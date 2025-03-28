import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

export function useDarkMode() {
    const [ value, setValue ] = useLocalStorage<boolean>("isDarkMode", true, { initializeWithValue: false })

    const isDarkMode = value

    const toggleDarkMode = () => {
        setValue(!value)
    }

    const setDarkMode = (value: boolean) => {
        setValue(value)
    }

    return {
        isDarkMode, toggleDarkMode, setDarkMode
    }
}