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
import { Input } from "@/components/ui/input";
import { EventsSidebar } from "@/components/custom/events-sidebar";

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Tech Summit 2024",
    description: "Join industry leaders for discussions on latest tech trends",
    date: "2024-06-15",
    time: "09:00 AM",
    location: "San Francisco Convention Center",
    totalSeats: 500,
    bookedSeats: 320,
    price: 99,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Web Development Workshop",
    description: "Learn modern web development with React and Next.js",
    date: "2024-06-22",
    time: "02:00 PM",
    location: "Downtown Tech Hub",
    totalSeats: 100,
    bookedSeats: 85,
    price: 49,
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop",
    status: "upcoming",
  },
  {
    id: "3",
    title: "Design Conference 2024",
    description:
      "Explore the future of UX/UI design with world-class designers",
    date: "2024-07-10",
    time: "10:00 AM",
    location: "Creative Arts Center",
    totalSeats: 300,
    bookedSeats: 150,
    price: 75,
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    status: "upcoming",
  },
  {
    id: "4",
    title: "AI & Machine Learning Expo",
    description:
      "Discover cutting-edge AI applications and network with experts",
    date: "2024-07-25",
    time: "09:00 AM",
    location: "Innovation Hub Downtown",
    totalSeats: 400,
    bookedSeats: 250,
    price: 129,
    image:
      "https://images.unsplash.com/photo-1677442d019cecf8b13b3c6d0e3a0c5e?w=400&h=250&fit=crop",
    status: "upcoming",
  },
  {
    id: "5",
    title: "Startup Pitch Competition",
    description: "Watch innovative startups pitch their ideas to investors",
    date: "2024-08-05",
    time: "06:00 PM",
    location: "Business District Convention Hall",
    totalSeats: 250,
    bookedSeats: 200,
    price: 39,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
    status: "upcoming",
  },
  {
    id: "6",
    title: "Cloud Computing Workshop",
    description: "Master AWS, Azure, and Google Cloud platforms",
    date: "2024-08-15",
    time: "11:00 AM",
    location: "Tech Innovation Center",
    totalSeats: 150,
    bookedSeats: 95,
    price: 59,
    image:
      "https://images.unsplash.com/photo-1460925895917-adf4e565db72?w=400&h=250&fit=crop",
    status: "upcoming",
  },
];

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const locations = useMemo(
    () => Array.from(new Set(mockEvents.map((e) => e.location))),
    [],
  );

  const filteredEvents = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return mockEvents.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q);
      const matchesLocation =
        !selectedLocation || event.location === selectedLocation;
      return matchesSearch && matchesLocation;
    });
  }, [searchQuery, selectedLocation]);

  const openBooking = (event: Event) => {
    setSelectedEvent(event);
    setShowBookingModal(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("");
  };

  return (
    <div className="flex w-full">
      {/* Sidebar */}
      <EventsSidebar
        variant="events"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        locations={locations}
        onClearFilters={clearFilters}
      />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Events</h2>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="text-lg font-semibold">No events found</h3>
            <p className="text-muted-foreground">Try changing filters</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onAction={() => openBooking(event)}
                actionLabel="Book Now"
                showPrice
              />
            ))}
          </div>
        )}
      </main>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Event</DialogTitle>
            <DialogDescription>
              Complete booking for {selectedEvent?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <h3 className="font-semibold">{selectedEvent.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedEvent.date} • {selectedEvent.time}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedEvent.location}
                </p>
                <p className="text-lg font-bold text-primary mt-2">
                  ${selectedEvent.price}
                </p>
              </div>
              <Input placeholder="Select seat..." disabled />
              <Button className="w-full">Confirm Booking</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}