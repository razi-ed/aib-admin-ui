import { Form, Input, Button } from 'antd';

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

  const { defaultValues = {}, onCancel, onSubmit, loading } = props

  return (
    <Form
        layout="vertical"
        name="nest-messages"
        onFinish={onSubmit}
        validateMessages={validateMessages}
        validateTrigger="onSubmit"
    >
        <Form.Item name={'label'} label="Label" rules={[{ required: true }]} initialValue={defaultValues.label}>
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