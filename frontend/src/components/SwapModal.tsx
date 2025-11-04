import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Event, ApiResponse } from "../types";
import { format } from "date-fns";

interface SwapModalProps {
  targetSlot: Event;
  onClose: () => void;
}

const SwapModal: React.FC<SwapModalProps> = ({ targetSlot, onClose }) => {
  const [mySwappableSlots, setMySwappableSlots] = useState<Event[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMySwappableSlots();
  }, []);

  const fetchMySwappableSlots = async () => {
    try {
      const response = await api.get<ApiResponse<Event[]>>("/api/events");
      const allEvents = response.data.data || [];
      const swappable = allEvents.filter(
        (event) => event.status === "SWAPPABLE"
      );
      setMySwappableSlots(swappable);
    } catch (err: any) {
      setError("Failed to load your swappable slots");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSlotId) {
      setError("Please select a slot to offer");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/api/swap-request", {
        mySlotId: selectedSlotId,
        theirSlotId: targetSlot.id,
        message,
      });

      alert("Swap request sent successfully!");
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send swap request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Request Swap</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="swap-target">
          <h3>You want this slot:</h3>
          <div className="swap-slot-info">
            <strong>{targetSlot.title}</strong>
            <div>{format(new Date(targetSlot.startTime), "PPpp")}</div>
            <div>to {format(new Date(targetSlot.endTime), "PPpp")}</div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {mySwappableSlots.length === 0 ? (
          <div className="empty-state">
            <p>You don't have any swappable slots.</p>
            <p>Please mark some of your events as swappable first.</p>
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="mySlot">Select your slot to offer *</label>
              <select
                id="mySlot"
                value={selectedSlotId}
                onChange={(e) => setSelectedSlotId(e.target.value)}
                required
              >
                <option value="">-- Choose a slot --</option>
                {mySwappableSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.title} - {format(new Date(slot.startTime), "PPpp")}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message (optional)</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Add a message to your swap request..."
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Swap Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SwapModal;
