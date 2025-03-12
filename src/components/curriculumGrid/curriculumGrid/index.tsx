import styles from "./styles.module.scss";

export function CurriculumGrid({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.cardsContainer}>
            {children}
        </div>
    )
}