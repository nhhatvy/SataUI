export type StudentStats = {
  level: number
  currentXp: number
  maxXp: number
  streak: number
  sataCoin: number
}

export type StudentCourse = {
  id: string
  title: string
  subject: string
  progress: number
  lessonsCount: number
  completedCount: number
  makeupCount: number
  color: string
  teacher: string
}

export type Mission = {
  id: string
  title: string
  rewardXp: number
  rewardCoin: number
  completed: boolean
  type: 'daily' | 'weekly'
}

export type BadgeItem = {
  id: string
  title: string
  desc: string
  icon: string
  unlocked: boolean
}

export type RewardItem = {
  id: string
  title: string
  price: number
  image: string
  stock: number
  desc: string
}

export const mockRewards: RewardItem[] = [
  {
    id: 'rw1',
    title: 'Bộ Lego lắp ráp mini',
    price: 300,
    image: '🧩',
    stock: 5,
    desc: 'Bộ lắp ghép sáng tạo 3-trong-1 phát triển tư duy hình học.'
  },
  {
    id: 'rw2',
    title: 'Hộp bút SataRobo siêu cấp',
    price: 150,
    image: '✏️',
    stock: 12,
    desc: 'Hộp đựng bút in hình linh thú đại diện SataRobo dễ thương.'
  },
  {
    id: 'rw3',
    title: 'Mũ lưỡi trai SataRobo năng động',
    price: 200,
    image: '🧢',
    stock: 8,
    desc: 'Mũ đội thời trang chống nắng đồng hành cùng con khi dã ngoại.'
  },
  {
    id: 'rw4',
    title: 'Robot thông minh dò đường Arduino',
    price: 1000,
    image: '🤖',
    stock: 2,
    desc: 'Kit robot lập trình mở rộng phát triển tư duy nâng cao tại nhà.'
  }
]

export const studentDataMap: Record<string, {
  stats: StudentStats
  courses: StudentCourse[]
  missions: Mission[]
  badges: BadgeItem[]
}> = {
  minh: {
    stats: {
      level: 4,
      currentXp: 320,
      maxXp: 500,
      streak: 5,
      sataCoin: 1280
    },
    courses: [
      {
        id: 'sc2',
        title: 'Robotics cơ bản & Lắp ráp',
        subject: 'Robotics',
        progress: 55,
        lessonsCount: 20,
        completedCount: 11,
        makeupCount: 2,
        color: 'from-orange-500 to-amber-500',
        teacher: 'Thầy Hoàng Minh'
      }
    ],
    missions: [
      {
        id: 'm1',
        title: 'Đăng nhập học tập hôm nay',
        rewardXp: 10,
        rewardCoin: 5,
        completed: true,
        type: 'daily'
      },
      {
        id: 'm2',
        title: 'Hoàn thành thử thách lắp ráp số 3',
        rewardXp: 50,
        rewardCoin: 25,
        completed: false,
        type: 'daily'
      },
      {
        id: 'm3',
        title: 'Đạt điểm 9 trở lên trong bài thi tuần',
        rewardXp: 100,
        rewardCoin: 50,
        completed: false,
        type: 'weekly'
      },
      {
        id: 'm4',
        title: 'Duy trì chuỗi học tập 7 ngày liên tiếp',
        rewardXp: 150,
        rewardCoin: 75,
        completed: false,
        type: 'weekly'
      }
    ],
    badges: [
      {
        id: 'b1',
        title: 'Chiến binh Streak',
        desc: 'Học liên tục trong 5 ngày',
        icon: '🔥',
        unlocked: true
      },
      {
        id: 'b2',
        title: 'Kỹ sư nhí tài ba',
        desc: 'Lắp ráp thành công mô hình robot tránh vật cản',
        icon: '🛠️',
        unlocked: true
      },
      {
        id: 'b3',
        title: 'Vua Scratch',
        desc: 'Hoàn thành dự án game tương tác đầu tay',
        icon: '🎮',
        unlocked: false
      }
    ]
  },
  an: {
    stats: {
      level: 2,
      currentXp: 180,
      maxXp: 300,
      streak: 12,
      sataCoin: 850
    },
    courses: [
      {
        id: 'sc1',
        title: 'Lập trình Scratch sáng tạo',
        subject: 'Scratch',
        progress: 78,
        lessonsCount: 16,
        completedCount: 12,
        makeupCount: 1,
        color: 'from-indigo-500 to-blue-500',
        teacher: 'Cô Lan Anh'
      }
    ],
    missions: [
      {
        id: 'm1',
        title: 'Đăng nhập học tập hôm nay',
        rewardXp: 10,
        rewardCoin: 5,
        completed: true,
        type: 'daily'
      },
      {
        id: 'm5',
        title: 'Thiết kế phim hoạt hình sinh nhật',
        rewardXp: 40,
        rewardCoin: 20,
        completed: true,
        type: 'daily'
      },
      {
        id: 'm6',
        title: 'Làm bài kiểm tra từ vựng Scratch',
        rewardXp: 80,
        rewardCoin: 40,
        completed: false,
        type: 'weekly'
      }
    ],
    badges: [
      {
        id: 'b1',
        title: 'Chiến binh Streak',
        desc: 'Học liên tục trong 10 ngày',
        icon: '🔥',
        unlocked: true
      },
      {
        id: 'b3',
        title: 'Nữ hoàng Scratch',
        desc: 'Hoàn thành 5 dự án hoạt hình sáng tạo',
        icon: '👑',
        unlocked: true
      }
    ]
  }
}

