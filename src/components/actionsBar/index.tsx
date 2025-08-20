import { Action } from "./action";

import styles from "./styles.module.scss";

export function ActionsBar({ actions }: { actions: Action[] }) {
  return (
    <div className={styles.icons}>
      {actions.map((a) => (
        <div key={a.name}>
          <button 
            onClick={a.onClick}
            aria-label={a.hoverText || a.name}
            className={styles.actionButton}
            type="button"
          >
            <a.icon />
          </button>
          {!!a.hoverText && (
            <small className={styles.hoverText}>{a.hoverText}</small>
          )}
        </div>
      ))}
    </div>
  );
}
