import { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Input, Button, Select, Typography, Divider, Table, Space, Popconfirm, notification, Row, Col, InputNumber, Radio, DatePicker, Tabs } from "antd";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import LoadingSpinner from "../../common/components/loading-spinner";

import { getListService, upsertService, deleteService, moduleName } from "../services/slice";
import { getListService as getAuthor } from "../../authors/services/slice";
import { getListService as getCategoriesService } from "../../categories/services/slice";

import { actionStatuses } from "../../common/constants/action-status.constants";

import "./page.css";

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

export function UpsertCourseBasicDetailsPage() {
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { courseId = "" } = useParams();

    const userList = useSelector(state => state.user.list)
    const categories = useSelector(state => state.category.list)
    const loading = useSelector(state => state[moduleName].queryStatus === actionStatuses.PENDING)
    const pending = useSelector(state => state[moduleName].mutationStatus === actionStatuses.PENDING)

    useEffect(() => {
        dispatch(getUsersService());
        dispatch(getCategoriesService());
    }, [])

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
        [courseId],
    )

    return(
        <div className="course-upsert-container" id="course-upsert-basic">
            <Form
                layout="vertical"
                name="nest-messages"
                onFinish={onSubmit}
                validateMessages={validateMessages}
                validateTrigger="onSubmit"
            >
                <Row gutter={16} style={{margin: 0}}>
                    <Col span={8}>
                    {/**initialValue={defaultValues.description} */}
                        <Form.Item name={'title'} label="Course Title" rules={[{ required: true }]} >
                            <Input />
                        </Form.Item>
                        <Form.Item name={'description'} label="Short Description" rules={[{ required: true }]}>
                            <Input.TextArea rows={5}/>
                        </Form.Item>
                        <Form.Item name={'author'} label="Author" rules={[{ required: true }]} >
                            <Select>
                                { userList.length > 0 ? (
                                    userList.map(({name,id}) => (
                                        <Select.Option key={id} value={name}>{name}</Select.Option>
                                    ))
                                ) : null}
                            </Select>
                        </Form.Item>
                        <Form.Item name={"durationValue"} label="duration" rules={[{ type: 'number', min: 1, max: 999, required: true }]}>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item name="durationType" rules={[{ required: true, message: 'Please pick an item!' }]}>
                            <Radio.Group>
                                <Radio.Button value="HOURS">Hours</Radio.Button>
                                <Radio.Button value="DAYS">Days</Radio.Button>
                                <Radio.Button value="MONTHS">Months</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="courseType" rules={[{ required: true, message: 'Please pick an item!' }]} label="Type">
                            <Radio.Group>
                                <Radio.Button value="FREE">Free</Radio.Button>
                                <Radio.Button value="PAID">Paid</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        
                        <Form.Item name={"brilliancePoints"} label="Brilliance Points" rules={[{ type: 'number', min: 0, max: 999, required: false }]}>
                            <InputNumber />
                        </Form.Item>
                        
                        <Form.Item name={"sellingPrice"} label="Selling Price" rules={[{ type: 'number', min: 1, max: 99999, required: true }]}>
                            <InputNumber />
                        </Form.Item>

                        <Form.Item name={"discountedPrice"} label="Discounted Price" rules={[{ type: 'number', min: 1, max: 99999, required: true }]}>
                            <InputNumber />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <div>
                            image
                        </div>
                    </Col>
                </Row>
                <Form.Item>
                    <div className="user-manage-form-action-container">
                        <Button type="primary" htmlType="submit" disabled={loading}>
                            Save
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    )
}