export function getStudentData(childId: string) {
  return studentDataMap[childId] || studentDataMap.minh
}

// ----- Khung chương trình + bài tập theo buổi (cho trang Bài tập của học sinh) -----

export type LessonProgress = 'done' | 'current' | 'upcoming'
export type HomeworkState = 'submitted' | 'pending' | 'overdue'

export type SyllabusHomework = {
  quizId: string // map tới QUIZ_DATABASE trong student-assignments
  title: string
  due: string
  state: HomeworkState
}

export type SyllabusLesson = {
  index: number
  title: string
  date: string
  progress: LessonProgress // done/current = đã/đang học (xanh), upcoming = chưa học (xám)
  homework?: SyllabusHomework
}

export type TeacherTest = {
  id: string // map tới QUIZ_DATABASE
  title: string
  due: string
  state: HomeworkState
  durationMinutes: number
  questionCount: number
}

export type CourseSyllabus = {
  courseName: string
  teacher: string
  totalSessions: number
  lessons: SyllabusLesson[]
  tests: TeacherTest[]
}

export const courseSyllabusMap: Record<string, CourseSyllabus> = {
  minh: {
    courseName: 'Robotics cơ bản & Lắp ráp',
    teacher: 'Thầy Hoàng Minh',
    totalSessions: 14,
    lessons: [
      { index: 1, title: 'Làm quen bộ kit & an toàn lab', date: '05/05/2026', progress: 'done' },
      { index: 2, title: 'Cảm biến siêu âm & đo khoảng cách', date: '08/05/2026', progress: 'done', homework: { quizId: 'a1', title: 'BT: Cảm biến siêu âm', due: '10/05/2026', state: 'submitted' } },
      { index: 3, title: 'Động cơ DC & điều khiển bánh xe', date: '12/05/2026', progress: 'done' },
      { index: 4, title: 'Dò đường bằng cảm biến hồng ngoại', date: '15/05/2026', progress: 'done', homework: { quizId: 'a3', title: 'BT: Xe dò đường', due: '17/05/2026', state: 'submitted' } },
      { index: 5, title: 'Vòng lặp & rẽ nhánh trong điều khiển', date: '19/05/2026', progress: 'done', homework: { quizId: 'a1', title: 'BT: Vòng lặp điều khiển', due: '21/05/2026', state: 'overdue' } },
      { index: 6, title: 'Robot tránh vật cản tự động', date: '22/05/2026', progress: 'done', homework: { quizId: 'a3', title: 'BT: Robot tránh vật cản', due: '24/05/2026', state: 'submitted' } },
      { index: 7, title: 'Lắp ráp khung gầm nâng cao', date: '26/05/2026', progress: 'current', homework: { quizId: 'a1', title: 'BT: Khung gầm & động lực', due: '16/06/2026', state: 'pending' } },
      { index: 8, title: 'Cánh tay robot & servo', date: '29/05/2026', progress: 'upcoming' },
      { index: 9, title: 'Lập trình theo kịch bản', date: '02/06/2026', progress: 'upcoming' },
      { index: 10, title: 'Dự án nhóm: robot phân loại', date: '05/06/2026', progress: 'upcoming' },
      { index: 11, title: 'Gỡ lỗi & tối ưu chương trình', date: '09/06/2026', progress: 'upcoming' },
      { index: 12, title: 'Thử thách sa hình', date: '12/06/2026', progress: 'upcoming' },
      { index: 13, title: 'Hoàn thiện dự án cuối khóa', date: '16/06/2026', progress: 'upcoming' },
      { index: 14, title: 'Thuyết trình & tổng kết', date: '19/06/2026', progress: 'upcoming' },
    ],
    tests: [
      { id: 'a1', title: 'Kiểm tra giữa kỳ: Cảm biến & điều khiển', due: '18/06/2026', state: 'pending', durationMinutes: 20, questionCount: 4 },
      { id: 'a3', title: 'Kiểm tra nhanh: Xe dò đường', due: '02/06/2026', state: 'submitted', durationMinutes: 10, questionCount: 2 },
    ],
  },
  an: {
    courseName: 'Lập trình Scratch sáng tạo',
    teacher: 'Cô Lan Anh',
    totalSessions: 14,
    lessons: [
      { index: 1, title: 'Làm quen giao diện Scratch', date: '04/05/2026', progress: 'done' },
      { index: 2, title: 'Khối lệnh chuyển động & sự kiện', date: '07/05/2026', progress: 'done', homework: { quizId: 'a4', title: 'BT: Chuyển động nhân vật', due: '09/05/2026', state: 'submitted' } },
      { index: 3, title: 'Vẽ hình bằng vòng lặp', date: '11/05/2026', progress: 'done', homework: { quizId: 'a5', title: 'BT: Vẽ ngôi sao 5 cánh', due: '13/05/2026', state: 'submitted' } },
      { index: 4, title: 'Biến số & điểm số trò chơi', date: '14/05/2026', progress: 'done', homework: { quizId: 'a4', title: 'BT: Biến đếm điểm', due: '16/05/2026', state: 'overdue' } },
      { index: 5, title: 'Thiết kế nhân vật & phông nền', date: '18/05/2026', progress: 'done' },
      { index: 6, title: 'Game hứng quả phần 1', date: '21/05/2026', progress: 'current', homework: { quizId: 'a5', title: 'BT: Game hứng quả', due: '16/06/2026', state: 'pending' } },
      { index: 7, title: 'Game hứng quả phần 2', date: '25/05/2026', progress: 'upcoming' },
      { index: 8, title: 'Âm thanh & hiệu ứng', date: '28/05/2026', progress: 'upcoming' },
      { index: 9, title: 'Hoạt hình kể chuyện', date: '01/06/2026', progress: 'upcoming' },
      { index: 10, title: 'Điều khiển bằng bàn phím', date: '04/06/2026', progress: 'upcoming' },
      { index: 11, title: 'Nhân bản (clone) & hiệu ứng', date: '08/06/2026', progress: 'upcoming' },
      { index: 12, title: 'Dự án game cá nhân', date: '11/06/2026', progress: 'upcoming' },
      { index: 13, title: 'Hoàn thiện dự án', date: '15/06/2026', progress: 'upcoming' },
      { index: 14, title: 'Thuyết trình & tổng kết', date: '18/06/2026', progress: 'upcoming' },
    ],
    tests: [
      { id: 'a4', title: 'Kiểm tra giữa kỳ: Khối lệnh & vòng lặp', due: '17/06/2026', state: 'pending', durationMinutes: 15, questionCount: 3 },
    ],
  },
}

