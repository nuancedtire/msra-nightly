// components/RankingQuestion.tsx

import { useState } from "react";
import { useTheme } from "nextra-theme-docs";
import { Info } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface Option {
  id: string;
  text: string;
  principle: string;
}

interface RankingQuestionProps {
  question: string;             // The main question text
  options: Option[];             // List of answer options
  correctOrder: string[];        // Expected correct order for validation
  hints: string[];               // List of hints for the user to improve their answer
  correctExplanation: string;    // Explanation displayed when user gets correct order
  onAnswer?: () => void;         // Optional callback executed on correct answer
}

const RankingQuestion = ({
  question,
  options,
  correctOrder,
  hints,
  correctExplanation,
  onAnswer,
}: RankingQuestionProps) => {

  // State variables to manage user interactions and feedback
  const [userOrder, setUserOrder] = useState<Option[]>(options);  // Tracks user's current answer order
  const [submitted, setSubmitted] = useState(false);              // Tracks if answer is submitted
  const [isCorrectOrder, setIsCorrectOrder] = useState(false);    // Indicates if user's order matches the correct one
  const [expandedOption, setExpandedOption] = useState<string | null>(null); // Stores option ID for showing extra info
  const [score, setScore] = useState<number>(0);                  // Tracks user's score based on answer accuracy

  // Theme and responsive detection
  const { resolvedTheme } = useTheme();                           // Detects if current theme is dark or light
  const isDark = resolvedTheme === "dark";                        // Boolean for conditional styling in dark theme
  const isMobile = useMediaQuery("(max-width: 768px)");           // Responsive check for mobile view

  // Calculates the maximum achievable score based on the number of options
  const maxScore = (options.length - 1) * options.length;

  // Animation variants for progress bar to reflect score dynamically
  const progressVariants = {
    initial: { width: 0 },                                        // Starting width of progress bar
    animate: (currentScore: number) => ({                         // Animates width based on current score
      width: `${(currentScore / maxScore) * 100}%`,               // Calculated percentage of maxScore
      transition: { duration: 1 },
    }),
  };

  // Resets the question state, preparing for a new attempt
  const resetQuestion = () => {
    setUserOrder(options);                                        // Reset user answer order
    setSubmitted(false);                                          // Set submission state to false
    setIsCorrectOrder(false);                                     // Reset order correctness
    setExpandedOption(null);                                      // Close any expanded info
    setScore(0);                                                  // Reset score to 0
  };

  // Updates userOrder based on drag-and-drop reordering, if not yet submitted
  const handleReorder = (newOrder: Option[]) => {
    if (!submitted) {                                             // Prevents reorder after submission
      setUserOrder(newOrder);                                     // Sets user answer order to new arrangement
    }
  };

  // Returns CSS classes for styling options based on theme and correctness after submission
  const getOptionStyle = (index: number) => {
    if (submitted) {
      const isOptionCorrect = userOrder[index].id === correctOrder[index]; // Checks if user's answer matches correct order
      if (isDark) {                                               // Applies conditional styling based on theme and correctness
        return isOptionCorrect
          ? "bg-green-700/10 border-green-800/50 text-green-200"
          : "bg-red-900/30 border-red-800/50 text-red-200";
      }
      return isOptionCorrect
        ? "bg-green-100 border-green-300 text-green-800"
        : "bg-red-100 border-red-300 text-red-800";
    }
    return isDark                                                 // Default styling before submission
      ? "bg-neutral-900 border-neutral-700 text-neutral-200 hover:bg-neutral-800/50"
      : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50";
  };

  // Handles answer submission and score calculation
  const handleSubmit = () => {
    const userOrderIds = userOrder.map((option) => option.id);    // Maps userOrder to array of IDs
    const isAnswerCorrect = JSON.stringify(userOrderIds) === JSON.stringify(correctOrder); // Checks for exact match with correctOrder
    setIsCorrectOrder(isAnswerCorrect);                           // Sets correct order state based on match result
    setSubmitted(true);                                           // Marks submission as true

    // Score calculation based on difference in position for each item
    let totalScore = 0;
    userOrder.forEach((option, index) => {
      const correctIndex = correctOrder.indexOf(option.id);       // Finds correct index for current option
      const difference = Math.abs(correctIndex - index);          // Calculates distance from correct position
      totalScore += (options.length - 1) - difference;            // Scores higher for positions closer to correct
    });
    setScore(totalScore);                                         // Sets score based on totalScore

    if (isAnswerCorrect) {                                        // Executes callback if answer is correct
      onAnswer?.();
    }
  };

  // Renders an information button for each option, displaying additional details on hover
  const renderInfoButton = (option: Option) => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button 
          className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
          onClick={(e) => e.preventDefault()}                     // Prevents click default behavior
        >
          <Info size={16} className="text-gray-500 dark:text-gray-400" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <p className="text-base leading-relaxed">{option.principle}</p>
      </HoverCardContent>
    </HoverCard>
  ); // Displays principle text for context
  // Renders the question and options, including drag-and-drop reordering and feedback
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}                             // Initial animation state
      animate={{ opacity: 1, y: 0 }}                              // Target animation state on mount
      className={`mt-4 p-3 border rounded-xl ${
        isDark
          ? "bg-neutral-950 border-neutral-800"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <h3 className={`text-base font-medium mb-2 ${isDark ? "text-neutral-200" : "text-gray-800"}`}>
        {question}
      </h3>

      <Reorder.Group
        axis="y"                                                   // Enables vertical drag-and-drop
        values={userOrder}                                         // Ordered list of options
        onReorder={handleReorder}                                  // Handler for updating order on drag
        className="space-y-2"
      >
        {userOrder.map((option, index) => (
          <Reorder.Item
            key={option.id}
            value={option}
            className={`
              py-2 px-3 border rounded-lg flex items-center justify-between
              ${getOptionStyle(index)}
              transition-colors duration-200
            `}                                                    // Dynamically applies option style based on state
            dragListener={!submitted}                             // Disables drag after submission
          >
            <span className="font-medium ml-1 mr-1">{option.id}.</span>
            <span className="flex-1">{option.text}</span>
            {renderInfoButton(option)}                            
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Action buttons */}
      <div className="mt-3">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-lg font-medium ${
              isDark
                ? "bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30"
                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            }`}
          >
            Submit
          </button>
        ) : (
          <button
            onClick={resetQuestion}
            className={`px-4 py-2 rounded-lg font-medium ${
              isCorrectOrder
                ? isDark
                  ? "bg-green-500/20 text-green-200 hover:bg-green-500/30"
                  : "bg-green-100 text-green-600 hover:bg-green-200"
                : isDark
                ? "bg-red-500/20 text-red-200 hover:bg-red-500/30"
                : "bg-red-50 text-red-600 hover:bg-red-100"
            }`}
          >
            Try Again
          </button>
        )}
      </div>

      {/* Feedback section */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-3"
          >
            <div className="mb-4">
              <div className={`w-full h-2 rounded-full ${isDark ? "bg-neutral-800" : "bg-gray-200"}`}>
                <motion.div
                  className={`h-full rounded-full ${
                    isCorrectOrder ? "bg-green-500" : "bg-blue-400"
                  }`}
                  variants={progressVariants}
                  initial="initial"
                  animate="animate"
                  custom={score}
                />
              </div>
              <div className="mt-2 text-sm text-center">
                <span className={isDark ? "text-blue-400" : "text-blue-700"}>
                  {isCorrectOrder
                    ? "Perfect score!"                        // Displays message based on correctness
                    : `Score: ${score}/${maxScore}`}
                </span>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg ${
                isCorrectOrder
                  ? isDark
                    ? "bg-green-900/30 text-green-200"
                    : "bg-green-100 text-green-800"
                  : isDark
                  ? "bg-amber-900/30 text-amber-200"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {isCorrectOrder ? (
                <p className="text-sm">{correctExplanation}</p>  // Displays correct explanation if answer is right
              ) : (
                <ul className="list-disc list-inside text-sm space-y-1">
                  {hints.map((hint, index) => (
                    <li key={index}>{hint}</li>                  // Shows hints for improvement if answer is incorrect
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RankingQuestion;
