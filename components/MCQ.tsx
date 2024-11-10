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
        ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700' 
        : 'bg-white border-gray-200 hover:border-gray-300'}
    `,
    questionNumber: `
      text-sm 
      font-medium 
      mb-2
      ${isDark ? 'text-gray-400' : 'text-gray-500'}
    `,
    question: `
      text-base 
      font-medium 
      mb-4 
      ${isDark ? 'text-gray-100' : 'text-gray-900'}
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
        ? 'bg-green-500/20 text-green-200 border border-green-800' 
        : 'bg-green-50 text-green-700 border border-green-200'}`
    }

    // For the selected option
    if (selectedAnswer === index) {
      return `${styles.option} ${isDark 
        ? 'bg-blue-500/20 text-blue-200 border border-blue-800' 
        : 'bg-blue-50 text-blue-700 border border-blue-200'}`
    }

    // Default state
    return `${styles.option} ${isDark 
      ? 'bg-gray-800 hover:bg-gray-800/80 text-gray-200 border border-gray-700' 
      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'}`
  }

  const getFeedbackStyle = () => {
    if (isCorrect) {
      return isDark 
        ? 'bg-green-500/10 border border-green-800/50 text-green-200' 
        : 'bg-green-50 border border-green-200 text-green-700'
    }
    return isDark 
      ? 'bg-blue-500/10 border border-blue-800/50 text-blue-200' 
      : 'bg-blue-50 border border-blue-200 text-blue-700'
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