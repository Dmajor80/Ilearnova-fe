import React, { useState, useEffect } from "react";
import {
  User,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { getStudentExams } from "../../api/dashboardApi";

// Sample exam data with realistic educational content
const SAMPLE_EXAMS = [
  {
    id: 1,
    graded_at: "2024-01-15T10:00:00Z",
    score: 85,
    exam: {
      name: "Mathematics Mid-Term Exam",
      course: { name: "Advanced Mathematics", id: 1 },
      class: { name: "Grade 12", id: 12 },
      scheduled_date: "2024-01-15",
      scheduled_time: "09:00 AM"
    }
  },
  {
    id: 2,
    graded_at: "2024-01-10T14:30:00Z",
    score: 92,
    exam: {
      name: "Physics Final Assessment",
      course: { name: "Physics Fundamentals", id: 2 },
      class: { name: "Grade 11", id: 11 },
      scheduled_date: "2024-01-10",
      scheduled_time: "02:00 PM"
    }
  },
  {
    id: 3,
    graded_at: "2024-02-01T11:15:00Z",
    score: 78,
    exam: {
      name: "English Literature Quiz",
      course: { name: "English Literature", id: 3 },
      class: { name: "Grade 10", id: 10 },
      scheduled_date: "2024-02-01",
      scheduled_time: "10:30 AM"
    }
  },
  {
    id: 4,
    graded_at: null, // Not graded yet - active
    score: null,
    exam: {
      name: "Chemistry Lab Practical",
      course: { name: "Chemistry Lab Techniques", id: 4 },
      class: { name: "Grade 12", id: 12 },
      scheduled_date: "2024-03-01",
      scheduled_time: "01:00 PM"
    }
  },
  {
    id: 5,
    graded_at: null, // Not graded yet - active
    score: null,
    exam: {
      name: "World History Final Exam",
      course: { name: "World History", id: 5 },
      class: { name: "Grade 9", id: 9 },
      scheduled_date: "2024-02-20",
      scheduled_time: "09:00 AM"
    }
  },
  {
    id: 6,
    graded_at: "2023-12-15T16:00:00Z",
    score: 88,
    exam: {
      name: "Computer Science Project",
      course: { name: "Computer Science Fundamentals", id: 6 },
      class: { name: "Grade 11", id: 11 },
      scheduled_date: "2023-12-15",
      scheduled_time: "03:00 PM"
    }
  }
];

const Exam = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [examStartTime, setExamStartTime] = useState(null);
  const [examResults, setExamResults] = useState(null);

  // API state
  const [examData, setExamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch exam data on component mount
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);
        const response = await getStudentExams();
        // Use API data if available, otherwise fall back to sample data
        const apiExams = response.data?.exams || response.data?.exam_results || [];
        const examsToUse = apiExams.length > 0 ? apiExams : SAMPLE_EXAMS;
        setExamData(examsToUse);
        setError(null);
      } catch (err) {
        console.error('Error fetching exam data:', err);
        // Fall back to sample data on error
        setExamData(SAMPLE_EXAMS);
        setError(null); // Don't show error since we have fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, []);

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

  // Transform API data to match UI format
  const completedTasks = examData
    .filter(exam => exam.graded_at) // Only show graded exams
    .map(exam => ({
      title: exam.exam?.name || 'Exam',
      description: `Course: ${exam.exam?.course?.name || 'N/A'} | Class: ${exam.exam?.class?.name || 'N/A'}`,
      date: `Graded: ${new Date(exam.graded_at).toLocaleDateString()}`,
      actions: ["View Results"],
      score: exam.score,
      examId: exam.id
    }));

  const activeTasks = examData
    .filter(exam => !exam.graded_at) // Show ungraded exams as active
    .map(exam => ({
      title: exam.exam?.name || 'Exam',
      description: `Course: ${exam.exam?.course?.name || 'N/A'} | Class: ${exam.exam?.class?.name || 'N/A'}`,
      date: `Due: ${exam.exam?.scheduled_date ? new Date(exam.exam.scheduled_date).toLocaleDateString() : 'TBD'}`,
      time: exam.exam?.scheduled_time || 'TBD',
      action: "Start Work",
      canStart: true,
      examId: exam.id
    }));

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
        <div className=" mx-auto">
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
        <div className="w-full">
          {/* Exam Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1
                className="text-[10px]  sm:text-[12px] md:text-[14px] lg:text-[25px] font-semibold text-gray-800"
                style={{ color: "rgba(18, 40, 164, 1)" }}
              >
                Mathematics Final Exams
              </h1>
              <p className="text-sm " style={{ color: "rgba(51, 51, 51, 1)" }}>
                Section 1
              </p>
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

              <span className="text-[10px] sm:text-[12px] lg:text-[14px] text-blue-600 cursor-pointer">
                Mark as review
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className=" font-medium mb-3 text-[18px]">Instructions</h3>
            <ul className="text-sm text-gray-500 space-y-1">
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
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-medium  ${
                currentQuestion === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
              style={{ backgroundColor: "rgba(235, 235, 235, 1)" }}
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
                  className=" flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-2xl font-medium"
                  style={{ backgroundColor: "rgba(235, 235, 235, 1)" }}
                >
                  Next <ArrowRight className="w-4 h-4" />
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
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading exam data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <XCircle className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-800">Error Loading Data</h3>
                <p className="text-red-600 mt-1">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="lg:text-[24px] font-bold text-gray-800 mb-1">
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
            Completed ({completedTasks.length})
          </h2>

          {completedTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No completed exams yet.
            </div>
          ) : (
            <div className="space-y-4">
              {completedTasks.map((task, index) => (
                <div
                  key={task.examId || index}
                  className="flex flex-col md:flex-row lg:flex-row justify-between items-start py-3 border-b border-gray-100 last:border-b-0 "
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-1">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {task.description}
                    </p>
                    <p className="text-sm text-gray-500">{task.date}</p>
                    {task.score && (
                      <p className="text-sm text-green-600 font-medium">
                        Score: {task.score}%
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4 mt-3.5">
                    {task.actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-[8px] lg:text-[14px] font-medium"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Task Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Active Tasks ({activeTasks.length})
          </h2>

          {activeTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No active exams available.
            </div>
          ) : (
            <div className="space-y-4">
              {activeTasks.map((task, index) => (
                <div
                  key={task.examId || index}
                  className="flex flex-col md:flex-row  lg:flex-row justify-between items-start py-3 border-b border-gray-100 last:border-b-0"
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
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium mt-[1rem]"
                    >
                      {task.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exam;
