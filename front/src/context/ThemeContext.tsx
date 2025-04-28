"use client";
import React, { createContext, useState } from "react";
interface ThemeContextType {
  mode: boolean;
  setMode: React.Dispatch<React.SetStateAction<boolean>>;
}
const defaultContextValue: ThemeContextType = {
  mode: false,
  setMode: () => {},
};
export const ThemeContext =
  createContext<ThemeContextType>(defaultContextValue);

export default function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<boolean>(false);
  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
