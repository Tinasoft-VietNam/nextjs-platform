'use client' // Quan trọng: Phải có dòng này

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Khởi tạo QueryClient trong useState để đảm bảo mỗi user/request 
  // có một instance riêng biệt và không bị khởi tạo lại mỗi lần render
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // Dữ liệu cũ sau 1 phút
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}