import styles from "./styles.module.scss";

export function CurriculumGrid({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`${styles.cardsContainer} ${className ?? ""}`.trim()}>
            {children}
        </div>
    )
}
