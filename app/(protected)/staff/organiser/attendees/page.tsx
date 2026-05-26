"use client";

import { useSearchParams } from "next/navigation";

export default function OrganiserAttendeesPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Attendees</h1>
      <p className="text-muted-foreground mt-2">
        Event attendee listing endpoint is not currently exposed by the backend routes.
      </p>
      {eventId && (
        <p className="mt-4">
          Selected event ID: <span className="font-mono">{eventId}</span>
        </p>
      )}
    </div>
  );
}
