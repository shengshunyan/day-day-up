import Filter from "./Filter";
import Add from "./Add";
import List from "./List";
import { useMount } from "ahooks";

const Home = () => {
  useMount(() => {
    // 初始化数据
    sessionStorage.setItem("list", JSON.stringify([]));
  });

  return (
    <>
      <h1>TODO LIST mobx</h1>

      <Filter></Filter>
      <Add></Add>
      <List></List>
    </>
  );
};
export default Home;
