import { Form, Input, Button, DatePicker, Typography, Upload, message, Alert } from 'antd';
import { useCallback, useState } from 'react';
import { imageFileUploader } from '../../../common/lib/asset-utils';
import { v4 as uuid } from '@lukeed/uuid';

import './manage-form.css'
import { PlusOutlined } from '@ant-design/icons';

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
const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

export default function ManageForm(props) {
  const [imageUrl, setImageUrl] = useState()
  const [imageFile, setImageFile] = useState()

  const { defaultValues = {}, options = {}, onCancel, onSubmit, loading } = props

  const handleSubmit = useCallback((data) => {
    if (imageUrl) {
      onSubmit({...data, imageUrl, date: data.date.toISOString()})
    } else {
      message.error('Upload Image File!');
    }
  }, [imageUrl, onSubmit])
  
  const imageFilePreUploadhook = useCallback(async (file)=> {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    const key = 'Upload';
    message.loading({ content: 'Uploading...', key });
    
    // return isJpgOrPng && isLt2M;
    const resp = await imageFileUploader({
      file,
      fileName: uuid(), folder:`webinars`
    })
    await setImageUrl(resp.secure_url)
    await setImageFile(file)
    message.success({ content: 'Uploaded!', key, duration: 2 });
    return false;
  }, []);
  
  return (
    <Form
      layout="vertical"
      name="nest-messages"
      onFinish={handleSubmit}
      validateMessages={validateMessages}
      validateTrigger="onSubmit"
    >
      <Form.Item name={'title'} label="Title" rules={[{ required: true }]} initialValue={defaultValues.title}>
        <Input />
      </Form.Item>
      <Form.Item name={'date'} label="Date" rules={[{ required: true }]} initialValue={defaultValues.date}>
        <DatePicker showTime/>
      </Form.Item>
      <Form.Item name={'zoomLink'} label="Zoom Link" rules={[{ required: true }]} initialValue={defaultValues.zoomLink}>
        <Input />
      </Form.Item>
      <Form.Item name={'youtubeLink'} label="Youtube Link" initialValue={defaultValues.youtubeLink}>
        <Input />
      </Form.Item>
      <Typography.Title level={5}>Images</Typography.Title>
              
      <Upload
        name="avatar"
        listType="picture-card"
        className="webinar-image"
        showUploadList={false}
        beforeUpload={imageFilePreUploadhook}
        onRemove={(_file) => {
          setImageUrl('')
          setImageFile(null);
        }}
        fileList={imageFile ? [imageFile] : []}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
              
      <Alert
        description="Image should be 350px X 450px, .png .jpg .jpeg Supported, Max size 2MB."
        type="info"
        style={{ marginBottom: '16px'}}
      />
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