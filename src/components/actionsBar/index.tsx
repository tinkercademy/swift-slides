import styles from "./styles.module.scss";
import { Action } from "./action";

export function ActionsBar({ actions }: { actions: Action[] }) {
    return (
        <div className={styles.icons}>
            {actions.map(a => (
                <div key={a.name} onClick={a.onClick}>
                    {a.icon}
                </div>
            ))}
        </div>
    )
}