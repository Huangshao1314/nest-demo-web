import React, { FC, useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Table,
  Tooltip,
  Space,
  Tag,
  Input,
  Form,
  InputNumber,
  Typography,
  Popconfirm,
  Checkbox,
} from "antd";
import api from "../api/http";
import type { ColumnsType } from "antd/es/table";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { dataSource } from "./data";

interface HomeProps {}

interface DataType {
  seq: number;
  id: number;
  blue: string;
  red: string;
  lotteryDrawTime: string;
  lotteryGameNum: string;
  same1: string;
  same2: string;
  same3: string;
  same4: string;
  same5: string;
  same6: string;
  same7: string;
  same8: string;
  same9: string;
  same10: string;
  total0: string;
  series: string;
  regionRate: string;
  blue1: string;
  blue2: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "seq",
    dataIndex: "seq",
    key: "seq",
  },
  {
    title: "result",
    dataIndex: "lotteryDrawResult",
    key: "lotteryDrawResult",
    render: (text, record) => <a>{record.red + "," + record.blue}</a>,
    fixed: true,
  },
  {
    title: "time",
    dataIndex: "lotteryDrawTime",
    key: "lotteryDrawTime",
  },
  {
    title: "num",
    dataIndex: "lotteryGameNum",
    key: "lotteryGameNum",
  },
  {
    title: "same1",
    dataIndex: "same1",
    key: "same1",
  },
  {
    title: "same2",
    dataIndex: "same2",
    key: "same2",
  },
  {
    title: "same3",
    dataIndex: "same3",
    key: "same3",
  },
  {
    title: "same4",
    dataIndex: "same4",
    key: "same4",
  },
  {
    title: "same5",
    dataIndex: "same5",
    key: "same5",
  },
  {
    title: "same6",
    dataIndex: "same6",
    key: "same6",
  },
  {
    title: "same7",
    dataIndex: "same7",
    key: "same7",
  },
  {
    title: "same8",
    dataIndex: "same8",
    key: "same8",
  },
  {
    title: "same9",
    dataIndex: "same9",
    key: "same9",
  },
  {
    title: "same10",
    dataIndex: "same10",
    key: "same10",
  },
  {
    title: "total0",
    dataIndex: "total0",
    key: "total0",
    sorter: (a: any, b: any) => Number(a.total0) - Number(b.total0),
  },
  {
    title: "series",
    dataIndex: "series",
    key: "series",
  },
  {
    title: "regionRate",
    dataIndex: "regionRate",
    key: "regionRate",
  },
  {
    title: "blue1",
    dataIndex: "blue1",
    key: "blue1",
  },
  {
    title: "blue2",
    dataIndex: "blue2",
    key: "blue2",
  },
];

const rateColumns = [
  {
    title: "data",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "number",
    dataIndex: "number",
    key: "number",
    sorter: (a: any, b: any) => Number(a.number) - Number(b.number),
  },
];

// 编辑表格
interface RateItem {
  key: string;
  name: string;
  column1: string;
  column2: string;
  column3: string;
  column4: string;
  column5: string;
  column6: string;
  column7: string;
  editable: boolean;
}

