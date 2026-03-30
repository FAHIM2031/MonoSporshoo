
import React, { useState } from 'react';
import { AssessmentType, AssessmentQuestion } from '../types';
import * as gemini from '../services/gemini';

const QUESTIONS: Record<AssessmentType, AssessmentQuestion[]> = {
  anxiety: [
    { id: 1, text: "Feeling nervous, anxious, or on edge?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 2, text: "Not being able to stop or control worrying?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 3, text: "Worrying too much about different things?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 4, text: "Trouble relaxing?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 5, text: "Being so restless that it is hard to sit still?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 6, text: "Becoming easily annoyed or irritable?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 7, text: "Feeling afraid as if something awful might happen?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 8, text: "Difficulty concentrating due to worry?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 9, text: "Physical symptoms like heart racing when anxious?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 10, text: "Avoiding situations that make you feel anxious?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] }
  ],
  depression: [
    { id: 1, text: "Little interest or pleasure in doing things?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 2, text: "Feeling down, depressed, or hopeless?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 3, text: "Trouble falling or staying asleep, or sleeping too much?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 4, text: "Feeling tired or having little energy?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 5, text: "Poor appetite or overeating?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 6, text: "Feeling bad about yourself — or that you are a failure?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 7, text: "Trouble concentrating on things?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 8, text: "Moving or speaking so slowly that others noticed?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 9, text: "Thoughts that you would be better off dead?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 10, text: "Feeling isolated or disconnected from others?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] }
  ],
  stress: [
    { id: 1, text: "In the last 7 days, how often did you feel tense or stressed?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 2, text: "How often have you felt unable to control important things?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 3, text: "How often have you felt confident about handling problems?", options: [{ label: "Never", value: 3 }, { label: "Sometimes", value: 2 }, { label: "Often", value: 1 }, { label: "Always", value: 0 }] },
    { id: 4, text: "How often have you felt that things were going your way?", options: [{ label: "Never", value: 3 }, { label: "Sometimes", value: 2 }, { label: "Often", value: 1 }, { label: "Always", value: 0 }] },
    { id: 5, text: "How often have you found you could not cope with tasks?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 6, text: "How often have you been able to control irritations?", options: [{ label: "Never", value: 3 }, { label: "Sometimes", value: 2 }, { label: "Often", value: 1 }, { label: "Always", value: 0 }] },
    { id: 7, text: "How often have you felt that you were on top of things?", options: [{ label: "Never", value: 3 }, { label: "Sometimes", value: 2 }, { label: "Often", value: 1 }, { label: "Always", value: 0 }] },
    { id: 8, text: "How often have you been angered by things outside control?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 9, text: "How often have you felt difficulties were overcoming you?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: 10, text: "How often have you felt overwhelmed by responsibilities?", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] }
  ]
};

interface HealthAssessmentProps {
  onGoHome?: () => void;
}

