import React from "react";
import styles from "./MetaData.module.sass";

type Props = {
  readonly title: string;
  readonly value: string;
  readonly errors?: readonly string[];
};

export const MetaData: React.FC<Props> = ({ title, value, errors = [] }) => {
  return (
    <section className={styles.stack}>
      <div className={styles.row}>
        <h2 className={styles.title}>{title}</h2>
        <div>{value}</div>
      </div>
      <ul>
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </section>
  );
};
