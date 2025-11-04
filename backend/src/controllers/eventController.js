import { Event } from "../models/index.js";
import { Op } from "sequelize";

// @desc    Get all events for current user
// @route   GET /api/events
// @access  Private
export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { userId: req.user.id },
      order: [["startTime", "ASC"]],
    });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching events.",
      error: error.message,
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching event.",
      error: error.message,
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req, res) => {
  try {
    const { title, description, startTime, endTime, status } = req.body;

    // Validation
    if (!title || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, startTime, and endTime.",
      });
    }

    // Validate dates
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format.",
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time.",
      });
    }

    // Create event
    const event = await Event.create({
      title,
      description,
      startTime: start,
      endTime: end,
      status: status || "BUSY",
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully.",
      data: event,
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating event.",
      error: error.message,
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Prevent updating if swap is pending
    if (
      event.status === "SWAP_PENDING" &&
      req.body.status &&
      req.body.status !== "SWAP_PENDING"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot update event with pending swap. Please resolve the swap first.",
      });
    }

    const { title, description, startTime, endTime, status } = req.body;

    // Validate dates if provided
    if (startTime || endTime) {
      const start = startTime ? new Date(startTime) : event.startTime;
      const end = endTime ? new Date(endTime) : event.endTime;

      if (
        (startTime && isNaN(start.getTime())) ||
        (endTime && isNaN(end.getTime()))
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format.",
        });
      }

      if (end <= start) {
        return res.status(400).json({
          success: false,
          message: "End time must be after start time.",
        });
      }
    }

    // Update event
    await event.update({
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(startTime && { startTime: new Date(startTime) }),
      ...(endTime && { endTime: new Date(endTime) }),
      ...(status && { status }),
    });

    res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      data: event,
    });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating event.",
      error: error.message,
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Prevent deletion if swap is pending
    if (event.status === "SWAP_PENDING") {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete event with pending swap. Please resolve the swap first.",
      });
    }

    await event.destroy();

    res.status(200).json({
      success: true,
      message: "Event deleted successfully.",
    });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting event.",
      error: error.message,
    });
  }
};