const HealthAssessment: React.FC<HealthAssessmentProps> = ({ onGoHome }) => {
  const [stage, setStage] = useState<'selection' | 'intro' | 'questions' | 'results'>('selection');
  const [type, setType] = useState<AssessmentType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string>('');

  const startAssessment = (selectedType: AssessmentType) => {
    setType(selectedType);
    setAnswers(new Array(10).fill(null));
    setCurrentQuestionIndex(0);
    setStage('intro');
  };

  const handleStartQuestions = () => {
    setStage('questions');
  };

  const handleSelectOption = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (answers[currentQuestionIndex] === null) return;

    if (type && currentQuestionIndex < QUESTIONS[type].length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setStage('results');
      generateAIRecommendations(answers as number[]);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      setStage('intro');
    }
  };

  const generateAIRecommendations = async (finalAnswers: number[]) => {
    setLoading(true);
    const score = finalAnswers.reduce((a, b) => a + b, 0);
    const maxScore = type ? QUESTIONS[type].length * (type === 'stress' ? 4 : 3) : 10;
    
    try {
      const ai = gemini.getAI();
      const prompt = `A user took a ${type} screening and scored ${score} out of ${maxScore}. 
      Provide 3 supportive, non-clinical, practical mental health tips for them. 
      Keep it brief, empathetic, and start with "Based on your score, here are some gentle suggestions:".`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setRecommendations(response.text || "Continue practicing self-care and reach out to loved ones for support.");
    } catch (e) {
      setRecommendations("Focus on deep breathing, stay hydrated, and try to get some fresh air today. You're doing great.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStage('selection');
    setType(null);
    setAnswers([]);
    setRecommendations('');
  };

  return (
    <div className="w-full max-w-4xl animate-fade-in flex flex-col items-center">
      {stage === 'selection' ? (
        <div className="w-full space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Health Assessment</h2>
            <p className="text-gray-500 font-bold">Simple screenings to help you understand your wellness.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              onClick={() => startAssessment('anxiety')}
              className="bg-[#f0f4ff] p-8 rounded-[2.5rem] border border-blue-100 shadow-sm hover:shadow-xl transition cursor-pointer group text-center"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition">😨</div>
              <h3 className="text-xl font-black text-blue-900">Anxiety</h3>
              <p className="text-sm font-bold text-blue-400 mt-2">GAD-2 Screening</p>
            </div>
            <div 
              onClick={() => startAssessment('depression')}
              className="bg-[#fff0f0] p-8 rounded-[2.5rem] border border-red-100 shadow-sm hover:shadow-xl transition cursor-pointer group text-center"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition">😔</div>
              <h3 className="text-xl font-black text-red-900">Depression</h3>
              <p className="text-sm font-bold text-red-400 mt-2">PHQ-2 Screening</p>
            </div>
            <div 
              onClick={() => startAssessment('stress')}
              className="bg-[#f0fff4] p-8 rounded-[2.5rem] border border-green-100 shadow-sm hover:shadow-xl transition cursor-pointer group text-center"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition">😫</div>
              <h3 className="text-xl font-black text-green-900">Stress</h3>
              <p className="text-sm font-bold text-green-400 mt-2">PSS-Short Screening</p>
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start space-x-4">
            <span className="text-2xl">⚠️</span>
            <p className="text-amber-800 text-sm font-medium leading-relaxed">
              <strong>Important:</strong> These screenings are for educational purposes only and are not a professional diagnosis. If you are in distress, please contact a healthcare provider or professional counselor.
            </p>
          </div>
        </div>
      ) : stage === 'intro' ? (
        <div className="w-full max-w-2xl space-y-12 py-10 animate-fade-in flex flex-col items-center">
          <div className="w-full text-left">
            <span className="text-gray-600 font-medium">Step 1 of 5</span>
          </div>

          <div className="bg-[#f0d8d8] p-10 rounded-[2rem] shadow-sm w-full max-w-md space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Before you begin</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-gray-800 font-medium">
                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                <span>There are no right and wrong answers</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-800 font-medium">
                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                <span>Answer Honestly</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-800 font-medium">
                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                <span>You can stop anytime</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-800 font-medium">
                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                <span>Your responses are private</span>
              </li>
            </ul>
          </div>

          <div className="flex space-x-6 w-full max-w-md">
            <button 
              onClick={reset}
              className="flex-1 bg-white border border-gray-300 text-gray-900 py-4 rounded-3xl font-bold shadow-sm hover:bg-gray-50 transition active:scale-95"
            >
              Go back
            </button>
            <button 
              onClick={handleStartQuestions}
              className="flex-1 bg-[#5c6df2] text-white py-4 rounded-3xl font-bold shadow-lg hover:bg-[#4b5cdb] transition active:scale-95"
            >
              Start Assessment
            </button>
          </div>
        </div>
      ) : stage === 'questions' && type ? (
        <div className="w-full max-w-2xl space-y-12 py-10 animate-fade-in flex flex-col items-center">
          <div className="w-full text-left">
            <span className="text-gray-600 font-medium">Question {currentQuestionIndex + 1} of 10</span>
          </div>

          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#f4a7a7] transition-all duration-500" 
              style={{ width: `${((currentQuestionIndex + 1) / 10) * 100}%` }}
            ></div>
          </div>

          <div className="bg-[#f0d8d8] p-10 rounded-[2rem] shadow-sm w-full max-w-md space-y-8">
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {QUESTIONS[type][currentQuestionIndex].text}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {QUESTIONS[type][currentQuestionIndex].options.map((opt, i) => (
                <button 
                  key={i}
                  onClick={() => handleSelectOption(opt.value)}
                  className={`w-full p-4 text-left rounded-2xl font-bold transition active:scale-[0.98] ${answers[currentQuestionIndex] === opt.value ? 'bg-[#5c6df2] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-6 w-full max-w-md">
            <button 
              onClick={handleBack}
              className="flex-1 bg-white border border-gray-300 text-gray-900 py-4 rounded-3xl font-bold shadow-sm hover:bg-gray-50 transition active:scale-95"
            >
              Back
            </button>
            <button 
              onClick={handleNext}
              disabled={answers[currentQuestionIndex] === null}
              className={`flex-1 py-4 rounded-3xl font-bold shadow-lg transition active:scale-95 ${answers[currentQuestionIndex] === null ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#5c6df2] text-white hover:bg-[#4b5cdb]'}`}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl space-y-10 py-10 animate-fade-in">
          <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-50 text-center space-y-6">
            <div className="text-6xl">📊</div>
            <h2 className="text-3xl font-black text-gray-900">Screening Complete</h2>
            <div className="py-4 px-8 bg-gray-50 rounded-2xl inline-block">
              <span className="text-sm font-black text-gray-400 uppercase tracking-widest block mb-1">Total Score</span>
              <span className="text-5xl font-black text-gray-800">
                {answers.reduce((a, b) => a + b, 0)}
              </span>
            </div>
          </div>

          <div className="bg-[#f7f9f2] p-10 rounded-[2.5rem] border border-[#eef3e8] space-y-6 shadow-inner">
            <h3 className="text-xl font-black text-gray-800 flex items-center">
              <span className="mr-3">✨</span> MonoSporsho Recommendations
            </h3>
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            ) : (
              <div className="prose prose-sm text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
                {recommendations}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={reset}
              className="flex-1 bg-[#f4a7a7] text-gray-900 py-5 rounded-3xl font-black shadow-lg hover:bg-[#ef9393] transition active:scale-95"
            >
              Take Another Assessment
            </button>
            <button 
              onClick={onGoHome || reset} 
              className="flex-1 bg-white border-2 border-gray-100 text-gray-500 py-5 rounded-3xl font-black hover:bg-gray-50 transition active:scale-95"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthAssessment;
