
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Ticket, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { EventsSidebar } from "@/components/custom/events-sidebar";

interface Booking {
  id: string;
  bookingId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  image: string;
  status: "confirmed" | "cancelled" | "pending";
  bookingDate: string;
  seatNumber?: string;
  paymentStatus: "paid" | "pending" | "refunded";
}

const mockBookings: Booking[] = [
  // ... your mock bookings
];

const StatusBadge = ({ status }: { status: Booking["status"] }) => {
  const variants = {
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
  };
  return <Badge className={variants[status]}>{status}</Badge>;
};

export default function MyBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const locations = useMemo(
    () => Array.from(new Set(mockBookings.map((b) => b.location))),
    [],
  );

  const filteredBookings = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return mockBookings.filter((booking) => {
      const matchesSearch = 
        booking.title.toLowerCase().includes(q) ||
        booking.bookingId.toLowerCase().includes(q);
      const matchesLocation = !selectedLocation || booking.location === selectedLocation;
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
      return matchesSearch && matchesLocation && matchesStatus;
    });
  }, [searchQuery, selectedLocation, statusFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("");
    setStatusFilter("all");
  };

  return (
    <div className="flex w-full">
      <EventsSidebar
        variant="bookings"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        locations={locations}
        onClearFilters={clearFilters}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Bookings</h2>
          <Link href="/events">
            <Button variant="outline">Browse Events</Button>
          </Link>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold">
              ${mockBookings.reduce((sum, b) => sum + (b.paymentStatus === "paid" ? b.price : 0), 0)}
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">Active Bookings</p>
            <p className="text-2xl font-bold">
              {mockBookings.filter(b => b.status === "confirmed").length}
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">Upcoming Events</p>
            <p className="text-2xl font-bold">
              {mockBookings.filter(b => b.status === "confirmed" && new Date(b.date) > new Date()).length}
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">Total Tickets</p>
            <p className="text-2xl font-bold">{mockBookings.length}</p>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="py-20 text-center">
            <Ticket className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No bookings found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedLocation || statusFilter !== "all" 
                ? "Try changing your filters" 
                : "You haven't booked any events yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.bookingId} className="border rounded-lg overflow-hidden bg-card">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 h-48 md:h-auto">
                    <img src={booking.image} alt={booking.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{booking.title}</h3>
                        <p className="text-sm text-muted-foreground">ID: {booking.bookingId}</p>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        {booking.date} at {booking.time}
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        {booking.location}
                      </div>
                      {booking.seatNumber && (
                        <div className="flex items-center text-sm">
                          <Ticket className="h-4 w-4 mr-2" />
                          Seat: {booking.seatNumber}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t">
                      <p className="text-2xl font-bold text-primary">${booking.price}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowDetailsModal(true);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Complete booking information</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <h3 className="font-semibold">{selectedBooking.title}</h3>
                <p className="text-sm">Date: {selectedBooking.date}</p>
                <p className="text-sm">Time: {selectedBooking.time}</p>
                <p className="text-sm">Location: {selectedBooking.location}</p>
                <p className="text-sm">Seat: {selectedBooking.seatNumber || "Not assigned"}</p>
                <p className="text-lg font-bold mt-2">${selectedBooking.price}</p>
              </div>
              <Button className="w-full">Download Ticket</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}