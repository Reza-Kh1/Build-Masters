import { ThemeProvider, createTheme } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import React from "react";
import App from "./App.tsx";
import { toast } from "react-toastify";
const cookieKey = import.meta.env.VITE_PUBLIC_COOKIE_KEY

const theme = createTheme({
  typography: {
    fontFamily: "iranSans, Arial",
  },
});
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [rtlPlugin],
});
const query = new QueryClient({
  queryCache: new QueryCache({
    onError: (err: any) => {
      console.log(err?.response?.status);
      if (err?.response?.status === 403) {
        toast.error("شما اجازه این کار ر ا ندارید !");
        localStorage.setItem(cookieKey, "");
        window.location.href = "/";
      } else {
        toast.error("در ارتباط با دیتابیس با خطا روبرو شدیم");
      }
    },
  }),
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={query}>
      <BrowserRouter>
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </CacheProvider>
      </BrowserRouter>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
