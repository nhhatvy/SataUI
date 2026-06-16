import { create } from 'zustand'

export type NotiCategory = 'study' | 'finance' | 'makeup' | 'survey' | 'report' | 'schedule'

export interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  type: NotiCategory
  unread: boolean
  childName: string
}

interface NotificationState {
  notifications: NotificationItem[]
  markAsRead: (id: string) => void
  markAllRead: () => void
  addNotification: (item: Omit<NotificationItem, 'id' | 'time' | 'unread'>) => void
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Học phí tháng 06 sắp đến hạn',
    description: 'Học phí tháng 06/2026 của Bảo Minh sắp đến hạn đóng vào ngày 15/06.',
    time: '1 giờ trước',
    type: 'finance',
    unread: true,
    childName: 'Bảo Minh'
  },
  {
    id: 'n2',
    title: 'Nhận xét mới từ Thầy Hoàng Minh',
    description: 'Bảo Minh hoàn thành xuất sắc mô hình robot tránh vật cản.',
    time: '3 giờ trước',
    type: 'study',
    unread: true,
    childName: 'Bảo Minh'
  },
  {
    id: 'n3',
    title: 'Lịch học bù đã được phê duyệt',
    description: 'Lớp học bù Robotics 4D ngày 12/06 của Bảo Minh đã được duyệt thành công.',
    time: '4 giờ trước',
    type: 'makeup',
    unread: false,
    childName: 'Bảo Minh'
  },
  {
    id: 'n4',
    title: 'Khảo sát chất lượng dịch vụ tháng 6',
    description: 'Khảo sát sự hài lòng về cơ sở vật chất cơ sở 1 đang được mở.',
    time: '2 ngày trước',
    type: 'survey',
    unread: true,
    childName: 'Bảo Minh'
  },
  {
    id: 'n5',
    title: 'Học bạ định kỳ tháng 05 đã phát hành',
    description: 'Học bạ tháng 05/2026 của Thảo An đã được công bố chính thức.',
    time: '3 ngày trước',
    type: 'report',
    unread: false,
    childName: 'Thảo An'
  },
  {
    id: 'n6',
    title: 'Thông báo thay đổi phòng học',
    description: 'Lớp Scratch 2A của Thảo An tuần sau chuyển sang phòng Lab 1.',
    time: '5 ngày trước',
    type: 'schedule',
    unread: false,
    childName: 'Thảo An'
  }
]

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: initialNotifications,
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => 
      n.id === id ? { ...n, unread: false } : n
    )
  })),
  markAllRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, unread: false }))
  })),
  addNotification: (item) => {
    const newNoti: NotificationItem = {
      ...item,
      id: `noti_${Date.now()}`,
      time: 'Vừa xong',
      unread: true
    }
    set((state) => ({
      notifications: [newNoti, ...state.notifications]
    }))
  }
}))
