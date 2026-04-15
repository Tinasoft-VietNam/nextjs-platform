'use client';
import { Homepage } from "@/components/organisms/home/Homepage"
import { useAuthContext } from "@/providers/AuthProvider"
import { Card, Typography, Descriptions } from 'antd';


const { Title } = Typography;

export default function Home() {
  const { user } = useAuthContext();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Homepage />

      {user && (
        <Card
          title={<Title level={4} style={{ margin: 0 }}>Thông tin cá nhân</Title>}
          style={{ maxWidth: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        >
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>

            <img
              src={user.image}
              alt="User Avatar"
              style={{ width: 100, height: 100, borderRadius: '50%', border: '2px solid #1677ff', objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.src = 'https://gw.alipayobjects.com/zos/antfincdn/XAosKoiAY/BiazfanxmamNRoxxVxka.png';
              }}
            />


            <Descriptions column={1} size="small">
              <Descriptions.Item label="Họ và Tên">
                <strong>{user?.firstName} {user?.lastName}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Tên đăng nhập">{user?.username}</Descriptions.Item>
              <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {user?.gender === 'female' ? 'Nữ' : (user?.gender === 'male' ? 'Nam' : user?.gender)}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Card>
      )}
    </div>
  )
}