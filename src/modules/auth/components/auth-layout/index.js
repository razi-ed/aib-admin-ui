import { Outlet } from 'react-router-dom';
import { Card } from 'antd';

import './auth-layout.css'

export default function AuthLayout(props) {
    return (
        <section id="auth-layout" className="cover-parent">
            <Card className="auth-layout-card">
                <Outlet />
            </Card>
        </section>
    )
}