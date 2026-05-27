import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { getAccessToken } from "../../utils/authUtil";
import { logout } from "../features/auth/authSlice";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = getAccessToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  // If unauthorized → logout (no refresh token exists in your system)
  if (result.error?.status === 401 && getAccessToken()) {
    api.dispatch(logout());
  }

  return result;
};