export function getCourseSyllabus(childId: string): CourseSyllabus {
  return courseSyllabusMap[childId] || courseSyllabusMap.minh
}

// ----- Nhận xét & hình ảnh THEO TỪNG BUỔI HỌC -----
// Mỗi buổi học có nhận xét riêng của giáo viên và bộ ảnh lớp riêng.

export type SessionComment = {
  teacher: string
  role: string
  initials: string
  content: string
  sentiment: 'positive' | 'neutral'
}

export type SessionPhoto = {
  id: string
  caption: string
  color: string
}

export type SessionExtra = {
  comment?: SessionComment
  photos?: SessionPhoto[]
}

const C_ORANGE = 'oklch(0.748 0.169 56.8)'
const C_BLUE = 'oklch(0.62 0.18 250)'
const C_GREEN = 'oklch(0.723 0.192 149.6)'
const C_AMBER = 'oklch(0.768 0.165 70.1)'

// Map theo childId -> theo index buổi học.
export const sessionExtrasMap: Record<string, Record<number, SessionExtra>> = {
  minh: {
    1: {
      photos: [
        { id: 'm1a', caption: 'Khám phá bộ kit Robotics', color: C_ORANGE },
        { id: 'm1b', caption: 'Hướng dẫn an toàn phòng lab', color: C_BLUE },
      ],
    },
    2: {
      comment: { teacher: 'Thầy Hoàng Minh', role: 'GV Robotics', initials: 'HM', sentiment: 'positive', content: 'Bảo Minh nắm rất nhanh nguyên lý cảm biến siêu âm, chủ động đo thử nhiều lần để kiểm chứng kết quả.' },
      photos: [
        { id: 'm2a', caption: 'Lắp cảm biến siêu âm', color: C_GREEN },
        { id: 'm2b', caption: 'Đo khoảng cách thực tế', color: C_AMBER },
        { id: 'm2c', caption: 'Thảo luận nhóm', color: C_BLUE },
      ],
    },
    3: {
      comment: { teacher: 'Thầy Hoàng Minh', role: 'GV Robotics', initials: 'HM', sentiment: 'neutral', content: 'Con điều khiển động cơ tốt nhưng cần cẩn thận hơn khi đấu nối dây nguồn để tránh ngắn mạch.' },
    },
    4: {
      comment: { teacher: 'Thầy Hoàng Minh', role: 'GV Robotics', initials: 'HM', sentiment: 'positive', content: 'Xe dò đường của con chạy ổn định, con biết tự hiệu chỉnh độ nhạy cảm biến hồng ngoại. Rất tốt!' },
      photos: [
        { id: 'm4a', caption: 'Thử nghiệm xe dò đường', color: C_ORANGE },
        { id: 'm4b', caption: 'Hiệu chỉnh cảm biến', color: C_GREEN },
      ],
    },
    5: {
      comment: { teacher: 'Cô Lan Anh', role: 'GV Thuật toán', initials: 'LA', sentiment: 'neutral', content: 'Con hiểu vòng lặp nhưng còn lúng túng với điều kiện rẽ nhánh lồng nhau. Nên luyện thêm ở nhà.' },
    },
    6: {
      comment: { teacher: 'Thầy Hoàng Minh', role: 'GV Robotics', initials: 'HM', sentiment: 'positive', content: 'Robot tránh vật cản của Bảo Minh hoạt động mượt mà, con xử lý tình huống va chạm rất thông minh.' },
      photos: [
        { id: 'm6a', caption: 'Robot tránh vật cản', color: C_BLUE },
        { id: 'm6b', caption: 'Đường đua thử thách', color: C_AMBER },
        { id: 'm6c', caption: 'Cả lớp cổ vũ', color: C_GREEN },
      ],
    },
    7: {
      comment: { teacher: 'Thầy Hoàng Minh', role: 'GV Robotics', initials: 'HM', sentiment: 'positive', content: 'Buổi học hôm nay con lắp khung gầm chắc chắn, có ý thức hỗ trợ các bạn cùng nhóm.' },
      photos: [
        { id: 'm7a', caption: 'Lắp ráp khung gầm', color: C_ORANGE },
        { id: 'm7b', caption: 'Kiểm tra độ chắc chắn', color: C_BLUE },
      ],
    },
  },
  an: {
    1: {
      photos: [{ id: 'a1a', caption: 'Làm quen Scratch', color: C_GREEN }],
    },
    2: {
      comment: { teacher: 'Cô Lan Anh', role: 'GV Scratch', initials: 'LA', sentiment: 'positive', content: 'Thảo An điều khiển nhân vật chuyển động rất sáng tạo, con tự thêm hiệu ứng xoay tròn ngộ nghĩnh.' },
      photos: [
        { id: 'a2a', caption: 'Lập trình chuyển động', color: C_BLUE },
        { id: 'a2b', caption: 'Trình bày sản phẩm', color: C_AMBER },
      ],
    },
    3: {
      comment: { teacher: 'Cô Lan Anh', role: 'GV Scratch', initials: 'LA', sentiment: 'positive', content: 'Con vẽ ngôi sao 5 cánh bằng vòng lặp chính xác, hiểu rõ góc xoay 144 độ. Tư duy hình học tốt.' },
      photos: [{ id: 'a3a', caption: 'Vẽ hình bằng vòng lặp', color: C_GREEN }],
    },
    4: {
      comment: { teacher: 'Cô Lan Anh', role: 'GV Scratch', initials: 'LA', sentiment: 'neutral', content: 'Con dùng biến đếm điểm tốt, nhưng quên đặt lại biến về 0 khi bắt đầu game. Cô đã nhắc con sửa.' },
    },
    5: {
      photos: [
        { id: 'a5a', caption: 'Thiết kế nhân vật', color: C_ORANGE },
        { id: 'a5b', caption: 'Vẽ phông nền', color: C_BLUE },
      ],
    },
    6: {
      comment: { teacher: 'Cô Lan Anh', role: 'GV Scratch', initials: 'LA', sentiment: 'positive', content: 'Game hứng quả của Thảo An đã chạy được phần điều khiển, con rất kiên trì sửa lỗi. Cô khen con!' },
      photos: [
        { id: 'a6a', caption: 'Lập trình game hứng quả', color: C_GREEN },
        { id: 'a6b', caption: 'Chơi thử cùng bạn', color: C_AMBER },
      ],
    },
  },
}

