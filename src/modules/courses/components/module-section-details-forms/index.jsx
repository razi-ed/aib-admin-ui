import { useParams } from 'react-router-dom';

import VideoForm from './video-form';
import PDFForm from './pdf-form';
import LiveForm from './live-form';
import ProjectForm from './project-form';
import PythonNoteBookForm from './pynb-form'
import ModuleForm from './module';

export default function ModuleSectionDetailsDFormContainer(props) {

    const { moduleType = '', moduleId } = useParams();

    if (moduleType === 'PROJECT') {
        return <ProjectForm details={props.section} onSubmit={props.onSubmit} isModuleForm />;
    }

    let fallback = <h2 style={{margin: '24px'}}>Please add a module</h2>

    if (moduleId && moduleType === 'CONTENT') {
        fallback = <ModuleForm />
    }

    if (props.section && props.section.sectionType) {
        switch (props.section.sectionType) {
            case 'VIDEO':
                return <VideoForm details={props.section} onSubmit={props.onSubmit} />;
    
            case 'PDF':
                return <PDFForm details={props.section} onSubmit={props.onSubmit} />;
    
            case 'LIVE':
                return <LiveForm details={props.section} onSubmit={props.onSubmit} />;
            
            case 'PROJECT':
                return <ProjectForm details={props.section} onSubmit={props.onSubmit} />;
            
            case 'PYNB':
                return <PythonNoteBookForm details={props.section} onSubmit={props.onSubmit} />;
        
            default:
                return fallback;
        }
    } else {
        return fallback;
    }
}