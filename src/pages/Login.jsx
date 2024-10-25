import AppLayout from "../components/layout/AppLayout.jsx";
import {Button, Checkbox, Flex, Form, Input, theme} from "antd";
import {UserOutlined, LockOutlined} from "@ant-design/icons";
import {useAuth} from "../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";


function Login() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(()=> {
        if(user !== null) {
            navigate("/dashboard");
        }
    },[user, navigate])

    async function onFinish(values){
        const response = await login({
            email: values.email,
            password: values.password,
        });
        if(response?.status === 200){
            navigate("/dashboard");
        }
    }

    return <AppLayout centerChildren={true}>
        <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            style={{
                width: "30rem",
                padding: "3em",
                background: colorBgContainer,
                borderRadius: borderRadiusLG}}
        >
            <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
            >
                <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
            >
                <Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" />
            </Form.Item>
            <Form.Item>
                <Flex justify="space-between" align="center">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <a href="">Forgot password</a>
                </Flex>
            </Form.Item>

            <Form.Item>
                <Button block type="primary" htmlType="submit">
                    Log in
                </Button>
            </Form.Item>
        </Form>
    </AppLayout>;
}

export default Login;