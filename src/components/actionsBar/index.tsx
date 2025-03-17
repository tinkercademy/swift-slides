import { Action } from "./action";

import styles from "./styles.module.scss";

export function ActionsBar({ actions }: { actions: Action[] }) {
  return (
    <div className={styles.icons}>
      {actions.map((a) => (
        <div key={a.name}>
          <span onClick={a.onClick}>
            <a.icon />
          </span>
          {!!a.hoverText && (
            <small className={styles.hoverText}>{a.hoverText}</small>
          )}
        </div>
      ))}
    </div>
  );
}
