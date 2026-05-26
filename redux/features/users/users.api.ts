import { baseApi } from "@/redux/api/baseApi";

export type UserEntity = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "ORGANIZER";
  createdAt: string;
};

type UsersResponse = {
  success: boolean;
  data: UserEntity[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type UpdateRoleResponse = {
  success: boolean;
  message: string;
  data: UserEntity;
};

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<
      UsersResponse,
      { page?: number; limit?: number; search?: string } | void
    >({
      query: (params) => ({
        url: "/api/users/all",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((user) => ({ type: "User" as const, id: user.id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    updateUserRole: builder.mutation<
      UpdateRoleResponse,
      { id: string; role: UserEntity["role"] }
    >({
      query: ({ id, role }) => ({
        url: `/api/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
});

export const { useGetUsersQuery, useUpdateUserRoleMutation } = usersApi;
