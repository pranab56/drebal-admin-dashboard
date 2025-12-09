// app/events/page.tsx
"use client";

import { useState } from 'react';
import AllEventsPage from '../../../components/event/AllEventsPage';
import EventDetailsPage from '../../../components/event/EventDetailsPage';

export default function EventsApp() {
  const [currentView, setCurrentView] = useState<'list' | 'details'>('list');
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  const handleEventClick = (eventId: string): void => {
    setSelectedEventId(eventId);
    setCurrentView('details');
  };

  const handleBack = (): void => {
    setCurrentView('list');
    setSelectedEventId('');
  };

  return (
    <div>
      {currentView === 'list' ? (
        <AllEventsPage onEventClick={handleEventClick} />
      ) : (
        <EventDetailsPage
          eventId={selectedEventId}
          onBack={handleBack}
        />
      )}
    </div>
  );
}