interface ResItem {
  key: string;
  name: string;
  same1: string;
  same2: string;
  same3: string;
  same4: string;
  same5: string;
  same6: string;
  same7: string;
  same8: string;
  same9: string;
  same10: string;
  editable: boolean;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: ResItem;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Project: FC<HomeProps> = (props) => {
  const [data, setData] = useState<DataType[]>([]);
  const [rateData, setRateData] = useState<any[]>([]);
  const [rate2Data, setRate2Data] = useState<any[]>([]);

  const query = () => {
    api.get("/projects").then((res) => {
      const arr = res.data.sort(
        (a: any, b: any) =>
          new Date(b.date.slice(0, 10)).getTime() -
          new Date(a.date.slice(0, 10)).getTime()
      );
      const data: any[] = [];
      let seq = 0;

      // 和前面10组data相同的data有多少，red
      arr.forEach((item: any, index: number) => {
        if (index < arr.length - 11) {
          let same: any = {};
          let j = 0;
          let sameStr = "";
          for (let i = 1; i < 11; i++) {
            same["same" + i] =
              getSameNum(item.red, arr[index + i].red) == 0 ? 0 : 1;
            sameStr += same["same" + i];
            if (same["same" + i] == 0) {
              j++;
            }
          }
          let blue1 = 0;
          let blue2 = 0;
          for (let i = 1; i < 30; i++) {
            if (item.blue == arr[index + i]?.blue) {
              if (blue1 != 0 && blue2 == 0) {
                blue2 = i;
                break;
              }
              if (blue1 == 0) {
                blue1 = i;
              }
            }
          }
          const nums = item.red.split(",").map((s: string) => Number(s));
          seq++;
          data.push({
            lotteryDrawTime: item.date,
            red: item.red,
            blue: item.blue,
            lotteryGameNum: "02",
            ...same,
            id: index,
            total0: j,
            blue1,
            blue2,
            series: findLongestConsecutive(nums),
            regionRate: calculateZoneRatio(nums),
            seq,
            sameStr,
          });
        }
      });
      let t = 0;
      let k = 0;
      let y = 0;
      let ttt: any[] = [];
      let obj: any = {};
      data.forEach((item) => {
        if (item.regionRate === "2:2:2") {
          if (obj[item.sameStr] == undefined) {
            obj[item.sameStr] = 1;
          } else {
            obj[item.sameStr] += 1;
          }
        }
      });
      for (let p in obj) {
        ttt.push({ name: p, value: obj[p] });
      }
      // console.log("rate", k / t);
      // console.log("obj: ", obj);
      console.log(
        "ttt: ",
        ttt.sort((a, b) => a.value - b.value)
      );

      setData(
        data as DataType[]
        //  .slice(0, 100)
        // .filter((item) => item.regionRate == "2:2:2")
      );
    });
  };

  // 检查连号
  const findLongestConsecutive = (nums: number[]) => {
    if (nums.length === 0) {
      return 0;
    }

    const numSet = new Set(nums);
    let maxLength = 0;

    for (const num of numSet) {
      if (!numSet.has(num - 1)) {
        let currentNum = num;
        let currentLength = 1;

        while (numSet.has(currentNum + 1)) {
          currentNum += 1;
          currentLength += 1;
        }

        maxLength = Math.max(maxLength, currentLength);
      }
    }

    return maxLength;
  };

  // 区间比
  const calculateZoneRatio = (nums: number[]) => {
    let n1 = 0;
    let n2 = 0;
    let n3 = 0;
    nums.forEach((item) => {
      if (item > 0 && item < 12) {
        n1++;
      } else if (item > 11 && item < 23) {
        n2++;
      } else {
        n3++;
      }
    });
    return n1 + ":" + n2 + ":" + n3;
  };

  const getSameNum = (toStr: string, fromStr: string) => {
    const arr = toStr.split(",");
    const arr2 = fromStr.split(",");
    let i = 0;
    arr.forEach((item: string) => {
      if (arr2.includes(item)) {
        i++;
      }
    });
    return i;
  };

  const countHandle = () => {
    if (data.length === 0) {
      return;
    }
    const arr6 = Array(34).fill(0);
    const arr7 = Array(17).fill(0);
    data.forEach((item) => {
      const tmp = item.red.split(",");
      for (let i = 0; i < 6; i++) {
        arr6[Number(tmp[i])] += 1;
      }
      arr7[Number(item.blue)] += 1;
    });
    const arr = [];
    for (let i = 1; i < 34; i++) {
      arr.push({
        name: i,
        number: (arr6[i] / data.length).toFixed(3),
      });
    }
    setRateData(arr);
    const arr2 = [];
    for (let i = 1; i < 17; i++) {
      arr2.push({
        name: i,
        number: (arr7[i] / data.length).toFixed(3),
      });
    }
    setRate2Data(arr2);
  };

  const [form] = Form.useForm();
  const [resData, setResData] = useState<ResItem[]>([]);
  const [editingKey, setEditingKey] = useState("");
  const [value, setValue] = useState<number>(1);
  const [checked, setChecked] = useState<boolean>(true);

  const isEditing = (record: ResItem) => record.key === editingKey;

  const edit = (record: Partial<ResItem> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", age: "", address: "", ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as ResItem;

      const newData = [...rateData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setResData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setResData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const tmpColumns = [
    { title: "data", dataIndex: "name" },
    {
      title: "same1",
      dataIndex: "same1",
      editable: true,
    },
    {
      title: "same2",
      dataIndex: "same2",
      editable: true,
    },
    {
      title: "same3",
      dataIndex: "same3",
      editable: true,
    },
    {
      title: "same4",
      dataIndex: "same4",
      editable: true,
    },
    {
      title: "same5",
      dataIndex: "same5",
      editable: true,
    },
    {
      title: "same6",
      dataIndex: "same6",
      editable: true,
    },
    {
      title: "same7",
      dataIndex: "same7",
      editable: true,
    },
    {
      title: "same8",
      dataIndex: "same8",
      editable: true,
    },
    {
      title: "same9",
      dataIndex: "same9",
      editable: true,
    },
    {
      title: "same10",
      dataIndex: "same10",
      editable: true,
    },
    {
      title: "total0",
      dataIndex: "total0",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_: any, record: ResItem) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = tmpColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: ResItem) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
      //   sorter: (a: any, b: any) =>
      //     Number(a[col.dataIndex]) - Number(b[col.dataIndex]),
    };
  }) as ColumnsType<ResItem>;

