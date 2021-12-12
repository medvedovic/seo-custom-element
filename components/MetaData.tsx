import React from "react";
import styles from "./MetaData.module.sass";

type Props = {
  readonly title: string;
  readonly value: string;
  readonly errors?: readonly string[];
};

export const MetaData: React.FC<Props> = ({ title, value, errors = [] }) => (
  <section className={`${styles.stack} ${styles["stack--s"]}`}>
    <div className={`${styles.stack} ${styles["stack--xs"]}`}>
      <h2 className={`label-large-emphasis ${styles.title}`}>{title}</h2>
      <div>{value}</div>
    </div>
    {!!errors.length && (
      <ul>
        {errors.map((error) => (
          <li key={error}>
            <span className="status status--is-missing">{error}</span>
          </li>
        ))}
      </ul>
    )}
  </section>
);
