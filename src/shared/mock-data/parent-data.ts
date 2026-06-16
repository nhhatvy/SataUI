// Dữ liệu mẫu cho trải nghiệm phụ huynh SataRobo.

export type Child = {
  id: string
  slug: string
  name: string
  shortName: string
  className: string
  grade: string
  avatarColor: string
  initials: string
  imageConsent: boolean
}

export const children: Child[] = [
  {
    id: 'minh',
    slug: 'minh',
    name: 'Nguyễn Bảo Minh',
    shortName: 'Bảo Minh',
    className: 'Robotics 4B',
    grade: 'Lớp 4',
    avatarColor: 'oklch(0.748 0.169 56.8)',
    initials: 'BM',
    imageConsent: true,
  },
  {
    id: 'an',
    slug: 'an',
    name: 'Nguyễn Thảo An',
    shortName: 'Thảo An',
    className: 'Scratch 2A',
    grade: 'Lớp 2',
    avatarColor: 'oklch(0.62 0.18 250)',
    initials: 'TA',
    imageConsent: false,
  },
]

// Resolve a child from a URL slug (slug is used in routes instead of the raw id).
export function getChildBySlug(slug: string): Child | undefined {
  return children.find((c) => c.slug === slug || c.id === slug)
}

export const parent = {
  name: 'Anh Nguyễn Văn Hải',
  fullName: 'Nguyễn Văn Hải',
  email: 'hai.nv@gmail.com',
  initials: 'VH',
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'unexcused' | 'makeup' | 'pending'

export type ScheduleItem = {
  id: string
  subject: string
  time: string
  day: string
  room: string
  teacher: string
  status: 'upcoming' | 'today' | 'done'
}

export type Feedback = {
  id: string
  teacher: string
  teacherRole: string
  initials: string
  date: string
  message: string
  sentiment: 'positive' | 'neutral'
}

export type ResultItem = {
  id: string
  title: string
  score: number
  maxScore: number
  date: string
  type: 'Bài tập' | 'Bài thi' | 'Dự án'
}

export type GalleryPhoto = {
  id: string
  caption: string
  date: string
  color: string
}

export type Notification = {
  id: string
  title: string
  description: string
  time: string
  type: 'info' | 'success' | 'warning' | 'payment'
  unread: boolean
}

export type WeekDaySchedule = {
  day: string
  date: string
  isToday?: boolean
  items: {
    id: string;
    subject: string;
    time: string;
    room: string;
    teacher: string;
    status: 'done' | 'today' | 'upcoming';
  }[]
}

export type Lesson = {
  id: string
  title: string
  subject: string
  progress: number
  lessons: number
  completed: number
  color: string
}

export type Assignment = {
  id: string
  title: string
  course: string
  due: string
  status: 'pending' | 'submitted' | 'graded'
  score?: number
}

export type Activity = {
  id: string
  title: string
  date: string
  photos: number
  category: string
  color: string
  image: string
}

export type Announcement = {
  id: string
  title: string
  body: string
  date: string
  pinned?: boolean
}

export type Transaction = {
  id: string
  title: string
  date: string
  amount: number
  status: 'paid' | 'due' | 'upcoming' | 'draft'
  method?: string
}

export const announcements: Announcement[] = [
  {
    id: 'an1',
    title: 'Lịch nghỉ hè và khai giảng khóa mới',
    body: 'Trung tâm sẽ nghỉ hè từ 01/07 đến 31/07. Khóa học mới khai giảng ngày 05/08/2026.',
    date: '10/06/2026',
    pinned: true,
  },
  {
    id: 'an2',
    title: 'Ngày hội Robot SataRobo 2026',
    body: 'Mời quý phụ huynh và các con tham gia Ngày hội Robot vào 20/06. Đăng ký tại quầy lễ tân.',
    date: '08/06/2026',
  },
  {
    id: 'an3',
    title: 'Thay đổi phòng học lớp Robotics 4B',
    body: 'Từ tuần sau, lớp Robotics 4B chuyển sang phòng Lab 2 (tầng 3).',
    date: '05/06/2026',
  },
]

export const paymentMethods = [
  { id: 'pm1', label: 'VietQR / Chuyển khoản', desc: 'Quét mã, xác nhận tức thì' },
  { id: 'pm2', label: 'Ví MoMo', desc: 'Thanh toán qua ví điện tử' },
  { id: 'pm3', label: 'Thẻ ATM / Visa', desc: 'Hỗ trợ thẻ nội địa & quốc tế' },
]

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

// Child Specific database mapping
export const childDataMap: Record<string, {
  todayAttendance: { status: AttendanceStatus; checkInTime: string; className: string; note: string }
  upcomingSchedule: ScheduleItem[]
  latestFeedback: Feedback[]
  recentResults: ResultItem[]
  learningProgress: { overall: number; attendance: number; assignments: number; participation: number; subjects: { name: string; value: number }[] }
  tuition: { status: 'due' | 'paid'; amount: number; period: string; dueDate: string; daysLeft: number }
  sataCoin: { balance: number; thisMonth: number; rank: string }
  classPhotos: GalleryPhoto[]
  notifications: Notification[]
  attendanceSummary: { 
    present: number; 
    absent: number; 
    late: number; 
    excused: number; 
    unexcused: number; 
    makeup: number; 
    completed: number; 
    total: number; 
    rate: number 
  }
  weeklyScores: { week: string; score: number }[]
  skillRadar: { skill: string; value: number }[]
  monthAttendance: { date: string; label: string; status: AttendanceStatus | 'off'; checkInTime?: string; note?: string }[]
  weekSchedule: WeekDaySchedule[]
  courses: Lesson[]
  assignments: Assignment[]
  activities: Activity[]
  transactions: Transaction[]
  calendarMonthEvents: Record<string, { type: 'normal' | 'makeup' | 'exam' | 'holiday'; label: string }>
}> = {
  minh: {
    todayAttendance: {
      status: 'present',
      checkInTime: '08:02',
      className: 'Robotics 4B',
      note: 'Con đã đến lớp đúng giờ',
    },
    upcomingSchedule: [
      {
        id: 's1',
        subject: 'Lập trình Robot cơ bản',
        time: '08:00 - 09:30',
        day: 'Hôm nay',
        room: 'Phòng Lab 2',
        teacher: 'Thầy Hoàng',
        status: 'today',
      },
      {
        id: 's2',
        subject: 'Tư duy thuật toán',
        time: '14:00 - 15:30',
        day: 'Ngày mai',
        room: 'Phòng 305',
        teacher: 'Cô Lan',
        status: 'upcoming',
      },
      {
        id: 's3',
        subject: 'Thực hành lắp ráp',
        time: '08:00 - 09:30',
        day: 'Thứ 6, 12/06',
        room: 'Phòng Lab 1',
        teacher: 'Thầy Hoàng',
        status: 'upcoming',
      },
    ],
    latestFeedback: [
      {
        id: 'f1',
        teacher: 'Thầy Hoàng Minh',
        teacherRole: 'GV Robotics',
        initials: 'HM',
        date: 'Hôm nay, 09:40',
        message: 'Bảo Minh hôm nay rất tập trung và hoàn thành mô hình robot dò đường sớm hơn dự kiến. Con tiến bộ rõ rệt về tư duy logic.',
        sentiment: 'positive',
      },
      {
        id: 'f2',
        teacher: 'Cô Lan Anh',
        teacherRole: 'GV Thuật toán',
        initials: 'LA',
        date: 'Hôm qua, 15:20',
        message: 'Con cần luyện thêm phần vòng lặp. Phụ huynh hỗ trợ con ôn lại bài tập số 3 ở nhà nhé.',
        sentiment: 'neutral',
      },
    ],
    recentResults: [
      {
        id: 'r1',
        title: 'Bài thi giữa kỳ - Robotics',
        score: 9.0,
        maxScore: 10,
        date: '08/06/2026',
        type: 'Bài thi',
      },
      {
        id: 'r2',
        title: 'Dự án Robot dò đường',
        score: 9.5,
        maxScore: 10,
        date: '05/06/2026',
        type: 'Dự án',
      },
      {
        id: 'r3',
        title: 'Bài tập Vòng lặp',
        score: 7.5,
        maxScore: 10,
        date: '03/06/2026',
        type: 'Bài tập',
      },
    ],
    learningProgress: {
      overall: 78,
      attendance: 95,
      assignments: 82,
      participation: 88,
      subjects: [
        { name: 'Lập trình Robot', value: 85 },
        { name: 'Tư duy thuật toán', value: 72 },
        { name: 'Thực hành lắp ráp', value: 90 },
      ],
    },
    tuition: {
      status: 'due',
      amount: 2400000,
      period: 'Tháng 06/2026',
      dueDate: '15/06/2026',
      daysLeft: 5,
    },
    sataCoin: {
      balance: 1280,
      thisMonth: 120,
      rank: 'Top 5 lớp',
    },
    classPhotos: [
      { id: 'p1', caption: 'Giờ thực hành lắp ráp robot', date: 'Hôm nay', color: 'oklch(0.748 0.169 56.8)' },
      { id: 'p2', caption: 'Thuyết trình dự án nhóm', date: 'Hôm qua', color: 'oklch(0.62 0.18 250)' },
      { id: 'p3', caption: 'Cuộc thi robot dò đường', date: '08/06', color: 'oklch(0.723 0.192 149.6)' },
      { id: 'p4', caption: 'Hoạt động ngoại khóa STEM', date: '06/06', color: 'oklch(0.768 0.165 70.1)' },
    ],
    notifications: [
      {
        id: 'n1',
        title: 'Học phí tháng 06 sắp đến hạn',
        description: 'Vui lòng thanh toán trước ngày 15/06/2026.',
        time: '1 giờ trước',
        type: 'payment',
        unread: true,
      },
      {
        id: 'n2',
        title: 'Nhận xét mới từ Thầy Hoàng',
        description: 'Bảo Minh có buổi học rất tích cực hôm nay.',
        time: '3 giờ trước',
        type: 'success',
        unread: true,
      },
      {
        id: 'n3',
        title: 'Hình ảnh lớp học mới',
        description: '4 ảnh mới từ buổi thực hành robot.',
        time: 'Hôm qua',
        type: 'info',
        unread: false,
      },
    ],
    attendanceSummary: {
      present: 16,
      absent: 2,
      late: 2,
      excused: 1,
      unexcused: 1,
      makeup: 2,
      completed: 18,
      total: 20,
      rate: 90,
    },
    weeklyScores: [
      { week: 'T1', score: 7.2 },
      { week: 'T2', score: 7.8 },
      { week: 'T3', score: 8.1 },
      { week: 'T4', score: 7.9 },
      { week: 'T5', score: 8.6 },
      { week: 'T6', score: 9.0 },
    ],
    skillRadar: [
      { skill: 'Tư duy logic', value: 88 },
      { skill: 'Sáng tạo', value: 76 },
      { skill: 'Hợp tác nhóm', value: 92 },
      { skill: 'Trình bày', value: 70 },
      { skill: 'Kỷ luật', value: 95 },
    ],
    monthAttendance: [
      { date: '02/06', label: 'T2', status: 'present' },
      { date: '03/06', label: 'T3', status: 'present' },
      { date: '04/06', label: 'T4', status: 'absent' },
      { date: '05/06', label: 'T5', status: 'present' },
      { date: '06/06', label: 'T6', status: 'present' },
      { date: '09/06', label: 'T2', status: 'present' },
      { date: '10/06', label: 'T3', status: 'present' },
      { date: '11/06', label: 'T4', status: 'pending' },
      { date: '12/06', label: 'T5', status: 'pending' },
      { date: '13/06', label: 'T6', status: 'pending' },
    ],
    weekSchedule: [
      {
        day: 'Thứ 2',
        date: '09/06',
        items: [
          {
            id: 'w1',
            subject: 'Lập trình Robot cơ bản',
            time: '08:00 - 09:30',
            room: 'Lab 2',
            teacher: 'Thầy Hoàng',
            status: 'done',
          },
        ],
      },
      {
        day: 'Thứ 4',
        date: '10/06',
        isToday: true,
        items: [
          {
            id: 'w2',
            subject: 'Lập trình Robot cơ bản',
            time: '08:00 - 09:30',
            room: 'Lab 2',
            teacher: 'Thầy Hoàng',
            status: 'today',
          },
        ],
      },
      {
        day: 'Thứ 5',
        date: '11/06',
        items: [
          {
            id: 'w3',
            subject: 'Tư duy thuật toán',
            time: '14:00 - 15:30',
            room: 'Phòng 305',
            teacher: 'Cô Lan',
            status: 'upcoming',
          },
        ],
      },
      {
        day: 'Thứ 6',
        date: '12/06',
        items: [
          {
            id: 'w4',
            subject: 'Thực hành lắp ráp',
            time: '08:00 - 09:30',
            room: 'Lab 1',
            teacher: 'Thầy Hoàng',
            status: 'upcoming',
          },
        ],
      },
    ],
    courses: [
      {
        id: 'c1',
        title: 'Lập trình Robot cơ bản',
        subject: 'Robotics',
        progress: 85,
        lessons: 20,
        completed: 17,
        color: 'oklch(0.748 0.169 56.8)',
      },
      {
        id: 'c2',
        title: 'Tư duy thuật toán',
        subject: 'Thuật toán',
        progress: 72,
        lessons: 16,
        completed: 11,
        color: 'oklch(0.62 0.18 250)',
      },
      {
        id: 'c3',
        title: 'Thực hành lắp ráp',
        subject: 'Cơ khí',
        progress: 90,
        lessons: 12,
        completed: 11,
        color: 'oklch(0.723 0.192 149.6)',
      },
    ],
    assignments: [
      {
        id: 'a1',
        title: 'Lập trình robot tránh vật cản',
        course: 'Lập trình Robot',
        due: 'Hạn 13/06',
        status: 'pending',
      },
      {
        id: 'a2',
        title: 'Bài tập vòng lặp số 3',
        course: 'Tư duy thuật toán',
        due: 'Nộp 09/06',
        status: 'submitted',
      },
      {
        id: 'a3',
        title: 'Mô hình robot dò đường',
        course: 'Thực hành lắp ráp',
        due: 'Chấm 05/06',
        status: 'graded',
        score: 9.5,
      },
    ],
    activities: [
      {
        id: 'ac1',
        title: 'Giờ thực hành lắp ráp robot',
        date: 'Hôm nay · 10/06',
        photos: 8,
        category: 'Trên lớp',
        color: 'oklch(0.748 0.169 56.8)',
        image: '/activities/lap-rap-robot.png',
      },
      {
        id: 'ac2',
        title: 'Thuyết trình dự án nhóm',
        date: 'Hôm qua · 09/06',
        photos: 12,
        category: 'Dự án',
        color: 'oklch(0.62 0.18 250)',
        image: '/activities/thuyet-trinh.png',
      },
    ],
    transactions: [
      {
        id: 't0',
        title: 'Học phí tháng 06/2026',
        date: 'Hạn 15/06/2026',
        amount: 2400000,
        status: 'due',
      },
      {
        id: 't1',
        title: 'Học phí tháng 05/2026',
        date: '08/05/2026',
        amount: 2400000,
        status: 'paid',
        method: 'Chuyển khoản',
      },
    ],
    calendarMonthEvents: {
      "2026-06-02": { type: "normal", label: "Lớp Robot cơ bản" },
      "2026-06-09": { type: "normal", label: "Lớp Robot cơ bản" },
      "2026-06-12": { type: "makeup", label: "Học bù Bài 4" },
      "2026-06-16": { type: "exam", label: "Kiểm tra Giữa kỳ" },
      "2026-06-23": { type: "holiday", label: "Nghỉ lễ Giỗ Tổ" },
    }
  },
  an: {
    todayAttendance: {
      status: 'absent',
      checkInTime: '--',
      className: 'Scratch 2A',
      note: 'Con nghỉ học có phép',
    },
    upcomingSchedule: [
      {
        id: 's5',
        subject: 'Lập trình Scratch sáng tạo',
        time: '10:00 - 11:30',
        day: 'Ngày mai',
        room: 'Phòng Lab 1',
        teacher: 'Cô Lan Anh',
        status: 'upcoming',
      }
    ],
    latestFeedback: [
      {
        id: 'f3',
        teacher: 'Cô Lan Anh',
        teacherRole: 'GV Thuật toán',
        initials: 'LA',
        date: '08/06, 16:00',
        message: 'Thảo An rất sáng tạo khi thiết kế hình nền động trên Scratch. Con có ý thức học bài xuất sắc.',
        sentiment: 'positive',
      },
    ],
    recentResults: [
      {
        id: 'r4',
        title: 'Bài tập Scratch cơ bản 4',
        score: 10,
        maxScore: 10,
        date: '09/06/2026',
        type: 'Bài tập',
      },
      {
        id: 'r5',
        title: 'Bài kiểm tra giữa kỳ Scratch',
        score: 8.5,
        maxScore: 10,
        date: '06/06/2026',
        type: 'Bài thi',
      },
    ],
    learningProgress: {
      overall: 82,
      attendance: 90,
      assignments: 88,
      participation: 85,
      subjects: [
        { name: 'Lập trình Scratch', value: 88 },
        { name: 'Sáng tạo mỹ thuật', value: 80 },
      ],
    },
    tuition: {
      status: 'paid',
      amount: 1800000,
      period: 'Tháng 06/2026',
      dueDate: '15/06/2026',
      daysLeft: 0,
    },
    sataCoin: {
      balance: 850,
      thisMonth: 80,
      rank: 'Top 10 lớp',
    },
    classPhotos: [
      { id: 'p5', caption: 'Lớp học vẽ phim hoạt hình Scratch', date: '08/06', color: 'oklch(0.723 0.192 149.6)' },
      { id: 'p6', caption: 'Sáng tạo phim hoạt hình', date: '06/06', color: 'oklch(0.768 0.165 70.1)' },
    ],
    notifications: [
      {
        id: 'n5',
        title: 'Thảo An nhận được huy hiệu Mới',
        description: 'Vua Scratch - Hoàn thành bài game hứng quả.',
        time: '2 ngày trước',
        type: 'success',
        unread: false,
      },
    ],
    attendanceSummary: {
      present: 13,
      absent: 2,
      late: 1,
      excused: 1,
      unexcused: 1,
      makeup: 1,
      completed: 14,
      total: 16,
      rate: 81.25,
    },
    weeklyScores: [
      { week: 'T1', score: 8.0 },
      { week: 'T2', score: 8.5 },
      { week: 'T3', score: 9.0 },
      { week: 'T4', score: 8.8 },
      { week: 'T5', score: 9.5 },
    ],
    skillRadar: [
      { skill: 'Tư duy logic', value: 84 },
      { skill: 'Sáng tạo', value: 92 },
      { skill: 'Hợp tác nhóm', value: 80 },
      { skill: 'Trình bày', value: 75 },
      { skill: 'Kỷ luật', value: 90 },
    ],
    monthAttendance: [
      { date: '02/06', label: 'T2', status: 'present' },
      { date: '03/06', label: 'T3', status: 'present' },
      { date: '04/06', label: 'T4', status: 'absent' },
      { date: '05/06', label: 'T5', status: 'present' },
      { date: '06/06', label: 'T6', status: 'present' },
      { date: '09/06', label: 'T2', status: 'present' },
      { date: '10/06', label: 'T3', status: 'present' },
    ],
    weekSchedule: [
      {
        day: 'Thứ 3',
        date: '09/06',
        items: [
          {
            id: 'w5',
            subject: 'Lập trình Scratch sáng tạo',
            time: '10:00 - 11:30',
            room: 'Phòng 204',
            teacher: 'Cô Lan Anh',
            status: 'done',
          },
        ],
      },
      {
        day: 'Thứ 5',
        date: '11/06',
        isToday: true,
        items: [
          {
            id: 'w6',
            subject: 'Lập trình Scratch sáng tạo',
            time: '10:00 - 11:30',
            room: 'Phòng 204',
            teacher: 'Cô Lan Anh',
            status: 'today',
          },
        ],
      },
    ],
    courses: [
      {
        id: 'c4',
        title: 'Lập trình Scratch sáng tạo',
        subject: 'Scratch',
        progress: 78,
        lessons: 16,
        completed: 12,
        color: 'oklch(0.62 0.18 250)',
      },
    ],
    assignments: [
      {
        id: 'a4',
        title: 'Tạo hình chuyển động nhân vật',
        course: 'Lập trình Scratch sáng tạo',
        due: 'Hạn 14/06',
        status: 'pending',
      },
      {
        id: 'a5',
        title: 'Thiết kế game hứng quả',
        course: 'Lập trình Scratch sáng tạo',
        due: 'Chấm 07/06',
        status: 'graded',
        score: 8.5,
      },
    ],
    activities: [
      {
        id: 'ac3',
        title: 'Lớp học vẽ phim hoạt hình Scratch',
        date: '08/06',
        photos: 6,
        category: 'Trên lớp',
        color: 'oklch(0.723 0.192 149.6)',
        image: '/activities/lap-rap-robot.png',
      },
    ],
    transactions: [
      {
        id: 't4',
        title: 'Học phí tháng 06/2026',
        date: '05/06/2026',
        amount: 1800000,
        status: 'paid',
        method: 'Ví điện tử',
      },
      {
        id: 't5',
        title: 'Học phí tháng 05/2026',
        date: '05/05/2026',
        amount: 1800000,
        status: 'paid',
        method: 'Chuyển khoản',
      },
    ],
    calendarMonthEvents: {
      "2026-06-03": { type: "normal", label: "Lớp Scratch cơ bản" },
      "2026-06-10": { type: "normal", label: "Lớp Scratch cơ bản" },
      "2026-06-17": { type: "normal", label: "Lớp Scratch cơ bản" },
    }
  }
}

export function getChildData(childId: string) {
  return childDataMap[childId] || childDataMap.minh
}

// Fallback values for backward compatibility
export const todayAttendance = childDataMap.minh.todayAttendance
export const upcomingSchedule = childDataMap.minh.upcomingSchedule
export const latestFeedback = childDataMap.minh.latestFeedback
export const recentResults = childDataMap.minh.recentResults
export const learningProgress = childDataMap.minh.learningProgress
export const tuition = childDataMap.minh.tuition
export const sataCoin = childDataMap.minh.sataCoin
export const classPhotos = childDataMap.minh.classPhotos
export const notifications = childDataMap.minh.notifications
export const attendanceSummary = childDataMap.minh.attendanceSummary
export const weeklyScores = childDataMap.minh.weeklyScores
export const skillRadar = childDataMap.minh.skillRadar
export const monthAttendance = childDataMap.minh.monthAttendance
export const weekSchedule = childDataMap.minh.weekSchedule
export const courses = childDataMap.minh.courses
export const assignments = childDataMap.minh.assignments
export const activities = childDataMap.minh.activities
export const transactions = childDataMap.minh.transactions
export const calendarMonthEvents = childDataMap.minh.calendarMonthEvents