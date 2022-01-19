import { Form, Input, Button, Select } from 'antd';

import './manage-form.css'

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};
/* eslint-enable no-template-curly-in-string */

export default function ManageForm(props) {

  const { defaultValues = {}, options = {}, onCancel, onSubmit, loading } = props
  return (
    <Form
        layout="vertical"
        name="nest-messages"
        onFinish={onSubmit}
        validateMessages={validateMessages}
        validateTrigger="onSubmit"
    >
        <Form.Item name={'name'} label="name" rules={[{ required: true }]} initialValue={defaultValues.name}>
            <Select>
                { options.userList.length > 0 ? (
                    options.userList.map(({name}) => (
                        <Select.Option key={name} value={name}>{name}</Select.Option>
                    ))
                ) : null}
            </Select>
        </Form.Item>
        <Form.Item name={'designation'} label="Designation" rules={[{ required: true }]} initialValue={defaultValues.designation}>
            <Input />
        </Form.Item>
        <Form.Item>
          <div className="user-manage-form-action-container">
            <Button type="primary" htmlType="submit" disabled={loading}>
                Submit
            </Button>
            <Button onClick={onCancel} disabled={loading}>
                Cancel
            </Button>
          </div>
        </Form.Item>
    </Form>
  );
};