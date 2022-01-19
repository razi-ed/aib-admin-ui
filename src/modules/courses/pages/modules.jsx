import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Row, Select, Steps, Tooltip, Typography, notification } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as secureUuid } from '@lukeed/uuid/secure';
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import ModuleSectionDetailsDFormContainer from "../components/module-section-details-forms";

import "./page.css";

import { 
    moduleName,
    addModule,
    addSection,
    removeModule,
    removeSection,
    submitCourseService,
} from '../services/slice'

export function UpsertCourseModulesDetailsPage(params) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { slug = '', courseId = '', moduleId = '', sectionId = '', moduleType = '' } = useParams();

    const modules = useSelector(state => state[moduleName].modules)
    const sections = useSelector(state => state[moduleName].sections && state[moduleName].sections[moduleId] ? state[moduleName].sections[moduleId] : []);

    const [sectionType, setSectionType] = useState();

    const onModuleAdd = useCallback(() => {
        const payload = {
            moduleId: secureUuid(),
            moduleType: 'CONTENT',
        }
        dispatch(addModule(payload))
    }, []);

    const onProjectAdd = useCallback(() => {
        const payload = {
            moduleId: secureUuid(),
            moduleType: 'PROJECT',
        }
        dispatch(addModule(payload))
    }, []);

    const onModuleSelect = useCallback((id, type) => {
        navigate(`/portal/${moduleName}/module/${slug}/${courseId}/${id}/${type}`);
    }, [moduleName, slug, courseId]);

    const onAddSection = useCallback(() => {
        const payload = {
            moduleId,
            sectionData: {
                sectionId: secureUuid(),
                sectionType,
            }
        }
        dispatch(addSection(payload))
    }, [moduleId, sectionType]);

    const onSectionSelect = useCallback((id) => {
        // console.log(`/${moduleName}/module/${slug}/${courseId}/${moduleId}/${id}`);
        navigate(`/portal/${moduleName}/module/${slug}/${courseId}/${moduleId}/${moduleType}/${id}`)
    }, [moduleName, slug, courseId, moduleId]);

    const onRemoveModule = useCallback((id) => {
        const payload = {
            moduleId: id
        }
        dispatch(removeModule(payload))
    }, []);

    const onRemoveSection = useCallback((id) => {
        const payload = {
            moduleId,
            sectionId: id,
        }
        dispatch(removeSection(payload))
    });

    const onCourseDetailsSubmit = useCallback(async () => {
        const resp = await dispatch(submitCourseService({courseId})).unwrap();
        if (resp.id){
            notification.success({
                message: `Course Submitted`,
                description:
                  'Course details have been submitted.',
                placement: 'topRight',
                closeIcon: null,
                duration: 3
            })
        }
    }, [courseId]);

    const renderModulesList = useCallback(() => {
        if (!modules.length) {
            return (<h3 style={{textAlign: 'center', margin: '16px 0'}}>Please Add Modules</h3>)
        }
        const list = modules.map((module, idx) => {
            const { moduleTitle, moduleIndex } = module;
            const isSelected = moduleId === module.moduleId;
            return(
                <li 
                    key={module.moduleId}
                    onClick={() => {
                        if (!isSelected) {
                            onModuleSelect(module.moduleId, module.moduleType || 'CONTENT')
                        }
                    }}
                    data-selected={isSelected ? 'yes' : 'no'}
                >
                    <Typography.Title level={4} >
                        
                        {
                            module.moduleType === 'PROJECT' ?
                                `PROJECT ${idx+1}` :
                                `Module ${idx+1}`
                        }
                    </Typography.Title>
                    <Tooltip title="delete">
                        <Button
                            shape="circle"
                            size="large"
                            icon={<DeleteOutlined />}
                            onClick={() => onRemoveModule(module.moduleId)}
                            danger
                        />
                    </Tooltip>
                </li>
            )
        })
        return (
            <ol className="modules-list">{list}</ol>
        );
    }, [modules, moduleId]);

    const renderSectionsList = useCallback(() => {
        if (!sections.length) {
            return (<h3 style={{textAlign: 'center', margin: '16px 0'}}>Please Add Sections</h3>)
        }
        const list = sections.map((section) => {
            const { sectionIndex, sectionType, sectionTitle, } = section;
            const isSelected = sectionId === section.sectionId;
            return(
                <li  
                    key={section.sectionId}
                    onClick={() => {
                        if (!isSelected) {
                            onSectionSelect(section.sectionId)
                        }
                    }}
                    data-selected={isSelected ? 'yes' : 'no'}
                >
                    <Typography.Title level={4} >
                        {sectionType}
                    </Typography.Title>
                    <Tooltip title="delete">
                        <Button
                            shape="circle"
                            size="large"
                            icon={<DeleteOutlined />}
                            onClick={() => onRemoveSection(section.sectionId)}
                            danger
                        />
                    </Tooltip>
                </li>
            )
        });
        return (
            <ol className="sections-list">{list}</ol>
        );
    }, [sections, sectionId]);

    const renderAddModuleForm = useCallback(() => {
        return (
            <aside className="upsert-course-modules-adder-container">
                <Button icon={<PlusOutlined />} onClick={onProjectAdd}>
                    Add Project
                </Button>
                <Button icon={<PlusOutlined />} onClick={onModuleAdd} type="primary">
                    Add Module
                </Button>
            </aside>
        )
    }, []);

    const renderAddSectionForm = useCallback(() => {
        return (
            <aside className="upsert-course-modules-adder-container">
                <Select style={{ width: '45%' }} onChange={(value) => { setSectionType(value) }}>
                    <Select.Option key={'VIDEO'} value={'VIDEO'}>
                        {'Video'}
                    </Select.Option>
                    <Select.Option key={"PDF"} value={"PDF"}>
                        {'PDF'}
                    </Select.Option>
                    <Select.Option key={'LIVE'}>
                        {'Live'}
                    </Select.Option>
                    <Select.Option key={'PROJECT'}>
                        {'Project'}
                    </Select.Option>
                </Select>
                <Button disabled={!sectionType || !moduleId || moduleType === 'PROJECT'} icon={<PlusOutlined />} onClick={onAddSection} type="primary">
                    Add Section
                </Button>
            </aside>
        )
    }, [sectionType, moduleId]);

    return (
        <section id="upsert-course-modules">
        <Row
            style={{ padding: "2rem 1rem" }}
            justify="space-between"
            className="create-source-header"
        >
            <Col span={16}>
                <Steps size="default" current={2}>
                    <Steps.Step title="Step 1 - Basic Details" />
                    <Steps.Step title="Step 2 - Batch Setup" />
                    <Steps.Step title="Step 3 - Learning Resources" />
                </Steps>
            </Col>
            <Col className="create-source-header-actions">
            {/* <Button style={{ marginRight: "12px" }}>Save Changes</Button> */}
            <Button style={{ marginRight: "12px" }} onClick={() => navigate(`/portal/${moduleName}/batch/${slug}/${courseId}`, { replace: true })}>Discard & Previous</Button>

                <Button type="primary" onClick={onCourseDetailsSubmit}>
                    Submit Course{" "}
                </Button>
            </Col>
        </Row>
        <Row
            justify="space-between"
            className="upsert-course-modules-main-section"
        >
            <Col span={4} className="upsert-course-modules-modules list-holder">
                {renderModulesList()}
                {renderAddModuleForm()}
            </Col>
            <Col span={4} className="upsert-course-modules-sections list-holder">
                {renderSectionsList()}
                {renderAddSectionForm()}
            </Col>
            <Col span={16} className="upsert-course-modules-main">
                <ModuleSectionDetailsDFormContainer
                    section={sections.find((s) => s.sectionId === sectionId) || {}}
                />
            </Col>
        </Row>
      </section>
    )
}