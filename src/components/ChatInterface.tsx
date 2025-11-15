import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Mic, MicOff, Send } from 'lucide-react';
import type { Trigger } from '../App';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatInterfaceProps {
  triggers: Trigger[];
  onAddTrigger: (trigger: Omit<Trigger, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTrigger: (id: string, updates: Partial<Trigger>) => void;
  onDeleteTrigger: (id: string) => void;
  onToggleTrigger: (id: string) => void;
}

export function ChatInterface({
  triggers,
  onAddTrigger,
  onUpdateTrigger,
  onDeleteTrigger,
  onToggleTrigger,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Hello! I can help you manage triggers. You can:\n• Create triggers (e.g., "Create a trigger called Daily Backup that runs at midnight")\n• Edit triggers (e.g., "Change Daily Backup action to archive files")\n• Delete triggers (e.g., "Delete the Daily Backup trigger")\n• Toggle triggers (e.g., "Activate the Email Alert trigger")\n• List triggers (e.g., "Show all triggers")',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleVoiceInput = () => {
    if (!recognition) {
      addMessage('assistant', 'Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const processCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();

    // List triggers
    if (lowerCommand.includes('list') || lowerCommand.includes('show')) {
      if (triggers.length === 0) {
        return 'You have no triggers yet.';
      }
      const triggerList = triggers
        .map(
          (t) =>
            `• ${t.name} (${t.isActive ? 'Active' : 'Inactive'})\n  Condition: ${t.condition}\n  Action: ${t.action}`
        )
        .join('\n\n');
      return `Here are your triggers:\n\n${triggerList}`;
    }

    // Create trigger
    if (lowerCommand.includes('create') || lowerCommand.includes('add')) {
      const nameMatch = command.match(/(?:called|named)\s+["']?([^"']+?)["']?(?:\s+that|\s+when|\s+with|$)/i);
      const conditionMatch = command.match(/(?:when|condition|if)\s+["']?([^"']+?)["']?(?:\s+then|\s+action|\s+do|$)/i);
      const actionMatch = command.match(/(?:then|action|do)\s+["']?([^"']+?)["']?$/i);

      const name = nameMatch?.[1]?.trim() || 'New Trigger';
      const condition = conditionMatch?.[1]?.trim() || command.replace(/create|add|trigger/gi, '').trim() || 'Specify condition';
      const action = actionMatch?.[1]?.trim() || 'Specify action';

      onAddTrigger({
        name,
        condition,
        action,
        isActive: true,
      });

      return `Created trigger "${name}" successfully!`;
    }

    // Delete trigger
    if (lowerCommand.includes('delete') || lowerCommand.includes('remove')) {
      const trigger = triggers.find((t) =>
        lowerCommand.includes(t.name.toLowerCase())
      );
      
      if (trigger) {
        onDeleteTrigger(trigger.id);
        return `Deleted trigger "${trigger.name}" successfully!`;
      }
      return 'Could not find that trigger. Please specify the trigger name.';
    }

    // Toggle trigger
    if (lowerCommand.includes('activate') || lowerCommand.includes('enable') || 
        lowerCommand.includes('deactivate') || lowerCommand.includes('disable')) {
      const trigger = triggers.find((t) =>
        lowerCommand.includes(t.name.toLowerCase())
      );
      
      if (trigger) {
        onToggleTrigger(trigger.id);
        const action = lowerCommand.includes('activate') || lowerCommand.includes('enable') 
          ? 'activated' 
          : 'deactivated';
        return `Successfully ${action} trigger "${trigger.name}"!`;
      }
      return 'Could not find that trigger. Please specify the trigger name.';
    }

    // Edit trigger
    if (lowerCommand.includes('edit') || lowerCommand.includes('update') || lowerCommand.includes('change')) {
      const trigger = triggers.find((t) =>
        lowerCommand.includes(t.name.toLowerCase())
      );
      
      if (trigger) {
        const updates: Partial<Trigger> = {};
        
        if (lowerCommand.includes('condition')) {
          const conditionMatch = command.match(/condition\s+(?:to\s+)?["']?([^"']+?)["']?$/i);
          if (conditionMatch) {
            updates.condition = conditionMatch[1].trim();
          }
        }
        
        if (lowerCommand.includes('action')) {
          const actionMatch = command.match(/action\s+(?:to\s+)?["']?([^"']+?)["']?$/i);
          if (actionMatch) {
            updates.action = actionMatch[1].trim();
          }
        }
        
        if (lowerCommand.includes('name')) {
          const nameMatch = command.match(/name\s+(?:to\s+)?["']?([^"']+?)["']?$/i);
          if (nameMatch) {
            updates.name = nameMatch[1].trim();
          }
        }

        if (Object.keys(updates).length > 0) {
          onUpdateTrigger(trigger.id, updates);
          return `Updated trigger "${trigger.name}" successfully!`;
        }
        return 'Please specify what you want to change (name, condition, or action).';
      }
      return 'Could not find that trigger. Please specify the trigger name.';
    }

    return "I'm not sure I understood that. Try asking me to create, edit, delete, toggle, or list triggers.";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    addMessage('user', input);
    const response = processCommand(input);
    setTimeout(() => addMessage('assistant', response), 300);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="flex flex-col h-[600px] bg-white">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-900'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 bg-slate-50">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a command or use voice input..."
            className="min-h-[60px] resize-none"
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={toggleVoiceInput}
              variant={isListening ? 'destructive' : 'outline'}
              size="icon"
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button onClick={handleSend} size="icon" title="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
