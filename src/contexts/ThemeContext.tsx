import React, { createContext, useContext, useEffect, useState } from "react";

// Khai báo kiểu dữ liệu cho ThemeContext
type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

// Tạo context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider chứa logic chuyển đổi theme
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const storedTheme = (localStorage.getItem("theme") as Theme) || "light";
    const [theme, setTheme] = useState<Theme>(storedTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook giúp sử dụng theme dễ dàng
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
};
