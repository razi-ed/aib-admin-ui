import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Typography,
  Divider,
  Table,
  Space,
  Popconfirm,
  notification,
  Row,
  Col,
  InputNumber,
  Radio,
  DatePicker,
  Tabs,
  Steps,
  Alert,
  Upload,
  message,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { capitalize } from "lodash";

import LoadingSpinner from "../../common/components/loading-spinner";

import {
  getListService,
  upsertService,
  deleteService,
  moduleName,
  getByIdService,
} from "../services/slice";
import { getListService as getAuthors } from "../../authors/services/slice";
import { getListService as getCategoriesService } from "../../categories/services/slice";

import { actionStatuses } from "../../common/constants/action-status.constants";

import "./page.css";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { imageFileUploader } from "../../common/lib/asset-utils";

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

export function UpsertCourseBasicDetailsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId = "" } = useParams();
  const [ imgFile, setImgFile ] = useState();
  const [ imageUrl, setImageUrl ] = useState();
  const formRef = useRef(null);

  const authorList = useSelector((state) => state.author.list);
  const courseData = useSelector((state) => state.course.course);
  const loading = useSelector(
    (state) => state[moduleName].queryStatus === actionStatuses.PENDING
  );
  const pending = useSelector(
    (state) => state[moduleName].mutationStatus === actionStatuses.PENDING
  );
  const courseList = useSelector(
    (state) => state[moduleName].list
  );

  useEffect(() => {
    dispatch(getAuthors());
    dispatch(getByIdService(courseId));
  }, []);

  useEffect(() => {
    if (courseData.thumbnailUrl) {
      setImageUrl(courseData.thumbnailUrl);
    }
  }, [courseData.thumbnailUrl]);

  function handleSaveAndNext() {
    formRef.current.submit()
  }

  // const courseData = useMemo(() => {
  //   if (courseId && Array.isArray(courseList) && courseList.length > 0) {
  //     return courseList
  //   }
  // }, [courseList, courseId]);

  const onSubmit = useCallback(
    async (payload) => {
      console.log(payload);
      if(!imageUrl) {
        message.error('Upload thumbnail!');
        return
      }
      const msgKey = 'CREATING';
      message.loading({ content: 'Saving...', key: msgKey });
      const upsertResponse = await dispatch(upsertService({payload, id: courseId, step: 'basic'})).unwrap();
      const { hasErrored = false } = upsertResponse;
      if (hasErrored) {
          notification.error({
              placement: 'topRight',
              message: `${courseId ? 'Updation' : 'Creation'} failed`,
              description: `${capitalize(moduleName)} ${courseId ? 'updation' : 'creation'} has failed`,
              duration: 3
          })
          return;
      }
      const { id, slug } = upsertResponse;
      if(courseData.thumbnailUrl !== imageUrl) {
        const file = dataURLtoFile(imageUrl, `${slug}-thumbnail`);
        const imageUploadResponse = await imageFileUploader({file, fileName: `${slug}-thumbnail`, folder: `courses/${slug}/images`}, {});
        const { secure_url: thumbnailUrl } = imageUploadResponse;
        console.log({imageUploadResponse})
        const updateResponse = await dispatch(upsertService({payload: { thumbnailUrl }, id, step: 'thumbnail'})).unwrap()
        if (hasErrored) {
          notification.error({
              placement: 'topRight',
              message: `${courseId ? 'Updation' : 'Creation'} failed`,
              description: `${capitalize(moduleName)} ${courseId ? 'updation' : 'creation'} has failed`,
              duration: 3
          })
          return;
        }
      }
      message.success({ content: 'Saved!', key: msgKey, duration: 2 });
      navigate(`/portal/course/batch/${slug}/${id}`);
    },
    [courseId, imageUrl, courseData.thumbnailUrl]
  );

  const imageFilePreUploadhook = useCallback((file)=> {
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

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  if (courseId && loading) {
    return 'Loading...'
  }

  return (
    <>
      <Row
        style={{ padding: "2rem 1rem" }}
        justify="space-between"
        className="create-source-header"
      >
        <Col span={16}>
          <Steps size="default" current={0}>
            <Steps.Step title="Step 1 - Basic Details" />
            <Steps.Step title="Step 2 - Batch Setup" />
            <Steps.Step title="Step 3 - Learning Resources" />
          </Steps>
        </Col>
        <Col className="create-source-header-actions">
          {/* <Button style={{ marginRight: "12px" }}>Clear all</Button> */}
          <Button onClick={handleSaveAndNext} type="primary">
            Save & Next{" "}
          </Button>
        </Col>
      </Row>
      <div className="course-upsert-container" id="course-upsert-basic">
        <Form
          layout="vertical"
          name="nest-messages"
          onFinish={onSubmit}
          validateMessages={validateMessages}
          validateTrigger="onSubmit"
          ref={formRef}
        >
          <Row gutter={16} style={{ margin: 0, marginTop: "3.5rem" }}>
            <Col className="basic-details-vertical-section" span={8}>
              <Typography.Title level={5}>Basic Information</Typography.Title>
              {/**initialValue={defaultValues.description} */}
              <Form.Item
                name={"title"}
                label="Course Title"
                rules={[{ required: true }]}
                initialValue={courseData.title}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={"description"}
                label="Short Description"
                rules={[{ required: true }]}
                initialValue={courseData.description}
              >
                <Input.TextArea rows={5} />
              </Form.Item>
              <Form.Item
                name={"author"}
                label="Author"
                rules={[{ required: true }]}
                initialValue={courseData.author}
              >
                <Select>
                  {authorList.length > 0
                    ? authorList.map(({ name, id }) => (
                        <Select.Option key={id} value={name}>
                          {name}
                        </Select.Option>
                      ))
                    : null}
                </Select>
              </Form.Item>
              <Row justify="space-between" align="bottom">
                <Form.Item
                  name={"durationValue"}
                  label="duration"
                  rules={[{ type: "number", min: 1, max: 999, required: true }]}
                  initialValue={courseData.durationValue}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  name="durationType"
                  rules={[{ required: true, message: "Please pick an item!" }]}
                  
                  initialValue={courseData.durationType}
                >
                  <Radio.Group>
                    <Radio.Button value="HOURS">Hours</Radio.Button>
                    <Radio.Button value="DAYS">Days</Radio.Button>
                    <Radio.Button value="MONTHS">Months</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Row>
            </Col>
            <Col className="basic-details-vertical-section" span={8}>
              <Typography.Title level={5}>Price</Typography.Title>
              <Form.Item
                name="courseType"
                rules={[{ required: true, message: "Please pick an item!" }]}
                label="Type"
                initialValue={courseData.courseType || 'FREE'}
              >
                <Radio.Group>
                  <Radio.Button value="FREE">Free</Radio.Button>
                  <Radio.Button value="PAID">Paid</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name={"brilliancePoints"}
                label="Brilliance Points"
                rules={[{ type: "number", min: 0, max: 9999, required: false }]}
                initialValue={courseData.brilliancePoints}
              >
                <InputNumber disabled/>
              </Form.Item>

              <Form.Item
                name={"sellingPrice"}
                label="Selling Price"
                rules={[{ type: "number", min: 0, max: 99999, required: false }]}
                
                initialValue={courseData.sellingPrice}
              >
                <InputNumber disabled/>
              </Form.Item>

              <Form.Item
                name={"discountedPrice"}
                label="Discounted Price"
                rules={[{ type: "number", min: 0, max: 99999, required: false }]}
                initialValue={courseData.discountedPrice}
              >
                <InputNumber disabled/>
              </Form.Item>
            </Col>
            <Col className="basic-details-vertical-section" span={8}>
              <Typography.Title level={5}>Images</Typography.Title>
              
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={imageFilePreUploadhook}
                onRemove={(_file) => {
                  setImageUrl('')
                  setImgFile(null);
                }}
                fileList={imgFile ? [imgFile] : []}
              >
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
              </Upload>
                      
              <Alert
                description="Image should be 350px X 450px, .png .jpg .jpeg Supported, Max size 2MB."
                type="info"
              />
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
}
