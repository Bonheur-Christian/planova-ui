"use client";

import { useState, useMemo } from "react";
import { EventCard, Event } from "@/components/custom/event-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventsSidebar } from "@/components/custom/events-sidebar";
import toast from "react-hot-toast";
import ProtectedRoute from "@/services/auth/ProtectedRoute";
import { useGetEventsQuery } from "@/redux/features/events/events.api";
import { useCreateBookingMutation } from "@/redux/features/bookings/bookings.api";

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  const { data, isLoading, isFetching, isError , error} = useGetEventsQuery(
    searchQuery ? { search: searchQuery, limit: 50 } : { limit: 50 },
  );


  const events = useMemo<Event[]>(() => {
    return (data?.data ?? []).map((event) => {
      const eventDate = new Date(event.date);
      return {
        id: event.id,
        title: event.title,
        description: event.description,
        date: eventDate.toLocaleDateString(),
        time: eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        location: "TBA",
        totalSeats: event.totalSeats,
        bookedSeats: 0,
        status: eventDate > new Date() ? "upcoming" : "completed",
      };
    });
  }, [data?.data]);

  const openBooking = (event: Event) => {
    setSelectedEvent(event);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedEvent) {
      return;
    }

    try {
      await createBooking({ eventId: selectedEvent.id }).unwrap();
      toast.success("Booking created successfully");
      setShowBookingModal(false);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Booking failed");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
  };

  return (
    <ProtectedRoute>
      <div className="flex w-full">
        <EventsSidebar
          variant="events"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          locations={[]}
          onClearFilters={clearFilters}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Events</h2>
          </div>

          {(isLoading || isFetching) && (
            <div className="py-20 text-center text-muted-foreground">Loading events...</div>
          )}

          {isError && (
            <div className="py-20 text-center text-red-600">
              Could not load events. Please try again.
            </div>
          )}

          {!isLoading && !isFetching && !isError && events.length === 0 && (
            <div className="py-20 text-center">
              <h3 className="text-lg font-semibold">No events found</h3>
              <p className="text-muted-foreground">Try changing the search term</p>
            </div>
          )}

          {!isLoading && !isFetching && !isError && events.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onAction={() => openBooking(event)}
                  actionLabel="Book Now"
                  showPrice={false}
                />
              ))}
            </div>
          )}
        </main>

        <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book Event</DialogTitle>
              <DialogDescription>
                Confirm booking for {selectedEvent?.title}
              </DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="font-semibold">{selectedEvent.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent.date} • {selectedEvent.time}
                  </p>
                </div>
                <Button
                  className="w-full"
                  disabled={isBooking}
                  onClick={handleConfirmBooking}
                >
                  {isBooking ? "Booking..." : "Confirm Booking"}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}