import React from "react";
import { Form, Input, Button, Typography, Upload, message } from "antd";

import "./manage-form.css";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { imageFileUploader } from "../../../common/lib/asset-utils";

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};
/* eslint-enable no-template-curly-in-string */

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function dataURLtoFile(dataurl, filename) {
 
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
      
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, {type:mime});
}

export default function ManageForm(props) {
  const { defaultValues = {}, onCancel, onSubmit, loading } = props;
  
  const [ imgFile, setImgFile ] = React.useState();
  const [ imageUrl, setImageUrl ] = React.useState(defaultValues.imageUrl || '');

  const imageFilePreUploadhook = React.useCallback((file)=> {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    // return isJpgOrPng && isLt2M;
    setImgFile(file);
    getBase64(file, setImageUrl)
    return false;
  }, [])

  const handleSubmit = React.useCallback(async (formValues)=> {
    
    if(!imgFile && !imageUrl) {
      message.error('Upload User Image!');
      return
    }
    formValues.imageUrl = imageUrl;
    if (imgFile) {
      const slug = formValues.email.split('@')[0];
      const file = dataURLtoFile(imageUrl, `${slug}-profile-image`);
      const imageUploadResponse = await imageFileUploader({file, fileName: `${slug}-thumbnail`, folder: `users/admin-portal/`}, {});
      const { secure_url } = imageUploadResponse;
      formValues.imageUrl = secure_url;
    }
    onSubmit(formValues);
  }, [imageUrl, imgFile, onSubmit]);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );


  return (
    <Form
      layout="vertical"
      name="nest-messages"
      onFinish={handleSubmit}
      validateMessages={validateMessages}
      validateTrigger="onSubmit"
    >
      <Form.Item
        name={"name"}
        label="Name"
        rules={[{ required: true }]}
        initialValue={defaultValues.name}
      >
        <Typography.Title level={5}>Images</Typography.Title>

        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={imageFilePreUploadhook}
          onRemove={(_file) => {
            setImageUrl("");
            setImgFile(null);
          }}
          fileList={imgFile ? [imgFile] : []}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
          ) : (
            uploadButton
          )}
        </Upload>
      </Form.Item>
      <Form.Item
        name={"name"}
        label="Name"
        rules={[{ required: true }]}
        initialValue={defaultValues.name}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={"email"}
        label="Email"
        rules={[{ type: "email" }, { required: true }]}
        initialValue={defaultValues.email}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={"phone"}
        label="Phone Number"
        rules={[
          {
            required: true,
            message: 'Please input your phone number(must be unique)!',
          },
        ]}
        initialValue={defaultValues.phone}
      >
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
}
