import { FilterType, StoreState } from "../types";

export const defaultState: StoreState = {
  todoList: [],
  filterType: FilterType.ALL,
  showTodoList: [],
};
