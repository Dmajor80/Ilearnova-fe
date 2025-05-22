import React, { useState, useEffect } from "react";
import {
  User,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const Exam = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [examStartTime, setExamStartTime] = useState(null);
  const [examResults, setExamResults] = useState(null);

  // Timer effect
  useEffect(() => {
    let timer;
    if (currentView === "exam" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Auto-submit when time runs out
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentView, timeLeft]);

  // Convert seconds to MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Exam questions with correct answers
  const examQuestions = [
    {
      id: 1,
      question: "Solve for x: 4x+2=7",
      options: [
        { label: "A", value: "x = 1.25" },
        { label: "B", value: "x = 2.5" },
        { label: "C", value: "x = 1.5" },
        { label: "D", value: "x = 3" },
        { label: "E", value: "x = 5" },
      ],
      correctAnswer: "A",
    },
    {
      id: 2,
      question: "What is the value of 3² + 4²?",
      options: [
        { label: "A", value: "25" },
        { label: "B", value: "24" },
        { label: "C", value: "49" },
        { label: "D", value: "12" },
        { label: "E", value: "16" },
      ],
      correctAnswer: "A",
    },
    {
      id: 3,
      question: "Simplify: 2(x + 3) - 4x",
      options: [
        { label: "A", value: "-2x + 6" },
        { label: "B", value: "6x + 6" },
        { label: "C", value: "2x - 6" },
        { label: "D", value: "-2x - 6" },
        { label: "E", value: "x + 3" },
      ],
      correctAnswer: "A",
    },
    {
      id: 4,
      question: "If y = 2x + 1, what is y when x = 5?",
      options: [
        { label: "A", value: "10" },
        { label: "B", value: "11" },
        { label: "C", value: "9" },
        { label: "D", value: "12" },
        { label: "E", value: "8" },
      ],
      correctAnswer: "B",
    },
    {
      id: 5,
      question: "What is 15% of 80?",
      options: [
        { label: "A", value: "10" },
        { label: "B", value: "12" },
        { label: "C", value: "15" },
        { label: "D", value: "20" },
        { label: "E", value: "8" },
      ],
      correctAnswer: "B",
    },
  ];

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestion < examQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    examQuestions.forEach((question) => {
      const userAnswer = answers[question.id];
      if (!userAnswer) {
        skipped++;
      } else if (userAnswer === question.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const totalQuestions = examQuestions.length;
    const percentage = Math.round((correct / totalQuestions) * 100);
    const timeSpent = 3600 - timeLeft; // Time spent in seconds

    return {
      correct,
      incorrect,
      skipped,
      totalQuestions,
      percentage,
      timeSpent: formatTime(timeSpent),
      passed: percentage >= 60, // Assuming 60% is passing grade
    };
  };

  const handleFinishExam = () => {
    const results = calculateResults();
    setExamResults(results);
    setCurrentView("results");
  };

  const completedTasks = [
    {
      title: "Mathematics First Exam",
      description: "Description here: Scheduled on May 5, 2024",
      date: "Date: May 05, 2024",
      actions: ["View Results", "Reschedule"],
    },
    {
      title: "English Continuous Assessment",
      description: "Description here: Scheduled on May 7, 2024",
      date: "Date: May 07, 2024",
      actions: ["View Results", "Retake"],
    },
    {
      title: "Science Weekly Quiz",
      description: "Description here: Scheduled on May 10, 2024",
      date: "Date: May 10, 2024",
      actions: ["View Results"],
    },
  ];

  const activeTasks = [
    {
      title: "Mathematics Continuous Assessment",
      description: "Status: In progress",
      date: "Due: May 15, 2024",
      time: "Time: 10:00 AM - 12:00 PM",
      action: "Start Work",
      canStart: true,
    },
    {
      title: "Physics Weekly Quiz",
      description: "Status: Not started",
      date: "Due: May 18, 2024",
      time: "Time: 2:00 PM - 3:30 PM",
      action: "View Details",
      canStart: false,
    },
    {
      title: "History Midterm Test",
      description: "Status: Pending",
      date: "Due: May 20, 2024",
      time: "Time: 9:00 AM - 11:00 AM",
      action: "Request Reschedule",
      canStart: false,
    },
  ];

  const handleButtonClick = (task) => {
    if (task.canStart && task.action === "Start Work") {
      setCurrentView("exam");
      setExamStartTime(Date.now());
      setTimeLeft(3600); // Reset timer
      setAnswers({}); // Reset answers
      setCurrentQuestion(0); // Reset to first question
    }
  };

  // Results View
  if (currentView === "results") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setCurrentView("dashboard")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>

          {/* Test Summary Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-800 mb-1">
                  Test Summary
                </h1>
                <p className="text-sm text-gray-600">
                  Mathematics Continuous Assessment
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{examResults?.timeSpent}</span>
              </div>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {/* Total Score */}
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {examResults?.percentage}
                </div>
                <div className="text-sm text-gray-600">Total Score</div>
              </div>

              {/* Correct Answers */}
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">
                    {examResults?.correct}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Answered Correctly</div>
              </div>

              {/* Incorrect Answers */}
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-2xl font-bold text-red-600">
                    {examResults?.incorrect}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Answered Incorrectly
                </div>
              </div>

              {/* Skipped Questions */}
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="text-2xl font-bold text-yellow-600">
                    {examResults?.skipped}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Skipped Questions</div>
              </div>
            </div>

            {/* Pass/Fail Status */}
            <div
              className={`text-center p-4 rounded-lg ${
                examResults?.passed
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <div className="font-semibold text-lg">
                {examResults?.passed
                  ? "🎉 Congratulations! You Passed!"
                  : "😔 You Need More Practice"}
              </div>
              <div className="text-sm mt-1">
                You scored {examResults?.percentage}% ({examResults?.correct}{" "}
                out of {examResults?.totalQuestions} questions)
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={() => setCurrentView("review")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
              >
                Review All Questions
              </button>
              <button
                onClick={() => setCurrentView("dashboard")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded font-medium"
              >
                Back to Tests
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Review View
  if (currentView === "review") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setCurrentView("results")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Results
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              Review Questions
            </h1>
          </div>

          {/* Questions Review */}
          <div className="space-y-6">
            {examQuestions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              const isSkipped = !userAnswer;

              return (
                <div
                  key={question.id}
                  className="bg-white rounded-lg border p-6"
                >
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className="mt-1">
                      {isSkipped ? (
                        <AlertCircle className="w-6 h-6 text-yellow-500" />
                      ) : isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-2">
                        Question {index + 1}: {question.question}
                      </h3>

                      <div className="space-y-2 mb-4">
                        {question.options.map((option) => {
                          const isUserAnswer = userAnswer === option.label;
                          const isCorrectAnswer =
                            option.label === question.correctAnswer;

                          return (
                            <div
                              key={option.label}
                              className={`p-3 rounded border ${
                                isCorrectAnswer
                                  ? "bg-green-50 border-green-200"
                                  : isUserAnswer
                                  ? "bg-red-50 border-red-200"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-medium">
                                  {option.label}.
                                </span>
                                <span>{option.value}</span>
                                {isCorrectAnswer && (
                                  <span className="text-green-600 text-sm font-medium">
                                    ✓ Correct
                                  </span>
                                )}
                                {isUserAnswer && !isCorrectAnswer && (
                                  <span className="text-red-600 text-sm font-medium">
                                    ✗ Your Answer
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-sm">
                        <span
                          className={`font-medium ${
                            isSkipped
                              ? "text-yellow-600"
                              : isCorrect
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {isSkipped
                            ? "Skipped"
                            : isCorrect
                            ? "Correct"
                            : "Incorrect"}
                        </span>
                        {!isSkipped && (
                          <span className="text-gray-600 ml-2">
                            Your answer: {userAnswer} | Correct answer:{" "}
                            {question.correctAnswer}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Exam View
  if (currentView === "exam") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Exam Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Mathematics Final Exams
              </h1>
              <p className="text-sm text-gray-600">SS3-01</p>
            </div>
            <div className="flex items-center gap-4">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  timeLeft <= 300
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {formatTime(timeLeft)}
              </div>
              <span className="text-sm text-gray-600">Left</span>
              <span className="text-sm text-blue-600 cursor-pointer">
                Mark as review
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Instructions</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• You have 60 minutes to complete this test</li>
              <li>• Answer all questions</li>
              <li>• Choose the best answer for each question</li>
            </ul>
          </div>

          {/* Question */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium text-gray-800 mb-4">
              Question {currentQuestion + 1} of {examQuestions.length}
            </h3>
            <p className="text-gray-700 mb-6">
              {examQuestions[currentQuestion].question}
            </p>

            <div className="space-y-3">
              {examQuestions[currentQuestion].options.map((option) => (
                <label
                  key={option.label}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`question${examQuestions[currentQuestion].id}`}
                    value={option.label}
                    className="w-4 h-4 text-blue-600"
                    checked={
                      answers[examQuestions[currentQuestion].id] ===
                      option.label
                    }
                    onChange={() =>
                      handleAnswerSelect(
                        examQuestions[currentQuestion].id,
                        option.label
                      )
                    }
                  />
                  <span className="font-medium">{option.label}.</span>
                  <span>{option.value}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded font-medium ${
                currentQuestion === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="text-sm text-gray-600">
              {currentQuestion + 1} of {examQuestions.length}
            </div>

            <div className="flex gap-3">
              {currentQuestion < examQuestions.length - 1 ? (
                <button
                  onClick={goToNextQuestion}
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-4 py-2 rounded font-medium"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleFinishExam}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
                >
                  Finish Exam
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Welcome Priscilla,
            </h1>
            <p className="text-gray-600 text-sm">
              Here's what's happening with your progress
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Notifications</span>
            <User className="w-8 h-8 bg-orange-400 text-white rounded-full p-1" />
          </div>
        </div>

        {/* Completed Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Completed
          </h2>

          <div className="space-y-4">
            {completedTasks.map((task, index) => (
              <div
                key={index}
                className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 mb-1">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {task.description}
                  </p>
                  <p className="text-sm text-gray-500">{task.date}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  {task.actions.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Task Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Active Task
          </h2>

          <div className="space-y-4">
            {activeTasks.map((task, index) => (
              <div
                key={index}
                className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 mb-1">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {task.description}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">{task.date}</p>
                  <p className="text-sm text-gray-500">{task.time}</p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => handleButtonClick(task)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
                  >
                    {task.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
