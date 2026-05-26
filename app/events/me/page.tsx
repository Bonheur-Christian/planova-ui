"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Ticket, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventsSidebar } from "@/components/custom/events-sidebar";
import ProtectedRoute from "@/services/auth/ProtectedRoute";
import {
  useCancelBookingMutation,
  useGetMyBookingsQuery,
} from "@/redux/features/bookings/bookings.api";
import toast from "react-hot-toast";

interface BookingView {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "BOOKED" | "CANCELLED";
  bookingDate: string;
  totalSeats: number;
}

const StatusBadge = ({ status }: { status: BookingView["status"] }) => {
  const variants = {
    BOOKED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return <Badge className={variants[status]}>{status}</Badge>;
};

export default function MyBookingsPage() {
  const { data, isLoading, isFetching, isError } = useGetMyBookingsQuery();
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedBooking, setSelectedBooking] = useState<BookingView | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const bookings = useMemo<BookingView[]>(() => {
    return (data?.data ?? []).map((booking) => ({
      id: booking.id,
      title: booking.event.title,
      description: booking.event.description,
      date: new Date(booking.event.date).toLocaleString(),
      status: booking.status,
      bookingDate: new Date(booking.createdAt).toLocaleString(),
      totalSeats: booking.event.totalSeats,
    }));
  }, [data?.data]);

  const filteredBookings = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.title.toLowerCase().includes(q) || booking.id.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "ALL" || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  const handleCancelBooking = async (id: string) => {
    try {
      await cancelBooking(id).unwrap();
      toast.success("Booking cancelled");
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Could not cancel booking");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
  };

  return (
    <ProtectedRoute>
      <div className="flex w-full">
        <EventsSidebar
          variant="bookings"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          locations={[]}
          onClearFilters={clearFilters}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Bookings</h2>
          </div>

          {(isLoading || isFetching) && (
            <div className="py-20 text-center text-muted-foreground">Loading bookings...</div>
          )}

          {isError && (
            <div className="py-20 text-center text-red-600">
              Could not load your bookings.
            </div>
          )}

          {filteredBookings.length === 0 ? (
            <div className="py-20 text-center">
              <Ticket className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No bookings found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "ALL"
                  ? "Try changing your filters"
                  : "You haven't booked any events yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border rounded-lg overflow-hidden bg-card"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{booking.title}</h3>
                        <p className="text-sm text-muted-foreground">ID: {booking.id}</p>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        {booking.date}
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2" />
                        Booked at {booking.bookingDate}
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end mt-4 pt-3 border-t">
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
                      {booking.status === "BOOKED" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isCancelling}
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel Booking
                        </Button>
                      )}
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
              <DialogDescription>
                Complete booking information
              </DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="font-semibold">{selectedBooking.title}</h3>
                  <p className="text-sm">Event Date: {selectedBooking.date}</p>
                  <p className="text-sm">Booking Date: {selectedBooking.bookingDate}</p>
                  <p className="text-sm">Total seats in event: {selectedBooking.totalSeats}</p>
                </div>
                {selectedBooking.status === "BOOKED" && (
                  <Button
                    className="w-full"
                    variant="destructive"
                    disabled={isCancelling}
                    onClick={() => handleCancelBooking(selectedBooking.id)}
                  >
                    Cancel this booking
                  </Button>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
