import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

export function useDarkMode() {
    const [ value, setValue ] = useLocalStorage<boolean>("isDarkMode", true, { initializeWithValue: false })

    const isDarkMode = value

    const toggle = () => {
        setValue(!value)
    }

    const enable = () => {
        setValue(true)
    }

    const disable = () => {
        setValue(false)
    }

    return {
        isDarkMode, toggle, enable, disable
    }
}