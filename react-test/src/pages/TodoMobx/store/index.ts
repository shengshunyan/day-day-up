import { action, makeAutoObservable } from "mobx";
import { FilterType, TodoItem } from "../types";
import {
  addTodo,
  completeTodo,
  deleteTodo,
  queryTodoList,
} from "../../../services/todo";

class Store {
  constructor() {
    makeAutoObservable(this);

    this.queryTodoList();
  }

  public todoList: TodoItem[] = [];

  public filterType: FilterType = FilterType.ALL;

  public get showTodoList() {
    return this.todoList.filter((item) => {
      switch (this.filterType) {
        case FilterType.ALL:
          return true;
        case FilterType.COMPLETED:
          return item.isCompleted === true;
        case FilterType.UNCOMPLETED:
          return item.isCompleted !== true;
      }
    });
  }

  /** 查询列表 */
  public queryTodoList = async () => {
    const res = await queryTodoList();
    action(() => {
      this.todoList = res;
    })();
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
    this.filterType = type;
  };
}

export const store = new Store();