  const addHandle = () => {
    setResData([
      ...resData,
      {
        id: resData.length + 1,
        name: data[0].red,
        key: resData.length + 1,
      },
    ] as ResItem[]);
  };

  const combinations = (arr: number[], k: number) => {
    const result: any[] = [];

    function backtrack(temp: any[], start: number) {
      if (temp.length === k) {
        result.push([...temp]);
        return;
      }

      for (let i = start; i < arr.length; i++) {
        temp.push(arr[i]);
        backtrack(temp, i + 1);
        temp.pop();
      }
    }

    backtrack([], 0);
    return result;
  };

  const measureHandle = () => {
    if (data.length === 0) {
      return;
    }
    let redArr: any[] = [];
    for (let i = 1; i < 34; i++) {
      if (i < 10) {
        redArr.push("0" + i);
      } else {
        redArr.push(i + "");
      }
    }
    const numbers = dataSource[value - 1];

    const numArr: number[] = [];
    numbers.forEach((item, index) => {
      if (item == 0) {
        redArr = redArr.filter(
          (el) => !data[index].red.split(",").includes(el)
        );
      } else {
        numArr.push(index);
      }
    });
    const allCombinations = combinations(redArr, 6);
    const result: any = [];
    allCombinations.forEach((item) => {
      let rateNum = 0;

      numArr.forEach((num) => {
        let isSame = false;
        let sameNum = 0;
        let arr = data[num].red.split(",");
        for (let i = 0; i < arr.length; i++) {
          if (item.includes(arr[i])) {
            isSame = true;
            sameNum++;
          }
        }
        if (isSame && sameNum < 3) {
          rateNum++;
        }
      });
      let isRegion = true;
      let n1 = 0;
      let n2 = 0;
      let n3 = 0;
      let nums = item.map((f: any) => {
        const n = Number(f);
        if (n > 0 && n < 12) {
          n1++;
        } else if (n > 11 && n < 23) {
          n2++;
        } else {
          n3++;
        }
        return n;
      });
      if (!["2:2:2"].includes(n1 + ":" + n2 + ":" + n3)) {
        isRegion = false;
      }
      if (
        rateNum === numArr.length &&
        isRegion &&
        findLongestConsecutive(nums) == (checked ? 2 : 1)
      ) {
        result.push(item);
      }
    });
    console.log("result: ", result);
  };

  useEffect(() => {}, []);

  const onChange = (value: any) => {
    setValue(Number(value));
  };
  const onChangechecked = (e: CheckboxChangeEvent) => {
    setChecked(e.target.checked);
  };
  return (
    <div>
      <Button type="primary" icon={<SearchOutlined />} onClick={query}>
        Search
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={"id"}
        style={{ marginTop: 20, marginBottom: 20 }}
        pagination={false}
      />
      <Button type="primary" icon={<SearchOutlined />} onClick={countHandle}>
        计算
      </Button>
      <Button type="primary" icon={<SearchOutlined />} onClick={measureHandle}>
        test
      </Button>
      <InputNumber defaultValue={1} min={1} max={5} onChange={onChange} />
      <Checkbox checked={checked} onChange={onChangechecked}>
        连
      </Checkbox>
      <Table
        columns={rateColumns}
        dataSource={rateData}
        rowKey={"name"}
        style={{ marginTop: 20 }}
      />
      <Table
        columns={rateColumns}
        dataSource={rate2Data}
        rowKey={"name"}
        style={{ marginTop: 20, marginBottom: 20 }}
      />
      <Button type="primary" icon={<SearchOutlined />} onClick={addHandle}>
        Add
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={resData}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
          style={{ marginTop: 20, marginBottom: 20 }}
        />
      </Form>
    </div>
  );
};

export default Project;
