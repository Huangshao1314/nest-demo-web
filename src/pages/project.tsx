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
  {
    title: "num",
    dataIndex: "lotteryGameNum",
    key: "lotteryGameNum",
  },
];

const rateColumns = [
  {
    title: "数据",
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

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: RateItem;
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
      const data = res.data
        .map((item: any) => {
          return {
            lotteryDrawTime: item.date,
            lotteryDrawResult: item.red + "," + item.blue,
            lotteryGameNum: "02",
          };
        })
        .slice(0, 100);
      setData(
        (data as DataType[]).sort(
          (a, b) =>
            new Date(b.lotteryDrawTime.slice(0, 10)).getTime() -
            new Date(a.lotteryDrawTime.slice(0, 10)).getTime()
        )
      );
    });
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
        style={{ marginTop: 20 }}
      />
      {/* <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={rateData}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
          style={{ marginTop: 20, marginBottom: 20 }}
        />
      </Form> */}
    </div>
  );
};

export default Project;
