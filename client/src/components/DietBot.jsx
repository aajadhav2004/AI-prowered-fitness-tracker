import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Loader, Mic, Volume2, VolumeX, Globe } from 'lucide-react';
import axios from 'axios';
import { playActivationSound } from '../utils/soundUtils';

const DietBot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState('en'); // en, hi, mr
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  const languages = {
    en: { 
      name: 'English', 
      code: 'en-US',
      welcome: "Hi! I'm Diet Bot 🥗 Your personal nutrition assistant. Ask me anything about diet, nutrition, meal planning, or healthy eating!",
      placeholder: "Ask about diet, nutrition, meals...",
      listening: "🎤 Listening... Speak now!",
      typeOrSpeak: "Type, speak, or ask about nutrition!"
    },
    hi: { 
      name: 'हिंदी', 
      code: 'hi-IN',
      welcome: "नमस्ते! मैं डाइट बॉट हूं 🥗 आपका व्यक्तिगत पोषण सहायक। मुझसे आहार, पोषण, भोजन योजना या स्वस्थ खाने के बारे में कुछ भी पूछें!",
      placeholder: "आहार, पोषण, भोजन के बारे में पूछें...",
      listening: "🎤 सुन रहा हूं... अब बोलें!",
      typeOrSpeak: "टाइप करें, बोलें, या पोषण के बारे में पूछें!"
    },
    mr: { 
      name: 'मराठी', 
      code: 'mr-IN',
      welcome: "नमस्कार! मी डाएट बॉट आहे 🥗 तुमचा वैयक्तिक पोषण सहाय्यक। मला आहार, पोषण, जेवणाची योजना किंवा निरोगी खाण्याबद्दल काहीही विचारा!",
      placeholder: "आहार, पोषण, जेवण बद्दल विचारा...",
      listening: "🎤 ऐकत आहे... आता बोला!",
      typeOrSpeak: "टाइप करा, बोला, किंवा पोषणाबद्दल विचारा!"
    }
  };

  // Initialize welcome message based on language
  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: languages[language].welcome
    }]);
  }, [language]);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = languages[language].code;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Speech Synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      // Load voices (they might not be immediately available)
      const loadVoices = () => {
        const voices = synthRef.current.getVoices();
        console.log('Voices loaded:', voices.length);
        if (voices.length > 0) {
          console.log('Available languages:', [...new Set(voices.map(v => v.lang))].join(', '));
        }
      };
      
      // Load voices immediately
      loadVoices();
      
      // Also listen for voiceschanged event (Chrome needs this)
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [language]); // Re-initialize when language changes

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    // Play activation sound
    playActivationSound();

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const speakText = (text) => {
    if (!synthRef.current) {
      console.log('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    synthRef.current.cancel();

    // Remove emojis and special characters for better speech
    const cleanText = text.replace(/[😊🥗💪✓🎯🔄]/g, '').trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Set language for speech
    utterance.lang = languages[language].code;
    
    // Try to find a voice for the selected language
    const voices = synthRef.current.getVoices();
    console.log('Available voices:', voices.length);
    
    // Find voice matching the language
    let selectedVoice = null;
    
    if (language === 'hi') {
      // Try to find Hindi voice
      selectedVoice = voices.find(voice => 
        voice.lang.includes('hi') || 
        voice.lang.includes('HI') ||
        voice.name.toLowerCase().includes('hindi')
      );
      console.log('Hindi voice found:', selectedVoice?.name);
    } else if (language === 'mr') {
      // Try to find Marathi voice (might not be available, fallback to Hindi)
      selectedVoice = voices.find(voice => 
        voice.lang.includes('mr') || 
        voice.lang.includes('MR') ||
        voice.name.toLowerCase().includes('marathi')
      );
      if (!selectedVoice) {
        // Fallback to Hindi voice for Marathi
        selectedVoice = voices.find(voice => 
          voice.lang.includes('hi') || 
          voice.name.toLowerCase().includes('hindi')
        );
      }
      console.log('Marathi/Hindi voice found:', selectedVoice?.name);
    } else {
      // English voice
      selectedVoice = voices.find(voice => 
        voice.lang.includes('en') || 
        voice.lang.includes('EN')
      );
      console.log('English voice found:', selectedVoice?.name);
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      console.warn(`No voice found for ${language}, using default`);
    }
    
    utterance.rate = 0.85; // Slightly slower for better clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      console.log('Started speaking in', language);
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      console.log('Finished speaking');
      setIsSpeaking(false);
    };
    utterance.onerror = (event) => {
      console.error('Speech error:', event.error);
      setIsSpeaking(false);
    };

    // Small delay to ensure voices are loaded
    setTimeout(() => {
      synthRef.current.speak(utterance);
    }, 100);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/user/diet-bot`,
        { 
          message: userMessage,
          language: language // Send selected language to backend
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botResponse = response.data.response;

      // Add bot response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: botResponse
      }]);

      // Speak the response
      speakText(botResponse);
    } catch (error) {
      console.error('Diet Bot error:', error);
      const errorMsg = "Sorry, I'm having trouble connecting right now. Please try again in a moment.";
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMsg
      }]);
      speakText(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Diet Bot</h3>
                <p className="text-xs text-green-100">Your Nutrition Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-sm font-medium pl-3 pr-8 py-2 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition"
                >
                  <option value="en" className="bg-green-600 text-white">🇬🇧 EN</option>
                  <option value="hi" className="bg-green-600 text-white">🇮🇳 हिं</option>
                  <option value="mr" className="bg-green-600 text-white">🇮🇳 मरा</option>
                </select>
                <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>
              
              {/* Voice Stop Button */}
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition"
                  title="Stop speaking"
                >
                  <VolumeX className="w-5 h-5" />
                </button>
              )}
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 shadow-md rounded-bl-none border border-gray-200'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-semibold text-green-600">Diet Bot</span>
                    </div>
                    <button
                      onClick={() => speakText(msg.content)}
                      className="text-green-600 hover:text-green-700 p-1 rounded hover:bg-green-50 transition"
                      title="Read aloud"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-md border border-gray-200">
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin text-green-600" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={languages[language].placeholder}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isLoading || isListening}
            />
            <button
              onClick={handleVoiceInput}
              disabled={isLoading}
              className={`p-3 rounded-full transition shadow-lg relative ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              title={isListening ? 'Stop listening' : 'Voice input'}
            >
              <Mic className="w-5 h-5" />
              
              {/* Small blinking ring animation when listening */}
              {isListening && (
                <>
                  <span className="absolute inset-0 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                  <span className="absolute inset-0 rounded-full border-2 border-red-300 animate-pulse"></span>
                </>
              )}
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-3 rounded-full hover:from-green-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {isListening ? languages[language].listening : languages[language].typeOrSpeak}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DietBot;
