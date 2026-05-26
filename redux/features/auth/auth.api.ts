// src/redux/features/auth/auth.api.ts
import { baseApi } from "@/redux/api/baseApi";
import { login } from "./authSlice";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  };
};

type RegisterResponse = {
  success: boolean;
  message: string;
  user: AuthUser;
};

type GetMeResponse = {
  success: boolean;
  data: AuthUser & { createdAt: string };
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, { email: string; password: string }>(
      {
        query: (body) => ({
          url: "/api/auth/login",
          method: "POST",
          body,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;

            const { token, user } = data.data;

            if (!token || !user) {
              throw new Error("Invalid login response");
            }

            dispatch(login({ token, user }));
          } catch (err) {
            console.error("Login failed:", err);
          }
        },
      },
    ),

    register: builder.mutation<
      RegisterResponse,
      { name: string; email: string; password: string }
    >({
      query: (body) => ({
        url: "/api/auth/register",
        method: "POST",
        body,
      }),
    }),

    getMe: builder.query<GetMeResponse, void>({
      query: () => ({
        url: "/api/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLogoutMutation,
} = authApi;
