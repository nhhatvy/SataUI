import { ParentSurvey } from '@/features/parent/survey/parent-survey'

interface PageProps {
  params: Promise<{ surveyId: string }>
}

export default async function SurveyIdPage({ params }: PageProps) {
  const { surveyId } = await params
  return <ParentSurvey defaultSurveyId={surveyId} />
}
