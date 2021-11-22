import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Layout, Menu, Dropdown, Divider } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  FormOutlined,
  TagOutlined,
  IdcardOutlined,
} from '@ant-design/icons';

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

  const toggle = React.useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);

  return (
    <Layout className="cover-parent">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="nav-user-mgmt" icon={<UserOutlined />}>
            Users
          </Menu.Item>
          <Menu.Item key="nav-author" icon={<FormOutlined />}>
            Authors
          </Menu.Item>
          <Menu.Item key="nav-coach" icon={<IdcardOutlined />}>
            Coaches
          </Menu.Item>
          <Menu.Item key="nav-category" icon={<TagOutlined />}>
            Categories
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
              Username
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
