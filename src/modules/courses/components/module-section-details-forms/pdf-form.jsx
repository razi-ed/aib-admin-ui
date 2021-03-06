import {useCallback, useState,} from 'react';
import { useParams } from 'react-router-dom';
import {Button, Form, Input, InputNumber, message, Radio, Row, Upload} from 'antd';


import { documentFileUploader } from '../../../common/lib/asset-utils';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { addSectionDetails } from '../../services/slice';
import { Document, Page } from 'react-pdf';

const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
);

export default function PDFSectionForm(params) {
    const { slug = '', courseId = '', moduleId = '', sectionId = '' } = useParams();
    const dispatch = useDispatch();

    const [pdfUrl, setPDFUrl] = useState();
    const [pdfFile, setPDFFile] = useState();
    
    const onSubmit = useCallback(async (payload) => {
        const key = 'SAVING';
        message.loading({ content: 'Saving...', key });
        const data = {
            sectionContentUrl: pdfUrl,
            sectionType: 'PDF',
            sectionId,
            ...payload,
        }
        await dispatch(addSectionDetails({ sectionId, moduleId, data }));
        message.success({ content: 'Saved!', key, duration: 2 });
    }, [pdfUrl, sectionId, moduleId]);

    const docUploadPreHook = useCallback(
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
            const resp = await documentFileUploader({
            file,
            fileName: `${moduleId}__${sectionId}`, folder:`courses/${slug}/pdf`
            })
            await setPDFUrl(resp.secure_url)
            await setPDFFile(file)
            message.success({ content: 'Uploaded!', key, duration: 2 });
            return false;
        },
        [slug, sectionId, moduleId],
    )
    return(
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
                >
                    <Input />
                </Form.Item>
                <Row align="bottom">
                    <Form.Item
                        name={"sectionDurationValue"}
                        label="duration"
                        rules={[{ type: "number", min: 1, max: 999, required: true }]}
                        style={{ width: '50%' }}
                        // initialValue={details.sectionDurationValue}
                    >
                        <InputNumber style={{ width: '90%' }} />
                    </Form.Item>
                    <Form.Item
                        name="sectionDurationType"
                        rules={[{ required: true, message: "Please pick an item!" }]}
                        // initialValue={details.sectionDurationType}
                    >
                        <Radio.Group>
                            <Radio.Button key='MINUTES' value="MINUTES">Minutes</Radio.Button>
                            <Radio.Button key='HOURS' value="HOURS">Hours</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Row>
              <Row>
                <Upload
                    name="avatar"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={docUploadPreHook}
                    onRemove={(_file) => {
                        setPDFUrl('')
                        setPDFFile(null)
                    }}
                    fileList={pdfFile ? [pdfFile] : []}
                >
                    {pdfUrl ? (
                        <Document
                        file={pdfUrl}
                        
                        // onLoadSuccess={onDocumentLoadSuccess}
                      >
                        <Page />
                      </Document>
                    ) : uploadButton}
                </Upload>
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