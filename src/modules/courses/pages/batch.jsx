import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Moment from "moment";
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
  Upload,
  Alert,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { find, capitalize } from "lodash";

import "./page.css";
import LoadingSpinner from "../../common/components/loading-spinner";
import { actionStatuses } from "../../common/constants/action-status.constants";
import {
  getListService,
  upsertService,
  deleteService,
  moduleName,
} from "../services/slice";
import { getListService as getCategoriesService } from "../../categories/services/slice";
import { imageFileUploader } from "../../common/lib/asset-utils";
import { getByIdService } from "../services/slice";

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

export function UpsertCourseBatchDetailsPage(params) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const courseData = useSelector((state) => state.course.course);
  
  const { courseId = "", slug = '' } = useParams();
  const [batchCount, setBatchCount] = useState(courseData.totalBatches || 0);
  const [detailImageUrl, setDetailImageUrl] = useState();
  const [detailImageFile, setDetailImageFile] = useState();
  const [overviewImageUrl, setOverviewImageUrl] = useState();
  const [overviewImageFile, setOverviewImageFile] = useState();
  const [overviewVideoUrl, setOverviewVideoUrl] = useState();
  const [overviewVideoFile, setOverviewVideoFile] = useState();
  const formRef = useRef(null);

  // const userList = useSelector((state) => state.user.list);
  const categories = useSelector((state) => state.category.list);
  const loading = useSelector(
    (state) => state[moduleName].queryStatus === actionStatuses.PENDING
  );
  const pending = useSelector(
    (state) => state[moduleName].mutationStatus === actionStatuses.PENDING
  );

  useEffect(() => {
    dispatch(getCategoriesService());
    if (!(courseData && courseData.title)) {
      dispatch(getByIdService(courseId));
    }
  }, []);

  useEffect(() => {
    if (courseData.detailImageUrl) {
      setDetailImageUrl(courseData.detailImageUrl);
    }
  }, [courseData.detailImageUrl]);

  useEffect(() => {
    if (courseData.overviewImageUrl) {
      setOverviewImageUrl(courseData.overviewImageUrl);
    }
  }, [courseData.overviewImageUrl]);

  function handleSaveAndNext() {
    formRef.current.submit()
  }

  const onSubmit = useCallback(
    async (payload) => {
      // console.log(payload);
      if(!(detailImageUrl && overviewImageUrl)) {
        message.error('Upload thumbnails!');
        return
      }
      const batchDates = payload.batchDates.map((mDate) => mDate.toISOString())
      payload = {
        ...payload,
        detailImageUrl,
        overviewImageUrl,
        totalBatches: batchCount,
        batchDates,
      }
      delete payload.overviewVideoThumbnailUrl;
      delete payload.detailThumbnailUrl;

      const upsertResponse = await dispatch(upsertService({payload, id: courseId, step: 'batch'})).unwrap();
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
      const { id, slug: courseSlug } = upsertResponse;
      navigate(`/portal/course/module/${courseSlug}/${id}/0/0`);
    },
    [courseId, detailImageUrl, overviewImageUrl, batchCount]
  );

  const detailedThumbUrlPreUploadhook = useCallback(async (file)=> {
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
      fileName: `${slug}-detailed-thumbnail`, folder:`courses/${slug}/images`
    })
    await setDetailImageUrl(resp.secure_url)
    await setDetailImageFile(file)
    message.success({ content: 'Uploaded!', key, duration: 2 });
    return false;
  }, [slug]);

  const overviewVideoThumbUrlPreUploadhook = useCallback(async (file)=> {
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
      fileName: `${slug}-overview-video-thumbnail`, folder:`courses/${slug}/images`
    })
    await setOverviewImageUrl(resp.secure_url)
    await setOverviewImageFile(file)
    message.success({ content: 'Uploaded!', key, duration: 2 });
    return false;
  }, [slug]);

  const datePickerForBatch = () => {
    const getDatePicker = (index) => (
      <Form.Item
        name={["batchDates", index]}
        label={`Batch 0${index + 1}`}
        key={`Batch 0${index + 1}`}
        rules={[
          {
            type: "object",
            required: false,
            message: "Please select date!",
          },
        ]}
        initialValue={Array.isArray(courseData.batchDates) ? Moment(courseData.batchDates[index]) : undefined}
      >
        <DatePicker />
      </Form.Item>
    );
    let requiredDatePickers = [];
    for (let index = 0; index < batchCount; index++) {
      requiredDatePickers[index] = getDatePicker(index);
    }
    return requiredDatePickers;
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Row
        style={{ padding: "2rem 1rem" }}
        justify="space-between"
        className="create-source-header"
      >
        <Col span={16}>
          <Steps size="default" current={1}>
            <Steps.Step title="Step 1 - Basic Details" />
            <Steps.Step title="Step 2 - Batch Setup" />
            <Steps.Step title="Step 3 - Learning Resources" />
          </Steps>
        </Col>
        <Col className="create-source-header-actions">
          <Button style={{ marginRight: "12px" }} onClick={() => navigate(`/portal/${moduleName}/basic/${courseId}`, { replace: true })}>Discard & Previous</Button>
          <Button onClick={handleSaveAndNext} type="primary">
            Save & Next{" "}
          </Button>
        </Col>
      </Row>
      <div className="course-upsert-container">
        <Form
          layout="vertical"
          name="nest-messages"
          onFinish={onSubmit}
          validateMessages={validateMessages}
          validateTrigger="onSubmit"
          ref={formRef}
        >
          <Row gutter={16} style={{ margin: 0, marginTop: "3.5rem" }}>
            <Col span={8} className="basic-details-vertical-section">
              <Typography.Title level={5}>Batch</Typography.Title>
              {/**initialValue={defaultValues.description} */}
              <Form.Item
                name={"totalBatches"}
                label="No' of Batches"
                rules={[{ type: "number", min: 0, max: 4}]}
                getValueFromEvent={() => batchCount}
              >
                <InputNumber
                  onChange={setBatchCount}
                  defaultValue={batchCount}
                  max={4}
                  min={0}
                />
                <div>Maximum 4 Batches</div>
              </Form.Item>
              <Typography.Title level={5}>Batch Dates</Typography.Title>
              {datePickerForBatch()}
            </Col>
            <Col span={8} className="basic-details-vertical-section">
              <Typography.Title level={5}>Course Filters</Typography.Title>
              <Form.Item
                name={"domain"}
                label="Main Domain"
                rules={[{ required: true }]}
                initialValue={courseData.domain}
              >
                <Select>
                  {categories.length > 0
                    ? categories.map(({ value, label }) => (
                        <Select.Option key={value} value={value}>
                          {label}
                        </Select.Option>
                      ))
                    : null}
                </Select>
              </Form.Item>
              <Form.Item name={"filters"} label="Advanced Filters" 
                initialValue={courseData.filters}>
                <Select mode="tags" />
              </Form.Item>
              <Form.Item
                name={"concepts"}
                label="You'll Learn/Concepts Covered"
                initialValue={courseData.concepts}
              >
                <Select mode="tags" />
              </Form.Item>
            </Col>
            <Col span={8} className="basic-details-vertical-section">
              <Typography.Title level={5}>Videos & Overview</Typography.Title>
              <Alert
                description="Overiew Image should be 350px X 350px, .png .jpg .jpeg Supported, Max size 2MB."
                type="info"
              />
              <Form.Item name={"detailThumbnailUrl"} label="Detail Image">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="batch-img-uploader"
                  showUploadList={false}
                  beforeUpload={detailedThumbUrlPreUploadhook}
                  onRemove={(_file) => {
                    setDetailImageUrl('')
                    setDetailImageFile(null)
                  }}
                  fileList={detailImageFile ? [detailImageFile] : []}
                >
                  {detailImageUrl ? <img src={detailImageUrl} alt="avatar" style={{ width: '100%', height: '100%', maxHeight: '100%', maxWidth: '100%' }} /> : uploadButton}
                </Upload>
              </Form.Item>
              <Alert
                description="Video Thumbnail should be 1920px X 1080px, .png .jpg .jpeg Supported, Max size 2MB."
                type="info"
              />
              <Form.Item name={"overviewVideoThumbnailUrl"} label="Overview Image">
              <Upload
                name="avatar"
                listType="picture-card"
                className="batch-img-uploader"
                showUploadList={false}
                beforeUpload={overviewVideoThumbUrlPreUploadhook}
                onRemove={(_file) => {
                  setOverviewImageUrl('')
                  setOverviewImageFile(null)
                }}
                fileList={overviewImageFile ? [overviewImageFile] : []}
              >
                {overviewImageUrl ? <img src={overviewImageUrl} alt="avatar" style={{ width: '100%', height: '100%', maxHeight: '100%', maxWidth: '100%' }} /> : uploadButton}
              </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
}