export function getSessionExtras(childId: string): Record<number, SessionExtra> {
  return sessionExtrasMap[childId] || {}
}

// ----- Nhận xét chi tiết theo buổi (cho giao diện Phụ huynh) -----

export type SkillRating = 'excellent' | 'good' | 'fair' | 'needs_improvement'

export type SessionReview = {
  teacher: string
  objectives: string[] // mục tiêu buổi học (1-5)
  skills: { name: string; rating: SkillRating }[]
  highlights: string // điểm nổi bật
  progress: string // tiến bộ
  improvements: string // cần cải thiện
  suggestions: string[] // đề xuất cho phụ huynh (tối đa 3)
  viewed: boolean
}

export const SKILL_RATING_LABEL: Record<SkillRating, string> = {
  excellent: 'Xuất sắc',
  good: 'Tốt',
  fair: 'Khá',
  needs_improvement: 'Cần cải thiện',
}

// Map childId -> index buổi -> nhận xét chi tiết. Chỉ có ở các buổi đã học.
export const sessionReviewsMap: Record<string, Record<number, SessionReview>> = {
  minh: {
    2: {
      teacher: 'Thầy Hoàng Minh',
      objectives: ['Hiểu nguyên lý cảm biến siêu âm', 'Đọc giá trị khoảng cách từ cảm biến', 'Kết nối cảm biến với mạch điều khiển'],
      skills: [
        { name: 'Lắp ráp', rating: 'good' },
        { name: 'Lập trình', rating: 'fair' },
        { name: 'Tư duy logic', rating: 'good' },
        { name: 'Tập trung', rating: 'excellent' },
        { name: 'Làm việc nhóm', rating: 'good' },
      ],
      highlights: 'Bảo Minh chủ động gắn cảm biến đúng chân tín hiệu và đo thử nhiều lần để kiểm chứng kết quả khoảng cách.',
      progress: 'So với buổi trước, con đã tự đọc được sơ đồ chân cắm mà không cần thầy nhắc lại.',
      improvements: 'Con cần thao tác đọc dữ liệu trên màn hình Serial nhanh hơn để theo kịp nhịp bài giảng.',
      suggestions: ['Cùng con đo khoảng cách vài vật trong nhà bằng thước', 'Khuyến khích con giải thích cảm biến hoạt động thế nào'],
      viewed: true,
    },
    3: {
      teacher: 'Thầy Hoàng Minh',
      objectives: ['Điều khiển động cơ DC', 'Đảo chiều quay bánh xe', 'Đấu nối nguồn an toàn'],
      skills: [
        { name: 'Lắp ráp', rating: 'good' },
        { name: 'Lập trình', rating: 'good' },
        { name: 'Tư duy logic', rating: 'good' },
        { name: 'Tập trung', rating: 'fair' },
        { name: 'Làm việc nhóm', rating: 'good' },
      ],
      highlights: 'Con lập trình cho hai bánh xe quay tiến và lùi đúng yêu cầu của bài.',
      progress: 'Con bắt đầu chú ý hơn đến cực âm/dương khi đấu dây, ít nhầm hơn buổi trước.',
      improvements: 'Con cần cẩn thận khi cắm dây nguồn để tránh chạm chập làm mất kết nối.',
      suggestions: ['Nhắc con kiểm tra dây nối trước khi cấp nguồn', 'Cho con xem video robot di chuyển để tạo hứng thú'],
      viewed: true,
    },
    4: {
      teacher: 'Thầy Hoàng Minh',
      objectives: ['Hiểu cảm biến dò đường hồng ngoại', 'Hiệu chỉnh độ nhạy cảm biến', 'Lập trình xe bám vạch'],
      skills: [
        { name: 'Lắp ráp', rating: 'excellent' },
        { name: 'Lập trình', rating: 'good' },
        { name: 'Tư duy logic', rating: 'excellent' },
        { name: 'Tập trung', rating: 'good' },
        { name: 'Làm việc nhóm', rating: 'good' },
      ],
      highlights: 'Xe dò đường của con chạy bám vạch ổn định, con tự hiệu chỉnh được ngưỡng cảm biến hồng ngoại.',
      progress: 'Con đã biết suy luận: khi xe lệch phải thì cho bánh phải chạy nhanh hơn để vào lại vạch.',
      improvements: 'Con nên ghi chú lại thông số đã hiệu chỉnh để lần sau không phải dò lại từ đầu.',
      suggestions: ['Khen ngợi sự kiên trì hiệu chỉnh của con', 'Cùng con vẽ một đường đua bằng băng dính đen để thử ở nhà'],
      viewed: true,
    },
    5: {
      teacher: 'Cô Lan Anh',
      objectives: ['Sử dụng vòng lặp trong điều khiển', 'Viết câu lệnh điều kiện rẽ nhánh'],
      skills: [
        { name: 'Lắp ráp', rating: 'good' },
        { name: 'Lập trình', rating: 'fair' },
        { name: 'Tư duy logic', rating: 'fair' },
        { name: 'Tập trung', rating: 'good' },
        { name: 'Làm việc nhóm', rating: 'good' },
      ],
      highlights: 'Con dùng được vòng lặp để lặp lại hành động di chuyển của robot.',
      progress: 'Con đã phân biệt được khi nào dùng vòng lặp vô hạn và khi nào dùng vòng lặp có số lần.',
      improvements: 'Con còn lúng túng khi lồng nhiều câu lệnh điều kiện vào nhau, cần luyện thêm.',
      suggestions: ['Ôn lại câu lệnh điều kiện đã học cùng con', 'Đặt cho con các tình huống "nếu... thì..." trong sinh hoạt'],
      viewed: false,
    },
    6: {
      teacher: 'Thầy Hoàng Minh',
      objectives: ['Hiểu cảm biến khoảng cách', 'Sử dụng câu lệnh điều kiện lồng nhau', 'Lập trình robot tránh vật cản'],
      skills: [
        { name: 'Lắp ráp', rating: 'excellent' },
        { name: 'Lập trình', rating: 'good' },
        { name: 'Tư duy logic', rating: 'excellent' },
        { name: 'Tập trung', rating: 'good' },
        { name: 'Làm việc nhóm', rating: 'good' },
      ],
      highlights: 'Bảo Minh tham gia lớp học tích cực và hoàn thành tốt phần lắp ráp robot tránh vật cản.',
      progress: 'Con đã biết sử dụng câu lệnh điều kiện lồng nhau để xử lý tình huống robot gặp chướng ngại vật.',
      improvements: 'Con cần luyện tập thêm thao tác kéo thả khối lệnh để tăng tốc độ lập trình.',
      suggestions: ['Ôn lại câu lệnh điều kiện đã học', 'Khuyến khích con kể lại cách robot tránh vật cản', 'Luyện tập thêm thao tác chuột'],
      viewed: false,
    },
    7: {
      teacher: 'Thầy Hoàng Minh',
      objectives: ['Lắp ráp khung gầm chắc chắn', 'Kiểm tra độ vững của kết cấu'],
      skills: [
        { name: 'Lắp ráp', rating: 'excellent' },
        { name: 'Lập trình', rating: 'good' },
        { name: 'Tư duy logic', rating: 'good' },
        { name: 'Tập trung', rating: 'good' },
        { name: 'Làm việc nhóm', rating: 'excellent' },
      ],
      highlights: 'Con lắp khung gầm chắc chắn và chủ động hỗ trợ bạn cùng nhóm hoàn thiện mô hình.',
      progress: 'Con đã siết ốc đều tay hơn và biết kiểm tra lại độ vững trước khi gắn linh kiện.',
      improvements: 'Con nên phân chia công việc trong nhóm rõ ràng hơn để tiết kiệm thời gian.',
      suggestions: ['Hỏi con hôm nay đã giúp bạn việc gì', 'Khen ngợi tinh thần làm việc nhóm của con'],
      viewed: false,
    },
  },
  an: {
    2: {
      teacher: 'Cô Lan Anh',
      objectives: ['Dùng khối lệnh chuyển động', 'Bắt sự kiện khi bấm cờ xanh', 'Thêm hiệu ứng cho nhân vật'],
      skills: [
        { name: 'Lắp ráp', rating: 'good' },
        { name: 'Lập trình', rating: 'excellent' },
        { name: 'Tư duy logic', rating: 'good' },
        { name: 'Tập trung', rating: 'good' },
        { name: 'Làm việc nhóm', rating: 'good' },
      ],
      highlights: 'Thảo An điều khiển nhân vật chuyển động mượt mà và tự thêm hiệu ứng xoay tròn ngộ nghĩnh.',
      progress: 'Con đã ghép được khối sự kiện với khối chuyển động mà không cần cô hướng dẫn.',
      improvements: 'Con cần đặt tên nhân vật rõ ràng để dễ quản lý khi chương trình dài hơn.',
      suggestions: ['Cùng con đặt tên các nhân vật trong dự án', 'Khuyến khích con kể câu chuyện của nhân vật'],
      viewed: true,
    },
    3: {
      teacher: 'Cô Lan Anh',
      objectives: ['Dùng vòng lặp để vẽ hình', 'Hiểu góc xoay khi vẽ đa giác'],
      skills: [
        { name: 'Lắp ráp', rating: 'good' },
        { name: 'Lập trình', rating: 'excellent' },
        { name: 'Tư duy logic', rating: 'excellent' },
        { name: 'Tập trung', rating: 'good' },
        { name: 'Làm việc nhóm', rating: 'good' },
      ],
      highlights: 'Con vẽ ngôi sao 5 cánh bằng vòng lặp rất chính xác và hiểu vì sao góc xoay là 144 độ.',
      progress: 'Con đã tự suy ra công thức góc xoay thay vì học thuộc như trước.',
      improvements: 'Con nên thử thay đổi số cạnh để vẽ các hình khác nhằm hiểu sâu hơn.',
      suggestions: ['Cho con vẽ thêm hình tam giác, lục giác để so sánh', 'Khen tư duy hình học của con'],
      viewed: true,
    },
    4: {
      teacher: 'Cô Lan Anh',
      objectives: ['Tạo và sử dụng biến số', 'Đếm điểm trong trò chơi'],
      skills: [
        { name: 'Lắp ráp', rating: 'good' },
        { name: 'Lập trình', rating: 'good' },
        { name: 'Tư duy logic', rating: 'fair' },
        { name: 'Tập trung', rating: 'good' },
        { name: 'Làm việc nhóm', rating: 'good' },
      ],
      highlights: 'Con tạo được biến đếm điểm và cộng điểm mỗi khi nhân vật bắt được vật phẩm.',
      progress: 'Con đã hiểu khái niệm biến số lưu trữ giá trị thay đổi theo thời gian.',
      improvements: 'Con thường quên đặt lại biến điểm về 0 khi bắt đầu lại trò chơi, cần luyện thêm.',
      suggestions: ['Nhắc con kiểm tra giá trị ban đầu của biến khi chơi lại', 'Cùng con thử trò chơi tính điểm đơn giản'],
      viewed: false,
    },
    6: {
      teacher: 'Cô Lan Anh',
      objectives: ['Lập trình điều khiển nhân vật chính', 'Xử lý va chạm bắt vật phẩm', 'Hoàn thiện vòng lặp trò chơi'],
      skills: [
        { name: 'Lắp ráp', rating: 'good' },
        { name: 'Lập trình', rating: 'good' },
        { name: 'Tư duy logic', rating: 'good' },
        { name: 'Tập trung', rating: 'excellent' },
        { name: 'Làm việc nhóm', rating: 'excellent' },
      ],
      highlights: 'Game hứng quả của con đã chạy được phần điều khiển nhân vật, con rất kiên trì sửa lỗi.',
      progress: 'Con đã tự tìm và sửa được lỗi nhân vật không di chuyển bằng cách kiểm tra lại khối sự kiện.',
      improvements: 'Con cần luyện thêm cách dùng khối "nếu chạm vào" để bắt vật phẩm chính xác hơn.',
      suggestions: ['Khuyến khích con cho cả nhà chơi thử game', 'Cùng con liệt kê các lỗi đã gặp và cách sửa'],
      viewed: false,
    },
  },
}

