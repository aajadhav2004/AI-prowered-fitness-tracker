import React, { useState, useEffect, useRef } from "react";
import { Mic, Volume2, X, AlertCircle } from "lucide-react";
import { playActivationSound } from "../utils/soundUtils";

export default function WorkoutVoiceAssistant({ 
  onWorkoutSubmit, 
  workoutNames, 
  categories, 
  isOpen, 
  onClose 
}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [displayData, setDisplayData] = useState({
    name: "",
    category: "",
    sets: 0,
    reps: 0,
    duration: 0,
    notes: ""
  });

  const recognitionRef = useRef(null);
  const listeningTimeoutRef = useRef(null);
  const hasReceivedResponseRef = useRef(false);
  const currentStepRef = useRef(0);
  const attemptCountRef = useRef(0);
  const workoutDataRef = useRef({
    name: "",
    category: "",
    sets: 0,
    reps: 0,
    duration: 0,
    notes: ""
  });

  const MAX_ATTEMPTS = 3;
  const LISTENING_TIMEOUT = 4000; // 4 seconds

  const steps = [
    { question: "Welcome to Voice Workout! What's the name of your workout?", field: "name", type: "workout_name" },
    { question: "What category is this workout?", field: "category", type: "category" },
    { question: "How many sets did you do?", field: "sets", type: "number" },
    { question: "How many reps per set?", field: "reps", type: "number" },
    { question: "How long was your workout in minutes?", field: "duration", type: "number" },
    { question: "Any notes about this workout? Say 'none' if no notes.", field: "notes", type: "text" },
    { question: "Are you ready to submit? Say 'yes' to add this workout or 'no' to cancel.", field: "confirm", type: "confirm" }
  ];

  useEffect(() => {
    if (isOpen) {
      initializeSpeechRecognition();
      // Reset everything
      currentStepRef.current = 0;
      attemptCountRef.current = 0;
      workoutDataRef.current = { name: "", category: "", sets: 0, reps: 0, duration: 0, notes: "" };
      hasReceivedResponseRef.current = false;
      setCurrentAnswer("");
      setDisplayData({ name: "", category: "", sets: 0, reps: 0, duration: 0, notes: "" });
      
      setTimeout(() => {
        askQuestion(0);
      }, 1000);
    }
    
    return () => {
      cleanup();
    };
  }, [isOpen]);

  const cleanup = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current);
    }
  };

  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Sorry, your browser doesn't support speech recognition. Please use Chrome or Edge.");
      onClose();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      console.log(`🎤 Started listening for step ${currentStepRef.current}: ${steps[currentStepRef.current]?.field} (Attempt ${attemptCountRef.current + 1}/${MAX_ATTEMPTS})`);
      
      // Set timeout - if no response in 4 seconds
      listeningTimeoutRef.current = setTimeout(() => {
        if (!hasReceivedResponseRef.current) {
          console.log(`⏰ Timeout - No response received for step ${currentStepRef.current} (Attempt ${attemptCountRef.current + 1})`);
          
          // Stop recognition immediately to prevent late responses
          if (recognitionRef.current) {
            try {
              recognitionRef.current.stop();
            } catch (e) {}
          }
          
          handleNoResponse();
        }
      }, LISTENING_TIMEOUT);
    };

    recognitionRef.current.onresult = (event) => {
      // Check if we're still within the timeout period
      if (!hasReceivedResponseRef.current) {
        const result = event.results[0][0].transcript.trim();
        console.log(`✅ Voice input received for step ${currentStepRef.current} (${steps[currentStepRef.current]?.field}): "${result}"`);
        
        // Mark that we received a response
        hasReceivedResponseRef.current = true;
        
        // Clear timeout
        if (listeningTimeoutRef.current) {
          clearTimeout(listeningTimeoutRef.current);
        }
        
        setCurrentAnswer(result);
        
        // Process immediately
        setTimeout(() => {
          processVoiceInput(result);
        }, 100);
      } else {
        console.log(`⚠️ Late response ignored: "${event.results[0][0].transcript}"`);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error(`❌ Speech recognition error for step ${currentStepRef.current}:`, event.error);
      setIsListening(false);
      
      if (event.error === 'no-speech' && !hasReceivedResponseRef.current) {
        console.log('🔄 No speech detected, trying again...');
        handleNoResponse();
      } else if (event.error === 'aborted') {
        console.log('🛑 Recognition aborted');
      } else {
        console.log('🔄 Recognition error, retrying...');
        setTimeout(() => {
          if (!isListening && currentStepRef.current < steps.length) {
            startListening();
          }
        }, 1000);
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      console.log("🔇 Recognition ended");
    };
  };

  const speak = (text, callback) => {
    console.log("🗣️ Speaking:", text);
    
    // Stop listening while speaking to avoid conflicts
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log("Recognition already stopped");
      }
    }
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsListening(false); // Ensure mic is closed
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        if (callback) callback();
      };
      
      window.speechSynthesis.speak(utterance);
    } else if (callback) {
      callback();
    }
  };

  const askQuestion = (stepIndex) => {
    if (stepIndex >= steps.length) {
      console.log("❌ No more questions");
      return;
    }
    
    hasReceivedResponseRef.current = false; // Reset for new question
    const question = steps[stepIndex].question;
    console.log(`📢 Asking question ${stepIndex + 1}/${steps.length}: ${question}`);
    
    speak(question, () => {
      // After speaking, wait 1 second then start listening
      setTimeout(() => {
        startListening();
      }, 1000);
    });
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        console.log(`🎤 Starting to listen for step ${currentStepRef.current}: ${steps[currentStepRef.current]?.field}`);
        
        // Play activation sound
        playActivationSound();
        
        setCurrentAnswer("");
        hasReceivedResponseRef.current = false;
        recognitionRef.current.start();
      } catch (error) {
        console.error('❌ Error starting recognition:', error);
        // If recognition fails, try again after a short delay
        setTimeout(() => {
          if (!isListening) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              console.error('❌ Second attempt failed:', e);
            }
          }
        }, 500);
      }
    } else {
      console.log(`⚠️ Cannot start listening - isListening: ${isListening}, recognitionRef: ${!!recognitionRef.current}`);
    }
  };

  const handleNoResponse = () => {
    setIsListening(false);
    hasReceivedResponseRef.current = false;
    
    attemptCountRef.current += 1;
    const currentAttempts = attemptCountRef.current;
    console.log(`⚠️ No response - Attempt ${currentAttempts}/${MAX_ATTEMPTS}`);
    
    if (currentAttempts >= MAX_ATTEMPTS) {
      console.log("❌ Max attempts reached - closing immediately");
      speak("Sorry! I didn't receive any response.Try again.by see you later.", () => {
        setTimeout(() => onClose(), 1500);
      });
    } else {
      console.log(`🔄 Retrying question (${currentAttempts}/${MAX_ATTEMPTS})`);
      // Directly repeat the question without saying "I didn't hear anything"
      setTimeout(() => {
        askQuestion(currentStepRef.current);
      }, 500);
    }
  };

  const processVoiceInput = (input) => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    
    const stepIndex = currentStepRef.current;
    const step = steps[stepIndex];
    let processedValue = input.trim();

    console.log(`✅ Step ${stepIndex}: field="${step.field}", input="${input}"`);

    // Process based on type
    switch (step.type) {
      case "workout_name":
        processedValue = findBestWorkoutMatch(input);
        break;
      case "category":
        processedValue = findBestCategoryMatch(input);
        break;
      case "number":
        processedValue = extractNumber(input);
        console.log(`🔢 Number extraction result: "${input}" → ${processedValue}`);
        
        // If number extraction fails, try more aggressive parsing
        if (isNaN(processedValue) || processedValue < 0 || processedValue > 50) {
          console.log("❌ Invalid number, trying aggressive parsing...");
          
          // Try to extract ANY digits from the input
          const anyDigits = input.replace(/\D/g, '');
          if (anyDigits && !isNaN(parseInt(anyDigits))) {
            const parsedNumber = parseInt(anyDigits);
            if (parsedNumber >= 0 && parsedNumber <= 50) {
              processedValue = parsedNumber;
              console.log(`✅ Aggressive parsing found: ${processedValue}`);
            }
          }
          
          // If still invalid, ask again
          if (isNaN(processedValue) || processedValue < 0 || processedValue > 50) {
            console.log(`❌ Still invalid: ${processedValue}`);
            speak(`I heard "${input}". Please say a number between 0 and 50.`, () => {
              setTimeout(() => {
                attemptCountRef.current += 1;
                hasReceivedResponseRef.current = false;
                askQuestion(stepIndex);
              }, 1000);
            });
            return;
          }
        }
        break;
      case "text":
        processedValue = input.toLowerCase() === "none" ? "" : input;
        break;
      case "confirm":
        const confirmLower = input.toLowerCase();
        console.log(`🤔 Checking confirmation: "${input}" → "${confirmLower}"`);
        
        if (confirmLower.includes("yes")) {
          console.log("✅ Response contains 'yes' - submitting workout");
          submitWorkout();
          return;
        } else if (confirmLower.includes("no")) {
          console.log("❌ Response contains 'no' - quitting immediately");
          speak("Ok ! i am quiting", () => {
            setTimeout(() => onClose(), 1000);
          });
          return;
        } else {
          console.log("⚠️ Response has neither 'yes' nor 'no' - asking again");
          speak(`I heard "${input}". Please say 'yes' to submit or 'no' to cancel.`, () => {
            setTimeout(() => {
              attemptCountRef.current += 1;
              hasReceivedResponseRef.current = false;
              askQuestion(stepIndex);
            }, 1000);
          });
          return;
        }
    }

    // Save to ref
    workoutDataRef.current[step.field] = processedValue;
    console.log(`💾 Saved ${step.field}="${processedValue}"`);
    console.log(`💾 Full data:`, workoutDataRef.current);
    
    // Update display
    setDisplayData({...workoutDataRef.current});

    // Move to next
    currentStepRef.current += 1;
    attemptCountRef.current = 0;
    
    speak(`Got it! ${processedValue}`, () => {
      hasReceivedResponseRef.current = false;
      setTimeout(() => {
        if (currentStepRef.current < steps.length) {
          askQuestion(currentStepRef.current);
        }
      }, 1000);
    });
  };

  const findBestWorkoutMatch = (input) => {
    const inputLower = input.toLowerCase();
    const exactMatch = workoutNames.find(name => name.toLowerCase() === inputLower);
    if (exactMatch) return exactMatch;
    
    const partialMatch = workoutNames.find(name => 
      name.toLowerCase().includes(inputLower) || inputLower.includes(name.toLowerCase())
    );
    return partialMatch || input;
  };

  const findBestCategoryMatch = (input) => {
    const inputLower = input.toLowerCase();
    const exactMatch = categories.find(cat => cat.toLowerCase() === inputLower);
    if (exactMatch) return exactMatch;
    
    const partialMatch = categories.find(cat => 
      cat.toLowerCase().includes(inputLower) || inputLower.includes(cat.toLowerCase())
    );
    if (partialMatch) return partialMatch;

    const aliases = {
      "strength": "Strength Training", "weights": "Weightlifting", "cardio": "Cardio",
      "running": "Running", "cycling": "Cycling", "yoga": "Yoga", "pilates": "Pilates",
      "hiit": "HIIT", "crossfit": "CrossFit", "dance": "Dance", "martial arts": "Martial Arts",
      "sports": "Sports", "flexibility": "Flexibility", "core": "Core",
      "upper body": "Upper Body", "lower body": "Lower Body", "full body": "Full Body"
    };
    return aliases[inputLower] || input;
  };

  const extractNumber = (input) => {
    const inputLower = input.toLowerCase().trim();
    console.log(`🔢 Extracting number from: "${inputLower}"`);
    
    // First, try to find ANY digits in the input (most reliable)
    const digitMatches = input.match(/\d+/g);
    if (digitMatches && digitMatches.length > 0) {
      const number = parseInt(digitMatches[0]);
      if (number >= 0 && number <= 50) {
        console.log(`✅ Found digit: ${number}`);
        return number;
      }
    }
    
    // Simple number words (most common)
    const simpleNumbers = {
      "zero": 0, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, 
      "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
      "eleven": 11, "twelve": 12, "thirteen": 13, "fourteen": 14, "fifteen": 15,
      "sixteen": 16, "seventeen": 17, "eighteen": 18, "nineteen": 19, "twenty": 20,
      "thirty": 30, "forty": 40, "fifty": 50
    };

    // Check for exact matches first
    if (simpleNumbers[inputLower]) {
      console.log(`✅ Simple number match: ${simpleNumbers[inputLower]}`);
      return simpleNumbers[inputLower];
    }
    
    // Check if input contains any simple number word
    for (const [word, num] of Object.entries(simpleNumbers)) {
      if (inputLower.includes(word)) {
        console.log(`✅ Contains "${word}" = ${num}`);
        return num;
      }
    }

    // Common speech recognition errors
    const corrections = {
      "to": 2, "too": 2, "tree": 3, "for": 4, "fore": 4, "ate": 8, "won": 1,
      "tu": 2, "free": 3, "fiv": 5, "siks": 6, "sevn": 7, "nien": 9, "tin": 10,
      "none": 0, "no": 0, "nothing": 0,
      "a": 1, "an": 1, "single": 1, "once": 1,
      "couple": 2, "pair": 2, "double": 2
    };
    
    if (corrections[inputLower]) {
      console.log(`✅ Correction: "${inputLower}" = ${corrections[inputLower]}`);
      return corrections[inputLower];
    }

    // Try compound numbers (21-29, 31-39, 41-49)
    if (inputLower.includes("twenty")) {
      for (let i = 1; i <= 9; i++) {
        const words = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
        if (inputLower.includes(words[i-1])) {
          console.log(`✅ Twenty + ${words[i-1]} = ${20 + i}`);
          return 20 + i;
        }
      }
    }
    
    if (inputLower.includes("thirty")) {
      for (let i = 1; i <= 9; i++) {
        const words = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
        if (inputLower.includes(words[i-1])) {
          console.log(`✅ Thirty + ${words[i-1]} = ${30 + i}`);
          return 30 + i;
        }
      }
    }
    
    if (inputLower.includes("forty")) {
      for (let i = 1; i <= 9; i++) {
        const words = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
        if (inputLower.includes(words[i-1])) {
          console.log(`✅ Forty + ${words[i-1]} = ${40 + i}`);
          return 40 + i;
        }
      }
    }

    console.log(`❌ No valid number found in: "${inputLower}"`);
    return NaN;
  };

  const submitWorkout = () => {
    speak("Perfect! Adding your workout now.", () => {
      const workoutToSubmit = {
        name: workoutDataRef.current.name,
        category: workoutDataRef.current.category,
        sets: parseInt(workoutDataRef.current.sets),
        reps: parseInt(workoutDataRef.current.reps), 
        duration: parseInt(workoutDataRef.current.duration),
        notes: workoutDataRef.current.notes
      };

      console.log("📤 Submitting workout:", workoutToSubmit);
      onWorkoutSubmit(workoutToSubmit);
      
      setTimeout(() => {
        speak("Workout added successfully! Goodbye!");
        setTimeout(() => onClose(), 2000);
      }, 1000);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-5 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Automated Voice Assistant</h3>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full ${
            isListening ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
          }`}>
            <Mic className={`w-3.5 h-3.5 ${isListening ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-medium">{isListening ? 'Listening...' : 'Waiting'}</span>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full ${
            isSpeaking ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
          }`}>
            <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-medium">{isSpeaking ? 'Speaking' : 'Silent'}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1.5">
            <span>Progress</span>
            <span>{currentStepRef.current + 1} / {steps.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentStepRef.current + 1) / steps.length) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-3">
          <p className="text-gray-700 font-medium text-sm">
            {currentStepRef.current < steps.length ? steps[currentStepRef.current].question : "Processing..."}
          </p>
        </div>

        {currentAnswer && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
            <p className="text-xs text-green-700 mb-1">You said:</p>
            <p className="text-sm font-medium text-green-800">"{currentAnswer}"</p>
          </div>
        )}

        {attemptCountRef.current > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <p className="text-xs text-yellow-700">Attempt {attemptCountRef.current + 1} of {MAX_ATTEMPTS}</p>
          </div>
        )}

        <div className="bg-white border rounded-lg p-3">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Collected Data:</h4>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{displayData.name || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium">{displayData.category || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sets:</span>
              <span className="font-medium">{displayData.sets || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Reps:</span>
              <span className="font-medium">{displayData.reps || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{displayData.duration ? `${displayData.duration} min` : "—"}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">🎤 Fully automated - just speak when prompted</p>
        </div>
      </div>
    </div>
  );
}




