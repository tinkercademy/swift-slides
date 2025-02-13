'use client';
import { FaSearch } from "react-icons/fa";

import styles from "./styles.module.scss";
import { useRef, useState } from "react";

export function SearchBar({ searchTerm }: { searchTerm: string }) {
    const [toggle, setToggle] = useState(!!searchTerm)
    const inputRef = useRef<HTMLInputElement>(null)

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
            }}><FaSearch /></div>
            <form method="get" action="">
                <input
                    ref={inputRef}
                    type="text"
                    name="search"
                    placeholder="Search units..."
                    defaultValue={searchTerm}
                    className={styles.searchInput}
                    style={{ height: toggle ? 50 : 0 }}
                />
            </form>
        </div>
    );
}