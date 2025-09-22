import React, { createContext, useState, useEffect, ReactNode } from "react";
import { getData, saveData } from "../utils/storage";

// Kiểu dữ liệu cho context
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

// Context mặc định
export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

// Props cho ThemeProvider
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    (async () => {
      const saved = await getData("APP_THEME");
      if (saved) setTheme(saved);
    })();
  }, []);

  useEffect(() => {
    saveData("APP_THEME", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
