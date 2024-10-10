import Filter from "./Filter";
import Add from "./Add";
import List from "./List";
import { useMount } from "ahooks";
import { StoreWrapper } from "./store/context";
import { store } from "./store/index";

const Home = () => {
  useMount(() => {
    // 初始化数据
    sessionStorage.setItem("list", JSON.stringify([]));

    store.queryTodoList();
  });

  return (
    <StoreWrapper>
      <h1>TODO LIST</h1>

      <Filter></Filter>
      <Add></Add>
      <List></List>
    </StoreWrapper>
  );
};
export default Home;
