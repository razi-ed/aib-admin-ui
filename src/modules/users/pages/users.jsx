import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Typography, Divider,Table, Space, Popconfirm, notification } from "antd";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { find } from "lodash";

import Modal from "../components/modal";
import Form from "../components/form";

import "./page.css";
import LoadingSpinner from "../../common/components/loading-spinner";
import { actionStatuses } from "../../common/constants/action-status.constants";
import { upsertUserService, getUsersService, deleteUserService } from "../services/user.slice";

export default function UsersPage(params) {
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userList = useSelector(state => state.user.list)
    const userListLoading = useSelector(state => state.user.queryStatus === actionStatuses.PENDING)
    const userMutatuionPending = useSelector(state => state.user.mutationStatus === actionStatuses.PENDING)

    const { userId = "" } = useParams();
    
    const [showModal, setShowModal] = useState(Boolean(userId));

    useEffect(() => {
        dispatch(getUsersService());
    }, [])

    useEffect(() => {
        if (Boolean(userId)) {
            setShowModal(true)
        } else {
            setShowModal(false)
        }
    }, [userId])

    const closeManageModal = useCallback(
        () => {
            if (userId) {
                navigate(`/portal/users`)
            } else {
                setShowModal(false)
            }
        },
        [userId, navigate]
    )

    const openManageModal = useCallback(
        () => {
            setShowModal(true)
        },
        [],
    )

    const onSubmit = useCallback(
        (values) => {
            if (userId) {
                const userObj = find(userList, (userObj) => userObj.id === userId) || {};
                if (userObj.email === values.email) {
                    delete values.email;
                }
                if (userObj.phone === values.phone) {
                    delete values.phone;
                }
            }
            dispatch(upsertUserService({...values, id: userId}))
            .unwrap()
            .then((result) => {
                const { hasErrored = false } = result;
                if (hasErrored) {
                    notification.error({
                        placement: 'topRight',
                        message: `${userId ? 'Updation' : 'Creation'} failed`,
                        description: `User ${userId ? 'updation' : 'creation'} has failed`,
                        duration: 3
                    })
                } else {
                    closeManageModal();
                    dispatch(getUsersService());
                    notification.success({
                        placement: 'topRight',
                        message: `${userId ? 'Updation' : 'Creation'} Success`,
                        description: `User ${userId ? 'updation' : 'creation'} was successful`,
                        duration: 3
                    })
                };
            })
            .catch((rejectedValueOrSerializedError) => {
                notification.error({
                    placement: 'topRight',
                    message: `${userId ? 'Updation' : 'Creation'} failed`,
                    description: `User ${userId ? 'updation' : 'creation'} has failed`,
                    duration: 3
                })
            })
        },
        [userId, dispatch, userList, closeManageModal],
    )

    const onDelete = useCallback(
        (id) => {
            dispatch(deleteUserService(id))
            .unwrap()
            .then((result) => {
                const { hasErrored = false } = result;
                if (hasErrored) {
                    notification.error({
                        placement: 'topRight',
                        message: `Removal failed`,
                        description: `User removal has failed`,
                        duration: 3
                    })
                } else {
                    dispatch(getUsersService());
                    notification.success({
                        placement: 'topRight',
                        message: `Removal Success`,
                        description: `User removal was successful`,
                        duration: 3
                    })
                };
            })
            .catch((rejectedValueOrSerializedError) => {
                notification.error({
                    placement: 'topRight',
                    message: `Removal failed`,
                    description: `User removal has failed`,
                    duration: 3
                })
            })
        },
        [dispatch],
    )

    
const columns = useMemo(() => ([
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
                <Button
                onClick={() =>{
                    navigate(`/portal/users/${record.id}`)
                }}
                disabled={record.role === 'admin'}
                >Edit User</Button>
                <Popconfirm
                    title="Are you sure to delete this user?"
                    onConfirm={() =>{onDelete(record.id)}}
                    okText="Yes"
                    cancelText="No"
                    disabled={record.role === 'admin'}
                >
                    <Button
                        danger 
                        disabled={record.role === 'admin'}
                    >
                        Delete User
                    </Button>
                </Popconfirm>
            </Space>
        ),
        width: 240
    },
]), []);


    if (userListLoading) {
        return (
            <LoadingSpinner />
        )
    }

    return (
        <>
            <div className="user-page-header">
                <Typography.Title level={3}>User Management</Typography.Title>
                <Button type="primary" onClick={openManageModal}>Add User</Button>
            </div>
            <Divider />
            <Table 
                columns={columns}
                dataSource={userList}
                loading={false}
                size="middle"
                rowKey="id"
            />
            {
                showModal ?
                <Modal onClose={closeManageModal} title="Manage User">
                    <Form
                        onCancel={closeManageModal}
                        onSubmit={onSubmit}
                        defaultValues={find(userList, (userObj) => userObj.id === userId) || {}}
                        loading={userMutatuionPending}
                    />
                </Modal> :
                null
            }
        </>
    )
}