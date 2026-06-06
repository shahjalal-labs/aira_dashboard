import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { JWTDecodeToken } from "@/lib/jwtDecode";

const baseUrl ="http://206.162.244.144:6017/api/v1"
// const baseUrl = "http://10.0.20.169:6017/api/v1"

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      // const token = state?.auth?.token;
      // console.log(token);

      const { token } = JWTDecodeToken();

      headers.set("Authorization", `${token}`);

      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: ["profile", "stats", "listings", "bookings", "payouts"],
});
