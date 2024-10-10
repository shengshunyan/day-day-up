import { TodoItem } from "../pages/Todo/types";
import { sleep } from "../utils";

export const queryTodoList = async () => {
  await sleep();
  const list: TodoItem[] = JSON.parse(sessionStorage.getItem("list") || "[]");

  return list;
};

export const addTodo = async (item: TodoItem) => {
  await sleep();
  const list: TodoItem[] = JSON.parse(sessionStorage.getItem("list") || "[]");
  list.push(item);
  sessionStorage.setItem("list", JSON.stringify(list));
  return true;
};

export const completeTodo = async (id: number) => {
  await sleep();
  const list: TodoItem[] = JSON.parse(sessionStorage.getItem("list") || "[]");
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) return false;

  list.splice(index, 1, { ...list[index], isCompleted: true });
  sessionStorage.setItem("list", JSON.stringify(list));
  return true;
};

export const deleteTodo = async (id: number) => {
  await sleep();
  const list: TodoItem[] = JSON.parse(sessionStorage.getItem("list") || "[]");
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) return false;

  list.splice(index, 1);
  sessionStorage.setItem("list", JSON.stringify(list));
  return true;
};
