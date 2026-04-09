import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
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
      setTranscript("");
      setFeedback("Listening...");
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }
      if (finalTranscript) {
        transcriptRef.current += finalTranscript;
        setTranscript((prev) => prev + finalTranscript);
      }
      if (interimTranscript) {
        setFeedback(`Heard: ${interimTranscript}`);
      }
    };

    recognition.onerror = (event) => {
      setFeedback(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("🎤 Speech recognition ended");
      setIsListening(false);
      // Process command if transcript exists
      if (transcriptRef.current.trim()) {
        console.log("Auto-processing transcript:", transcriptRef.current);
        processCommand(transcriptRef.current);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

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
    setIsProcessing(true);
    setFeedback("");

    console.log("Processing command:", lowerCommand);

    // Navigation commands
    if (
      lowerCommand.includes("dashboard") ||
      lowerCommand.includes("home")
    ) {
      console.log("Navigating to dashboard");
      speak("Opening dashboard");
      setFeedback("Navigating to dashboard");
      setTimeout(() => {
        navigate("/");
        setIsProcessing(false);
      }, 500);
    } else if (
      lowerCommand.includes("workout") ||
      lowerCommand.includes("exercise")
    ) {
      console.log("Navigating to workouts");
      speak("Opening workout page");
      setFeedback("Navigating to workout page");
      setTimeout(() => {
        navigate("/workouts");
        setIsProcessing(false);
      }, 500);
    } else if (
      lowerCommand.includes("diet") &&
      !lowerCommand.includes("generate") &&
      !lowerCommand.includes("create")
    ) {
      console.log("Navigating to diet");
      speak("Opening diet recommendation page");
      setFeedback("Navigating to diet page");
      setTimeout(() => {
        navigate("/diet");
        setIsProcessing(false);
      }, 500);
    } else if (
      lowerCommand.includes("tutorial") ||
      lowerCommand.includes("help")
    ) {
      console.log("Navigating to tutorials");
      speak("Opening tutorial page");
      setFeedback("Navigating to tutorial page");
      setTimeout(() => {
        navigate("/tutorials");
        setIsProcessing(false);
      }, 500);
    } else if (lowerCommand.includes("blog")) {
      console.log("Navigating to blogs");
      speak("Opening blogs page");
      setFeedback("Navigating to blogs page");
      setTimeout(() => {
        navigate("/blogs");
        setIsProcessing(false);
      }, 500);
    } else if (lowerCommand.includes("profile") || lowerCommand.includes("account")) {
      console.log("Navigating to profile");
      speak("Opening profile page");
      setFeedback("Navigating to profile page");
      setTimeout(() => {
        navigate("/userinfo");
        setIsProcessing(false);
      }, 500);
    } else if (lowerCommand.includes("leaderboard") || lowerCommand.includes("ranking") || lowerCommand.includes("leader board")) {
      console.log("Navigating to leaderboard");
      speak("Opening leaderboard page");
      setFeedback("Navigating to leaderboard page");
      setTimeout(() => {
        navigate("/leaderboard");
        setIsProcessing(false);
      }, 500);
    } else if (lowerCommand.includes("report") || lowerCommand.includes("workout report")) {
      console.log("Navigating to workout report");
      speak("Opening workout report page");
      setFeedback("Navigating to workout report page");
      setTimeout(() => {
        navigate("/workout-report");
        setIsProcessing(false);
      }, 500);
    } else if (lowerCommand.includes("logout") || lowerCommand.includes("sign out")) {
      console.log("Logging out");
      speak("Logging out. Goodbye!");
      setFeedback("Logging out...");
      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/login");
        setIsProcessing(false);
      }, 500);
    } else {
      console.log("Command not recognized");
      speak("Command not recognized. Try saying dashboard, workout, diet, tutorial, blogs, profile, leaderboard, report, or logout");
      setFeedback("Command not recognized");
      setIsProcessing(false);
    }
  };

  // Start listening
  const handleStartListening = () => {
    if (recognitionRef.current && !isListening) {
      transcriptRef.current = "";
      setTranscript("");
      recognitionRef.current.start();
    }
  };

  // Stop listening and process
  const handleStopListening = () => {
    console.log("Stopping listening, transcript:", transcriptRef.current);
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      // Give a small delay to ensure transcript is updated
      setTimeout(() => {
        if (transcriptRef.current.trim()) {
          console.log("Processing transcript:", transcriptRef.current);
          processCommand(transcriptRef.current);
        }
      }, 100);
    }
  };

  // Toggle listening
  const toggleListening = () => {
    if (isListening) {
      handleStopListening();
    } else {
      handleStartListening();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white z-40 hover:scale-110"
        title="Voice Assistant"
      >
        <Mic size={28} />
      </button>

      {/* Voice Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-2xl p-6 z-50 border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Voice Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Status */}
          <div className="mb-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Status:</span>{" "}
              {isListening ? (
                <span className="text-blue-600 font-semibold">🎤 Listening...</span>
              ) : isProcessing ? (
                <span className="text-yellow-600 font-semibold">⏳ Processing...</span>
              ) : (
                <span className="text-gray-600">Ready</span>
              )}
            </p>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">{feedback}</p>
            </div>
          )}

          {/* Transcript */}
          {transcript && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-300">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">You said:</span> {transcript}
              </p>
            </div>
          )}

          {/* Commands Help */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">Try saying:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• "Open dashboard"</li>
              <li>• "Open workout"</li>
              <li>• "Open diet"</li>
              <li>• "Open tutorial"</li>
              <li>• "Open blogs"</li>
              <li>• "Open profile"</li>
              <li>• "Open leaderboard"</li>
              <li>• "Open report"</li>
              <li>• "Logout"</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={toggleListening}
              disabled={isProcessing}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                isListening
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isListening ? (
                <>
                  <MicOff size={18} />
                  Stop
                </>
              ) : (
                <>
                  <Mic size={18} />
                  Start
                </>
              )}
            </button>
            <button
              onClick={() => speak("Voice assistant ready")}
              className="flex-1 py-2 px-4 rounded-lg font-semibold bg-green-500 hover:bg-green-600 text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Volume2 size={18} />
              Test
            </button>
          </div>

          {/* Browser Support Warning */}
          {!recognitionRef.current && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-800">
                ⚠️ Speech recognition not supported in your browser. Please use Chrome, Edge, or Safari.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;
