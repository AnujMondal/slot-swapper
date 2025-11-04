import React from "react";
import { Event } from "../types";
import { format } from "date-fns";

interface MarketplaceCardProps {
  slot: Event;
  onRequestSwap: (slot: Event) => void;
}

const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
  slot,
  onRequestSwap,
}) => {
  return (
    <div className="marketplace-card">
      <div className="marketplace-card-header">
        <h3>{slot.title}</h3>
        <span className="status-badge status-swappable">Available</span>
      </div>
      {slot.description && (
        <p className="slot-description">{slot.description}</p>
      )}
      <div className="slot-owner">
        <strong>Owner:</strong> {slot.owner?.name || "Unknown"}
      </div>
      <div className="slot-times">
        <div className="slot-time">
          <strong>Start:</strong> {format(new Date(slot.startTime), "PPpp")}
        </div>
        <div className="slot-time">
          <strong>End:</strong> {format(new Date(slot.endTime), "PPpp")}
        </div>
      </div>
      <button className="btn btn-primary" onClick={() => onRequestSwap(slot)}>
        Request Swap
      </button>
    </div>
  );
};

export default MarketplaceCard;
