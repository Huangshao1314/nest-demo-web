import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Table, Input, Form, InputNumber, Typography, Popconfirm, } from "antd";
import { colorArr, dataSource, originBlue, originRed } from "./data";
import "./project.scss";
import { cloneDeep } from "lodash";
import outData from "../../out.json";
const columns = [
    {
        title: "seq",
        dataIndex: "seq",
        key: "seq",
        fixed: true,
    },
    {
        title: "result",
        dataIndex: "lotteryDrawResult",
        key: "lotteryDrawResult",
        render: (text, record) => _jsx("a", { children: record.red + "," + record.blue }),
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
        sorter: (a, b) => Number(a.total0) - Number(b.total0),
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
        sorter: (a, b) => Number(a.number) - Number(b.number),
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
const Project = (props) => {
    const [data, setData] = useState([]);
    const [rateData, setRateData] = useState([]);
    const [rate2Data, setRate2Data] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [tableCopyData, setTableCopyData] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [isDelete, setIsDelete] = useState(false);
    const columnsTable = [
        {
            title: "index",
            key: "index",
            dataIndex: "index",
            width: 20,
        },
        {
            title: "seq",
            key: "seq",
            dataIndex: "seq",
            width: 20,
        },
        { title: "开奖期数", key: "date", dataIndex: "date", width: 150 },
        {
            title: "开奖号码",
            key: "number",
            width: 400,
            render: (text, record) => {
                return (_jsxs("div", { children: [record.red.map((item) => {
                            return (_jsx(Fragment, { children: _jsx("span", { className: "red-boll", style: { background: item.background }, children: item.value }) }, JSON.stringify(item)));
                        }), _jsx("span", { className: "red-boll", style: { background: record.blue.background }, children: record.blue.value })] }));
            },
        },
        {
            title: "操作",
            render: (text, record, index) => {
                return (_jsx("div", { children: _jsx(Button, { onClick: () => redUpHandle(record.index - 1), style: { marginRight: 10 }, children: "\u5BF9\u6BD4" }) }));
            },
        },
    ];
    const redUpHandle = (index) => {
        setStartIndex(index);
        const redArr = tableData[index].red;
        const blueObj = tableData[index].blue;
        setTableData(tableData.map((item, ind) => {
            let seq = "";
            let red = item.red.map((el) => ({
                value: el.value,
                background: "#d9d9d9",
            }));
            let blue = { value: item.blue.value, background: "#d9d9d9" };
            if (ind > index && ind < 20 + index) {
                // 对比红色
                seq = ind - index;
                red = item.red.map((el) => {
                    let background = "#d9d9d9";
                    const res = redArr.findIndex((f) => f.value == el.value);
                    if (res != -1) {
                        background = colorArr[res];
                    }
                    return {
                        value: el.value,
                        background,
                    };
                });
            }
            if (index == ind) {
                red = item.red.map((el, i) => {
                    return {
                        value: el.value,
                        background: colorArr[i],
                    };
                });
                blue.background = originBlue;
                seq = 0;
            }
            if (ind > index && ind < 20 + index) {
                if (item.blue.value == blueObj.value) {
                    blue.background = originBlue;
                }
            }
            return {
                ...item,
                red,
                seq,
                blue,
            };
        }));
    };
    const queryHandle = () => {
        setStartIndex(0);
        const arr = outData.sort((a, b) => new Date(b.date.slice(0, 10)).getTime() -
            new Date(a.date.slice(0, 10)).getTime());
        const data = arr.map((item, index) => {
            const red = item.red.split(",").map((str) => {
                return {
                    value: str,
                    background: "#d9d9d9",
                };
            });
            return {
                id: item.id,
                date: item.date,
                index: index + 1,
                seq: "",
                red,
                blue: {
                    value: item.blue,
                    background: "#d9d9d9",
                },
            };
        });
        setTableData(data);
    };
    const resetHandle = () => {
        setStartIndex(0);
        setTableData((tableCopyData.length ? tableCopyData : tableData).map((item) => {
            let red = item.red.map((el) => ({
                value: el.value,
                background: originRed,
            }));
            return {
                ...item,
                red,
                blue: {
                    value: item.blue.value,
                    background: originBlue,
                },
            };
        }));
    };
    const deleteHandle = () => {
        if (!isDelete) {
            setTableCopyData(cloneDeep(tableData));
            setTableData(tableData.slice(0, startIndex + 10));
        }
        else {
            setTableData(tableCopyData);
        }
        setIsDelete(!isDelete);
    };
    // 连号分析
    const seqHandle = () => {
        setStartIndex(0);
        setTableData(tableData.map((item) => {
            let red = item.red.map((el, index) => {
                let background = "#d9d9d9";
                if (index < 5 &&
                    Number(el.value) + 1 == Number(item.red[index + 1].value)) {
                    background = originRed;
                }
                if (index > 0 &&
                    Number(el.value) - 1 == Number(item.red[index - 1].value)) {
                    background = originRed;
                }
                return {
                    value: el.value,
                    background,
                };
            });
            return {
                ...item,
                red,
                blue: {
                    value: item.blue.value,
                    background: "#d9d9d9",
                },
            };
        }));
    };
    const query = () => {
        const arr = outData.sort((a, b) => new Date(b.date.slice(0, 10)).getTime() -
            new Date(a.date.slice(0, 10)).getTime());
        const data = [];
        let seq = 0;
        // 和前面10组data相同的data有多少，red
        arr.forEach((item, index) => {
            if (index < arr.length - 11) {
                let same = {};
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
                const nums = item.red.split(",").map((s) => Number(s));
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
        let ttt = [];
        let obj = {};
        data.forEach((item) => {
            if (item.regionRate === "2:2:2") {
                if (obj[item.sameStr] == undefined) {
                    obj[item.sameStr] = 1;
                }
                else {
                    obj[item.sameStr] += 1;
                }
            }
        });
        for (let p in obj) {
            ttt.push({ name: p, value: obj[p] });
        }
        setData(data.slice(0, 100)
        // .filter((item) => item.regionRate == "2:2:2")
        );
    };
    // 检查连号
    const findLongestConsecutive = (nums) => {
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
    const calculateZoneRatio = (nums) => {
        let n1 = 0;
        let n2 = 0;
        let n3 = 0;
        nums.forEach((item) => {
            if (item > 0 && item < 12) {
                n1++;
            }
            else if (item > 11 && item < 23) {
                n2++;
            }
            else {
                n3++;
            }
        });
        return n1 + ":" + n2 + ":" + n3;
    };
    const getSameNum = (toStr, fromStr) => {
        const arr = toStr.split(",");
        const arr2 = fromStr.split(",");
        let i = 0;
        arr.forEach((item) => {
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
    const [resData, setResData] = useState([]);
    const [editingKey, setEditingKey] = useState("");
    const [value, setValue] = useState(1);
    const [checked, setChecked] = useState(true);
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
                setResData(newData);
                setEditingKey("");
            }
            else {
                newData.push(row);
                setResData(newData);
                setEditingKey("");
            }
        }
        catch (errInfo) {
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
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (_jsxs("span", { children: [_jsx(Typography.Link, { onClick: () => save(record.key), style: { marginRight: 8 }, children: "Save" }), _jsx(Popconfirm, { title: "Sure to cancel?", onConfirm: cancel, children: _jsx("a", { children: "Cancel" }) })] })) : (_jsx(Typography.Link, { disabled: editingKey !== "", onClick: () => edit(record), children: "Edit" }));
            },
        },
    ];
    const mergedColumns = tmpColumns.map((col) => {
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
            //   sorter: (a: any, b: any) =>
            //     Number(a[col.dataIndex]) - Number(b[col.dataIndex]),
        };
    });
    const addHandle = () => {
        setResData([
            ...resData,
            {
                id: resData.length + 1,
                name: data[0].red,
                key: resData.length + 1,
            },
        ]);
    };
    const combinations = (arr, k) => {
        const result = [];
        function backtrack(temp, start) {
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
        let redArr = [];
        for (let i = 1; i < 34; i++) {
            if (i < 10) {
                redArr.push("0" + i);
            }
            else {
                redArr.push(i + "");
            }
        }
        const numbers = dataSource[value - 1];
        const numArr = [];
        numbers.forEach((item, index) => {
            if (item == 0) {
                redArr = redArr.filter((el) => !data[index].red.split(",").includes(el));
            }
            else {
                numArr.push(index);
            }
        });
        const allCombinations = combinations(redArr, 6);
        const result = [];
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
            let nums = item.map((f) => {
                const n = Number(f);
                if (n > 0 && n < 12) {
                    n1++;
                }
                else if (n > 11 && n < 23) {
                    n2++;
                }
                else {
                    n3++;
                }
                return n;
            });
            if (!["2:2:2"].includes(n1 + ":" + n2 + ":" + n3)) {
                isRegion = false;
            }
            if (rateNum === numArr.length &&
                isRegion &&
                findLongestConsecutive(nums) == (checked ? 2 : 1)) {
                result.push(item);
            }
        });
    };
    useEffect(() => { }, []);
    const onChange = (value) => {
        setValue(Number(value));
    };
    const onChangechecked = (e) => {
        setChecked(e.target.checked);
    };
    return (_jsxs("div", { children: [_jsx(Button, { type: "primary", onClick: queryHandle, children: "\u7F6E\u7070" }), _jsx(Button, { style: { marginLeft: 8, marginRight: 8 }, type: "primary", onClick: deleteHandle, children: "\u53EA\u9009\u524D\u5341\u4E2A" }), _jsx(Button, { type: "primary", onClick: seqHandle, children: "\u8FDE\u53F7\u5206\u6790" }), _jsx(Button, { type: "primary", onClick: resetHandle, style: { marginLeft: 8, marginRight: 8 }, children: "\u91CD\u7F6E" }), _jsx(Table, { columns: columnsTable, dataSource: tableData, rowKey: "id", style: { marginTop: 20, marginBottom: 20 } }), _jsx(Button, { type: "primary", icon: _jsx(SearchOutlined, {}), onClick: query, children: "Search" }), _jsx(Table, { columns: columns, dataSource: data, rowKey: "id", style: { marginTop: 20, marginBottom: 20 }, pagination: false }), _jsx(Table, { columns: rateColumns, dataSource: rateData, rowKey: "name", style: { marginTop: 20 } }), _jsx(Table, { columns: rateColumns, dataSource: rate2Data, rowKey: "name", style: { marginTop: 20, marginBottom: 20 } }), _jsx(Button, { type: "primary", icon: _jsx(SearchOutlined, {}), onClick: addHandle, children: "Add" }), _jsx(Form, { form: form, component: false, children: _jsx(Table, { components: {
                        body: {
                            cell: EditableCell,
                        },
                    }, bordered: true, dataSource: resData, columns: mergedColumns, rowClassName: "editable-row", pagination: false, style: { marginTop: 20, marginBottom: 20 } }) })] }));
};
export default Project;
