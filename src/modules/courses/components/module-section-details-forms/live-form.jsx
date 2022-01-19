import {useCallback, useEffect, useState,} from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {Button, Col, Form, Input, InputNumber, message, Radio, Row, Select, Typography, Upload} from 'antd';

import { addSectionDetails } from '../../services/slice';
import { getListService as getCoachesService } from '../../../coaches/services/slice';

export default function LiveSectionForm(params) {
    const { slug = '', courseId = '', moduleId = '', sectionId = '' } = useParams();
    const dispatch = useDispatch();
    const coaches = useSelector(state => state.coach.list);

    const [totalCodingEnablers, setTotalCodingEnablers] = useState(1);

    useEffect(() => {
        dispatch(getCoachesService());
    }, []);

    
    const onSubmit = useCallback(async (payload) => {
        const key = 'SAVING';
        message.loading({ content: 'Saving...', key });
        const data = {
            sectionType: 'LIVE',
            sectionId,
            ...payload,
        }
        await dispatch(addSectionDetails({ sectionId, moduleId, data }));
        message.success({ content: 'Saved!', key, duration: 2 });
    }, []);

    const codingEnablersInputs = useCallback(() => {
        const getInput = (index) => (
            <Col span={12}>
                <Form.Item
                    name={["sectionCodingEnablers", index]}
                    label={`Coding Enabler 0${index + 1}`}
                    rules={[
                    {
                        required: true,
                    },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Col>
        );
        let requiredDatePickers = [];
        for (let index = 0; index < totalCodingEnablers; index++) {
          requiredDatePickers[index] = getInput(index);
          
        }
        return requiredDatePickers;
      }, [totalCodingEnablers]);

    return(
        <div className="module-section-form-upsert-container" style={{ paddingBottom: 8 }}>
            <Form
            layout="vertical"
            name="video-section"
            onFinish={onSubmit}
            // validateMessages={validateMessages}
            validateTrigger="onSubmit"
            >
                <Form.Item
                    name={"sectionTitle"}
                    label="Title"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Row align="bottom">
                    <Form.Item
                        name={"durationValue"}
                        label="duration"
                        rules={[{ type: "number", min: 1, max: 999, required: true }]}
                        style={{width: '50%'}}
                    >
                        <InputNumber style={{width: '90%'}}/>
                    </Form.Item>
                    <Form.Item
                        name="durationType"
                        rules={[{ required: true, message: "Please pick an item!" }]}
                    >
                        <Radio.Group>
                            <Radio.Button key='MINUTES' value="MINUTES">Minutes</Radio.Button>
                            <Radio.Button key='HOURS' value="HOURS">Hours</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
              </Row>
              <Form.Item
                    name={"sectionLiveUrl"}
                    label="Link to Join the meeting"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={"sectionCoach"}
                    label="Coach"
                    rules={[{ required: true }]}
                >
                    <Select>
                    {coaches.length > 0
                        ? coaches.map(({ name, id }) => (
                            <Select.Option key={id} value={name}>
                            {name}
                            </Select.Option>
                        ))
                        : null}
                    </Select>
                </Form.Item>
                <Typography.Text style={{display: 'block', marginBottom: 8}}>Total Coding Enablers:</Typography.Text>
                <InputNumber style={{marginBottom: 8}}min={1} max={4} onChange={(value) => { setTotalCodingEnablers(value)}} defaultValue={totalCodingEnablers}/>
                <Row gutter={8}>
                    {codingEnablersInputs()}
                </Row>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                    Save
                </Button>
            </Form.Item>
            </Form>
        </div>
    )
}