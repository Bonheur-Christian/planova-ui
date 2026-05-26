"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetEventByIdQuery } from "@/redux/features/events/events.api";
import {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
} from "@/redux/features/bookings/bookings.api";
import toast from "react-hot-toast";
import ProtectedRoute from "@/services/auth/ProtectedRoute";

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const eventId = String(params.id);

  const { data, isLoading, isFetching, isError } = useGetEventByIdQuery(eventId);
  const { data: myBookings } = useGetMyBookingsQuery();
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  const alreadyBooked = (myBookings?.data ?? []).some(
    (booking) => booking.eventId === eventId && booking.status === "BOOKED",
  );

  const handleBook = async () => {
    try {
      await createBooking({ eventId }).unwrap();
      toast.success("Booking successful");
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Booking failed");
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto p-6">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>

        {(isLoading || isFetching) && (
          <div className="mt-6 text-muted-foreground">Loading event details...</div>
        )}

        {isError && (
          <div className="mt-6 text-red-600">Could not load this event.</div>
        )}

        {data?.data && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{data.data.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{data.data.description}</p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(data.data.date).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Total Seats:</span>{" "}
                {data.data.totalSeats}
              </p>
              <Button
                disabled={isBooking || alreadyBooked}
                onClick={handleBook}
              >
                {alreadyBooked ? "Already Booked" : isBooking ? "Booking..." : "Book Event"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}
