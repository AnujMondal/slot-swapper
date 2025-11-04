import { Event, SwapRequest, User } from "../models/index.js";
import { Op } from "sequelize";
import sequelize from "../config/database.js";

// @desc    Get all swappable slots from other users
// @route   GET /api/swappable-slots
// @access  Private
export const getSwappableSlots = async (req, res) => {
  try {
    const swappableSlots = await Event.findAll({
      where: {
        status: "SWAPPABLE",
        userId: {
          [Op.ne]: req.user.id, // Exclude current user's slots
        },
      },
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["startTime", "ASC"]],
    });

    res.status(200).json({
      success: true,
      count: swappableSlots.length,
      data: swappableSlots,
    });
  } catch (error) {
    console.error("Get swappable slots error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching swappable slots.",
      error: error.message,
    });
  }
};

// @desc    Create a swap request
// @route   POST /api/swap-request
// @access  Private
export const createSwapRequest = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { mySlotId, theirSlotId, message } = req.body;

    // Validation
    if (!mySlotId || !theirSlotId) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Please provide both mySlotId and theirSlotId.",
      });
    }

    if (mySlotId === theirSlotId) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Cannot swap a slot with itself.",
      });
    }

    // Fetch both slots
    const [mySlot, theirSlot] = await Promise.all([
      Event.findByPk(mySlotId, { transaction }),
      Event.findByPk(theirSlotId, { transaction }),
    ]);

    // Verify both slots exist
    if (!mySlot || !theirSlot) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "One or both slots not found.",
      });
    }

    // Verify mySlot belongs to current user
    if (mySlot.userId !== req.user.id) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "You can only offer your own slots for swap.",
      });
    }

    // Verify theirSlot doesn't belong to current user
    if (theirSlot.userId === req.user.id) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Cannot swap with your own slot.",
      });
    }

    // Verify both slots are SWAPPABLE
    if (mySlot.status !== "SWAPPABLE") {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Your slot must be marked as SWAPPABLE.",
      });
    }

    if (theirSlot.status !== "SWAPPABLE") {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "The requested slot is no longer available for swap.",
      });
    }

    // Check for existing pending swap requests involving these slots
    const existingSwap = await SwapRequest.findOne({
      where: {
        [Op.or]: [
          { requesterSlotId: mySlotId },
          { receiverSlotId: mySlotId },
          { requesterSlotId: theirSlotId },
          { receiverSlotId: theirSlotId },
        ],
        status: "PENDING",
      },
      transaction,
    });

    if (existingSwap) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "One or both slots already have a pending swap request.",
      });
    }

    // Create swap request
    const swapRequest = await SwapRequest.create(
      {
        requesterId: req.user.id,
        receiverId: theirSlot.userId,
        requesterSlotId: mySlotId,
        receiverSlotId: theirSlotId,
        status: "PENDING",
        message: message || null,
      },
      { transaction }
    );

    // Update both slots to SWAP_PENDING
    await Promise.all([
      mySlot.update({ status: "SWAP_PENDING" }, { transaction }),
      theirSlot.update({ status: "SWAP_PENDING" }, { transaction }),
    ]);

    await transaction.commit();

    // Fetch the complete swap request with associations
    const completeSwapRequest = await SwapRequest.findByPk(swapRequest.id, {
      include: [
        {
          model: User,
          as: "requester",
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["id", "name", "email"],
        },
        {
          model: Event,
          as: "requesterSlot",
        },
        {
          model: Event,
          as: "receiverSlot",
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Swap request created successfully.",
      data: completeSwapRequest,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Create swap request error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating swap request.",
      error: error.message,
    });
  }
};

// @desc    Respond to a swap request (accept or reject)
// @route   POST /api/swap-response/:requestId
// @access  Private
export const respondToSwapRequest = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { requestId } = req.params;
    const { accept } = req.body;

    // Validation
    if (typeof accept !== "boolean") {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Please provide accept (true/false) in request body.",
      });
    }

    // Fetch swap request with related data
    const swapRequest = await SwapRequest.findByPk(requestId, {
      include: [
        {
          model: Event,
          as: "requesterSlot",
        },
        {
          model: Event,
          as: "receiverSlot",
        },
      ],
      transaction,
    });

    if (!swapRequest) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Swap request not found.",
      });
    }

    // Verify the current user is the receiver
    if (swapRequest.receiverId !== req.user.id) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "You are not authorized to respond to this swap request.",
      });
    }

    // Verify swap request is still pending
    if (swapRequest.status !== "PENDING") {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `This swap request has already been ${swapRequest.status.toLowerCase()}.`,
      });
    }

    const { requesterSlot, receiverSlot } = swapRequest;

    if (accept) {
      // ACCEPT: Exchange ownership of the slots

      // Store original user IDs
      const originalRequesterUserId = requesterSlot.userId;
      const originalReceiverUserId = receiverSlot.userId;

      // Swap the ownership
      await Promise.all([
        requesterSlot.update(
          {
            userId: originalReceiverUserId,
            status: "BUSY",
          },
          { transaction }
        ),
        receiverSlot.update(
          {
            userId: originalRequesterUserId,
            status: "BUSY",
          },
          { transaction }
        ),
      ]);

      // Update swap request status
      await swapRequest.update(
        {
          status: "ACCEPTED",
        },
        { transaction }
      );

      await transaction.commit();

      res.status(200).json({
        success: true,
        message: "Swap request accepted. Slots have been exchanged.",
        data: swapRequest,
      });
    } else {
      // REJECT: Set both slots back to SWAPPABLE

      await Promise.all([
        requesterSlot.update({ status: "SWAPPABLE" }, { transaction }),
        receiverSlot.update({ status: "SWAPPABLE" }, { transaction }),
      ]);

      // Update swap request status
      await swapRequest.update(
        {
          status: "REJECTED",
        },
        { transaction }
      );

      await transaction.commit();

      res.status(200).json({
        success: true,
        message: "Swap request rejected. Slots are now available again.",
        data: swapRequest,
      });
    }
  } catch (error) {
    await transaction.rollback();
    console.error("Respond to swap request error:", error);
    res.status(500).json({
      success: false,
      message: "Error responding to swap request.",
      error: error.message,
    });
  }
};

// @desc    Get swap requests for current user (incoming and outgoing)
// @route   GET /api/swap-requests
// @access  Private
export const getMySwapRequests = async (req, res) => {
  try {
    const { type } = req.query; // 'incoming', 'outgoing', or 'all'

    let whereClause = {};

    if (type === "incoming") {
      whereClause.receiverId = req.user.id;
    } else if (type === "outgoing") {
      whereClause.requesterId = req.user.id;
    } else {
      // Default: get both incoming and outgoing
      whereClause = {
        [Op.or]: [{ requesterId: req.user.id }, { receiverId: req.user.id }],
      };
    }

    const swapRequests = await SwapRequest.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "requester",
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["id", "name", "email"],
        },
        {
          model: Event,
          as: "requesterSlot",
        },
        {
          model: Event,
          as: "receiverSlot",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Categorize requests
    const categorized = {
      incoming: [],
      outgoing: [],
    };

    swapRequests.forEach((request) => {
      if (request.receiverId === req.user.id) {
        categorized.incoming.push(request);
      }
      if (request.requesterId === req.user.id) {
        categorized.outgoing.push(request);
      }
    });

    res.status(200).json({
      success: true,
      count: swapRequests.length,
      data: type ? swapRequests : categorized,
    });
  } catch (error) {
    console.error("Get swap requests error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching swap requests.",
      error: error.message,
    });
  }
};
