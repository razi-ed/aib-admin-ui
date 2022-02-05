import { useCallback, useEffect, useState, } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Checkbox, Form, Input, InputNumber, message, Radio, Row, Upload } from 'antd';

import { videoFileUploader } from '../../../common/lib/asset-utils';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { addSectionDetails } from '../../services/slice';

const uploadButton = (
    <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
    </div>
);

export default function VideoSectionForm(props) {
    const { slug = '', courseId = '', moduleId = '', sectionId = '' } = useParams();
    const { details } = props;
    const dispatch = useDispatch();

    const [videoUrl, setVideoUrl] = useState();
    const [videoFile, setVideoFile] = useState();

    const onSubmit = useCallback(async (payload) => {
        const key = 'SAVING';
        message.loading({ content: 'Saving...', key });
        const data = {
            sectionContentUrl: payload.sectionContentUrl ? payload.sectionContentUrl : videoUrl,
            sectionType: 'VIDEO',
            sectionId,
            ...payload,
        }
        await dispatch(addSectionDetails({ sectionId, moduleId, data }));
        message.success({ content: 'Saved!', key, duration: 2 });
    }, [videoUrl, sectionId, moduleId]);

    useEffect(() => {
        if (details.sectionContentUrl) {
            setVideoUrl(details.sectionContentUrl)
        }
    }, [details.sectionContentUrl])

    const onUrlAdd = useCallback(() => {
        setVideoUrl()
    }, []);

    const videoUploadPreHook = useCallback(
        async (file) => {
            // const isMovOrMp4 = file.type === 'video/mov' || file.type === 'video/mp4';
            // if (!isMovOrMp4) {
            //     message.error('You can only upload MOV/MP4 file!');
            // }
            // const isLt2M = file.size / 1024 / 1024 < 2;
            // if (!isLt2M) {
            // message.error('Image must smaller than 2MB!');
            // }
            const key = 'Upload';
            message.loading({ content: 'Uploading...', key });

            // return isJpgOrPng && isLt2M;
            const resp = await videoFileUploader({
                file,
                fileName: `${moduleId}__${sectionId}`, folder: `courses/${slug}/videos`
            })
            await setVideoUrl(resp.secure_url)
            await setVideoFile(file)
            message.success({ content: 'Uploaded!', key, duration: 2 });
            return false;
        },
        [slug, sectionId, moduleId],
    )
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
                    name={"sectionTitle"}
                    label="Title"
                    rules={[{ required: true }]}
                    initialValue={details.sectionTitle}
                >
                    <Input />
                </Form.Item>
                <Row align="bottom">
                    <Form.Item
                        name={"sectionDurationValue"}
                        label="duration"
                        rules={[{ type: "number", min: 1, max: 999, required: true }]}
                        style={{ width: '50%' }}
                        initialValue={details.sectionDurationValue}
                    >
                        <InputNumber style={{ width: '90%' }} />
                    </Form.Item>
                    <Form.Item
                        name="sectionDurationType"
                        rules={[{ required: true, message: "Please pick an item!" }]}
                        initialValue={details.sectionDurationType}
                    >
                        <Radio.Group>
                            <Radio.Button key='MINUTES' value="MINUTES">Minutes</Radio.Button>
                            <Radio.Button key='HOURS' value="HOURS">Hours</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Row>
                <Row>
                <Form.Item>
                    <Form.Item name="addToTask" valuePropName="checked" noStyle>
                    <Checkbox>Add to preview</Checkbox>
                    </Form.Item>
                </Form.Item>
                </Row>
                <Row>
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        showUploadList={false}
                        beforeUpload={videoUploadPreHook}
                        onRemove={(_file) => {
                            setVideoUrl('')
                            setVideoFile(null)
                        }}
                        fileList={videoFile ? [videoFile] : []}
                    >
                        {videoUrl ? <video src={videoUrl} alt="avatar" style={{ width: '100%', height: '100%', maxHeight: '100%', maxWidth: '100%' }} /> : uploadButton}
                    </Upload>
                </Row>
                <Row>
                    <Form.Item
                        name={"sectionContentUrl"}
                        label="YouTube URL"
                    >
                        <Input />
                    </Form.Item>
                </Row>
                {/* <Row>
                    <Col span={8} className="basic-details-vertical-section">
                        <Typography.Title level={5}>Batch</Typography.Title>
                        initialValue={defaultValues.description}
                        <Form.Item
                            name={"totalBatches"}
                            label="No' of Batches"
                            rules={[{ type: "number", min: 1, max: 4 }]}
                            getValueFromEvent={() => batchCount}
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
                        {datePickerForBatch()}
                    </Col>
                </Row> */}
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}