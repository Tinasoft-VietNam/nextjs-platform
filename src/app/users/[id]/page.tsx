import UserDetail from "@/components/organisms/users/UserDetail";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <UserDetail params={params} />
    )
}