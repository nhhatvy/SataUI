import { StudentAssignments } from '@/features/student/assignments/student-assignments'

interface PageProps {
  params: Promise<{ hwSlug: string }>
}

export default async function HomeworkResultPage({ params }: PageProps) {
  const { hwSlug } = await params
  return (
    <StudentAssignments
      initialViewState="result"
      initialAssignmentId={hwSlug}
    />
  )
}
