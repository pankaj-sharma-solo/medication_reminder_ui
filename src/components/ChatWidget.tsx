import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! 👋 How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('price') || input.includes('cost') || input.includes('pricing')) {
      return 'Our pricing starts at $29/month for the Starter plan. We also offer Professional ($79/month) and Enterprise ($199/month) plans. All plans include a 14-day free trial!';
    }

    if (input.includes('feature') || input.includes('what can')) {
      return 'We offer features including lightning-fast performance, enterprise security, global coverage, mobile-friendly design, advanced analytics, and team collaboration tools. Would you like to know more about any specific feature?';
    }

    if (input.includes('support') || input.includes('help')) {
      return 'We provide 24/7 support via live chat, email, and phone. Professional and Enterprise plans get priority support with faster response times. How can I assist you today?';
    }

    if (input.includes('demo') || input.includes('trial')) {
      return 'Great! You can start a free 14-day trial right now - no credit card required. Would you like me to direct you to the signup page?';
    }

    if (input.includes('contact') || input.includes('talk') || input.includes('speak')) {
      return 'You can reach our team at hello@techsolutions.com or call us at +1 (555) 123-4567. We\'re available Monday-Friday 9AM-6PM PST. Would you prefer to schedule a call?';
    }

    if (input.includes('thanks') || input.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    }

    return 'I\'d be happy to help! You can ask me about our features, pricing, support options, or schedule a demo. What would you like to know?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isMinimized ? 'w-80' : 'w-96'
      }`}
    >
      <Card className="shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-white text-blue-600">TS</AvatarFallback>
              </Avatar>
              <div>
                <p>TechSolutions Support</p>
                <p className="text-sm text-blue-100">Online • Typically replies instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Body */}
        {!isMinimized && (
          <>
            <div className="h-96 overflow-y-auto p-4 bg-slate-50 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-900 shadow-sm'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-900 shadow-sm rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="p-3 bg-white border-t flex gap-2 flex-wrap">
              {['Pricing', 'Features', 'Demo'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setInputValue(option);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-700 transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