export function getSessionReviews(childId: string): Record<number, SessionReview> {
  return sessionReviewsMap[childId] || {}
}

// ----- Học bù (cho giao diện Phụ huynh) -----

export type MissedSession = {
  id: string
  lessonIndex: number
  lessonTitle: string
  missedDate: string
  reason: string
}
export type MakeupSuggestion = {
  id: string
  className: string
  lessonTitle: string
  date: string
  time: string
  teacher: string
  campus: 'same' | 'other'
  campusName: string
  seatsLeft: number
}
export type MakeupHistory = {
  id: string
  lessonTitle: string
  targetClass: string
  campusName: string
  date: string
  status: 'pending' | 'approved' | 'done'
}
export type MakeupData = {
  homeCampus: string
  missed: MissedSession[]
  suggestions: MakeupSuggestion[]
  history: MakeupHistory[]
}

export const makeupDataMap: Record<string, MakeupData> = {
  minh: {
    homeCampus: 'Cơ sở 1 - Nguyễn Trãi',
    missed: [
      { id: 'ms1', lessonIndex: 5, lessonTitle: 'Vòng lặp & rẽ nhánh trong điều khiển', missedDate: '19/05/2026', reason: 'Nghỉ ốm có phép' },
    ],
    suggestions: [
      { id: 'sg1', className: 'Robotics 4C', lessonTitle: 'Vòng lặp & rẽ nhánh', date: '18/06/2026', time: '14:00 - 15:30', teacher: 'Cô Trần Lan', campus: 'same', campusName: 'Cơ sở 1 - Nguyễn Trãi', seatsLeft: 3 },
      { id: 'sg2', className: 'Robotics 4D', lessonTitle: 'Vòng lặp & rẽ nhánh', date: '20/06/2026', time: '16:00 - 17:30', teacher: 'Thầy Lê Bình', campus: 'same', campusName: 'Cơ sở 1 - Nguyễn Trãi', seatsLeft: 1 },
      { id: 'sg3', className: 'Robotics 4B', lessonTitle: 'Vòng lặp & rẽ nhánh', date: '21/06/2026', time: '08:00 - 09:30', teacher: 'Cô Phạm Mai', campus: 'other', campusName: 'Cơ sở 2 - Cầu Giấy', seatsLeft: 5 },
    ],
    history: [
      { id: 'h1', lessonTitle: 'Cảm biến siêu âm & đo khoảng cách', targetClass: 'Robotics 4C', campusName: 'Cơ sở 1 - Nguyễn Trãi', date: '08/05/2026', status: 'done' },
      { id: 'h2', lessonTitle: 'Động cơ DC & điều khiển bánh xe', targetClass: 'Robotics 4D', campusName: 'Cơ sở 1 - Nguyễn Trãi', date: '14/05/2026', status: 'approved' },
    ],
  },
  an: {
    homeCampus: 'Cơ sở 2 - Cầu Giấy',
    missed: [
      { id: 'ms2', lessonIndex: 4, lessonTitle: 'Biến số & điểm số trò chơi', missedDate: '14/05/2026', reason: 'Bận việc gia đình' },
    ],
    suggestions: [
      { id: 'sg4', className: 'Scratch 2B', lessonTitle: 'Biến số & điểm số', date: '19/06/2026', time: '10:00 - 11:30', teacher: 'Cô Lan Anh', campus: 'same', campusName: 'Cơ sở 2 - Cầu Giấy', seatsLeft: 4 },
      { id: 'sg5', className: 'Scratch 2A', lessonTitle: 'Biến số & điểm số', date: '22/06/2026', time: '14:00 - 15:30', teacher: 'Thầy Hồ Nam', campus: 'other', campusName: 'Cơ sở 1 - Nguyễn Trãi', seatsLeft: 2 },
    ],
    history: [
      { id: 'h3', lessonTitle: 'Khối lệnh chuyển động & sự kiện', targetClass: 'Scratch 2B', campusName: 'Cơ sở 2 - Cầu Giấy', date: '10/05/2026', status: 'done' },
    ],
  },
}

