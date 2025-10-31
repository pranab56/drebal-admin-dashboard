"use client";

import { useState } from 'react';
import AllEventsPage from '../../../components/event/AllEventsPage';
import EventDetailsPage from '../../../components/event/EventDetailsPage';
import { Event } from '../../../components/event/eventType';


export default function EventsApp() {
  const [currentView, setCurrentView] = useState<'list' | 'details'>('list');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleEventClick = (event: Event): void => {
    setSelectedEvent(event);
    setCurrentView('details');
  };

  const handleBack = (): void => {
    setCurrentView('list');
    setSelectedEvent(null);
  };

  const handleApprove = (): void => {
    alert('Event approved!');
  };

  const handleReject = (): void => {
    alert('Event rejected!');
  };

  return (
    <div>
      {currentView === 'list' ? (
        <AllEventsPage onEventClick={handleEventClick} />
      ) : (
        selectedEvent && (
          <EventDetailsPage
            event={selectedEvent}
            onBack={handleBack}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )
      )}
    </div>
  );
}