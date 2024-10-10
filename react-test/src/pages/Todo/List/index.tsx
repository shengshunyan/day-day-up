import { store } from "../store/index";
import { Button, List, message } from "antd";

import styles from "./index.module.scss";

const TodoList = () => {
  const { showTodoList } = store.getState();
  const time = new Date().toLocaleTimeString();

  // console.log(showTodoList);

  const onComplete = async (id: number) => {
    await store.completeTodo(id);
    message.success("complete success");
  };

  const onDelete = async (id: number) => {
    await store.deleteTodo(id);
    message.success("delete success");
  };

  return (
    <List
      size="small"
      header={<div>{time}</div>}
      footer={<div>total: {showTodoList.length}</div>}
      bordered
      dataSource={showTodoList}
      renderItem={(item) => {
        return (
          <List.Item
            className={`${styles["todo-item"]} ${
              item.isCompleted ? styles["todo-item-completed"] : ""
            }`}
          >
            {item.text}
            <div>
              <Button
                type="link"
                disabled={item.isCompleted}
                onClick={() => onComplete(item.id)}
              >
                complete
              </Button>
              <Button type="link" onClick={() => onDelete(item.id)}>
                delete
              </Button>
            </div>
          </List.Item>
        );
      }}
    />
  );
};
export default TodoList;
