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
} from "antd";
import api from "../api/http";
import type { ColumnsType } from "antd/es/table";

interface HomeProps {}

interface DataType {
  id: number;
  lotteryDrawResult: string;
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
  blue1: string;
  blue2: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "result",
    dataIndex: "lotteryDrawResult",
    key: "lotteryDrawResult",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "time",
    dataIndex: "lotteryDrawTime",
    key: "lotteryDrawTime",
  },
  //   {
  //     title: "num",
  //     dataIndex: "lotteryGameNum",
  //     key: "lotteryGameNum",
  //   },
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

      //和前面10组data相同的data有多少，red
      arr.forEach((item: any, index: number) => {
        if (index < arr.length - 11) {
          let same: any = {};
          let j = 0;
          for (let i = 0; i < 10; i++) {
            same["same" + (i + 1)] = getSameNum(
              item.red,
              arr[index + i + 1].red
            );
            if (same["same" + (i + 1)] == 0) {
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
          data.push({
            lotteryDrawTime: item.date,
            lotteryDrawResult: item.red + "," + item.blue,
            lotteryGameNum: "02",
            ...same,
            id: index,
            total0: j,
            blue1,
            blue2,
          });
        }
      });

      setData(data as DataType[]);
    });
  };

  const getSameNum = (toStr: string, fromStr: string) => {
    const arr = toStr.split(",");
    const arr2 = fromStr.split(",");
    let i = 0;
    arr.forEach((item: string, index: number) => {
      if (item == arr2[index]) {
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
      const tmp = item.lotteryDrawResult.split(",");
      for (let i = 0; i < 6; i++) {
        arr6[Number(tmp[i])] += 1;
      }
      arr7[Number(tmp[6])] += 1;
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
        name: data[0].lotteryDrawResult,
        key: resData.length + 1,
      },
    ] as ResItem[]);
  };

  useEffect(() => {}, []);
  return (
    <div>
      <Button type="primary" icon={<SearchOutlined />} onClick={query}>
        Search
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={"id"}
        style={{ marginTop: 20 }}
      />
      <Button type="primary" icon={<SearchOutlined />} onClick={countHandle}>
        计算
      </Button>
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
