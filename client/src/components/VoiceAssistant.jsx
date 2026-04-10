import { useState, useEffect, useRef } from "react";
import { Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState("");
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const navigate = useNavigate();

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setFeedback("Listening...");
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        }
      }
      if (finalTranscript) {
        transcriptRef.current += finalTranscript;
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setFeedback("");
    };

    recognition.onend = () => {
      setIsListening(false);
      // Process command if transcript exists
      if (transcriptRef.current.trim()) {
        processCommand(transcriptRef.current);
      }
      setFeedback("");
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Play activation sound (Google Assistant style)
  const playActivationSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // First tone (higher pitch)
      const oscillator1 = audioContext.createOscillator();
      const gainNode1 = audioContext.createGain();
      
      oscillator1.connect(gainNode1);
      gainNode1.connect(audioContext.destination);
      
      oscillator1.frequency.value = 600; // First note
      oscillator1.type = "sine";
      
      gainNode1.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      
      oscillator1.start(audioContext.currentTime);
      oscillator1.stop(audioContext.currentTime + 0.15);
      
      // Second tone (lower pitch) - slightly delayed
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();
      
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);
      
      oscillator2.frequency.value = 480; // Second note (lower)
      oscillator2.type = "sine";
      
      gainNode2.gain.setValueAtTime(0.2, audioContext.currentTime + 0.08);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
      
      oscillator2.start(audioContext.currentTime + 0.08);
      oscillator2.stop(audioContext.currentTime + 0.25);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  // Text to Speech
  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Process voice command
  const processCommand = (command) => {
    const lowerCommand = command.toLowerCase().trim();

    // Navigation commands
    if (lowerCommand.includes("dashboard") || lowerCommand.includes("home")) {
      speak("Opening dashboard");
      setTimeout(() => navigate("/"), 300);
    } else if (lowerCommand.includes("workout") || lowerCommand.includes("exercise")) {
      speak("Opening workout page");
      setTimeout(() => navigate("/workouts"), 300);
    } else if (lowerCommand.includes("diet") && !lowerCommand.includes("generate")) {
      speak("Opening diet recommendation page");
      setTimeout(() => navigate("/diet"), 300);
    } else if (lowerCommand.includes("tutorial") || lowerCommand.includes("help")) {
      speak("Opening tutorial page");
      setTimeout(() => navigate("/tutorials"), 300);
    } else if (lowerCommand.includes("blog")) {
      speak("Opening blogs page");
      setTimeout(() => navigate("/blogs"), 300);
    } else if (lowerCommand.includes("profile") || lowerCommand.includes("account")) {
      speak("Opening profile page");
      setTimeout(() => navigate("/userinfo"), 300);
    } else if (lowerCommand.includes("leaderboard") || lowerCommand.includes("ranking")) {
      speak("Opening leaderboard page");
      setTimeout(() => navigate("/leaderboard"), 300);
    } else if (lowerCommand.includes("report") || lowerCommand.includes("workout report")) {
      speak("Opening workout report page");
      setTimeout(() => navigate("/workout-report"), 300);
    } else if (lowerCommand.includes("logout") || lowerCommand.includes("sign out")) {
      speak("Logging out. Goodbye!");
      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/login");
      }, 500);
    } else {
      speak("Command not recognized");
    }
  };

  // Toggle listening
  const toggleListening = () => {
    // Play activation sound
    playActivationSound();
    
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      if (recognitionRef.current) {
        transcriptRef.current = "";
        recognitionRef.current.start();
      }
    }
  };

  return (
    <>
      {/* Floating Button with Animation */}
      <button
        onClick={toggleListening}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center text-white z-40 ${
          isListening
            ? "bg-gradient-to-r from-red-500 to-red-600 animate-pulse scale-110"
            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-110"
        }`}
        title={isListening ? "Stop Listening" : "Start Voice Assistant"}
      >
        <Mic size={28} className={isListening ? "animate-bounce" : ""} />
        
        {/* Listening Animation Rings */}
        {isListening && (
          <>
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
            <span className="absolute inline-flex h-20 w-20 rounded-full bg-red-400 opacity-50 animate-ping animation-delay-150"></span>
          </>
        )}
      </button>

      {/* Feedback Toast */}
      {feedback && (
        <div className="fixed bottom-28 right-6 bg-white rounded-lg shadow-xl p-4 z-50 border-2 border-blue-500 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <span className="w-1 h-6 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="w-1 h-6 bg-blue-500 rounded-full animate-pulse animation-delay-100"></span>
              <span className="w-1 h-6 bg-blue-500 rounded-full animate-pulse animation-delay-200"></span>
            </div>
            <p className="text-sm font-semibold text-gray-800">{feedback}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;
