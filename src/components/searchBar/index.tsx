'use client';
import { FaMagnifyingGlass } from "react-icons/fa6";

import styles from "./styles.module.scss";
import { useEffect, useRef, useState } from "react";

export function SearchBar({ searchTerm }: { searchTerm: string }) {
    const [toggle, setToggle] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const [inputValue, setInputValue] = useState(searchTerm)

    useEffect(() => {
        setInputValue(searchTerm)
    }, [searchTerm])

    return (
        <div className={styles.searchBar}>
            <div onClick={() => {
                if (inputRef.current) {
                    inputRef.current.focus()
                    const val = inputRef.current.value
                    inputRef.current.value = ""
                    inputRef.current.value = val
                }
                setToggle(!toggle)
            }}><FaMagnifyingGlass /></div>
            <form method="get" action="">
                <input
                    ref={inputRef}
                    type="text"
                    name="search"
                    placeholder="Search units..."
                    value={inputValue}
                    onChange={(event) => {
                        setInputValue(event.target.value)
                    }}
                    className={styles.searchInput}
                    style={{ height: (!!searchTerm || toggle) ? 50 : 0 }}
                />
            </form>
        </div>
    );
}
