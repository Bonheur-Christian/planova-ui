import { baseApi } from "@/redux/api/baseApi";

export type BookingEntity = {
  id: string;
  userId: string;
  eventId: string;
  status: "BOOKED" | "CANCELLED";
  createdAt: string;
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    totalSeats: number;
    createdAt: string;
  };
};

type BookingMutationResponse = {
  success: boolean;
  message: string;
  data: BookingEntity;
};

type MyBookingsResponse = {
  success: boolean;
  data: BookingEntity[];
};

export const bookingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation<BookingMutationResponse, { eventId: string }>({
      query: (body) => ({
        url: "/api/bookings/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Booking", id: "LIST" }, { type: "Event", id: "LIST" }],
    }),

    getMyBookings: builder.query<MyBookingsResponse, void>({
      query: () => ({
        url: "/api/bookings/me",
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((booking) => ({ type: "Booking" as const, id: booking.id })),
              { type: "Booking", id: "LIST" },
            ]
          : [{ type: "Booking", id: "LIST" }],
    }),

    cancelBooking: builder.mutation<BookingMutationResponse, string>({
      query: (id) => ({
        url: `/api/bookings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Booking", id },
        { type: "Booking", id: "LIST" },
        { type: "Event", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useCancelBookingMutation,
} = bookingsApi;
