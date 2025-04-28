"use client";
import { ThemeContext } from "@/context/ThemeContext";
import { ThemeProvider } from "@mui/material";
import React, { useContext } from "react";
import { createTheme } from "@mui/material/styles";

export default function ThemeMuiContext({ children }: { children: React.ReactNode }) {
  const { mode } = useContext(ThemeContext);
  const themeLight = createTheme({
    typography: {
      fontFamily: "__fontSahel_7a8a2f",
    },
    cssVariables: true,
    direction: "rtl",
    colorSchemes: {
      dark: mode,
    },
  });
  return <ThemeProvider theme={themeLight}>{children}</ThemeProvider>;
}