export function getMakeupData(childId: string): MakeupData {
  return makeupDataMap[childId] || makeupDataMap.minh
}

// ----- Danh sách học bạ (cho giao diện Phụ huynh) -----

export type ReportCardEntry = {
  id: string
  title: string
  period: string
  date: string
  status: 'published' | 'draft' | 'pending_approval'
  author: string
}

export const reportCardListMap: Record<string, ReportCardEntry[]> = {
  minh: [
    { id: 'rep1', title: 'Học bạ định kỳ tháng 05/2026', period: 'Tháng 05/2026', date: '05/06/2026', status: 'published', author: 'Phòng Đào Tạo' },
    { id: 'rep2', title: 'Học bạ định kỳ tháng 04/2026', period: 'Tháng 04/2026', date: '05/05/2026', status: 'published', author: 'Phòng Đào Tạo' },
    { id: 'rep3', title: 'Đánh giá năng lực thực hành tuần 24', period: 'Tuần 24', date: '11/06/2026', status: 'draft', author: 'Cô Lan Anh' },
  ],
  an: [
    { id: 'rep4', title: 'Học bạ định kỳ tháng 05/2026', period: 'Tháng 05/2026', date: '05/06/2026', status: 'published', author: 'Phòng Đào Tạo' },
    { id: 'rep5', title: 'Đánh giá năng lực tuần 23', period: 'Tuần 23', date: '09/06/2026', status: 'pending_approval', author: 'Cô Lan Anh' },
  ],
}

