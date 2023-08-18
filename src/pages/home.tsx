import React, { FC, useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Table, Tooltip, Space, Tag } from "antd";
import api from "../api/http";
import type { ColumnsType } from "antd/es/table";

interface HomeProps {}

interface DataType {
  id: number;
  title: string;
  description: string;
  done: boolean;
}

const columns: ColumnsType<DataType> = [
  {
    title: "title",
    dataIndex: "title",
    key: "title",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "done",
    dataIndex: "done",
    key: "done",
    render: (text) => <Tag>{text ? "是" : "否"}</Tag>,
  },
];

const Home: FC<HomeProps> = (props) => {
  const [data, setData] = useState<DataType[]>([]);
  const query = () => {
    api.get("/tasks").then((res) => {
      setData(res.data as DataType[]);
    });
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
    </div>
  );
};

export default Home;
