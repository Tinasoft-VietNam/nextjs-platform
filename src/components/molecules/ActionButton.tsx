import React from 'react';
import { Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
interface ActionButtonProps {
    onEdit: () => void;
    onDelete: () => void;
}
const  ActionButton = ({ onEdit, onDelete }: ActionButtonProps)  => {
    return (
        <div className="flex items-center space-x-2">
            <Tooltip title="Chỉnh sửa">
                <Button
                    type="text"
                    icon={<EditOutlined className="text-blue-500" />}
                    onClick={onEdit}
                />
            </Tooltip>
            <Tooltip title="Xóa">
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={onDelete}
                />
            </Tooltip>
        </div>
    )
}
export default ActionButton;
