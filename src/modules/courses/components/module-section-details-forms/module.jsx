import {useCallback, useState,} from 'react';
import { useParams } from 'react-router-dom';
import {Button, Form, Input, InputNumber, message, Radio, Row, Upload} from 'antd';

import { useDispatch } from 'react-redux';
import { addProjectModuleDetails } from '../../services/slice';

export default function ModuleForm(params) {
    const { slug = '', courseId = '', moduleId = '', sectionId = '' } = useParams();
    const dispatch = useDispatch();

    const onSubmit = useCallback(async (payload) => {
        const key = 'SAVING';
        message.loading({ content: 'Saving...', key });
        await dispatch(addProjectModuleDetails({ moduleId, data: { moduleTitle: payload.moduleTitle } }));
        message.success({ content: 'Saved!', key, duration: 2 });
    }, [moduleId]);

    return (
        <div className="module-section-form-upsert-container">
            <Form
            layout="vertical"
            name="video-section"
            onFinish={onSubmit}
            // validateMessages={validateMessages}
            validateTrigger="onSubmit"
            >
                <Form.Item
                    name={"moduleTitle"}
                    label="Module Title"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                    Save
                </Button>
            </Form.Item>
            </Form>
        </div>
    )
}