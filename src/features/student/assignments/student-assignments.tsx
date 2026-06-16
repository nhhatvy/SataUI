'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Progress } from '@/shared/components/ui/progress'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { useScoreStore } from '@/shared/stores/useScoreStore'
import { getStudentData, getCourseSyllabus, type HomeworkState } from '@/shared/mock-data/student-data'
import { getChildData } from '@/shared/mock-data/parent-data'
import { StateMockWrapper } from '@/shared/components/state-mock-wrapper'
import { PageHeader, InfoNote } from '@/shared/components/page-header'
import { cn } from '@/shared/utils/utils'
import {
  ClipboardList,
  Send,
  CheckCircle2,
  Timer,
  Award,
  Sparkles,
  ArrowRight,
  BookOpen,
  ArrowLeft,
  Info,
  Check,
  X,
  History,
  Trophy
} from 'lucide-react'

type Question = {
  id: string
  type: 'single' | 'multiple' | 'boolean'
  question: string
  options: string[]
  correctIndex?: number
  correctIndices?: number[]
  explanation: string
  visualType?: 'scratch-loop' | 'robot-wiring'
}

type Attempt = {
  date: string
  score: number
  correctCount: number
  totalCount: number
  answers: Record<string, number | number[]>
  questions: Question[]
  xp: number
  coins: number
}

