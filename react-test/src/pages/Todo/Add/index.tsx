import { Button, Input } from "antd";
import { ChangeEvent, useState } from "react";
import { store } from "../store/index.ts";

import styles from "./index.module.scss";

const Add = () => {
  const [value, setValue] = useState("");

  const onValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onAddClick = () => {
    if (!value) return;

    store.addTodo(value);
    setValue("");
  };

  return (
    <div className={styles.container}>
      <div className={styles["add-line"]}>
        <Input
          className={styles["add-line-input"]}
          placeholder="input todo item..."
          value={value}
          onChange={onValueChange}
          onPressEnter={onAddClick}
        />
        <Button type="primary" onClick={onAddClick}>
          Add
        </Button>
      </div>
    </div>
  );
};
export default Add;
