import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Typography, Divider,Table, Space, Popconfirm, notification } from "antd";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { find, capitalize, snakeCase, trim } from "lodash";

import Modal from "../components/modal";
import Form from "../components/form";

import "./page.css";
import LoadingSpinner from "../../common/components/loading-spinner";
import { actionStatuses } from "../../common/constants/action-status.constants";
import { getListService, upsertService, deleteService, moduleName } from "../services/slice";

export { moduleName }

export default function UsersPage(params) {
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const list = useSelector(state => state[moduleName].list)
    const loading = useSelector(state => state[moduleName].queryStatus === actionStatuses.PENDING)
    const pending = useSelector(state => state[moduleName].mutationStatus === actionStatuses.PENDING)

    const { keyId = "" } = useParams();
    
    const [showModal, setShowModal] = useState(Boolean(keyId));

    useEffect(() => {
        dispatch(getListService());
    }, [])

    useEffect(() => {
        if (Boolean(keyId)) {
            setShowModal(true)
        } else {
            setShowModal(false)
        }
    }, [keyId])

    const closeManageModal = useCallback(
        () => {
            if (keyId) {
                navigate(`/portal/${moduleName}`)
            } else {
                setShowModal(false)
            }
        },
        [keyId, navigate]
    )

    const openManageModal = useCallback(
        () => {
            setShowModal(true)
        },
        [],
    )

    const onSubmit = useCallback(
        ({label}) => {
            const value = snakeCase(trim(label))
            dispatch(upsertService({value, label, id: keyId}))
            .unwrap()
            .then((result) => {
                const { hasErrored = false } = result;
                if (hasErrored) {
                    notification.error({
                        placement: 'topRight',
                        message: `${keyId ? 'Updation' : 'Creation'} failed`,
                        description: `${capitalize(moduleName)} ${keyId ? 'updation' : 'creation'} has failed`,
                        duration: 3
                    })
                } else {
                    closeManageModal();
                    dispatch(getListService());
                    notification.success({
                        placement: 'topRight',
                        message: `${keyId ? 'Updation' : 'Creation'} Success`,
                        description: `${capitalize(moduleName)} ${keyId ? 'updation' : 'creation'} was successful`,
                        duration: 3
                    })
                };
            })
            .catch((rejectedValueOrSerializedError) => {
                notification.error({
                    placement: 'topRight',
                    message: `${keyId ? 'Updation' : 'Creation'} failed`,
                    description: `${capitalize(moduleName)} ${keyId ? 'updation' : 'creation'} has failed`,
                    duration: 3
                })
            })
        },
        [keyId, dispatch, closeManageModal],
    )

    const onDelete = useCallback(
        (id) => {
            dispatch(deleteService(id))
            .unwrap()
            .then((result) => {
                const { hasErrored = false } = result;
                if (hasErrored) {
                    notification.error({
                        placement: 'topRight',
                        message: `Removal failed`,
                        description: `${capitalize(moduleName)} removal has failed`,
                        duration: 3
                    })
                } else {
                    dispatch(getListService());
                    notification.success({
                        placement: 'topRight',
                        message: `Removal Success`,
                        description: `${capitalize(moduleName)} removal was successful`,
                        duration: 3
                    })
                };
            })
            .catch((rejectedValueOrSerializedError) => {
                notification.error({
                    placement: 'topRight',
                    message: `Removal failed`,
                    description: `${capitalize(moduleName)} removal has failed`,
                    duration: 3
                })
            })
        },
        [dispatch],
    )

    
const columns = useMemo(() => ([
    {
        title: 'Label',
        dataIndex: 'label',
        key: 'label',
        sorter: {
            compare: (a, b) => a.label.length - b.label.length,
        },
        ellipsis: true,
    },
    {
        title: 'Key',
        dataIndex: 'value',
        key: 'value',
        sorter: {
            compare: (a, b) => a.value - b.value,
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
                    navigate(`/portal/${moduleName}/${record.value}`)
                }}
                disabled={record.role === 'admin'}
                >{`Edit ${capitalize(moduleName)}`}</Button>
                <Popconfirm
                    title={`Are you sure to delete this ${moduleName}?`}
                    onConfirm={() =>{onDelete(record.value)}}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button
                        danger
                    >
                        {`Delete ${capitalize(moduleName)}`}
                    </Button>
                </Popconfirm>
            </Space>
        ),
        width: 300
    }]), []);


    if (loading) {
        return (
            <LoadingSpinner />
        )
    }

    return (
        <>
            <div className="user-page-header">
                <Typography.Title level={3}>{`${capitalize(moduleName)} Management`}</Typography.Title>
                <Button type="primary" onClick={openManageModal}>{`Add ${capitalize(moduleName)}`}</Button>
            </div>
            <Divider />
            <Table 
                columns={columns}
                dataSource={list}
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
                        defaultValues={find(list, (obj) => obj.value === keyId) || {}}
                        loading={pending}
                    />
                </Modal> :
                null
            }
        </>
    )
}