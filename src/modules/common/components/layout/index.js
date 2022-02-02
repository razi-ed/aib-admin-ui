import React from 'react';
import { useSelector } from 'react-redux';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Layout, Menu, Dropdown, Divider } from 'antd';
import { capitalize, replace } from 'lodash';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  FormOutlined,
  TagOutlined,
  GroupOutlined,
  IdcardOutlined,
  UsergroupAddOutlined,
  QuestionCircleOutlined,
  FundProjectionScreenOutlined,
  ContactsOutlined,
  SolutionOutlined,
  BarcodeOutlined,
} from '@ant-design/icons';

import { moduleName as categoryModuleName } from '../../../categories/constants';
import { moduleName as authorsModuleName } from '../../../authors/constants';
import { moduleName as coachesModuleName } from '../../../coaches/constants';
import { moduleName as codingEnablersModuleName } from '../../../coding-enablers/constants';
import { moduleName as coursesModuleName } from '../../../courses/constants';
import { moduleName as contactUsModuleName } from '../../../contactUs/constants';
import { moduleName as hireStudentModuleName } from '../../../hireStudent/constants';
import { moduleName as emailEnquirModuleName } from '../../../emailEnquiry/constants';
import { moduleName as webinarsModuleName } from '../../../webinars/constants';
import { moduleName as studentModuleName } from '../../../student/constants';
import { moduleName as couponModuleName } from '../../../coupon/constants';

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
          <Menu.SubMenu key={coursesModuleName} icon={<GroupOutlined />} title={`${capitalize(coursesModuleName)}`}>
            <Menu.Item key={`${coursesModuleName}/create`}>
              <Link to={`/portal/${coursesModuleName}/create`}>
                {`Create ${capitalize(coursesModuleName)}`}
              </Link>
            </Menu.Item>
            <Menu.Item key={`${coursesModuleName}/list`}>
              <Link to={`/portal/${coursesModuleName}/list`}>
                {`All ${capitalize(coursesModuleName)}s`}
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="Users" icon={<UserOutlined />} a>
            <Link to="/portal/users">Users</Link>
          </Menu.Item>
          <Menu.Item key={authorsModuleName} icon={<FormOutlined />}>
            <Link to={`/portal/${authorsModuleName}`}>{`${capitalize(authorsModuleName)}`}</Link>
          </Menu.Item>
          <Menu.Item key={coachesModuleName} icon={<ContactsOutlined />}>
            <Link to={`/portal/${coachesModuleName}`}>{`${capitalize(coachesModuleName)}`}</Link>
          </Menu.Item>
          <Menu.Item key={codingEnablersModuleName} icon={<GroupOutlined />}>
            <Link to={`/portal/${codingEnablersModuleName}`}>{`${capitalize(replace(codingEnablersModuleName, '-', ' '))}`}</Link>
          </Menu.Item>
          <Menu.Item key={categoryModuleName} icon={<TagOutlined />}>
            <Link to={`/portal/${categoryModuleName}`}>{`${capitalize(categoryModuleName)}`}</Link>
          </Menu.Item>
          <Menu.Item key={contactUsModuleName} icon={<IdcardOutlined />}>
            <Link to={`/portal/${contactUsModuleName}`}>{`${capitalize(replace(contactUsModuleName, '-', ' '))}`}</Link>
          </Menu.Item>
          <Menu.Item key={hireStudentModuleName} icon={<UsergroupAddOutlined />}>
            <Link to={`/portal/${hireStudentModuleName}`}>{`${capitalize(replace(hireStudentModuleName, '-', ' '))}`}</Link>
          </Menu.Item>
          <Menu.Item key={emailEnquirModuleName} icon={<QuestionCircleOutlined />}>
            <Link to={`/portal/${emailEnquirModuleName}`}>{`${capitalize(replace(emailEnquirModuleName, '-', ' '))}`}</Link>
          </Menu.Item>
          <Menu.Item key={webinarsModuleName} icon={<FundProjectionScreenOutlined />}>
            <Link to={`/portal/${webinarsModuleName}`}>{`${capitalize(replace(webinarsModuleName, '-', ' '))}`}</Link>
          </Menu.Item>
          <Menu.Item key={studentModuleName} icon={<SolutionOutlined />}>
            <Link to={`/portal/${studentModuleName}`}>{`${capitalize(replace(studentModuleName, '-', ' '))}`}</Link>
          </Menu.Item>
          <Menu.Item key={couponModuleName} icon={<BarcodeOutlined />}>
            <Link to={`/portal/${couponModuleName}`}>{`${capitalize(replace(couponModuleName, '-', ' '))}`}</Link>
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
