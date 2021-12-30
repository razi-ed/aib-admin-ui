import { useCallback, useEffect, useMemo, useState } from "react";
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
import { getUsersService } from "../../users/services/user.slice";
import { getListService as getCategoriesService } from "../../categories/services/slice";

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

export function UpsertBatchPage(params) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id = "" } = useParams();
  const [batchCount, setBatchCount] = useState(1);
  const [panes, setPanes] = useState(initialPanes);
  const [activeModuleTabKey, setActiveModuleTabKey] = useState(initialPanes);

  let newModuleTabIndex = 0;

  // const userList = useSelector((state) => state.user.list);
  const categories = useSelector((state) => state.category.list);
  // const loading = useSelector(
  //   (state) => state[moduleName].queryStatus === actionStatuses.PENDING
  // );
  // const pending = useSelector(
  //   (state) => state[moduleName].mutationStatus === actionStatuses.PENDING
  // );

  // useEffect(() => {
  //   dispatch(getUsersService());
  //   dispatch(getCategoriesService());
  // }, []);

  const onSubmit = useCallback(
    (data) => {
      console.log(data);
      // dispatch(upsertService({name, description, id: keyId}))
      // .unwrap()
      // .then((result) => {
      //     const { hasErrored = false } = result;
      //     if (hasErrored) {
      //         notification.error({
      //             placement: 'topRight',
      //             message: `${keyId ? 'Updation' : 'Creation'} failed`,
      //             description: `${capitalize(moduleName)} ${keyId ? 'updation' : 'creation'} has failed`,
      //             duration: 3
      //         })
      //     } else {
      //         closeManageModal();
      //         dispatch(getListService());
      //         notification.success({
      //             placement: 'topRight',
      //             message: `${keyId ? 'Updation' : 'Creation'} Success`,
      //             description: `${capitalize(moduleName)} ${keyId ? 'updation' : 'creation'} was successful`,
      //             duration: 3
      //         })
      //     };
      // })
      // .catch((rejectedValueOrSerializedError) => {
      //     notification.error({
      //         placement: 'topRight',
      //         message: `${keyId ? 'Updation' : 'Creation'} failed`,
      //         description: `${capitalize(moduleName)} ${keyId ? 'updation' : 'creation'} has failed`,
      //         duration: 3
      //     })
      // })
    },
    [id]
  );

  const onModuleTabChange = (activeKey) => {
    setActiveModuleTabKey(activeKey);
  };

  const datePickerForBatch = useCallback((count) => {
    let batchCount = 1;
    const getDatePicker = (index) => (
      <Form.Item
        name={["batchDates", index]}
        label={`Batch 0${index}`}
        rules={[
          {
            type: "object",
            required: true,
            message: "Please select time!",
          },
        ]}
      >
        <DatePicker />
      </Form.Item>
    );
    const requiredDatePickers = [];
    while (batchCount <= count) {
      requiredDatePickers.push(getDatePicker(batchCount));
      batchCount++;
    }
    return requiredDatePickers;
  }, []);

  const onModuleTabEdit = () => {};

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
          <Button style={{ marginRight: "12px" }}>Clear all</Button>
          <Button onClick={onSubmit} type="primary">
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
        >
          <Row gutter={16} style={{ margin: 0, marginTop: "3.5rem" }}>
            <Col span={8} className="basic-details-vertical-section">
              <Typography.Title level={5}>Batch</Typography.Title>
              {/**initialValue={defaultValues.description} */}
              <Form.Item
                name={"totalBatches"}
                label="No' of Batches"
                rules={[{ type: "number", min: 1, max: 999, required: true }]}
              >
                <InputNumber
                  onChange={setBatchCount}
                  defaultValue={batchCount}
                  max={4}
                  min={1}
                />
                <div>Maximum 4 Batches</div>
              </Form.Item>
              <Typography.Title level={5}>Batch Dates</Typography.Title>
              {datePickerForBatch(batchCount)}
              {/* <Form.Item
                name={["batchDates", "0"]}
                label="Batch 01"
                rules={[
                  {
                    type: "object",
                    required: true,
                    message: "Please select time!",
                  },
                ]}
              >
                <DatePicker />
              </Form.Item> */}
            </Col>
            <Col span={8} className="basic-details-vertical-section">
              <Typography.Title level={5}>Course Filters</Typography.Title>
              <Form.Item
                name={"domain"}
                label="Main Domain"
                rules={[{ required: true }]}
              >
                <Select>
                  {categories.length > 0
                    ? categories.map(({ key, label }) => (
                        <Select.Option key={key} value={key}>
                          {label}
                        </Select.Option>
                      ))
                    : null}
                </Select>
              </Form.Item>
              <Form.Item name={"filters"} label="Advanced Filters">
                <Select mode="tags" />
              </Form.Item>
              <Form.Item
                name={"concepts"}
                label="You'll Learn/Concepts Covered"
              >
                <Select mode="tags" />
              </Form.Item>
            </Col>
            <Col span={8} className="basic-details-vertical-section">
              <Typography.Title level={5}>Videos & Thumbnail</Typography.Title>
              <Form.Item name={"concepts"} label="Overiew Thumbnail">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  beforeUpload={() => {}}
                  onChange={() => {}}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
              <Form.Item name={"concepts"} label="Detailed Thumbnail">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  beforeUpload={() => {}}
                  onChange={() => {}}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
              <Form.Item name={"concepts"} label="Video Thumbnail">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  beforeUpload={() => {}}
                  onChange={() => {}}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {/* <div>
          <Tabs
            type="editable-card"
            onChange={onModuleTabChange}
            activeKey={activeModuleTabKey}
            onEdit={onModuleTabEdit}
            tabPosition={"left"}
          >
            {panes.map((pane) => (
              <Tabs.TabPane
                tab={pane.title}
                key={pane.key}
                closable={pane.closable}
              >
                <div className="course-section-container">{pane.key}</div>
              </Tabs.TabPane>
            ))}
          </Tabs>
        </div> */}
      </div>
    </>
  );
}

const initialPanes = [
  {
    title: "Module 1",
    key: "1",
    closable: false,
  },
  { title: "Module 2", key: "2" },
  { title: "Module 3", key: "3" },
];
