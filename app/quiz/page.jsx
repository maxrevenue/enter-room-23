import QuizClient from './quiz-client'

export const metadata = {
  title: 'Find Your Piece - Product Match Quiz',
  description:
    'Answer one considered question to match a Room 23 essential: lubricant, delay spray, body oil, or the Hello Cake stroker. 18+ only.',
  alternates: { canonical: '/quiz' },
}

export default function QuizPage() {
  return <QuizClient />
}
