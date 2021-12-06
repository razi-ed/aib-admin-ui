import React from 'react';
import { useSelector } from 'react-redux';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Layout, Menu, Dropdown, Divider } from 'antd';
import { capitalize } from 'lodash';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  FormOutlined,
  TagOutlined,
  IdcardOutlined,
} from '@ant-design/icons';

import { moduleName as categoryModuleName } from '../../../categories/constants';
import { moduleName as authorsModuleName } from '../../../authors/constants';

import './layout.css';

const { Header, Sider, Content } = Layout;

const HeaderUserOptionsMenu = (
  <Menu>
    <Menu.Item disabled key="user-options-profile">
      <Link to="/profile">
        Profile
      </Link>
    </Menu.Item>
    <Divider key="user-options-divider" className="applayout-user-options-divider" />
    <Menu.Item danger key="user-options-logout">Logout</Menu.Item>
  </Menu>
)

export default function AppLayout(props) {
  const [collapsed, setCollapsed] = React.useState(false);
  const { pathname } = useLocation();
  const userName = useSelector((store) => store.auth?.user?.name || 'Welcome!');

  const toggle = React.useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);

  return (
    <Layout className="cover-parent">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu theme="dark" mode="inline" selectedKeys={[pathname.split('/')[2] || '']}>
          <Menu.Item key="Users" icon={<UserOutlined />} a>
            <Link to="/portal/users">Users</Link>
          </Menu.Item>
          <Menu.Item key={authorsModuleName} icon={<FormOutlined />}>
            <Link to={`/portal/${authorsModuleName}`}>{`${capitalize(authorsModuleName)}`}</Link>
          </Menu.Item>
          <Menu.Item key="Coaches" icon={<IdcardOutlined />}>
            Coaches
          </Menu.Item>
          <Menu.Item key={categoryModuleName} icon={<TagOutlined />}>
            <Link to={`/portal/${categoryModuleName}`}>{`${capitalize(categoryModuleName)}`}</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {
            collapsed ?
              <MenuUnfoldOutlined className="trigger" onClick={toggle} /> :
              <MenuFoldOutlined className="trigger" onClick={toggle} />
          }
          <div className="applayout-header-items-container">
            <Dropdown.Button overlay={HeaderUserOptionsMenu} placement="bottomRight" icon={<UserOutlined />} >
              {userName}
            </Dropdown.Button>
          </div>
        </Header>
        <Content
          className="applayout-content"
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