// Advanced Quiz questions database
const QUIZ_DATABASE: Record<string, Question[]> = {
  a1: [
    {
      id: 'q1_1',
      type: 'single',
      question: 'Cảm biến siêu âm của robot tránh vật cản dùng để làm gì?',
      options: [
        'Đo khoảng cách tới vật cản trước mặt bằng sóng siêu âm',
        'Đo nhiệt độ và độ ẩm của môi trường xung quanh',
        'Nhận biết các màu sắc khác nhau trên vạch đường đi',
        'Kết nối truyền dữ liệu Bluetooth với thiết bị di động'
      ],
      correctIndex: 0,
      explanation: 'Cảm biến siêu âm hoạt động bằng cách phát sóng siêu âm và đo thời gian sóng phản xạ trở lại để tính khoảng cách tới vật cản.'
    },
    {
      id: 'q1_2',
      type: 'boolean',
      question: 'Cảm biến siêu âm hoạt động bằng cách phát ra tia hồng ngoại để phản xạ từ vật cản.',
      options: ['Đúng', 'Sai'],
      correctIndex: 1,
      explanation: 'Cảm biến siêu âm sử dụng sóng âm tần số cao (siêu âm), còn cảm biến hồng ngoại mới sử dụng tia hồng ngoại (IR) để phát hiện vạch đường.'
    },
    {
      id: 'q1_3',
      type: 'multiple',
      question: 'Những bộ phận nào dưới đây đóng vai trò là thiết bị đầu vào (Input) của Robot tránh vật cản? (Chọn nhiều đáp án)',
      options: [
        'Cảm biến siêu âm đo khoảng cách',
        'Mạch điều khiển trung tâm (Arduino)',
        'Cảm biến hồng ngoại phát hiện vạch',
        'Động cơ DC quay bánh xe'
      ],
      correctIndices: [0, 2],
      explanation: 'Cảm biến siêu âm và cảm biến hồng ngoại là các thiết bị cảm nhận môi trường (Input). Mạch Arduino là bộ xử lý (Processor), động cơ là thiết bị đầu ra (Output).'
    },
    {
      id: 'q1_4',
      type: 'single',
      question: 'Dựa vào sơ đồ lắp dây (wiring) cảm biến siêu âm dưới đây, chân Echo của cảm biến được nối vào chân tín hiệu nào của vi điều khiển?',
      options: [
        'Nối vào chân 5V (Nguồn điện)',
        'Nối vào chân GND (Đất)',
        'Nối vào chân Digital Pin 12',
        'Nối vào chân Analog Pin A0'
      ],
      correctIndex: 2,
      explanation: 'Theo sơ đồ kết nối chuẩn của SataRobo, chân Trigger nối vào Pin 11 và Echo nối vào Pin 12 để gửi nhận tín hiệu xung siêu âm.',
      visualType: 'robot-wiring'
    }
  ],
  a2: [
    {
      id: 'q2_1',
      type: 'single',
      question: 'Để lập trình vẽ hình ngôi sao 5 cánh trong Scratch, góc xoay của nhân vật cần là bao nhiêu độ?',
      options: [
        '72 độ',
        '90 độ',
        '120 độ',
        '144 độ'
      ],
      correctIndex: 3,
      explanation: 'Công thức tính góc xoay để vẽ sao 5 cánh là 360 * 2 / 5 = 144 độ. Nếu xoay 72 độ (360/5) bạn sẽ vẽ được hình ngũ giác đều chứ không phải ngôi sao.'
    },
    {
      id: 'q2_2',
      type: 'multiple',
      question: 'Trong Scratch, các khối lệnh nào dưới đây thuộc nhóm lệnh điều khiển (Control)? (Chọn nhiều đáp án)',
      options: [
        'Khối lệnh "Move 10 steps"',
        'Khối lệnh "Repeat 10"',
        'Khối lệnh "Forever"',
        'Khối lệnh "When green flag clicked"'
      ],
      correctIndices: [1, 2],
      explanation: '"Repeat 10" và "Forever" là các khối điều khiển cấu trúc lặp. "Move 10 steps" thuộc nhóm Motion, còn "When green flag clicked" thuộc nhóm Events.'
    },
    {
      id: 'q2_3',
      type: 'single',
      question: 'Phân tích đoạn mã lệnh lặp Scratch bên dưới. Nhân vật sẽ vẽ ra hình gì sau khi thực hiện hết chương trình này?',
      options: [
        'Một hình tròn màu đỏ duy nhất',
        '10 hình tròn đồng tâm xếp đè lên nhau',
        'Hình trang trí gồm nhiều hình tròn xoay xung quanh tâm tạo thành hoa văn',
        'Nhân vật chỉ đứng im và không vẽ gì cả'
      ],
      correctIndex: 2,
      explanation: 'Đoạn mã lồng vòng lặp vẽ hình tròn (repeat 36) bên trong vòng lặp lớn (repeat 12) kèm lệnh xoay góc 30 độ, tạo nên một hoa văn xoay tròn đối xứng tuyệt đẹp.',
      visualType: 'scratch-loop'
    }
  ],
  a3: [
    {
      id: 'q3_1',
      type: 'single',
      question: 'Cảm biến nào giúp xe tự động phát hiện và di chuyển dọc theo vạch đường màu đen có sẵn?',
      options: [
        'Cảm biến khoảng cách siêu âm',
        'Cảm biến hồng ngoại dò đường (IR Line Tracker)',
        'Cảm biến nút chạm hành trình',
        'Cảm biến gia tốc con quay hồi chuyển'
      ],
      correctIndex: 1,
      explanation: 'Cảm biến hồng ngoại phát ra tia hồng ngoại xuống mặt đường và nhận lại tia phản xạ. Mặt đen hấp thụ hồng ngoại tốt nên tín hiệu phản xạ yếu giúp phát hiện vạch màu đen.'
    },
    {
      id: 'q3_2',
      type: 'boolean',
      question: 'Khi xe dò đường đi lệch hẳn sang bên phải vạch đen, xe cần điều khiển bánh xe bên trái quay chậm lại và bánh xe bên phải quay nhanh hơn để quay đầu trở lại vạch.',
      options: ['Đúng', 'Sai'],
      correctIndex: 1,
      explanation: 'Sai. Khi xe lệch sang bên phải vạch đen, tức là cần rẽ trái để vào lại vạch. Do đó phải quay bánh bên phải nhanh hơn và bánh bên trái quay chậm lại/hoặc đứng yên.'
    }
  ]
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...(array ?? [])]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function StudentAssignments({
  initialViewState,
  initialAssignmentId
}: {
  initialViewState?: 'list' | 'quiz' | 'result' | 'review'
  initialAssignmentId?: string | null
} = {}) {
  const { child } = useActiveChildStore()
  const studentData = getStudentData(child.id)
  const syllabus = getCourseSyllabus(child.id)

  const [assignments, setAssignments] = useState<any[]>([])

  // Navigation states
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(initialAssignmentId || null)
  const [selectedQuizTitle, setSelectedQuizTitle] = useState<string>('Bài tập')
  const [viewState, setViewState] = useState<'list' | 'quiz' | 'result' | 'review'>(initialViewState || 'list')

  // Quiz gameplay states
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([])
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number | number[]>>({})
  const [timeLeft, setTimeLeft] = useState(120)
  const [score, setScore] = useState(0)
  const [earnedCoins, setEarnedCoins] = useState(0)
  const [earnedXp, setEarnedXp] = useState(0)
  const [claimSuccess, setClaimSuccess] = useState(false)

  // Draft Restore Confirmation and warning toast states
  const [draftToRestore, setDraftToRestore] = useState<{ answers: any, currentIdx: number, timeLeft: number, assignmentId: string } | null>(null)
  const [warningToast, setWarningToast] = useState<string | null>(null)

  useEffect(() => {
    if (warningToast) {
      const t = setTimeout(() => setWarningToast(null), 3000)
      return () => clearTimeout(t)
    }
  }, [warningToast])

  // Attempt Review State
  const [activeReviewAttempt, setActiveReviewAttempt] = useState<Attempt | null>(null)

  // Persistent attempts history in session storage
  const [attempts, setAttempts] = useState<Record<string, Attempt[]>>({})

  // Initialize attempts from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('student-quiz-attempts-history')
    if (saved) {
      try {
        setAttempts(JSON.parse(saved))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  // Sync attempts to sessionStorage when they change
  useEffect(() => {
    if (Object.keys(attempts).length > 0) {
      sessionStorage.setItem('student-quiz-attempts-history', JSON.stringify(attempts))
    }
  }, [attempts])

  // Initialize and sync assignments data based on child.id
  useEffect(() => {
    const parentChildData = getChildData(child.id)
    const rawAssignments = parentChildData?.assignments ?? []
    setAssignments(rawAssignments.map(a => {
      let desc = "Bài tập lập trình & tư duy thuật toán SataRobo."
      if (a.id === 'a1' || a.id === 'a4') {
        desc = "Sử dụng cảm biến khoảng cách đọc dữ liệu để robot tự tránh vật cản."
      } else if (a.id === 'a2' || a.id === 'a5') {
        desc = "Vẽ ngôi sao 5 cánh hoặc hình trang trí sáng tạo sử dụng vòng lặp lồng nhau."
      } else if (a.id === 'a3') {
        desc = "Thực hành lắp ráp khung gầm xe 2 bánh, kết nối cảm biến dò đường hồng ngoại."
      }
      return {
        ...a,
        desc,
        statusLabel: a.status === 'graded' ? 'Đã chấm điểm' : a.status === 'submitted' ? 'Đã nộp' : 'Chưa nộp'
      }
    }))

    if (initialViewState) {
      setViewState(initialViewState)
      if (initialAssignmentId) {
        setSelectedAssignmentId(initialAssignmentId)
        if (initialViewState === 'quiz') {
          const originalQuestions = QUIZ_DATABASE[initialAssignmentId] || QUIZ_DATABASE.a1
          const shuffled = shuffleArray(originalQuestions)
          setCurrentQuestions(shuffled)
          setCurrentQuestionIdx(0)
          setSelectedAnswers({})
          setTimeLeft(120)
        }
      }
    } else {
      setSelectedAssignmentId(null)
      setViewState('list')
    }
  }, [child.id, initialViewState, initialAssignmentId])

  // Timer logic for Quiz view
  useEffect(() => {
    if (viewState !== 'quiz') return
    if (timeLeft <= 0) {
      handleQuizSubmit()
      return
    }
    if (timeLeft === 60) {
      setWarningToast("Còn 1 phút! Hãy kiểm tra lại bài làm.")
    } else if (timeLeft === 10) {
      setWarningToast("Chỉ còn 10 giây! Khẩn trương chọn các đáp án cuối cùng.")
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [viewState, timeLeft])

  // Auto-save answers into localStorage every 30s
  useEffect(() => {
    if (viewState !== 'quiz' || !selectedAssignmentId) return
    const timer = setInterval(() => {
      const draftKey = `homework_draft_${selectedAssignmentId}_${child.id}`
      const draftData = {
        answers: selectedAnswers,
        currentIdx: currentQuestionIdx,
        timeLeft: timeLeft
      }
      localStorage.setItem(draftKey, JSON.stringify(draftData))
    }, 30000)
    return () => clearInterval(timer)
  }, [viewState, selectedAssignmentId, selectedAnswers, currentQuestionIdx, timeLeft, child.id])

  const handleStartQuiz = (id: string, title?: string) => {
    if (title) setSelectedQuizTitle(title)
    const draftKey = `homework_draft_${id}_${child.id}`
    const savedDraft = localStorage.getItem(draftKey)
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft)
        setDraftToRestore({
          answers: parsed.answers,
          currentIdx: parsed.currentIdx,
          timeLeft: parsed.timeLeft,
          assignmentId: id
        })
      } catch (e) {
        console.error(e)
        startFreshQuiz(id)
      }
    } else {
      startFreshQuiz(id)
    }
  }

  const startFreshQuiz = (id: string) => {
    const originalQuestions = QUIZ_DATABASE[id] || QUIZ_DATABASE.a1
    const shuffled = shuffleArray(originalQuestions)
    setCurrentQuestions(shuffled)
    setSelectedAssignmentId(id)
    setCurrentQuestionIdx(0)
    setSelectedAnswers({})
    setTimeLeft(120)
    setViewState('quiz')
  }

  const restoreDraftQuiz = () => {
    if (!draftToRestore) return
    const id = draftToRestore.assignmentId
    const originalQuestions = QUIZ_DATABASE[id] || QUIZ_DATABASE.a1
    setCurrentQuestions(originalQuestions)
    setSelectedAssignmentId(id)
    setCurrentQuestionIdx(draftToRestore.currentIdx)
    setSelectedAnswers(draftToRestore.answers)
    setTimeLeft(draftToRestore.timeLeft)
    setViewState('quiz')
    setDraftToRestore(null)
  }

  const activeAssignment = selectedAssignmentId ? { id: selectedAssignmentId, title: selectedQuizTitle } : null

  // Toggle selection for multiple choice
  const handleToggleMultiple = (qId: string, oIdx: number) => {
    const current = (selectedAnswers[qId] as number[]) || []
    if (current.includes(oIdx)) {
      setSelectedAnswers(prev => ({
        ...prev,
        [qId]: current.filter(idx => idx !== oIdx)
      }))
    } else {
      setSelectedAnswers(prev => ({
        ...prev,
        [qId]: [...current, oIdx].sort()
      }))
    }
  }

  const handleQuizSubmit = () => {
    // Clear draft if it exists
    if (selectedAssignmentId) {
      const draftKey = `homework_draft_${selectedAssignmentId}_${child.id}`
      localStorage.removeItem(draftKey)
    }
    let correctCount = 0
    currentQuestions.forEach((q) => {
      const ans = selectedAnswers[q.id]
      if (q.type === 'multiple') {
        const correctIndices = q.correctIndices || []
        const userIndices = (ans as number[]) || []
        const isCorrect = correctIndices.length === userIndices.length &&
          correctIndices.every(val => userIndices.includes(val))
        if (isCorrect) correctCount++
      } else {
        if (ans === q.correctIndex) {
          correctCount++
        }
      }
    })

    const finalScore = Math.round((correctCount / currentQuestions.length) * 10)
    const xpReward = correctCount * 30
    const coinReward = correctCount * 15

    setScore(finalScore)
    setEarnedXp(xpReward)
    setEarnedCoins(coinReward)
    setViewState('result')

    // Cộng điểm thành tích vào bảng xếp hạng (theo từng con)
    useScoreStore.getState().addResult(child.id, finalScore)

    // Add to attempts history
    const dateStr = new Date().toLocaleDateString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

    const newAttempt: Attempt = {
      date: dateStr,
      score: finalScore,
      correctCount,
      totalCount: currentQuestions.length,
      answers: selectedAnswers,
      questions: currentQuestions,
      xp: xpReward,
      coins: coinReward
    }

    setAttempts(prev => {
      const currentList = prev[selectedAssignmentId!] || []
      return {
        ...prev,
        [selectedAssignmentId!]: [newAttempt, ...currentList]
      }
    })

    // Update local assignment status
    setAssignments(prev => prev.map(a =>
      a.id === selectedAssignmentId
        ? { ...a, status: 'graded', statusLabel: 'Đã chấm điểm', score: Math.max(a.score || 0, finalScore) }
        : a
    ))
  }

  const handleClaimRewards = () => {
    studentData.stats.sataCoin += earnedCoins
    studentData.stats.currentXp += earnedXp
    if (studentData.stats.currentXp >= studentData.stats.maxXp) {
      studentData.stats.currentXp -= studentData.stats.maxXp
      studentData.stats.level += 1
    }

    setClaimSuccess(true)
    setTimeout(() => {
      setClaimSuccess(false)
      setViewState('list')
      setSelectedAssignmentId(null)
    }, 1500)
  }

  const handleViewPastAttempt = (attempt: Attempt) => {
    setActiveReviewAttempt(attempt)
    setViewState('review')
  }


  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Warning toast alert floating banner */}
      {warningToast && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-destructive text-white text-sm font-bold rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-300 no-print">
          <Info className="size-5 shrink-0 animate-pulse" />
          <span>{warningToast}</span>
        </div>
      )}

      {/* Draft Restore Confirmation Dialog */}
      {draftToRestore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200 no-print">
          <div className="bg-white border border-slate-200 p-6 w-full max-w-md rounded-2xl shadow-xl relative text-center space-y-4">
            <span className="text-4xl block animate-bounce">📝</span>
            <h3 className="text-base font-bold text-slate-900">Tiếp tục bài đang làm dở?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-semibold">
              Hệ thống tìm thấy bản nháp được tự động lưu của bài thi này từ lần làm trước. Bạn có muốn khôi phục và tiếp tục làm không?
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const draftKey = `homework_draft_${draftToRestore.assignmentId}_${child.id}`
                  localStorage.removeItem(draftKey)
                  startFreshQuiz(draftToRestore.assignmentId)
                  setDraftToRestore(null)
                }}
                className="h-10 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer min-w-[100px]"
              >
                Không, làm mới
              </button>
              <button
                type="button"
                onClick={() => {
                  restoreDraftQuiz()
                }}
                className="h-10 rounded-xl bg-primary px-5 text-sm font-black text-white hover:opacity-90 transition-all cursor-pointer border-none shadow-xs min-w-[100px]"
              >
                Đồng ý, khôi phục
              </button>
            </div>
          </div>
        </div>
      )}

      <StateMockWrapper
        skeletonType="list"
        emptyTitle="Không có bài tập nào"
        emptyDescription="Thầy cô chưa giao bài tập thử thách nào cho lớp học của em."
      >

        {/* VIEW 1: SYLLABUS + HOMEWORK + TESTS */}
        {viewState === 'list' && (() => {
          const doneCount = syllabus.lessons.filter((l) => l.progress !== 'upcoming').length
          const progressPct = Math.round((doneCount / syllabus.totalSessions) * 100)
          const hwBadge = (state: HomeworkState) =>
            state === 'submitted'
              ? { label: 'Đã làm', cls: 'bg-success/15 text-success border border-success/30' }
              : state === 'overdue'
                ? { label: 'Quá hạn', cls: 'bg-destructive/15 text-destructive border border-destructive/30' }
                : { label: 'Chưa làm', cls: 'bg-amber-500/15 text-amber-600 border border-amber-500/30' }

          return (
            <div className="space-y-6">
              <div>
                <PageHeader
                  icon={BookOpen}
                  title="Bài tập của em"
                  subtitle="Theo dõi lộ trình từng buổi học, làm bài tập về nhà và bài kiểm tra của giáo viên."
                />
                <InfoNote variant="tip">
                  Em làm bài trắc nghiệm <strong>ngay trên web</strong> (bấm "Làm bài tập"). Sau khi nộp sẽ được chấm điểm tự động và <strong>cộng điểm vào Bảng xếp hạng lớp</strong>.
                </InfoNote>
              </div>

              {/* Course header */}
              <Card className="border-border/60 rounded-2xl shadow-none bg-gradient-to-r from-primary/5 via-transparent to-transparent">
                <CardContent className="p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <Badge className="bg-primary/10 text-primary border-none text-xs font-bold px-2 py-0.5 rounded-md mb-1">Khóa học</Badge>
                      <h2 className="text-lg font-bold text-slate-900">{syllabus.courseName}</h2>
                      <p className="text-sm text-slate-500 font-medium mt-0.5">Giáo viên: {syllabus.teacher}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{doneCount}/{syllabus.totalSessions}</p>
                      <p className="text-sm text-slate-500 font-medium">buổi đã học</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-500">Tiến độ chương trình</span>
                      <span className="text-primary">{progressPct}%</span>
                    </div>
                    <Progress value={progressPct} className="h-2.5 bg-slate-100" />
                  </div>
                </CardContent>
              </Card>

              {/* Lessons (14 sessions) */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                  Lộ trình {syllabus.totalSessions} buổi học
                </h3>
                <div className="space-y-2.5">
                  {syllabus.lessons.map((lesson) => {
                    const isUpcoming = lesson.progress === 'upcoming'
                    const isCurrent = lesson.progress === 'current'
                    return (
                      <div
                        key={lesson.index}
                        className={cn(
                          'rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-3 transition-colors',
                          isUpcoming
                            ? 'border-slate-200 bg-slate-50/60'
                            : isCurrent
                              ? 'border-primary/40 bg-primary/5'
                              : 'border-success/30 bg-success/5'
                        )}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span
                            className={cn(
                              'grid size-9 shrink-0 place-items-center rounded-xl text-sm font-black',
                              isUpcoming ? 'bg-slate-200 text-slate-500' : isCurrent ? 'bg-primary text-white' : 'bg-success text-white'
                            )}
                          >
                            {lesson.progress === 'done' ? '✓' : lesson.index}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className={cn('text-sm font-bold leading-snug', isUpcoming ? 'text-slate-500' : 'text-slate-900')}>
                                Buổi {lesson.index}: {lesson.title}
                              </h4>
                              {isCurrent && (
                                <Badge className="bg-primary text-white border-none text-[11px] font-bold px-2 py-0.5 rounded-md">Đang học</Badge>
                              )}
                              {isUpcoming && (
                                <Badge className="bg-slate-200 text-slate-500 border-none text-[11px] font-bold px-2 py-0.5 rounded-md">Chưa học</Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-400 font-medium mt-0.5">Ngày học: {lesson.date}</p>
                            {lesson.homework && (
                              <p className="text-sm text-slate-500 font-semibold mt-1">
                                {lesson.homework.title} · Hạn: <span className="text-slate-700">{lesson.homework.due}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        {lesson.homework ? (
                          <div className="flex items-center gap-2.5 shrink-0">
                            <Badge className={cn('text-sm font-bold px-2.5 py-1 rounded-md shadow-none', hwBadge(lesson.homework.state).cls)}>
                              {hwBadge(lesson.homework.state).label}
                            </Badge>
                            <button
                              type="button"
                              onClick={() => handleStartQuiz(lesson.homework!.quizId, lesson.homework!.title)}
                              className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-primary text-white text-sm font-black hover:opacity-90 transition-opacity cursor-pointer"
                            >
                              <BookOpen className="size-4 shrink-0" />
                              {lesson.homework.state === 'submitted' ? 'Làm lại' : 'Làm bài tập'}
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm font-semibold text-slate-400 shrink-0">
                            {isUpcoming ? 'Chưa mở' : 'Không có bài tập'}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Teacher-created tests */}
              {syllabus.tests.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">Bài kiểm tra của giáo viên</h3>
                  <div className="space-y-2.5">
                    {syllabus.tests.map((test) => {
                      const b = hwBadge(test.state)
                      return (
                        <div key={test.id} className="rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.03] p-4 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-500 text-white">
                              <ClipboardList className="size-4.5" />
                            </span>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-slate-900 leading-snug">{test.title}</h4>
                              <p className="text-sm text-slate-400 font-medium mt-0.5">
                                {test.questionCount} câu · {test.durationMinutes} phút · Hạn: <span className="text-slate-700 font-semibold">{test.due}</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5 shrink-0">
                            <Badge className={cn('text-sm font-bold px-2.5 py-1 rounded-md shadow-none', b.cls)}>{b.label}</Badge>
                            <button
                              type="button"
                              onClick={() => handleStartQuiz(test.id, test.title)}
                              className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-indigo-600 text-white text-sm font-black hover:opacity-90 transition-opacity cursor-pointer"
                            >
                              <BookOpen className="size-4 shrink-0" />
                              {test.state === 'submitted' ? 'Làm lại' : 'Làm bài'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })()}

        {/* VIEW 2: QUIZ PLAY DETAIL PLAYER */}
        {viewState === 'quiz' && activeAssignment && currentQuestions.length > 0 && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            {/* Header / Timer */}
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Lưu ý: Bạn chưa nộp bài, quay lại sẽ làm mất tiến trình hiện tại. Bạn có chắc không?')) {
                    setViewState('list')
                  }
                }}
                className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground cursor-pointer border-none bg-transparent"
              >
                <ArrowLeft className="size-4" /> Thoát ra ngoài
              </button>

               <div className={cn(
                "flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-black border transition-all",
                timeLeft <= 30
                  ? "bg-destructive text-white border-destructive animate-pulse"
                  : "bg-destructive/10 border-destructive/20 text-destructive"
              )}>
                <Timer className={cn("size-4.5", timeLeft <= 30 ? "animate-bounce" : "animate-spin")} />
                <span>Thời gian còn lại: {timeLeft}s</span>
              </div>
            </div>

            {/* Quiz Card */}
            <Card className="border-border/60 rounded-3xl shadow-sm overflow-hidden">
              <div className="h-2 bg-slate-100 w-full">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentQuestionIdx + 1) / currentQuestions.length) * 100}%` }}
                />
              </div>

              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-sm font-black px-2.5 py-1 shadow-none">
                      Câu hỏi {currentQuestionIdx + 1}/{currentQuestions.length}
                    </Badge>
                    <span className="text-sm font-bold text-muted-foreground">
                      {currentQuestions[currentQuestionIdx].type === 'multiple' ? 'Chọn nhiều đáp án (Checkbox)' : 'Chọn một đáp án'}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 text-foreground leading-snug">
                    {currentQuestions[currentQuestionIdx].question}
                  </h2>
                </div>

                {/* Render visual diagram if present */}
                {currentQuestions[currentQuestionIdx].visualType && (
                  <div className="py-4 bg-slate-50 rounded-2xl border border-border/40 flex items-center justify-center">
                    {currentQuestions[currentQuestionIdx].visualType === 'scratch-loop' ? (
                      <svg viewBox="0 0 320 160" className="w-full max-w-xs rounded-xl border bg-[#fcfcfc] p-2">
                        {/* Outer orange repeat 12 block */}
                        <path d="M 10 10 L 150 10 L 155 15 L 165 15 L 170 10 L 290 10 L 290 150 L 70 150 L 65 145 L 55 145 L 50 150 L 10 150 Z" fill="#ffab19" stroke="#cf8b13" strokeWidth="1.5" />
                        <text x="25" y="30" fill="white" fontSize="12" fontWeight="bold">repeat (12)</text>

                        {/* Inner yellow repeat 36 block */}
                        <path d="M 60 45 L 170 45 L 175 50 L 185 50 L 190 45 L 270 45 L 270 115 L 110 115 L 105 110 L 95 110 L 90 115 L 60 115 Z" fill="#ffab19" stroke="#cf8b13" strokeWidth="1.5" />
                        <text x="75" y="62" fill="white" fontSize="11" fontWeight="bold">repeat (36)</text>

                        {/* Move and Turn blocks inside */}
                        <path d="M 90 70 L 250 70 L 250 88 L 90 88 Z" fill="#4c97ff" stroke="#3373cc" strokeWidth="1" />
                        <text x="100" y="83" fill="white" fontSize="10" fontWeight="bold">move (10) steps</text>
                        <path d="M 90 92 L 250 92 L 250 110 L 90 110 Z" fill="#4c97ff" stroke="#3373cc" strokeWidth="1" />
                        <text x="100" y="105" fill="white" fontSize="10" fontWeight="bold">turn ↻ (10) degrees</text>

                        {/* Turn block in outer repeat */}
                        <path d="M 60 123 L 270 123 L 270 141 L 60 141 Z" fill="#4c97ff" stroke="#3373cc" strokeWidth="1" />
                        <text x="75" y="136" fill="white" fontSize="10" fontWeight="bold">turn ↻ (30) degrees</text>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 320 160" className="w-full max-w-xs rounded-xl border bg-[#f5f5f5] p-2">
                        {/* Main Arduino Board */}
                        <rect x="20" y="20" width="120" height="120" rx="8" fill="#008184" stroke="#005d60" strokeWidth="2" />
                        <text x="35" y="45" fill="white" fontSize="12" fontWeight="bold">Arduino Uno</text>

                        {/* Arduino Pins */}
                        <rect x="130" y="30" width="10" height="10" fill="#333" />
                        <text x="110" y="38" fill="white" fontSize="8" fontWeight="bold">D11</text>
                        <rect x="130" y="45" width="10" height="10" fill="#333" />
                        <text x="110" y="53" fill="white" fontSize="8" fontWeight="bold">D12</text>

                        {/* Sensor Module */}
                        <rect x="220" y="40" width="80" height="80" rx="6" fill="#004d80" stroke="#003353" strokeWidth="2" />
                        <text x="230" y="60" fill="white" fontSize="9" fontWeight="bold">Ultrasonic</text>
                        <circle cx="240" cy="90" r="12" fill="#888" stroke="#333" strokeWidth="1.5" />
                        <circle cx="280" cy="90" r="12" fill="#888" stroke="#333" strokeWidth="1.5" />

                        {/* Connecting Pins */}
                        <line x1="140" y1="35" x2="220" y2="70" stroke="#ff4d4d" strokeWidth="2" />
                        <line x1="140" y1="50" x2="220" y2="85" stroke="#4d79ff" strokeWidth="2" />
                        <text x="160" y="30" fill="#ff4d4d" fontSize="8" fontWeight="bold">Trig Pin</text>
                        <text x="160" y="60" fill="#4d79ff" fontSize="8" fontWeight="bold">Echo Pin</text>
                      </svg>
                    )}
                  </div>
                )}

                {/* Question Options */}
                {currentQuestions[currentQuestionIdx].type === 'boolean' ? (
                  // True / False layout (side-by-side cards)
                  <div className="grid grid-cols-2 gap-4">
                    {currentQuestions[currentQuestionIdx].options.map((option, oIdx) => {
                      const isSelected = selectedAnswers[currentQuestions[currentQuestionIdx].id] === oIdx
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentQuestions[currentQuestionIdx].id]: oIdx }))}
                          className={cn(
                            "flex flex-col items-center justify-center p-6 rounded-2xl border transition-all cursor-pointer min-h-[120px]",
                            isSelected
                              ? "bg-primary border-primary text-white font-extrabold shadow-md shadow-primary/25"
                              : "bg-slate-50 border-border/40 text-slate-800 hover:bg-slate-100 font-semibold"
                          )}
                          style={{ minHeight: '44px' }}
                        >
                          <span className="text-3xl mb-2">{oIdx === 0 ? '👍' : '👎'}</span>
                          <span className="text-base">{option}</span>
                        </button>
                      )
                    })}
                  </div>
                ) : currentQuestions[currentQuestionIdx].type === 'multiple' ? (
                  // Multiple Choice (Checkbox)
                  <div className="space-y-3">
                    {currentQuestions[currentQuestionIdx].options.map((option, oIdx) => {
                      const currentSelection = (selectedAnswers[currentQuestions[currentQuestionIdx].id] as number[]) || []
                      const isSelected = currentSelection.includes(oIdx)

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleToggleMultiple(currentQuestions[currentQuestionIdx].id, oIdx)}
                          className={cn(
                            "w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[50px] text-sm",
                            isSelected
                              ? "bg-primary/5 border-primary text-primary font-extrabold"
                              : "bg-slate-50 border-border/40 text-slate-800 hover:border-slate-300 font-semibold"
                          )}
                          style={{ minHeight: '44px' }}
                        >
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "size-5.5 rounded-md flex items-center justify-center border font-bold text-sm shrink-0",
                              isSelected ? "bg-primary border-primary text-white" : "border-slate-300 bg-white"
                            )}>
                              {isSelected && '✓'}
                            </span>
                            <span>{option}</span>
                          </div>
                          <span className="text-sm text-muted-foreground font-semibold">Chọn nhiều</span>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  // Standard Single Choice (Radio)
                  <div className="space-y-3">
                    {currentQuestions[currentQuestionIdx].options.map((option, oIdx) => {
                      const alphabet = ['A', 'B', 'C', 'D'][oIdx]
                      const isSelected = selectedAnswers[currentQuestions[currentQuestionIdx].id] === oIdx

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentQuestions[currentQuestionIdx].id]: oIdx }))}
                          className={cn(
                            "w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 min-h-[50px] text-sm",
                            isSelected
                              ? "bg-primary border-primary text-white font-extrabold shadow-sm shadow-primary/25"
                              : "bg-slate-50 border-border/40 text-slate-800 hover:border-slate-300 font-semibold"
                          )}
                          style={{ minHeight: '44px' }}
                        >
                          <span className={cn(
                            "size-6.5 shrink-0 rounded-full flex items-center justify-center font-black text-sm",
                            isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                          )}>
                            {alphabet}
                          </span>
                          <span>{option}</span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex justify-between items-center pt-4 border-t border-border/60">
                  <button
                    type="button"
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                    className="h-11 rounded-xl border border-border px-4 py-2 text-sm font-bold text-foreground hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-card"
                  >
                    Câu trước
                  </button>

                  {currentQuestionIdx < currentQuestions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                      className="h-11 rounded-xl bg-primary px-5 py-2 text-sm font-black text-white hover:opacity-90 transition-all cursor-pointer border-none shadow-xs"
                    >
                      Câu tiếp theo
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleQuizSubmit}
                      className="h-11 rounded-xl bg-success px-5 py-2 text-sm font-black text-white hover:opacity-90 transition-all cursor-pointer border-none shadow-xs flex items-center gap-1.5"
                    >
                      <Send className="size-4 shrink-0" />
                      Nộp bài ngay
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* VIEW 3: QUIZ RESULT CARD */}
        {viewState === 'result' && activeAssignment && (
          <div className="max-w-md mx-auto animate-in zoom-in-95 duration-300">
            <Card className="border-border/60 rounded-3xl overflow-hidden shadow-lg shadow-slate-100">
              {/* Colored Banner */}
              <div className="bg-gradient-to-br from-primary to-indigo-600 text-white p-8 text-center space-y-3 relative">
                <Sparkles className="absolute left-6 top-6 size-10 opacity-15" />
                <Award className="size-16 mx-auto animate-bounce" />
                <div>
                  <h2 className="text-xl font-black">Kết quả nộp bài thi</h2>
                  <p className="text-sm font-semibold opacity-90 mt-0.5">Chúc mừng em đã hoàn thành thử thách!</p>
                </div>
              </div>

              <CardContent className="p-6 space-y-6">
                {/* Score stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-slate-50 border border-border/40 rounded-2xl">
                    <p className="text-sm font-bold text-muted-foreground uppercase">Điểm số</p>
                    <p className="text-2xl font-bold tracking-tight text-slate-900 text-primary mt-1">{score}/10</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-border/40 rounded-2xl">
                    <p className="text-sm font-bold text-muted-foreground uppercase">Tỷ lệ đúng</p>
                    <p className="text-2xl font-bold tracking-tight text-slate-900 text-emerald-500 mt-1">
                      {Math.round((score / 10) * 100)}%
                    </p>
                  </div>
                </div>

                {/* Điểm thành tích cộng vào bảng xếp hạng */}
                <div className="rounded-2xl bg-primary/5 border border-primary/20 p-3.5 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">Điểm thành tích nhận được</span>
                  <span className="text-lg font-black text-primary">+{score * 10} điểm</span>
                </div>

                <p className="text-sm text-center text-muted-foreground font-semibold">
                  Điểm đã được cộng vào bảng xếp hạng lớp. Em có thể xem lại lời giải trong lịch sử thử thách.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    href="/student/leaderboard"
                    className="flex-1 h-12 rounded-2xl border border-primary/30 bg-white text-primary text-sm font-black hover:bg-primary/5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trophy className="size-4.5" /> Xem bảng xếp hạng
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setViewState('list')
                      setSelectedAssignmentId(null)
                    }}
                    className="flex-1 h-12 rounded-2xl bg-primary text-sm font-black text-white hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 border-none cursor-pointer"
                  >
                    Quay về danh sách <ArrowRight className="size-4.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* VIEW 4: QUIZ EXPLANATIONS / REVIEW SCREEN */}
        {viewState === 'review' && activeReviewAttempt && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <button
                type="button"
                onClick={() => {
                  setViewState('list')
                  setActiveReviewAttempt(null)
                }}
                className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground cursor-pointer border-none bg-transparent"
              >
                <ArrowLeft className="size-4" /> Quay về danh sách
              </button>

              <Badge className="bg-primary text-white text-sm font-black px-3 py-1.5 rounded-xl border-none">
                Độ chính xác: {activeReviewAttempt.score}/10 điểm
              </Badge>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-border/40 text-sm font-semibold flex items-start gap-3">
                <Info className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-foreground">Chế độ xem lời giải và đáp án chi tiết</h4>
                  <p className="text-muted-foreground mt-0.5">Dưới đây là đáp án của em, câu trả lời đúng và giải thích chi tiết cho từng câu hỏi.</p>
                </div>
              </div>

              {/* Questions List with explanations */}
              {activeReviewAttempt.questions.map((q, idx) => {
                const userAns = activeReviewAttempt.answers[q.id]
                let isCorrect = false

                if (q.type === 'multiple') {
                  const correctIndices = q.correctIndices || []
                  const userIndices = (userAns as number[]) || []
                  isCorrect = correctIndices.length === userIndices.length &&
                    correctIndices.every(val => userIndices.includes(val))
                } else {
                  isCorrect = userAns === q.correctIndex
                }

                return (
                  <Card key={q.id} className="border-border/60 rounded-3xl overflow-hidden shadow-xs">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <Badge className="bg-slate-100 text-slate-700 text-sm font-black px-2.5 py-0.5 rounded-md">
                          Câu hỏi {idx + 1}
                        </Badge>

                        <Badge className={cn(
                          "px-2.5 py-0.5 rounded-md text-sm font-semibold tracking-wider text-slate-500 uppercase border-none",
                          isCorrect ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                        )}>
                          {isCorrect ? 'Đúng' : 'Sai'}
                        </Badge>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{q.question}</h3>

                      {/* Options rendering with colors */}
                      <div className="space-y-2.5">
                        {q.options.map((option, oIdx) => {
                          const alphabet = ['A', 'B', 'C', 'D'][oIdx]

                          let isUserSelected = false
                          if (q.type === 'multiple') {
                            isUserSelected = ((userAns as number[]) || []).includes(oIdx)
                          } else {
                            isUserSelected = userAns === oIdx
                          }

                          let isOptionCorrect = false
                          if (q.type === 'multiple') {
                            isOptionCorrect = (q.correctIndices || []).includes(oIdx)
                          } else {
                            isOptionCorrect = q.correctIndex === oIdx
                          }

                          return (
                            <div
                              key={oIdx}
                              className={cn(
                                "p-3.5 rounded-xl border flex items-center justify-between text-sm font-semibold",
                                isOptionCorrect
                                  ? "bg-success/5 border-success/40 text-success"
                                  : isUserSelected && !isOptionCorrect
                                    ? "bg-destructive/5 border-destructive/30 text-destructive"
                                    : "bg-slate-50 border-border/40 text-slate-700"
                              )}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className={cn(
                                  "size-6.5 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                                  isOptionCorrect ? "bg-success text-white" : "bg-slate-200 text-slate-700"
                                )}>
                                  {alphabet}
                                </span>
                                <span>{option}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {isUserSelected && (
                                  <Badge className="bg-slate-200/50 text-slate-700 text-sm font-black py-0.5 shadow-none rounded-md border-none">Bài làm của em</Badge>
                                )}
                                {isOptionCorrect ? (
                                  <Check className="size-4 text-success" />
                                ) : isUserSelected ? (
                                  <X className="size-4 text-destructive" />
                                ) : null}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Explanation box */}
                      <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl text-sm leading-relaxed text-slate-700 font-semibold space-y-1">
                        <p className="text-sm font-black text-indigo-600 uppercase">Giải thích chi tiết:</p>
                        <p>{q.explanation}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

      </StateMockWrapper>
    </main>
  )
}
