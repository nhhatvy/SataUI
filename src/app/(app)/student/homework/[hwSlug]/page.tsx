import { StudentAssignments } from '@/features/student/assignments/student-assignments'

interface PageProps {
  params: Promise<{ hwSlug: string }>
}

export default async function HomeworkAssignmentPage({ params }: PageProps) {
  const { hwSlug } = await params
  return (
    <StudentAssignments
      initialViewState="quiz"
      initialAssignmentId={hwSlug}
    />
  )
}
