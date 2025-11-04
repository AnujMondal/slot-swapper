import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { Event, ApiResponse } from "../types";
import MarketplaceCard from "../components/MarketplaceCard";
import SwapModal from "../components/SwapModal";
import "../styles/Marketplace.css";

const Marketplace: React.FC = () => {
  const [slots, setSlots] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<Event | null>(null);
  const [showSwapModal, setShowSwapModal] = useState(false);

  const fetchSwappableSlots = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse<Event[]>>(
        "/api/swappable-slots"
      );
      setSlots(response.data.data || []);
      setError("");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to fetch swappable slots"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwappableSlots();
  }, []);

  const handleRequestSwap = (slot: Event) => {
    setSelectedSlot(slot);
    setShowSwapModal(true);
  };

  const handleModalClose = () => {
    setShowSwapModal(false);
    setSelectedSlot(null);
    fetchSwappableSlots();
  };

  return (
    <div className="marketplace-container">
      <div className="marketplace-header">
        <h1>Marketplace</h1>
        <p>Browse available slots and request swaps</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading available slots...</div>
      ) : slots.length === 0 ? (
        <div className="empty-state">
          <p>No swappable slots available at the moment.</p>
          <p>Check back later or mark some of your own slots as swappable!</p>
        </div>
      ) : (
        <div className="slots-grid">
          {slots.map((slot) => (
            <MarketplaceCard
              key={slot.id}
              slot={slot}
              onRequestSwap={handleRequestSwap}
            />
          ))}
        </div>
      )}

      {showSwapModal && selectedSlot && (
        <SwapModal targetSlot={selectedSlot} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default Marketplace;
