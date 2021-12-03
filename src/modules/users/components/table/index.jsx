import { Table, Space, Button, Popconfirm } from 'antd';
 
import './user-table.css'

export default function UsersTable(props) {
    
    return(
        <Table 
            columns={columns}
            dataSource={data}
            loading={false}
            size="middle"
            rowKey="id"
        />
    )
}

const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: {
        compare: (a, b) => a.name.length - b.name.length,
      },
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: {
        compare: (a, b) => a.email - b.email,
      },
      ellipsis: true,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button>Edit User</Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() =>{console.log(record)}}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete User</Button>
          </Popconfirm>
        </Space>
      ),
      width: 240
    },
  ];

const data = [
    {
      id: '1',
      name: 'John Brown',
      email: 'test@tmail.tom',
    },
    {
      id: '2',
      name: 'Jim Green',
      email: 'test@tmail.tom',
    },
    {
      id: '3',
      name: 'Joe Black',
      email: 'test@tmail.tom',
    },
  ];