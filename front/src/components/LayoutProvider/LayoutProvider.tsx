"use client";
import React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import ThemeContextProvider from "@/context/ThemeContext";
import ThemeMuiContext from "../ThemeMuiContext/ThemeMuiContext";
axios.defaults.baseURL = process.env.NEXT_PUBLIC_URL_API;
axios.defaults.withCredentials = true;
export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeContextProvider>
        <ThemeMuiContext>
          {children}
          <Toaster toastOptions={{ style: { direction: "ltr" } }} />
        </ThemeMuiContext>
      </ThemeContextProvider>
    </CacheProvider>
  );
}
