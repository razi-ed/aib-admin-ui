import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, Divider, Typography } from "antd";

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import "./login.css";

export default function Login(props) {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const onAuthSuccess = useCallback(() => {
    // Send them back to the page they tried to visit when they were
    // redirected to the login page. Use { replace: true } so we don't create
    // another entry in the history stack for the login page.  This means that
    // when they get to the protected page and click the back button, they
    // won't end up back on the login page, which is also really nice for the
    // user experience.
    navigate(from, { replace: true });
  }, [from, navigate]);

  const onFinish = useCallback((values) => {
    console.log("Success:", values);
  }, []);

  const onFinishFailed = useCallback((errorInfo) => {
    console.log("Failed:", errorInfo);
  }, []);

    return (
        <Form
            name="login"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Typography.Title level={3} className="login-title">Welcome to AIB Admin Portal</Typography.Title>
            <Divider />
            <Form.Item
                label="Email"
                name="email"
                rules={[
                {
                    required: true,
                    message: "Please input your email!",
                },
                ]}
            >
                <Input type="email" placeholder="Input your email" />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                {
                    required: true,
                    message: "Please input your password!",
                },
                ]}
            >
                <Input.Password placeholder="Input your password"/>
            </Form.Item>

            {/* <Form.Item
                name="remember"
                valuePropName="checked"
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Checkbox>Remember me</Checkbox>
            </Form.Item> */}

            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
                >
                    <div
                        className="login-btn-container"
                    >
                        <Button type="primary" htmlType="submit">
                            Login
                        </Button>
                    </div>
            </Form.Item>
        </Form>
    );
}
