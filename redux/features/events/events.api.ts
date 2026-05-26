import { baseApi } from "@/redux/api/baseApi";

export type EventEntity = {
  id: string;
  title: string;
  description: string;
  date: string;
  totalSeats: number;
  createdAt: string;
};

type EventsResponse = {
  success: boolean;
  message: string;
  data: EventEntity[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type EventResponse = {
  success: boolean;
  data: EventEntity;
};

type EventMutationResponse = {
  success: boolean;
  message: string;
  data: EventEntity;
};

type DeleteEventResponse = {
  success: boolean;
  message: string;
};

export type EventQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type EventPayload = {
  title: string;
  description: string;
  date: string;
  totalSeats: number;
};

export const eventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<EventsResponse, EventQueryParams | void>({
      query: (params) => ({
        url: "/api/events/all",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((event) => ({ type: "Event" as const, id: event.id })),
              { type: "Event", id: "LIST" },
            ]
          : [{ type: "Event", id: "LIST" }],
    }),

    getEventById: builder.query<EventResponse, string>({
      query: (id) => ({
        url: `/api/events/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "Event", id }],
    }),

    createEvent: builder.mutation<EventMutationResponse, EventPayload>({
      query: (body) => ({
        url: "/api/events/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Event", id: "LIST" }],
    }),

    updateEvent: builder.mutation<
      EventMutationResponse,
      { id: string; data: Partial<EventPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/api/events/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Event", id },
        { type: "Event", id: "LIST" },
      ],
    }),

    deleteEvent: builder.mutation<DeleteEventResponse, string>({
      query: (id) => ({
        url: `/api/events/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Event", id },
        { type: "Event", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventsApi;
