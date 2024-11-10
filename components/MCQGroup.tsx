import { useState } from 'react'
import { useTheme } from 'nextra-theme-docs'
import MCQ from './MCQ'

interface MCQItem {
  question: string
  options: string[]
  correctAnswer: number
  correctFeedback: string
  incorrectFeedback: string
}

interface MCQGroupProps {
  questions: MCQItem[]
}

const MCQGroup = ({ questions }: MCQGroupProps) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [answeredCount, setAnsweredCount] = useState(0)

  const styles = {
    container: `mt-12 space-y-8`,
    header: `mb-8`,
    progress: `
      text-sm 
      font-medium
      ${isDark ? 'text-gray-400' : 'text-gray-500'}
    `,
    progressBar: `
      mt-3
      w-full 
      h-1.5 
      rounded-full 
      overflow-hidden
      ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
    `,
    progressFill: `
      h-full 
      rounded-full 
      transition-all 
      duration-300
      ${isDark ? 'bg-blue-500' : 'bg-blue-600'}
    `
  }

  const handleQuestionAnswered = () => {
    setAnsweredCount(prev => prev + 1)
  }

  const progress = (answeredCount / questions.length) * 100

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.progress}>
          {answeredCount} of {questions.length} questions completed
        </p>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-6">
        {questions.map((question, index) => (
          <MCQ
            key={index}
            {...question}
            questionNumber={index + 1}
            onAnswer={handleQuestionAnswered}
          />
        ))}
      </div>
    </div>
  )
}

export default MCQGroup