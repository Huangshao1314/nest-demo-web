import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Checkbox, Form, Input } from "antd";
const onFinish = (values) => {
    console.log("Success:", values);
};
const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
};
const Login = () => (_jsxs(Form, { name: "basic", labelCol: { span: 8 }, wrapperCol: { span: 16 }, style: { maxWidth: 600 }, initialValues: { remember: true }, onFinish: onFinish, onFinishFailed: onFinishFailed, autoComplete: "off", children: [_jsx(Form.Item, { label: "Username", name: "username", rules: [{ required: true, message: "Please input your username!" }], children: _jsx(Input, {}) }), _jsx(Form.Item, { label: "Password", name: "password", rules: [{ required: true, message: "Please input your password!" }], children: _jsx(Input.Password, {}) }), _jsx(Form.Item, { name: "remember", valuePropName: "checked", wrapperCol: { offset: 8, span: 16 }, children: _jsx(Checkbox, { children: "Remember me" }) }), _jsx(Form.Item, { wrapperCol: { offset: 8, span: 16 }, children: _jsx(Button, { type: "primary", htmlType: "submit", children: "Submit" }) })] }));
export default Login;
