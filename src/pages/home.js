import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Table, Input, Form, InputNumber, Typography, Popconfirm, } from "antd";
import api from "../api/http";
const columns = [
    {
        title: "lotteryDrawResult",
        dataIndex: "lotteryDrawResult",
        key: "lotteryDrawResult",
        render: (text) => _jsx("a", { children: text }),
    },
    {
        title: "lotteryDrawTime",
        dataIndex: "lotteryDrawTime",
        key: "lotteryDrawTime",
    },
    {
        title: "lotteryGameNum",
        dataIndex: "lotteryGameNum",
        key: "lotteryGameNum",
    },
];
const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    const inputNode = inputType === "number" ? _jsx(InputNumber, {}) : _jsx(Input, {});
    return (_jsx("td", { ...restProps, children: editing ? (_jsx(Form.Item, { name: dataIndex, style: { margin: 0 }, rules: [
                {
                    required: true,
                    message: `Please Input ${title}!`,
                },
            ], children: inputNode })) : (children) }));
};
const Home = (props) => {
    const [data, setData] = useState([]);
    const query = () => {
        api.get("/tasks").then((res) => {
            setData(res.data.sort((a, b) => new Date(a.lotteryDrawTime).getTime() -
                new Date(b.lotteryDrawTime).getTime()));
        });
    };
    const [form] = Form.useForm();
    const [rateData, setRateData] = useState([]);
    const [editingKey, setEditingKey] = useState("");
    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({ name: "", age: "", address: "", ...record });
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey("");
    };
    const save = async (key) => {
        try {
            const row = (await form.validateFields());
            const newData = [...rateData];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setRateData(newData);
                setEditingKey("");
            }
            else {
                newData.push(row);
                setRateData(newData);
                setEditingKey("");
            }
        }
        catch (errInfo) {
            console.log("Validate Failed:", errInfo);
        }
    };
    const rateColumns = [
        { title: "数据", dataIndex: "name" },
        {
            title: "1",
            dataIndex: "column1",
            editable: true,
        },
        {
            title: "2",
            dataIndex: "column2",
            editable: true,
        },
        {
            title: "3",
            dataIndex: "column3",
            editable: true,
        },
        {
            title: "4",
            dataIndex: "column4",
            editable: true,
        },
        {
            title: "5",
            dataIndex: "column5",
            editable: true,
        },
        {
            title: "6",
            dataIndex: "column6",
            editable: true,
        },
        {
            title: "7",
            dataIndex: "column7",
            editable: true,
        },
        {
            title: "operation",
            dataIndex: "operation",
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (_jsxs("span", { children: [_jsx(Typography.Link, { onClick: () => save(record.key), style: { marginRight: 8 }, children: "Save" }), _jsx(Popconfirm, { title: "Sure to cancel?", onConfirm: cancel, children: _jsx("a", { children: "Cancel" }) })] })) : (_jsx(Typography.Link, { disabled: editingKey !== "", onClick: () => edit(record), children: "Edit" }));
            },
        },
        {
            title: "sum1",
            dataIndex: "sum1",
            editable: true,
        },
        {
            title: "sum2",
            dataIndex: "sum2",
            editable: true,
        },
    ];
    const mergedColumns = rateColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === "age" ? "number" : "text",
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
            sorter: (a, b) => Number(a[col.dataIndex]) - Number(b[col.dataIndex]),
        };
    });
    const countHandle = () => {
        if (data.length === 0) {
            return;
        }
        let obj = {};
        data.forEach((item) => {
            const temp = item.lotteryDrawResult.split(" ");
            temp.forEach((tmp, index) => {
                if (obj[index + 1] == undefined) {
                    obj[index + 1] = {};
                }
                if (obj[index + 1][tmp] == undefined) {
                    obj[index + 1][tmp] = 1;
                }
                else {
                    obj[index + 1][tmp] += 1;
                }
            });
        });
        const arr = [];
        for (let i = 0; i < 15; i++) {
            let tmp = {
                key: i + 1 + "",
                name: i + "",
            };
            let sum1 = 0;
            let sum2 = 0;
            for (let j = 1; j < 8; j++) {
                if (i > 9 && j < 7) {
                    tmp["column" + j] = 0;
                }
                else {
                    tmp["column" + j] = (1 - (obj[j][i] || 0) / data.length).toFixed(3);
                }
                if (j < 4) {
                    sum1 += Number(tmp["column" + j]);
                }
                else if (j < 7) {
                    sum2 += Number(tmp["column" + j]);
                }
            }
            tmp.sum1 = sum1.toFixed(3);
            tmp.sum2 = sum2.toFixed(3);
            arr.push(tmp);
        }
        setRateData(arr);
    };
    const resColumns = [
        { title: "数据", dataIndex: "name" },
        {
            title: "1",
            dataIndex: "column1",
            editable: true,
        },
        {
            title: "2",
            dataIndex: "column2",
            editable: true,
        },
        {
            title: "3",
            dataIndex: "column3",
            editable: true,
        },
        {
            title: "4",
            dataIndex: "column4",
            editable: true,
        },
        {
            title: "5",
            dataIndex: "column5",
            editable: true,
        },
        {
            title: "6",
            dataIndex: "column6",
            editable: true,
        },
        {
            title: "7",
            dataIndex: "column7",
            editable: true,
        },
    ];
    const [resData, setResData] = useState([]);
    // 定义数字和它们的权重
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const testHandle = () => {
        if (rateData.length === 0) {
            return;
        }
        const obj = {};
        for (let i = 1; i < 8; i++) {
            obj[i] = rateData.map((item) => Number(item["column" + i]));
        }
        // let arr: any[] = [];
        // let k = 1;
        // obj[1].forEach((item1: any) => {
        //   obj[2].forEach((item2: any) => {
        //     obj[3].forEach((item3: any) => {
        //       obj[4].forEach((item4: any) => {
        //         obj[5].forEach((item5: any) => {
        //           obj[6].forEach((item6: any) => {
        //             obj[7].forEach((item7: any) => {
        //               const tmp = {
        //                 name: k++ + "",
        //                 column1: item1.num,
        //                 column2: item2.num,
        //                 column3: item3.num,
        //                 column4: item4.num,
        //                 column5: item5.num,
        //                 column6: item6.num,
        //                 column7: item7.num,
        //                 rate:
        //                   Number(item1.rate) *
        //                   Number(item2.rate) *
        //                   Number(item3.rate) *
        //                   Number(item4.rate) *
        //                   Number(item5.rate) *
        //                   Number(item6.rate) *
        //                   Number(item7.rate),
        //               };
        //               arr.push(tmp);
        //             });
        //           });
        //         });
        //       });
        //     });
        //   });
        // });
        // setResData(arr);
        let row = { name: resData.length + 1 };
        for (let i = 1; i < 8; i++) {
            row["column" + i] = getRandomNumber(obj[i]);
        }
        setResData([...resData, row]);
        console.error("hello-->resData:", resData);
    };
    const getRandomNumber = (weights) => {
        // 计算累积权重
        const cumulativeWeights = [];
        let cumulativeWeight = 0;
        for (const weight of weights) {
            cumulativeWeight += weight;
            cumulativeWeights.push(cumulativeWeight);
        }
        const random = Math.random() * cumulativeWeight;
        for (let i = 0; i < cumulativeWeights.length; i++) {
            if (random < cumulativeWeights[i]) {
                return numbers[i];
            }
        }
        return numbers[numbers.length - 1];
    };
    useEffect(() => { }, []);
    return (_jsxs("div", { children: [_jsx(Button, { type: "primary", icon: _jsx(SearchOutlined, {}), onClick: query, children: "Search" }), _jsx(Table, { columns: columns, dataSource: data, rowKey: "id", style: { marginTop: 20 } }), _jsx(Button, { type: "primary", icon: _jsx(SearchOutlined, {}), onClick: countHandle, children: "\u8BA1\u7B97" }), _jsx(Form, { form: form, component: false, children: _jsx(Table, { components: {
                        body: {
                            cell: EditableCell,
                        },
                    }, bordered: true, dataSource: rateData, columns: mergedColumns, rowClassName: "editable-row", pagination: false, style: { marginTop: 20, marginBottom: 20 } }) }), _jsx(Button, { type: "primary", icon: _jsx(SearchOutlined, {}), onClick: testHandle, children: "\u4F30\u91CF" }), _jsx(Table, { columns: resColumns, dataSource: resData, rowKey: "name", style: { marginTop: 20 }, pagination: false })] }));
};
export default Home;
