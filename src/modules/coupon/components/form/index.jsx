import { Form, Input, InputNumber, Button, Select } from 'antd';

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
        <Form.Item name={'label'} label="Coupon" rules={[{ required: true }]} initialValue={defaultValues.label}>
            <Input />
        </Form.Item>
        <Form.Item name={'name'} label="Unique Name" rules={[{ required: true }]} initialValue={defaultValues.name}>
            <Input />
        </Form.Item>
        <Form.Item name={'action'} label="Coupon Action" rules={[{ required: true }]} initialValue={defaultValues.action}>
            <Select>
                <Select.Option key={'precentage-deduct'} value={'precentage-deduct'}>{'Precentage Deduct'}</Select.Option>
                <Select.Option key={'overall-deduct'} value={'overall-deduct'}>{'Overall Deduct'}</Select.Option>
            </Select>
        </Form.Item>
        <Form.Item name={'value'} label="Affect Value" rules={[{ required: true }]} initialValue={defaultValues.value}>
            <InputNumber style={{width: '100%'}} />
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