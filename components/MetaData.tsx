import React from "react";
import styles from "./MetaData.module.sass";

type Props = {
  readonly title: string;
  readonly value: string;
};

export const MetaData: React.FC<Props> = ({ title, value }) => {
  return (
    <div className={styles.row}>
      <h2>{title}</h2>
      <div>{value}</div>
    </div>
  );
};
