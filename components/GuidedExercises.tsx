
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type ExerciseType = 'breathing' | 'grounding' | 'relaxation' | 'meditation';

interface Exercise {
  id: ExerciseType;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const EXERCISES: Exercise[] = [
  { id: 'breathing', title: '4-4-6 Breathing', description: 'A calming technique to reduce stress and anxiety.', icon: '🌬️', color: 'bg-blue-50' },
  { id: 'grounding', title: '5-4-3-2-1 Grounding', description: 'Anchor yourself in the present moment.', icon: '⚓', color: 'bg-green-50' },
  { id: 'relaxation', title: 'Muscle Relaxation', description: 'Release physical tension from your body.', icon: '🧘', color: 'bg-purple-50' },
  { id: 'meditation', title: 'Body Scan Meditation', description: 'A 10-minute guided journey through your body.', icon: '✨', color: 'bg-amber-50' },
];

const MEDITATION_STEPS = [
  { title: "Preparation", text: "Lie down comfortably and gently close your eyes. Let your arms rest by your sides.", icon: "🛌" },
  { title: "Toes", text: "Bring your awareness to your toes. Notice any sensations... any warmth or coolness. Gently release any tension you find there.", icon: "👣" },
  { title: "Feet", text: "Move your attention to your feet. Feel the weight of them. If you notice tightness, imagine it melting away with each breath.", icon: "🦶" },
  { title: "Legs", text: "Now, scan your legs. From your ankles to your knees, and up to your thighs. Let them feel heavy and completely relaxed.", icon: "🦵" },
  { title: "Stomach", text: "Focus on your stomach. Feel it rise and fall with your natural breath. Soften the muscles here, letting go of any bracing.", icon: "🧘" },
  { title: "Chest", text: "Shift to your chest. Notice the gentle rhythm of your heart. Breathe into this space, allowing it to feel open and calm.", icon: "❤️" },
  { title: "Shoulders", text: "Bring awareness to your shoulders. This is where we often hold stress. Let them drop away from your ears, becoming soft.", icon: "👔" },
  { title: "Face", text: "Finally, focus on your face. Relax your jaw, your tongue, and the space between your eyebrows. Let your whole face be smooth.", icon: "😊" },
  { title: "Mind Wandering", text: "If your mind wanders, that's okay. Gently acknowledge the thought and guide your focus back to your body.", icon: "🧠" },
  { title: "Completion", text: "Your body is now fully relaxed. Stay in this peace for a moment before gradually returning to awareness.", icon: "✨" }
];

const RELAXATION_STEPS = [
  { title: "Preparation", text: "Welcome to this Progressive Muscle Relaxation session. Please find a comfortable position, either sitting or lying down. Gently close your eyes. Take a deep breath in... and a slow breath out. Another deep breath... filling your lungs... and releasing all the air. One more time... inhale deeply... and exhale completely. Let your body begin to settle.", icon: "🧘" },
  { title: "Feet", text: "We will start with your feet. Gently curl your toes downward, tensing the muscles in your arches and soles. Do not tense too hard; avoid any pain. Hold it... 1... 2... 3... 4... 5. Now, release. Let your feet go completely limp. Notice the sensation of relaxation spreading through your toes. Feel the difference between the tension you just held and the ease you feel now. We will pause here for a moment.", icon: "🦶" },
  { title: "Legs", text: "Moving up to your legs. Tense your calf muscles and your thighs. Feel the tightness in your lower and upper legs. Hold... 1... 2... 3... 4... 5. And release. Let your legs feel heavy and sink into the surface beneath you. Observe the blood flow and the warmth returning to your muscles. Just breathe.", icon: "🦵" },
  { title: "Stomach", text: "Now, focus on your stomach. Gently tighten your abdominal muscles as if you are bracing for a light touch. Hold... 1... 2... 3... 4... 5. Now let it go. Feel your stomach soften and expand. Notice how much easier it is to breathe when these muscles are relaxed.", icon: "腹" },
  { title: "Hands", text: "Bring your awareness to your hands. Clench both fists tightly, feeling the tension in your fingers, palms, and wrists. Hold... 1... 2... 3... 4... 5. Release. Let your fingers curl naturally. Feel the tension draining out through your fingertips. Notice the stillness in your hands.", icon: "🖐️" },
  { title: "Arms", text: "Tense your arms now by flexing your biceps and tightening your forearms. Feel the strength and the strain. Hold... 1... 2... 3... 4... 5. Release. Let your arms rest heavily by your sides. Experience the contrast between the effort of tensing and the ease of letting go.", icon: "💪" },
  { title: "Shoulders", text: "Lift your shoulders up toward your ears, as if you are trying to touch them. Feel the tightness in your neck and upper back. Hold... 1... 2... 3... 4... 5. Now, drop them down completely. Let them fall. Feel the weight lifting off your shoulders. Enjoy this release.", icon: "👔" },
  { title: "Face", text: "Finally, focus on your face. Squeeze your eyes shut, scrunch your nose, and tighten your jaw. Hold this tension... 1... 2... 3... 4... 5. Release. Let your jaw go slack. Let your tongue rest at the bottom of your mouth. Feel your forehead become smooth and calm.", icon: "😊" },
  { title: "Full Body", text: "Now, take a moment to scan your entire body from head to toe. If you notice any remaining tension, simply breathe into that area and imagine it softening. You are completely relaxed. Enjoy this state of deep peace for a few moments.", icon: "✨" },
  { title: "Completion", text: "Our session is coming to an end. Gently begin to wiggle your fingers and toes. Take a deep, refreshing breath. When you are ready, slowly open your eyes and return your awareness to the room, carrying this sense of relaxation with you. You did well.", icon: "🌿" }
];

const GuidedExercises: React.FC = () => {
  const [activeExercise, setActiveExercise] = useState<ExerciseType | null>(null);
  const [step, setStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [totalTimer, setTotalTimer] = useState(300); // Default for breathing
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Meditation specific state
  const [meditationStep, setMeditationStep] = useState(0);
  const [meditationTimer, setMeditationTimer] = useState(600); // 10 minutes

  // Relaxation specific state
  const [relaxationStep, setRelaxationStep] = useState(0);
  const [relaxationTimer, setRelaxationTimer] = useState(720); // 12 minutes

  // Voice Guidance
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find a nice female/soothing voice
      const voices = window.speechSynthesis.getVoices();
      const soothingVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Female')) || voices[0];
      
      if (soothingVoice) utterance.voice = soothingVoice;
      utterance.rate = 0.85; // Slightly slower for soothing effect
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Reset states when changing exercise
  useEffect(() => {
    setIsActive(false);
    setIsFinished(false);
    setStep(0);
    setTimer(0);
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    if (activeExercise === 'breathing') setTotalTimer(300);
    if (activeExercise === 'meditation') {
      setMeditationTimer(600);
      setMeditationStep(0);
    }
    if (activeExercise === 'relaxation') {
      setRelaxationTimer(720);
      setRelaxationStep(0);
    }
  }, [activeExercise]);

  // Handle Voice for Meditation & Relaxation
  useEffect(() => {
    if (isActive && !isFinished) {
      if (activeExercise === 'meditation') {
        speak(MEDITATION_STEPS[meditationStep].text);
      } else if (activeExercise === 'relaxation') {
        speak(RELAXATION_STEPS[relaxationStep].text);
      }
    }
    if (!isActive) {
      window.speechSynthesis.cancel();
    }
  }, [meditationStep, relaxationStep, isActive, activeExercise, isFinished]);

  // Breathing Logic
  useEffect(() => {
    let interval: any;
    if (activeExercise === 'breathing' && isActive && !isFinished) {
      interval = setInterval(() => {
        setTotalTimer((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });

        setTimer((prev) => {
          const durations = [4, 4, 6]; // Inhale, Hold, Exhale
          if (prev >= durations[step]) {
            setStep((s) => (s + 1) % 3);
            return 1;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeExercise, isActive, isFinished, step]);

  // Meditation Logic
  useEffect(() => {
    let interval: any;
    if (activeExercise === 'meditation' && isActive && !isFinished) {
      interval = setInterval(() => {
        setMeditationTimer((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsFinished(true);
            return 0;
          }
          
          // Change steps based on time
          // 10 steps total, ~60s each
          const newStep = Math.floor((600 - (prev - 1)) / 60);
          if (newStep !== meditationStep && newStep < 9) {
            setMeditationStep(newStep);
          }
          
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeExercise, isActive, isFinished, meditationStep]);

  // Relaxation Logic
  useEffect(() => {
    let interval: any;
    if (activeExercise === 'relaxation' && isActive && !isFinished) {
      interval = setInterval(() => {
        setRelaxationTimer((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsFinished(true);
            return 0;
          }
          
          // 12 mins = 720s. We have 10 steps. 
          // Let's distribute them. 72s per step on average.
          const stepDuration = 720 / RELAXATION_STEPS.length;
          const newStep = Math.floor((720 - (prev - 1)) / stepDuration);
          
          if (newStep !== relaxationStep && newStep < RELAXATION_STEPS.length) {
            setRelaxationStep(newStep);
          }
          
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeExercise, isActive, isFinished, relaxationStep]);

  const renderBreathing = () => {
    const steps = ['Inhale', 'Hold', 'Exhale'];
    const colors = ['text-blue-500', 'text-indigo-500', 'text-cyan-500'];
    
    if (isFinished) {
      return (
        <div className="flex flex-col items-center justify-center space-y-8 py-10 text-center">
          <div className="text-6xl mb-4">✨</div>
          <h3 className="text-2xl font-black text-gray-900">
            Take a normal breath. Notice how your body feels. You did well.
          </h3>
          <button 
            onClick={() => {
              setIsFinished(false);
              setTotalTimer(300);
              setTimer(0);
              setStep(0);
            }}
            className="bg-blue-500 text-white px-10 py-4 rounded-3xl font-black shadow-lg hover:bg-blue-600 transition"
          >
            Try Again
          </button>
        </div>
      );
    }

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className="flex flex-col items-center space-y-12 py-10">
        <div className="text-center">
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Total Time Remaining</p>
          <p className="text-3xl font-black text-gray-900">{formatTime(totalTimer)}</p>
        </div>

        <div className="relative w-64 h-64 flex items-center justify-center">
          <motion.div 
            animate={{ 
              scale: step === 0 ? [1, 1.5] : step === 2 ? [1.5, 1] : 1.5,
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: step === 0 ? 4 : step === 1 ? 4 : 6, 
              ease: "easeInOut", 
              repeat: isActive ? Infinity : 0 
            }}
            className="absolute inset-0 bg-blue-200 rounded-full"
          />
          <div className="z-10 text-center">
            <h3 className={`text-4xl font-black transition-colors duration-500 ${colors[step]}`}>
              {steps[step]}
            </h3>
            <p className="text-2xl font-bold text-gray-400 mt-2">
              {timer > 0 ? `${steps[step]}... ${timer}` : 'Ready?'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <button 
            onClick={() => { 
              if (!isActive) {
                setTimer(1);
                setStep(0);
              }
              setIsActive(!isActive); 
            }}
            className={`${isActive ? 'bg-gray-200 text-gray-600' : 'bg-blue-500 text-white'} px-10 py-4 rounded-3xl font-black shadow-lg transition w-64`}
          >
            {isActive ? 'Pause' : 'Start Exercise'}
          </button>
          <p className="text-xs font-bold text-gray-400 italic">
            Inhale (4s) • Hold (4s) • Exhale (6s)
          </p>
        </div>
      </div>
    );
  };

  const renderMeditation = () => {
    if (isFinished) {
      return (
        <div className="flex flex-col items-center justify-center space-y-8 py-10 text-center">
          <div className="text-6xl mb-4">🌿</div>
          <h3 className="text-2xl font-black text-gray-900 leading-relaxed">
            You have completed your body scan. <br/>
            Take a deep breath, wiggle your fingers and toes, and when you're ready, open your eyes. <br/>
            Carry this peace with you.
          </h3>
          <button 
            onClick={() => {
              setIsFinished(false);
              setMeditationTimer(600);
              setMeditationStep(0);
            }}
            className="bg-amber-500 text-white px-10 py-4 rounded-3xl font-black shadow-lg hover:bg-amber-600 transition"
          >
            Practice Again
          </button>
        </div>
      );
    }

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const currentStep = MEDITATION_STEPS[meditationStep];

    return (
      <div className="flex flex-col items-center space-y-10 py-6">
        <div className="text-center">
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Meditation Progress</p>
          <p className="text-3xl font-black text-amber-600">{formatTime(meditationTimer)}</p>
        </div>

        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <motion.div 
            className="bg-amber-400 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${((600 - meditationTimer) / 600) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={meditationStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 text-center space-y-4 w-full"
          >
            <div className="text-5xl mb-2">{currentStep.icon}</div>
            <h4 className="text-2xl font-black text-amber-900">{currentStep.title}</h4>
            <p className="text-lg text-amber-800 leading-relaxed font-medium italic">
              "{currentStep.text}"
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col items-center space-y-4 w-full">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`${isActive ? 'bg-gray-200 text-gray-600' : 'bg-amber-500 text-white'} px-10 py-4 rounded-3xl font-black shadow-lg transition w-full max-w-xs`}
          >
            {isActive ? 'Pause Guide' : 'Start Meditation'}
          </button>
          <p className="text-sm font-bold text-gray-400">
            Guided Body Scan • 10 Minutes
          </p>
        </div>
      </div>
    );
  };

  const renderRelaxation = () => {
    if (isFinished) {
      return (
        <div className="flex flex-col items-center justify-center space-y-8 py-10 text-center">
          <div className="text-6xl mb-4">💪</div>
          <h3 className="text-2xl font-black text-gray-900 leading-relaxed">
            You have completed the Progressive Muscle Relaxation. <br/>
            Notice the lightness in your body. <br/>
            Take this feeling of relaxation with you.
          </h3>
          <button 
            onClick={() => {
              setIsFinished(false);
              setRelaxationTimer(720);
              setRelaxationStep(0);
            }}
            className="bg-purple-500 text-white px-10 py-4 rounded-3xl font-black shadow-lg hover:bg-purple-600 transition"
          >
            Practice Again
          </button>
        </div>
      );
    }

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const currentStep = RELAXATION_STEPS[relaxationStep];

    return (
      <div className="flex flex-col items-center space-y-10 py-6">
        <div className="text-center">
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Relaxation Progress</p>
          <p className="text-3xl font-black text-purple-600">{formatTime(relaxationTimer)}</p>
        </div>

        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <motion.div 
            className="bg-purple-400 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${((720 - relaxationTimer) / 720) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={relaxationStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-purple-50 p-8 rounded-[2.5rem] border border-purple-100 text-center space-y-4 w-full"
          >
            <div className="text-5xl mb-2">{currentStep.icon}</div>
            <h4 className="text-2xl font-black text-purple-900">{currentStep.title}</h4>
            <p className="text-lg text-purple-800 leading-relaxed font-medium italic">
              "{currentStep.text}"
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col items-center space-y-4 w-full">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`${isActive ? 'bg-gray-200 text-gray-600' : 'bg-purple-500 text-white'} px-10 py-4 rounded-3xl font-black shadow-lg transition w-full max-w-xs`}
          >
            {isActive ? 'Pause Guide' : 'Start Relaxation'}
          </button>
          <p className="text-sm font-bold text-gray-400">
            Progressive Muscle Relaxation • 12 Minutes
          </p>
        </div>
      </div>
    );
  };

  const renderGrounding = () => {
    const groundingSteps = [
      { count: 5, label: 'Things you can see', icon: '👀' },
      { count: 4, label: 'Things you can touch', icon: '🖐️' },
      { count: 3, label: 'Things you can hear', icon: '👂' },
      { count: 2, label: 'Things you can smell', icon: '👃' },
      { count: 1, label: 'Thing you can taste', icon: '👅' },
    ];

    return (
      <div className="space-y-8 py-6">
        <div className="grid grid-cols-1 gap-4">
          {groundingSteps.map((s, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-6"
            >
              <div className="text-4xl font-black text-green-500 w-12">{s.count}</div>
              <div className="text-2xl">{s.icon}</div>
              <div className="text-xl font-bold text-gray-700">{s.label}</div>
            </motion.div>
          ))}
        </div>
        <button 
          onClick={() => setActiveExercise(null)}
          className="w-full bg-green-500 text-white py-4 rounded-3xl font-black shadow-lg hover:bg-green-600 transition"
        >
          I feel more grounded now
        </button>
      </div>
    );
  };

  const renderExercise = () => {
    switch (activeExercise) {
      case 'breathing': return renderBreathing();
      case 'grounding': return renderGrounding();
      case 'meditation': return renderMeditation();
      case 'relaxation': return renderRelaxation();
      default: return (
        <div className="py-20 text-center space-y-4">
          <p className="text-gray-400 font-bold">This exercise is coming soon!</p>
          <button onClick={() => setActiveExercise(null)} className="text-blue-500 font-black">Go Back</button>
        </div>
      );
    }
  };

  return (
    <div className="w-full max-w-4xl animate-fade-in space-y-10">
      <div className="flex flex-col space-y-2">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Guided Exercises</h2>
        <p className="text-gray-500 font-bold">Simple techniques to help you find balance.</p>
      </div>

      <AnimatePresence mode="wait">
        {!activeExercise ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {EXERCISES.map((ex) => (
              <div 
                key={ex.id}
                onClick={() => setActiveExercise(ex.id)}
                className={`${ex.color} p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group flex flex-col space-y-4`}
              >
                <div className="text-5xl group-hover:scale-110 transition duration-300">{ex.icon}</div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">{ex.title}</h3>
                  <p className="text-gray-500 font-bold mt-1 leading-relaxed">{ex.description}</p>
                </div>
                <div className="pt-2">
                  <span className="text-sm font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-900 transition">Start Now →</span>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="active"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-50"
          >
            <button 
              onClick={() => { setActiveExercise(null); setIsActive(false); }}
              className="text-gray-400 font-bold hover:text-gray-600 transition flex items-center mb-8"
            >
              <span className="mr-2">←</span> Back to Exercises
            </button>
            
            <div className="text-center mb-10">
              <h3 className="text-3xl font-black text-gray-900">{EXERCISES.find(e => e.id === activeExercise)?.title}</h3>
              <p className="text-gray-500 font-bold mt-2">{EXERCISES.find(e => e.id === activeExercise)?.description}</p>
            </div>

            {renderExercise()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GuidedExercises;
