import VideoForm from './video-form';
import PDFForm from './pdf-form';
import LiveForm from './live-form';

export default function ModuleSectionDetailsDFormContainer(props) {

    let fallback = <p>Select Section</p>
    if (props.section && props.section.sectionType) {
        switch (props.section.sectionType) {
            case 'VIDEO':
                return <VideoForm details={props.section} onSubmit={props.onSubmit} />;
    
            case 'PDF':
                return <PDFForm details={props.section} onSubmit={props.onSubmit} />;
    
            case 'LIVE':
                return <LiveForm details={props.section} onSubmit={props.onSubmit} />;
        
            default:
                return fallback;
        }
    } else {
        return fallback;
    }
}