import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from './Icons.tsx';

interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

const questions: Question[] = [
  {
    question: "Which processing unit is best suited for handling thousands of similar, parallel tasks?",
    options: ["CPU", "GPU", "RAM", "SSD"],
    correctAnswerIndex: 1,
    explanation: "GPUs are designed with thousands of cores, making them highly efficient at parallel processing, which is common in machine learning.",
  },
  {
    question: "In our simulation, what does a long task queue typically indicate?",
    options: ["Efficient processing", "A system bottleneck", "Low number of tasks", "Idle processors"],
    correctAnswerIndex: 1,
    explanation: "A long queue means tasks are arriving faster than they can be processed, indicating a bottleneck where the processing capacity is insufficient for the workload.",
  },
  {
    question: "Why would a CPU be faster than a GPU for certain types of tasks?",
    options: ["It has more cores", "It runs at a lower temperature", "It excels at complex, sequential tasks", "It uses less power"],
    correctAnswerIndex: 2,
    explanation: "CPUs have a few, very powerful cores that are optimized for high-speed execution of single-threaded, sequential tasks. GPUs are for parallel, not necessarily complex, tasks.",
  },
];

const Assessment: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const question = questions[currentQuestionIndex];

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (index === question.correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg text-center border border-gray-200 dark:border-slate-700 shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Quiz Completed!</h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 mb-6">Your score: <span className="font-bold text-blue-600 dark:text-blue-500">{score}</span> out of <span className="font-bold text-blue-600 dark:text-blue-500">{questions.length}</span></p>
            <button
                onClick={handleReset}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
                Try Again
            </button>
        </div>
    );
  }

  return (
    <section id="assessment" className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-lg border border-gray-200 dark:border-slate-700 shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-slate-900 dark:text-slate-100">Test Your Knowledge</h2>
      <div className="max-w-2xl mx-auto">
        <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">{currentQuestionIndex + 1}. {question.question}</p>
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isCorrect = index === question.correctAnswerIndex;
            const isSelected = selectedAnswer === index;
            let buttonClass = 'bg-white hover:bg-gray-100 border border-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-600';
            if (showFeedback) {
              if (isCorrect) buttonClass = 'bg-green-500 text-white border-green-500';
              else if (isSelected) buttonClass = 'bg-red-500 text-white border-red-500';
              else buttonClass = 'bg-gray-100 opacity-70 border-gray-200 dark:bg-slate-700/50 dark:border-slate-700';
            }
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-md transition-all duration-200 flex items-center justify-between ${buttonClass}`}
              >
                <span>{option}</span>
                {showFeedback && isSelected && (isCorrect ? <CheckCircleIcon className="w-6 h-6 text-white"/> : <XCircleIcon className="w-6 h-6 text-white"/>)}
              </button>
            );
          })}
        </div>
        {showFeedback && (
          <div className="mt-6 animate-fade-in">
            <div className="p-4 bg-blue-50 dark:bg-slate-900/50 rounded-md border border-blue-200 dark:border-blue-900">
              <p className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Explanation:</p>
              <p className="text-blue-700 dark:text-blue-400">{question.explanation}</p>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Assessment;