// components/RankingQuestion.tsx
import { useState, useEffect } from "react";
import { useTheme } from "nextra-theme-docs";
import { Info, GripVertical } from "lucide-react";
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
  question: string;
  options: Option[];
  correctOrder: string[];
  hints: string[];
  correctExplanation: string;
  onAnswer?: () => void;
}

const RankingQuestion = ({
  question,
  options,
  correctOrder,
  hints,
  correctExplanation,
  onAnswer,
}: RankingQuestionProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [userOrder, setUserOrder] = useState<Option[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrectOrder, setIsCorrectOrder] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [expandedOption, setExpandedOption] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [maxScore, setMaxScore] = useState<number>(0);

  const maxPointsPerOption = options.length - 1; // For 5 options, max points per option is 4

  useEffect(() => {
    setUserOrder(options);

    // Calculate maximum possible score
    const totalMaxScore = options.length * maxPointsPerOption;
    setMaxScore(totalMaxScore);
  }, [options, maxPointsPerOption]);

  const resetQuestion = () => {
    setUserOrder(options);
    setSubmitted(false);
    setIsCorrectOrder(false);
    setShowHints(false);
    setExpandedOption(null);
    setScore(null);
  };

  const handleReorder = (newOrder: Option[]) => {
    if (!submitted) {
      setUserOrder(newOrder);
    }
  };

  const getOptionStyle = (index: number) => {
    if (submitted) {
      const isOptionCorrect = userOrder[index].id === correctOrder[index];
      if (isDark) {
        return isOptionCorrect
          ? "bg-green-700/10 border-green-800/50 text-green-200"
          : "bg-red-900/30 border-red-800/50 text-red-200";
      }
      return isOptionCorrect
        ? "bg-green-100 border-green-300 text-green-800"
        : "bg-red-100 border-red-300 text-red-800";
    }
    return isDark
      ? "bg-neutral-900 border-neutral-700 text-neutral-200 hover:bg-neutral-800/50 cursor-grab active:cursor-grabbing"
      : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50 cursor-grab active:cursor-grabbing";
  };

  const handleSubmit = () => {
    const userOrderIds = userOrder.map((option) => option.id);
    const isAnswerCorrect =
      JSON.stringify(userOrderIds) === JSON.stringify(correctOrder);
    setIsCorrectOrder(isAnswerCorrect);
    setSubmitted(true);

    // Calculate the score
    let totalScore = 0;
    userOrder.forEach((option, index) => {
      const optionId = option.id;
      const correctIndex = correctOrder.indexOf(optionId);
      const difference = Math.abs(correctIndex - index);
      const optionScore = maxPointsPerOption - difference;
      totalScore += optionScore;
    });
    setScore(totalScore);

    if (isAnswerCorrect) {
      onAnswer?.();
    } else {
      setShowHints(true);
    }
  };

  const handlePrincipleClick = (principle: string) => {
    if (isMobile) {
      setExpandedOption(expandedOption === principle ? null : principle);
    }
  };

  // Progress bar animation variants
  const progressVariants = {
    initial: { width: 0 },
    animate: (score: number) => ({
      width: `${(score / maxScore) * 100}%`,
      transition: { duration: 1 },
    }),
    reset: { width: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-4 p-3 border rounded-xl transition-all duration-200 ${
        isDark
          ? "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
          : "bg-gray-50 border-gray-200 hover:border-gray-300"
      }`}
    >
      <h3
        className={`text-base font-medium mb-2 ${
          isDark ? "text-neutral-200" : "text-gray-800"
        }`}
      >
        {question}
      </h3>

      <Reorder.Group
        axis="y"
        values={userOrder}
        onReorder={handleReorder}
        className="space-y-2"
      >
        <AnimatePresence>
          {userOrder.map((option, index) => (
            <div key={option.id}>
              <Reorder.Item
                value={option}
                style={{ 
                  pointerEvents: submitted ? 'none' : 'auto',
                  opacity: submitted ? 0.7 : 1
                }}
                whileDrag={{
                  scale: 1.02,
                  boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`
                  relative py-2 px-3 border rounded-lg flex items-center justify-between
                  ${getOptionStyle(index)}
                  transition-colors duration-200
                `}
              >
                <span className="font-medium ml-1 mr-1 flex-shrink-0">{option.id}. 
                </span>
                <span className="flex-1">{option.text}</span>
                <div className="flex items-center space-x-2">
                {!submitted && (
                <GripVertical
                  size={16}
                  className="text-gray-400 dark:text-gray-600 flex-shrink-0"
                />
                )}
                  {submitted && (
                    isMobile ? (
                      <button
                        onClick={() => handlePrincipleClick(option.principle)}
                        className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        <Info size={16} className="text-gray-500 dark:text-gray-400" />
                      </button>
                    ) : (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <button className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                            <Info size={16} className="text-gray-500 dark:text-gray-400" />
                          </button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <p className="text-base leading-relaxed">{option.principle}</p>
                        </HoverCardContent>
                      </HoverCard>
                    )
                  )}
                </div>
              </Reorder.Item>
              {isMobile && expandedOption === option.principle && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mt-1 mb-2 p-3 rounded-sm ${
                    isDark
                      ? "bg-neutral-800 text-neutral-200"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <p className="text-sm">{option.principle}</p>
                </motion.div>
              )}
            </div>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      <div className="mt-3 space-x-2">
        {!submitted ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isDark
                ? "bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30"
                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            }`}
          >
            Submit
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetQuestion}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
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
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-3"
          >
            {/* Progress Bar */}
            <div className="mb-4">
              <div
                className={`w-full h-2 rounded-full overflow-hidden ${
                  isDark ? "bg-neutral-800" : "bg-gray-200"
                }`}
              >
                <motion.div
                  className={`h-full rounded-full ${
                    isCorrectOrder
                      ? isDark
                        ? "bg-green-500"
                        : "bg-green-500"
                      : isDark
                      ? "bg-blue-400/80"
                      : "bg-blue-400"
                  }`}
                  variants={progressVariants}
                  initial="initial"
                  animate="animate"
                  custom={score || 0}
                />
              </div>
              <div className="mt-2 text-sm text-center">
                {isCorrectOrder ? (
                  <span
                    className={`font-medium ${
                      isDark ? "text-green-400" : "text-green-700"
                    }`}
                  >
                    Excellent! You achieved the maximum score.
                  </span>
                ) : (
                  <span
                    className={`font-medium ${
                      isDark ? "text-blue-400" : "text-blue-700"
                    }`}
                  >
                    Your score: {score} / {maxScore}
                  </span>
                )}
              </div>
            </div>

            {/* Feedback */}
            {isCorrectOrder ? (
              <div
                className={`p-3 rounded-lg ${
                  isDark
                    ? "bg-green-900/30 text-green-200"
                    : "bg-green-100 text-green-800"
                }`}
              >
                <p className="text-sm">{correctExplanation}</p>
              </div>
            ) : (
              <div
                className={`p-3 rounded-lg ${
                  isDark
                    ? "bg-amber-900/30 text-amber-200"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                <p className="text-sm font-medium mb-2">Hints:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RankingQuestion;
