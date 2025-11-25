import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Trophy, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  fun_fact: string;
  order_index: number;
}

interface QuizProps {
  onBack: () => void;
}

const Quiz: React.FC<QuizProps> = ({ onBack }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('treasure_quiz')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].correct_answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return 'Perfekt! Du kennst mich besser als ich mich selbst! 💕';
    if (percentage >= 80) return 'Wow! Du kennst mich wirklich gut! 😊';
    if (percentage >= 60) return 'Nicht schlecht! Wir sollten mehr Zeit zusammen verbringen! 💖';
    return 'Oje! Aber das macht nichts, wir haben noch viel Zeit uns kennenzulernen! 💗';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="text-fuchsia-500 animate-pulse mx-auto mb-4" size={48} fill="currentColor" />
          <p className="text-xl text-gray-600">Lade Quiz...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all mb-8 group"
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
            <span>Zurück zu den Truhen</span>
          </button>
          <div className="text-center py-20">
            <Heart className="text-gray-400 mx-auto mb-4" size={64} />
            <p className="text-xl text-gray-500">
              Noch keine Quiz-Fragen hinzugefügt. Füge Fragen über die Datenbank hinzu!
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <Trophy className="text-yellow-500 mx-auto mb-6" size={80} />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Quiz abgeschlossen! 🎉
            </h2>
            <div className="mb-6">
              <p className="text-6xl font-bold text-transparent bg-gradient-to-r from-fuchsia-500 to-pink-500 bg-clip-text mb-4">
                {score} / {questions.length}
              </p>
              <p className="text-2xl text-gray-700 mb-2">{getScoreMessage()}</p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className="px-8 py-4 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-lg font-semibold rounded-full hover:shadow-lg transition-all"
              >
                Nochmal versuchen
              </button>
              <button
                onClick={onBack}
                className="px-8 py-4 bg-gray-200 text-gray-700 text-lg font-semibold rounded-full hover:bg-gray-300 transition-all"
              >
                Zurück zu den Truhen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correct_answer;

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all mb-8 group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          <span>Zurück zu den Truhen</span>
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-600">
                Frage {currentQuestion + 1} von {questions.length}
              </span>
              <span className="text-lg font-semibold text-fuchsia-600">
                Score: {score}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-fuchsia-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
            {question.question}
          </h2>

          <div className="space-y-4 mb-8">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`
                  w-full p-6 rounded-xl text-left text-lg font-medium transition-all
                  ${
                    selectedAnswer === index
                      ? showResult
                        ? isCorrect
                          ? 'bg-green-100 border-2 border-green-500'
                          : 'bg-red-100 border-2 border-red-500'
                        : 'bg-fuchsia-100 border-2 border-fuchsia-500'
                      : showResult && index === question.correct_answer
                      ? 'bg-green-100 border-2 border-green-500'
                      : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
                  }
                  ${showResult ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && selectedAnswer === index && (
                    <>
                      {isCorrect ? (
                        <CheckCircle className="text-green-500" size={24} />
                      ) : (
                        <XCircle className="text-red-500" size={24} />
                      )}
                    </>
                  )}
                  {showResult &&
                    selectedAnswer !== index &&
                    index === question.correct_answer && (
                      <CheckCircle className="text-green-500" size={24} />
                    )}
                </div>
              </button>
            ))}
          </div>

          {showResult && question.fun_fact && (
            <div className="mb-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <p className="text-sm font-semibold text-blue-800 mb-2">
                💡 Wusstest du?
              </p>
              <p className="text-gray-700">{question.fun_fact}</p>
            </div>
          )}

          {!showResult ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className={`
                w-full py-4 text-lg font-semibold rounded-full transition-all
                ${
                  selectedAnswer !== null
                    ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              Antwort bestätigen
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="w-full py-4 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-lg font-semibold rounded-full hover:shadow-lg transition-all"
            >
              {currentQuestion < questions.length - 1
                ? 'Nächste Frage'
                : 'Quiz beenden'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
