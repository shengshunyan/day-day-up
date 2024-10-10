import { useContext, useState } from "react";
import { FilterType, TodoItem } from "../types";
import {
  addTodo,
  completeTodo,
  deleteTodo,
  queryTodoList,
} from "../../../services/todo";
import { StoreContext } from "./context";
import { defaultState } from "./constants";

let updateTodoList: React.Dispatch<React.SetStateAction<TodoItem[]>> | null =
  null;
let updateFilterType: React.Dispatch<React.SetStateAction<FilterType>> | null =
  null;

export const useStore = () => {
  const [todoList, setTodoList] = useState<TodoItem[]>(defaultState.todoList);
  const [filterType, setFilterType] = useState<FilterType>(
    defaultState.filterType
  );

  updateTodoList = setTodoList;
  updateFilterType = setFilterType;

  const showTodoList = todoList.filter((item) => {
    switch (filterType) {
      case FilterType.ALL:
        return true;
      case FilterType.COMPLETED:
        return item.isCompleted === true;
      case FilterType.UNCOMPLETED:
        return item.isCompleted !== true;
    }
  });

  return {
    todoList,
    showTodoList,
    filterType,
  };
};

class Store {
  public getState = () => {
    return useContext(StoreContext);
  };

  /** 查询列表 */
  public queryTodoList = async () => {
    const res = await queryTodoList();
    updateTodoList?.(res);
  };

  /** 新增 */
  public addTodo = async (text: string) => {
    const item: TodoItem = {
      id: Date.now(),
      text,
      isCompleted: false,
    };
    await addTodo(item);
    await this.queryTodoList();
    return true;
  };

  /** 标为已完成 */
  public completeTodo = async (id: number) => {
    const res = await completeTodo(id);
    await this.queryTodoList();
    return res;
  };

  /** 删除 */
  public deleteTodo = async (id: number) => {
    const res = await deleteTodo(id);
    await this.queryTodoList();
    return res;
  };

  /** 切换筛选状态 */
  public changeFilterType = (type: FilterType) => {
    updateFilterType?.(type);
  };
}

export const store = new Store();
