export type StoreState = {
  todoList: TodoItem[];
  filterType: FilterType;
  showTodoList: TodoItem[];
};

export type TodoItem = {
  id: number;
  text: string;
  isCompleted: boolean;
};

export enum FilterType {
  ALL = "all",
  COMPLETED = "completed",
  UNCOMPLETED = "uncompleted",
}
