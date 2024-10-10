import { Radio, RadioChangeEvent } from "antd";
import { FilterType } from "../types";
import { store } from "../store/index";
import { observer } from "mobx-react-lite";

import styles from "./index.module.scss";

const options = [
  { label: FilterType.ALL, value: FilterType.ALL },
  { label: FilterType.COMPLETED, value: FilterType.COMPLETED },
  { label: FilterType.UNCOMPLETED, value: FilterType.UNCOMPLETED },
];

const Filter = observer(() => {
  const { filterType } = store;

  const onChange = (e: RadioChangeEvent) => {
    store.changeFilterType(e.target.value);
  };

  return (
    <div className={styles.container}>
      <Radio.Group
        block
        options={options}
        defaultValue={FilterType.ALL}
        optionType="button"
        buttonStyle="solid"
        value={filterType}
        onChange={onChange}
      />
    </div>
  );
});

export default Filter;
