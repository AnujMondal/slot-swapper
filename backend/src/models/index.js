import User from "./User.js";
import Event from "./Event.js";
import SwapRequest from "./SwapRequest.js";

// Define associations
User.hasMany(Event, {
  foreignKey: "userId",
  as: "events",
  onDelete: "CASCADE",
});

Event.belongsTo(User, {
  foreignKey: "userId",
  as: "owner",
});

// SwapRequest associations
SwapRequest.belongsTo(User, {
  foreignKey: "requesterId",
  as: "requester",
});

SwapRequest.belongsTo(User, {
  foreignKey: "receiverId",
  as: "receiver",
});

SwapRequest.belongsTo(Event, {
  foreignKey: "requesterSlotId",
  as: "requesterSlot",
});

SwapRequest.belongsTo(Event, {
  foreignKey: "receiverSlotId",
  as: "receiverSlot",
});

// Export all models
export { User, Event, SwapRequest };
