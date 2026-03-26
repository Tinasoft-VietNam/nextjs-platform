import { Input, Modal } from 'antd';
import React, { useState } from 'react';
interface ICreateModalProps {
    isModalCreateOpen: boolean;
    setIsModalCreateOpen: (open: boolean) => void;
}
type DataType = {
    name: string;
    email: string;
    city: string;
}

const CreateModal = ({ isModalCreateOpen, setIsModalCreateOpen }: ICreateModalProps) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');

    const handleOk = () => {
        const newUser: DataType = {
            name: fullName,
            email,
            city,
        };
        console.log("Thêm user mới:", newUser);
        setIsModalCreateOpen(false);
    };

    const handleCancel = () => {
        setIsModalCreateOpen(false);
    };
    return (
        <>
            <Modal
                title="ADD USER MODAL"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalCreateOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
                    <div >
                        <span>
                            Full name:
                        </span>
                        <Input
                            value={fullName}
                            onChange={(e) => { setFullName(e.target.value) }}
                        />
                    </div>
                    <div>
                        <span>
                            Email:
                        </span>
                        <Input
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                    </div>
                    <div>
                        <span>
                            City:
                        </span>
                        <Input
                            value={city}
                            onChange={(e) => { setCity(e.target.value) }}
                        />
                    </div>
                </div>

            </Modal>

        </>
    )
}
export default CreateModal;