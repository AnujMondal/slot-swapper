import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { SwapRequest, ApiResponse, SwapRequestsResponse } from "../types";
import SwapRequestCard from "../components/SwapRequestCard";
import "../styles/Requests.css";

const Requests: React.FC = () => {
  const {} = useAuth();
  const [incomingRequests, setIncomingRequests] = useState<SwapRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">(
    "incoming"
  );

  const fetchSwapRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse<SwapRequestsResponse>>(
        "/api/swap-requests"
      );
      const data = response.data.data;

      if (data) {
        setIncomingRequests(data.incoming || []);
        setOutgoingRequests(data.outgoing || []);
      }
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch swap requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwapRequests();
  }, []);

  const handleAccept = async (requestId: string) => {
    try {
      await api.post(`/api/swap-response/${requestId}`, { accept: true });
      await fetchSwapRequests();
      alert("Swap accepted successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to accept swap");
    }
  };

  const handleReject = async (requestId: string) => {
    if (!window.confirm("Are you sure you want to reject this swap request?")) {
      return;
    }

    try {
      await api.post(`/api/swap-response/${requestId}`, { accept: false });
      await fetchSwapRequests();
      alert("Swap rejected.");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to reject swap");
    }
  };

  const pendingIncoming = incomingRequests.filter(
    (r) => r.status === "PENDING"
  );
  const pendingOutgoing = outgoingRequests.filter(
    (r) => r.status === "PENDING"
  );

  return (
    <div className="requests-container">
      <div className="requests-header">
        <h1>Swap Requests</h1>
        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === "incoming" ? "active" : ""}`}
            onClick={() => setActiveTab("incoming")}
          >
            Incoming{" "}
            {pendingIncoming.length > 0 && `(${pendingIncoming.length})`}
          </button>
          <button
            className={`tab-btn ${activeTab === "outgoing" ? "active" : ""}`}
            onClick={() => setActiveTab("outgoing")}
          >
            Outgoing{" "}
            {pendingOutgoing.length > 0 && `(${pendingOutgoing.length})`}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading requests...</div>
      ) : (
        <div className="requests-content">
          {activeTab === "incoming" ? (
            incomingRequests.length === 0 ? (
              <div className="empty-state">
                <p>No incoming swap requests.</p>
              </div>
            ) : (
              <div className="requests-list">
                {incomingRequests.map((request) => (
                  <SwapRequestCard
                    key={request.id}
                    request={request}
                    type="incoming"
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                ))}
              </div>
            )
          ) : outgoingRequests.length === 0 ? (
            <div className="empty-state">
              <p>No outgoing swap requests.</p>
            </div>
          ) : (
            <div className="requests-list">
              {outgoingRequests.map((request) => (
                <SwapRequestCard
                  key={request.id}
                  request={request}
                  type="outgoing"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Requests;
