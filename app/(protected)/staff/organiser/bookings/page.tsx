"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Calendar,
  Ticket,
  Clock,
  XCircle,
} from "lucide-react";
import {
  useCancelBookingMutation,
  useGetMyBookingsQuery,
} from "@/redux/features/bookings/bookings.api";
import toast from "react-hot-toast";

export default function OrganiserBookingsPage() {
  const { data, isLoading, isFetching, isError } = useGetMyBookingsQuery();
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedBooking, setSelectedBooking] = useState<{
    id: string;
    title: string;
    eventDate: string;
    bookingDate: string;
    status: "BOOKED" | "CANCELLED";
  } | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const bookings = useMemo(
    () =>
      (data?.data ?? []).map((booking) => ({
        id: booking.id,
        title: booking.event.title,
        eventDate: new Date(booking.event.date).toLocaleString(),
        bookingDate: new Date(booking.createdAt).toLocaleString(),
        status: booking.status,
      })),
    [data?.data],
  );

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId).unwrap();
      toast.success("Booking cancelled");
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Could not cancel booking");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">Your bookings in organiser account</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by booking ID or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={statusFilter === "ALL" ? "default" : "outline"}
            onClick={() => setStatusFilter("ALL")}
          >
            All
          </Button>
          <Button
            variant={statusFilter === "BOOKED" ? "default" : "outline"}
            onClick={() => setStatusFilter("BOOKED")}
          >
            Booked
          </Button>
          <Button
            variant={statusFilter === "CANCELLED" ? "default" : "outline"}
            onClick={() => setStatusFilter("CANCELLED")}
          >
            Cancelled
          </Button>
        </div>
      </div>

      {(isLoading || isFetching) && (
        <div className="py-20 text-center text-muted-foreground">Loading bookings...</div>
      )}

      {isError && (
        <div className="py-20 text-center text-red-600">Could not fetch bookings</div>
      )}

      {!isLoading && !isFetching && !isError && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Event Date</TableHead>
              <TableHead>Booked At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.id}</TableCell>
                <TableCell>{booking.title}</TableCell>
                <TableCell>{booking.eventDate}</TableCell>
                <TableCell>{booking.bookingDate}</TableCell>
                <TableCell>
                  <Badge variant={booking.status === "BOOKED" ? "default" : "secondary"}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowDetailsDialog(true);
                      }}
                    >
                      Details
                    </Button>
                    {booking.status === "BOOKED" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isCancelling}
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Booking information from API</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div>
                  <label className="text-sm font-semibold">Booking ID:</label>
                  <p className="text-muted-foreground">{selectedBooking.id}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold">Event:</label>
                  <p className="text-muted-foreground">{selectedBooking.title}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {selectedBooking.eventDate}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    {selectedBooking.bookingDate}
                  </div>
                </div>
              </div>
              {selectedBooking.status === "BOOKED" && (
                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                >
                  Cancel Booking
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
