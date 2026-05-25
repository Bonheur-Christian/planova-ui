// src/redux/features/auth/auth.api.ts
import { baseApi } from "@/redux/api/baseApi";
import { saveAccessToken, saveUser, logout } from "@/utils/authUtil";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      {
        token: string;
        user: {
          id: string;
          name: string;
          email: string;
          role: string;
        };
      },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "/api/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // store auth data
          saveAccessToken(data.token);
          saveUser(data.user);
        } catch (err) {
          console.error("Login failed:", err);
        }
      },
    }),

    register: builder.mutation<
      any,
      { name: string; email: string; password: string }
    >({
      query: (body) => ({
        url: "/api/auth/register",
        method: "POST",
        body,
      }),
    }),

    getMe: builder.query<any, void>({
      query: () => ({
        url: "/api/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
} = authApi;