export function getReportCardList(childId: string): ReportCardEntry[] {
  return reportCardListMap[childId] || []
}

// ----- Bảng xếp hạng lớp (điểm thành tích từ bài tập & kiểm tra trắc nghiệm) -----

export type LeaderboardStudent = {
  id: string
  name: string
  initials: string
  avatarColor: string
  completed: number // số bài/kiểm tra đã hoàn thành
  avgScore: number // điểm trung bình (thang 10)
  points: number // điểm thành tích tích lũy
  isMe?: boolean
}

export type ClassLeaderboard = {
  className: string
  students: LeaderboardStudent[]
}

export const leaderboardMap: Record<string, ClassLeaderboard> = {
  minh: {
    className: 'Robotics 4B',
    students: [
      { id: 'lb1', name: 'Trần Gia Bảo', initials: 'GB', avatarColor: 'oklch(0.62 0.18 250)', completed: 9, avgScore: 9.4, points: 846 },
      { id: 'lb2', name: 'Lê Khánh An', initials: 'KA', avatarColor: 'oklch(0.723 0.192 149.6)', completed: 8, avgScore: 9.2, points: 736 },
      { id: 'minh', name: 'Nguyễn Bảo Minh', initials: 'BM', avatarColor: 'oklch(0.748 0.169 56.8)', completed: 7, avgScore: 9.0, points: 630, isMe: true },
      { id: 'lb3', name: 'Phạm Minh Quân', initials: 'MQ', avatarColor: 'oklch(0.768 0.165 70.1)', completed: 7, avgScore: 8.6, points: 602 },
      { id: 'lb4', name: 'Đỗ Hải Đăng', initials: 'HĐ', avatarColor: 'oklch(0.637 0.208 25.3)', completed: 6, avgScore: 8.8, points: 528 },
      { id: 'lb5', name: 'Vũ Tuệ Lâm', initials: 'TL', avatarColor: 'oklch(0.62 0.18 300)', completed: 6, avgScore: 8.3, points: 498 },
      { id: 'lb6', name: 'Bùi Gia Hân', initials: 'GH', avatarColor: 'oklch(0.7 0.15 180)', completed: 5, avgScore: 8.0, points: 400 },
      { id: 'lb7', name: 'Hoàng Nam Phong', initials: 'NP', avatarColor: 'oklch(0.65 0.16 30)', completed: 5, avgScore: 7.6, points: 380 },
    ],
  },
  an: {
    className: 'Scratch 2A',
    students: [
      { id: 'lb8', name: 'Nguyễn Khải Minh', initials: 'KM', avatarColor: 'oklch(0.62 0.18 250)', completed: 8, avgScore: 9.5, points: 760 },
      { id: 'an', name: 'Nguyễn Thảo An', initials: 'TA', avatarColor: 'oklch(0.62 0.18 250)', completed: 6, avgScore: 9.3, points: 558, isMe: true },
      { id: 'lb9', name: 'Trần Bảo Châu', initials: 'BC', avatarColor: 'oklch(0.723 0.192 149.6)', completed: 6, avgScore: 9.0, points: 540 },
      { id: 'lb10', name: 'Lê Thảo Nhi', initials: 'TN', avatarColor: 'oklch(0.768 0.165 70.1)', completed: 5, avgScore: 8.8, points: 440 },
      { id: 'lb11', name: 'Phạm Gia Linh', initials: 'GL', avatarColor: 'oklch(0.637 0.208 25.3)', completed: 5, avgScore: 8.4, points: 420 },
      { id: 'lb12', name: 'Đặng Minh Khôi', initials: 'MK', avatarColor: 'oklch(0.7 0.15 180)', completed: 4, avgScore: 8.0, points: 320 },
      { id: 'lb13', name: 'Vũ Hà My', initials: 'HM', avatarColor: 'oklch(0.65 0.16 30)', completed: 4, avgScore: 7.5, points: 300 },
    ],
  },
}

export function getClassLeaderboard(childId: string): ClassLeaderboard {
  return leaderboardMap[childId] || leaderboardMap.minh
}

// Fallback values for backward compatibility
export const studentStats = studentDataMap.minh.stats
export const studentCourses = studentDataMap.minh.courses
export const mockMissions = studentDataMap.minh.missions
export const mockBadges = studentDataMap.minh.badges
