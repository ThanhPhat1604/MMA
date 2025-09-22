import React, {createContext, useState, useEffect, Children} from "react";
import { getData, saveData } from "../utils/storage";

export const ThemeContext=createContext({
    theme: "light",
    toggleTheme: () => {}
});
export const ThemeProvider = ({Children}) =>{
    const [theme, setTheme] = useState("light");
    useEffect(() => {
        (async()=> {
            const saved = await getData("APP_THEME");
            if (saved) setTheme (saved);
    })();
}, []);
useEffect(() => {
    saveData("APP_THEME", theme);
}, [theme]);
const toggleTheme = () =>setTheme(prev =>(prev === "light"?"dark":"light"));
return(
    <ThemeContext.Provider value={{theme, toggleTheme}}>
        {Children}
    </ThemeContext.Provider>
);
};