import {useCallback, useState,} from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {Button, Col, Form, Input, InputNumber, message, Radio, Row, Typography, Upload} from 'antd';
import { PlusOutlined } from '@ant-design/icons';


import { documentFileUploader } from '../../../common/lib/asset-utils';
import { addSectionDetails, addProjectModuleDetails } from '../../services/slice';

const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
);

export default function ProjectSectionForm(props) {
    const { slug = '', courseId = '', moduleId = '', sectionId = '' } = useParams();
    const dispatch = useDispatch();

    const [resourceUrl, setResourceUrl] = useState();
    const [briefUrl, setBriefUrl] = useState();
    const [resourceFile, setResourceFile] = useState();
    const [briefFile, setBriefFile] = useState();
    const [instructions, setInstructions] = useState('');
    
    const onSubmit = useCallback(async () => {
        const key = 'SAVING';
        message.loading({ content: 'Saving...', key });
        const data = {
            briefUrl,
            resourceUrl,
            sectionId,
            instructions
        }
        if (props.isModuleForm) {
            await dispatch(addProjectModuleDetails({ sectionId, moduleId, data }));
        } else {
            await dispatch(addSectionDetails({ sectionId, moduleId, data }));
        }
        message.success({ content: 'Saved!', key, duration: 2 });
    }, [briefUrl, resourceUrl, instructions, sectionId, moduleId, props.isModuleForm]);

    const resourceUploadPreHook = useCallback(
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
            fileName: `${moduleId}__${sectionId}`, folder:`courses/${slug}/pynb`
            })
            await setResourceUrl(resp.secure_url)
            await setResourceFile({
                uid: '2',
                name: file.name,
                status: 'done',
                url: resp.secure_url,
            })
            message.success({ content: 'Uploaded!', key, duration: 2 });
            return false;
        },
        [slug, sectionId, moduleId],
    )
    const briefUploadPreHook = useCallback(
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
            await setBriefUrl(resp.secure_url)
            await setBriefFile(file)
            message.success({ content: 'Uploaded!', key, duration: 2 });
            return false;
        },
        [slug, sectionId, moduleId],
    )
    return(
        <div className="module-section-form-upsert-container">
              <Row>
                <Col span={12}>
                    <Typography.Title level={4}>
                        Python Notebook
                    </Typography.Title>
                    <Upload
                        name="upload-pynb"
                        // showUploadList={false}
                        beforeUpload={resourceUploadPreHook}
                        onRemove={(_file) => {
                            setResourceUrl('')
                            setResourceFile(null)
                        }}
                        fileList={resourceFile ? [resourceFile] : []}
                    >
                        {resourceUrl ? (
                            <></>
                        ) : uploadButton}
                    </Upload>
                </Col>
              </Row>
                <Button type="primary" onClick={onSubmit}>
                    Save
                </Button>
        </div>
    )
}