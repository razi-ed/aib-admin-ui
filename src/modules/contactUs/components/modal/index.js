import { Modal } from 'antd';

export default function WrappedModal(props) {
    const {
        onClose,
        title
    } = props;
    return (
        <Modal
            title={title}
            centered
            visible
            footer={null}
            onCancel={onClose}
        >
            {props.children}
        </Modal>
    )
}