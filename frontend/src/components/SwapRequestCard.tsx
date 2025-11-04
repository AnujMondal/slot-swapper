import React from "react";
import { SwapRequest } from "../types";
import { format } from "date-fns";

interface SwapRequestCardProps {
  request: SwapRequest;
  type: "incoming" | "outgoing";
  onAccept?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
}

const SwapRequestCard: React.FC<SwapRequestCardProps> = ({
  request,
  type,
  onAccept,
  onReject,
}) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "status-badge status-pending";
      case "ACCEPTED":
        return "status-badge status-accepted";
      case "REJECTED":
        return "status-badge status-rejected";
      default:
        return "status-badge";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "ACCEPTED":
        return "Accepted";
      case "REJECTED":
        return "Rejected";
      default:
        return status;
    }
  };

  return (
    <div className="swap-request-card">
      <div className="swap-request-header">
        <h3>
          {type === "incoming"
            ? `Swap Request from ${request.requester?.name}`
            : `Swap Request to ${request.receiver?.name}`}
        </h3>
        <span className={getStatusBadgeClass(request.status)}>
          {getStatusText(request.status)}
        </span>
      </div>

      {request.message && (
        <div className="swap-message">
          <strong>Message:</strong> {request.message}
        </div>
      )}

      <div className="swap-slots">
        <div className="swap-slot">
          <h4>{type === "incoming" ? "They offer:" : "You offered:"}</h4>
          <div className="slot-details">
            <strong>{request.requesterSlot?.title}</strong>
            <div>
              {request.requesterSlot &&
                format(new Date(request.requesterSlot.startTime), "PPpp")}
            </div>
            <div>
              to{" "}
              {request.requesterSlot &&
                format(new Date(request.requesterSlot.endTime), "PPpp")}
            </div>
          </div>
        </div>

        <div className="swap-arrow">⇄</div>

        <div className="swap-slot">
          <h4>{type === "incoming" ? "For your slot:" : "For their slot:"}</h4>
          <div className="slot-details">
            <strong>{request.receiverSlot?.title}</strong>
            <div>
              {request.receiverSlot &&
                format(new Date(request.receiverSlot.startTime), "PPpp")}
            </div>
            <div>
              to{" "}
              {request.receiverSlot &&
                format(new Date(request.receiverSlot.endTime), "PPpp")}
            </div>
          </div>
        </div>
      </div>

      {type === "incoming" &&
        request.status === "PENDING" &&
        onAccept &&
        onReject && (
          <div className="swap-actions">
            <button
              className="btn btn-danger"
              onClick={() => onReject(request.id)}
            >
              Reject
            </button>
            <button
              className="btn btn-primary"
              onClick={() => onAccept(request.id)}
            >
              Accept Swap
            </button>
          </div>
        )}

      <div className="swap-timestamp">
        {format(new Date(request.createdAt), "PPpp")}
      </div>
    </div>
  );
};

export default SwapRequestCard;
