import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 64 }} spin />;

export default function LoadingSpinner() {
    return(
        <div className="cover-parent flex-center">
            <Spin indicator={antIcon} />
        </div>
    );
}
