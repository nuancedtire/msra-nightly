import { useTheme } from 'nextra-theme-docs'
import { useState, useEffect } from 'react'

interface MCQProps {
  question: string
  options: string[]
  correctAnswer: number
  correctFeedback: string
  incorrectFeedback: string
  onAnswer?: () => void
  questionNumber: number
}

const MCQ = ({ 
  question, 
  options, 
  correctAnswer, 
  correctFeedback, 
  incorrectFeedback, 
  onAnswer,
  questionNumber 
}: MCQProps) => {
  const { resolvedTheme, theme } = useTheme()
  const [isDark, setIsDark] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState(false)

  useEffect(() => {
    // Update isDark when theme changes or on initial load
    setIsDark(resolvedTheme === 'dark' || theme === 'dark')
  }, [resolvedTheme, theme])

  const styles = {
    container: `
      w-full
      p-6 
      rounded-xl
      border
      transition-all
      duration-200
      ${isDark 
        ? 'bg-neutral-950 border-neutral-800 hover:border-neutral-700' 
        : 'bg-gray-50 border-gray-200 hover:border-gray-300'}
    `,
    questionNumber: `
      text-sm 
      font-medium 
      mb-2
      ${isDark ? 'text-neutral-400' : 'text-gray-600'}
    `,
    question: `
      text-base 
      font-medium 
      mb-4 
      ${isDark ? 'text-neutral-200' : 'text-gray-800'}
    `,
    option: `
      p-4 
      rounded-lg 
      cursor-pointer 
      text-sm
      font-medium
      transition-all
      duration-200
    `,
    feedback: `
      mt-4 
      p-4 
      rounded-lg 
      text-sm
      animate-fadeIn
      font-medium
    `
  }

  const getOptionStyle = (index: number) => {
    // If this option is the correct one and user got it right
    if (isCorrect && index === correctAnswer) {
      return `${styles.option} ${isDark 
        ? 'bg-green-900/30 text-green-200 border border-green-800/50' 
        : 'bg-green-100 text-green-800 border border-green-300'}`
    }

    // For the selected option
    if (selectedAnswer === index) {
      return `${styles.option} ${isDark 
        ? 'bg-neutral-900 text-neutral-200 border border-neutral-700' 
        : 'bg-gray-100 text-gray-800 border border-gray-300'}`
    }

    // Default state
    return `${styles.option} ${isDark 
      ? 'bg-neutral-950 hover:bg-neutral-900 text-neutral-300 border border-neutral-800' 
      : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'}`
  }

  const getFeedbackStyle = () => {
    if (isCorrect) {
      return isDark 
        ? 'bg-green-900/20 border border-green-800/50 text-green-200' 
        : 'bg-green-100 border border-green-300 text-green-800'
    }
    return isDark 
      ? 'bg-neutral-800 border border-neutral-700 text-neutral-200' 
      : 'bg-gray-100 border border-gray-300 text-gray-700'
  }

  const handleOptionClick = (index: number) => {
    if (isCorrect) return
    
    setSelectedAnswer(index)
    if (index === correctAnswer) {
      setIsCorrect(true)
      onAnswer?.()
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.questionNumber}>Question {questionNumber}</div>
      <h3 className={styles.question}>{question}</h3>
      <div className="flex flex-col gap-3">
        {options.map((option, index) => (
          <div
            key={index}
            className={getOptionStyle(index)}
            onClick={() => handleOptionClick(index)}
          >
            {option}
          </div>
        ))}
      </div>
      {(selectedAnswer !== null && !isCorrect || isCorrect) && (
        <div className={`${styles.feedback} ${getFeedbackStyle()}`}>
          {isCorrect ? correctFeedback : incorrectFeedback}
        </div>
      )}
    </div>
  )
}

export default MCQ