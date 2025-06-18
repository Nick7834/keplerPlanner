import React from "react";
import styles from "./DelConfirm.module.scss";
import { useConfirmContext } from "@/app/context/ConfirmContext";

export const DelConfirm = () => {
  const { confirmOpen, setConfirmOpen, setConfirmDel } = useConfirmContext();

  const handDelTask = () => {
    setConfirmDel(true);
    setConfirmOpen(false);
  };

  const closeModal = () => {
    setConfirmOpen(false);
  };

  return (
    <div className={`${styles.confirm} ${confirmOpen ? `${styles.open}` : ""}`}>
      <div
        className={`${styles.modal} ${
          confirmOpen ? `${styles.openModal}` : ""
        }`}
      >
        <h2>Удалить задачу?</h2>

        <p>Вы точно хотите удалить эту задачу?</p>

        <div className={styles.buttons}>
          <button onClick={closeModal}>Отмена</button>
          <button onClick={handDelTask}>Удалить</button>
        </div>
      </div>
    </div>
  );
};
