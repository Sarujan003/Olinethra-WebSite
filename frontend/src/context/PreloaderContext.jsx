import { createContext, useContext, useState } from "react";

const PreloaderContext = createContext({ preloaderDone: false, setPreloaderDone: () => { } });

export function PreloaderProvider({ children }) {
    // If preloader was already shown this session, skip it
    const already = typeof sessionStorage !== "undefined" && sessionStorage.getItem("preloaderShown") === "1";
    const [preloaderDone, setPreloaderDoneState] = useState(already);

    const setPreloaderDone = (val) => {
        if (val) sessionStorage.setItem("preloaderShown", "1");
        setPreloaderDoneState(val);
    };

    return (
        <PreloaderContext.Provider value={{ preloaderDone, setPreloaderDone }}>
            {children}
        </PreloaderContext.Provider>
    );
}

export function usePreloader() {
    return useContext(PreloaderContext);
}
