import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Button, Divider, notification, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import Moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { capitalize } from 'lodash';

import LoadingSpinner from '../../common/components/loading-spinner';

import { deleteService, getListService, moduleName } from '../services/slice';

import { actionStatuses } from '../../common/constants/action-status.constants';

export { moduleName };

export function ListCoursePage(params) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { list, queryStatus } = useSelector(store => store[moduleName]);

    useEffect(()=> {
        dispatch(getListService());
    }, []);

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
        [],
    );

    const columns = useMemo(() => ([
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: {
                compare: (a, b) => a.title.length - b.title.length,
            },
            ellipsis: true,
        },
        {
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
            sorter: {
                compare: (a, b) => a.author - b.author,
            },
            ellipsis: true,
        },
        {
            title: 'Batches',
            key: 'batchDates',
            render: (text, record) => {
                const innerChildren = Array.isArray(record.batchDates) && record.batchDates.length > 0 ?
                    record.batchDates.map((startDate) => {
                        return (
                            <Tag>
                                {Moment(startDate).format('DD MMMM YYYY')}
                            </Tag>
                        )
                    }) : '-'
        
                return (
                    <Space size="middle">
                        { innerChildren }
                    </Space>
                );
            },
            width: '50%'
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        onClick={() =>{
                            navigate(`/portal/${moduleName}/basic/${record.id}`)
                        }}
                    >
                        {`Edit ${capitalize(moduleName)}`}
                    </Button>
                    <Popconfirm
                        title={`Are you sure to delete this ${moduleName}?`}
                        onConfirm={() =>{onDelete(record.id)}}
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
    

    // if (queryStatus === actionStatuses.PENDING) {
    //     return <LoadingSpinner />
    // }
    
    return (
        <>
            <div className="user-page-header">
                <Typography.Title level={3}>{`${capitalize(moduleName)} Management`}</Typography.Title>
                <Button type="primary" onClick={() => { navigate(`/portal/${moduleName}/create`) }}>{`Add ${capitalize(moduleName)}`}</Button>
            </div>
            <Divider />
            <Table
                columns={columns}
                dataSource={list}
                loading={queryStatus === actionStatuses.PENDING}
                size="middle"
                rowKey="id"
            /> 
        </>
    )
}