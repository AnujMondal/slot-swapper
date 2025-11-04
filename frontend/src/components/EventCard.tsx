import React from "react";
import { Event } from "../types";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onToggleSwappable: (event: Event) => void;
  isOwner: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
  onToggleSwappable,
  isOwner,
}) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "BUSY":
        return "status-badge status-busy";
      case "SWAPPABLE":
        return "status-badge status-swappable";
      case "SWAP_PENDING":
        return "status-badge status-pending";
      default:
        return "status-badge";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "BUSY":
        return "Busy";
      case "SWAPPABLE":
        return "Swappable";
      case "SWAP_PENDING":
        return "Swap Pending";
      default:
        return status;
    }
  };

  return (
    <div className="event-card">
      <div className="event-card-header">
        <h3>{event.title}</h3>
        <span className={getStatusBadgeClass(event.status)}>
          {getStatusText(event.status)}
        </span>
      </div>
      {event.description && (
        <p className="event-description">{event.description}</p>
      )}
      <div className="event-times">
        <div className="event-time">
          <strong>Start:</strong> {format(new Date(event.startTime), "PPpp")}
        </div>
        <div className="event-time">
          <strong>End:</strong> {format(new Date(event.endTime), "PPpp")}
        </div>
      </div>
      {isOwner && event.status !== "SWAP_PENDING" && (
        <div className="event-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onToggleSwappable(event)}
          >
            {event.status === "SWAPPABLE" ? "Mark as Busy" : "Make Swappable"}
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onEdit(event)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(event.id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default EventCard;
