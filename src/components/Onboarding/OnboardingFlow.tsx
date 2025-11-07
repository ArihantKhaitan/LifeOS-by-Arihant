import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { OnboardingQuestion } from '../../types';

const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: '1',
    question: 'What are your favorite movie/TV genres?',
    type: 'multiple',
    options: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Documentary', 'Thriller', 'Animation', 'Fantasy'],
    category: 'favoriteGenres'
  },
  {
    id: '2',
    question: 'What types of workouts do you prefer?',
    type: 'multiple',
    options: ['Cardio', 'Strength Training', 'Yoga', 'Pilates', 'Running', 'Swimming', 'Cycling', 'HIIT', 'Dance', 'Martial Arts'],
    category: 'workoutTypes'
  },
  {
    id: '3',
    question: 'What are your main interests?',
    type: 'multiple',
    options: ['Technology', 'Travel', 'Cooking', 'Reading', 'Music', 'Art', 'Sports', 'Gaming', 'Photography', 'Fashion'],
    category: 'interests'
  },
  {
    id: '4',
    question: 'What are your primary life goals?',
    type: 'multiple',
    options: ['Health & Fitness', 'Career Growth', 'Financial Freedom', 'Learning & Education', 'Relationships', 'Travel', 'Creativity', 'Spirituality'],
    category: 'goals'
  },
  {
    id: '5',
    question: 'Which productivity tools do you use most?',
    type: 'multiple',
    options: ['ChatGPT', 'Notion', 'Todoist', 'Trello', 'Slack', 'Google Workspace', 'Microsoft Office', 'Figma', 'GitHub', 'Zoom'],
    category: 'productivity'
  },
  {
    id: '6',
    question: 'What entertainment platforms do you use?',
    type: 'multiple',
    options: ['Netflix', 'YouTube', 'Apple TV+', 'Prime Video', 'Disney+', 'Spotify', 'Twitch', 'TikTok', 'Instagram', 'Twitter'],
    category: 'entertainment'
  },
  {
    id: '7',
    question: 'How do you prefer to communicate?',
    type: 'multiple',
    options: ['WhatsApp', 'Telegram', 'Discord', 'Slack', 'Email', 'Phone Calls', 'Video Calls', 'SMS', 'Social Media', 'In Person'],
    category: 'communication'
  }
];

const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { user, updateUser } = useAuth();
  const { theme } = useTheme();

  const currentQuestion = onboardingQuestions[currentStep];
  const isDark = theme === 'dark';

  const handleAnswer = (option: string) => {
    const questionId = currentQuestion.id;
    const currentAnswers = answers[questionId] || [];
    
    if (currentQuestion.type === 'multiple') {
      if (currentAnswers.includes(option)) {
        setAnswers({
          ...answers,
          [questionId]: currentAnswers.filter(a => a !== option)
        });
      } else {
        setAnswers({
          ...answers,
          [questionId]: [...currentAnswers, option]
        });
      }
    } else {
      setAnswers({
        ...answers,
        [questionId]: [option]
      });
    }
  };

  const handleNext = () => {
    if (currentStep < onboardingQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    if (!user) return;

    const preferences = { ...user.preferences };
    
    onboardingQuestions.forEach(question => {
      const answer = answers[question.id] || [];
      preferences[question.category] = answer;
    });

    updateUser({
      preferences,
      onboardingCompleted: true
    });
  };

  const progress = ((currentStep + 1) / onboardingQuestions.length) * 100;
  const currentAnswers = answers[currentQuestion.id] || [];

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="max-w-2xl w-full mx-4">
        <div className={`${
          isDark 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/80 border-white/20'
        } backdrop-blur-xl rounded-3xl p-8 shadow-2xl border`}>
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isDark 
                ? 'bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent'
            }`}>
              Let's personalize your LifeOS
            </h1>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Answer a few questions to get personalized recommendations
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Question {currentStep + 1} of {onboardingQuestions.length}
              </span>
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {Math.round(progress)}% complete
              </span>
            </div>
            <div className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <div 
                className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {currentQuestion.question}
            </h2>
            
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options?.map((option) => {
                const isSelected = currentAnswers.includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : isDark
                          ? 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500 hover:bg-slate-700'
                          : 'border-slate-200 bg-white/50 text-slate-700 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {isSelected && <Check className="w-5 h-5 text-blue-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                currentStep === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : isDark
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentAnswers.length === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                currentAnswers.length === 0
                  ? 'opacity-50 cursor-not-allowed bg-slate-300'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              <span>{currentStep === onboardingQuestions.length - 1 ? 'Complete' : 'Next'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;