import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { Event, ApiResponse } from "../types";
import EventCard from "../components/EventCard";
import EventModal from "../components/EventModal";
import "../styles/Dashboard.css";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse<Event[]>>("/api/events");
      setEvents(response.data.data || []);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowModal(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await api.delete(`/api/events/${eventId}`);
      await fetchEvents();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete event");
    }
  };

  const handleToggleSwappable = async (event: Event) => {
    try {
      const newStatus = event.status === "SWAPPABLE" ? "BUSY" : "SWAPPABLE";
      await api.put(`/api/events/${event.id}`, { status: newStatus });
      await fetchEvents();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update event status");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingEvent(null);
    fetchEvents();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Calendar</h1>
        <button className="btn btn-primary" onClick={handleCreateEvent}>
          + Create Event
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <p>You don't have any events yet.</p>
          <button className="btn btn-primary" onClick={handleCreateEvent}>
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              onToggleSwappable={handleToggleSwappable}
              isOwner={true}
            />
          ))}
        </div>
      )}

      {showModal && (
        <EventModal event={editingEvent} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default Dashboard;
