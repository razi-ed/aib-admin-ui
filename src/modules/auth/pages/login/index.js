import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, Divider, Typography } from "antd";

import { loginService } from '../../../common/services/auth/auth.slice'


import "./login.css";

export default function Login(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const from = location.state?.from?.pathname || "/portal/";
  
  const onFinish = useCallback((values) => {
    dispatch(loginService(values))
    .unwrap()
    .then((originalPromiseResult) => {
      const { user } = originalPromiseResult;
      if (user) {
        navigate(from, { replace: true });;
      }
    })
    .catch((rejectedValueOrSerializedError) => {
      // handle error here
    })
  }, [dispatch, from, navigate]);

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
            autoComplete
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
