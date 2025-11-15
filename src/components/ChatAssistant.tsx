import { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Mic, MicOff, Send, Image as ImageIcon, X, Sparkles, PhoneCall, PhoneOff } from 'lucide-react'; // Added Phone icons
import { toast } from 'sonner';
import type { Trigger } from '../App';

// 1. IMPORT AGORA RTC SDK
import AgoraRTC, { IAgoraRTCClient, ILocalAudioTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng';

// --- AGORA CONFIGURATION ---
const AGORA_APP_ID = "6d85fc029ecb426eb765613d51596ec0";
// NOTE: Token must be dynamically generated on your FastAPI server for security!
// Using a static token is for initial testing only.
const AGORA_TOKEN = "MTcwNjcxY2Y5YzAxNDJjY2I3MWJhZGQ0ODg1ZjJmMWM6YTU1ODMwOTY4ODVmNGFjZDgxNzI1MmRlMDhjOGI4Yjk=";
const AGORA_CHANNEL = "ai_assistant_channel"; // The channel your FastAPI bot is listening to

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  image?: string;
}

interface ChatAssistantProps {
  triggers: Trigger[];
  onAddTrigger: (trigger: Omit<Trigger, 'id'>) => void;
  onUpdateTrigger: (id: string, updates: Partial<Trigger>) => void;
}

export function ChatAssistant({ triggers, onAddTrigger, onUpdateTrigger }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 I\'m your AI assistant. Click the phone icon to connect via voice.',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. AGORA STATE
  const [agoraClient, setAgoraClient] = useState<IAgoraRTCClient | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<ILocalAudioTrack | null>(null);
  const [remoteBotUID, setRemoteBotUID] = useState<number | null>(null); // To track the bot's UID

  // Quick action suggestions and simulated chats remain the same...
  //

  // --- Utility Functions ---

  const addMessage = (sender: Message['sender'], text: string, image?: string) => {
    setMessages((prev) => [...prev, {
      id: Date.now().toString() + Math.random(),
      text: text,
      sender: sender,
      timestamp: new Date(),
      image: image,
    }]);
  };

  useEffect(() => {
    // Scroll to the bottom whenever a new message is added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- AGORA RTC LOGIC ---

  const initAgoraClient = () => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    // Set up event listeners for the remote bot's audio stream
    client.on("user-published", async (user, mediaType) => {
      if (mediaType === 'audio') {
        await client.subscribe(user, mediaType);
        const remoteAudioTrack = user.audioTrack as IRemoteAudioTrack;
        remoteAudioTrack.play();
        setRemoteBotUID(user.uid as number);
        addMessage('assistant', `🎤 Voice Bot connected. UID: ${user.uid}. Say something to get started!`);
      }
    });

    client.on("user-unpublished", (user) => {
      if (user.uid === remoteBotUID) {
        setRemoteBotUID(null);
        addMessage('assistant', 'Voice Bot disconnected.');
      }
    });

    client.on("user-left", (user) => {
      if (user.uid === remoteBotUID) {
        setRemoteBotUID(null);
        addMessage('assistant', 'Voice Bot left the channel.');
      }
    });

    setAgoraClient(client);
    return client;
  };

  const startCall = async () => {
    if (isCalling) return;
    setIsCalling(true);
    addMessage('assistant', 'Connecting to the AI Voice Channel...');
    toast.info('Connecting...');

    try {
      const client = agoraClient || initAgoraClient();

      // Use a unique UID for the user (e.g., a session ID or user ID)
      const uid = Math.floor(Math.random() * 100000);

      // 3. Join the channel
      await client.join(AGORA_APP_ID, AGORA_CHANNEL, AGORA_TOKEN, uid);
      toast.success('Successfully connected to the voice channel!');

      // 4. Create the local audio track (mic)
      const track = await AgoraRTC.createMicrophoneAudioTrack();
      setLocalAudioTrack(track);

      // Do not publish yet, wait for the user to press the mic button

    } catch (error) {
      console.error("Agora join failed:", error);
      toast.error('Failed to join the voice channel. Check your token/App ID.');
      setIsCalling(false);
      addMessage('assistant', `Connection failed: ${error.message}`);
    }
  };

  const endCall = async () => {
    if (!agoraClient || !isCalling) return;

    try {
      // Stop the local audio track and close the mic
      localAudioTrack?.close();

      // Unpublish the track before leaving the channel
      if(agoraClient.localTracks.length > 0) {
        await agoraClient.unpublish(agoraClient.localTracks);
      }

      await agoraClient.leave();

      setLocalAudioTrack(null);
      setIsListening(false);
      setIsCalling(false);
      setRemoteBotUID(null);
      addMessage('assistant', 'Disconnected from the voice channel.');
      toast.info('Disconnected.');
    } catch (error) {
      console.error("Agora leave failed:", error);
      toast.error('Failed to leave the voice channel.');
    }
  };

  const toggleVoiceInput = async () => {
    if (!agoraClient || !localAudioTrack || !isCalling) {
      toast.error('Please connect to the voice channel first.');
      return;
    }

    if (isListening) {
      // Stop publishing audio (Mute)
      await agoraClient.unpublish([localAudioTrack]);
      setIsListening(false);
      toast.info('Microphone muted. Publishing stopped.');
    } else {
      // Start publishing audio (Unmute)
      await agoraClient.publish([localAudioTrack]);
      setIsListening(true);
      toast.info('Microphone active! Your voice is now being sent to the AI.');

      // For text input fallback (Simulated STT)
      // In a real scenario, Agora's Convo AI handles STT on the backend.
      // We simulate sending a text command after a short voice window.
      setTimeout(() => {
        if (isListening) {
          // Simulate STT output sent by Agora's webhook to your FastAPI server
          const simulatedTranscript = "Create a new trigger for the team project update tomorrow morning";
          addMessage('user', `(Voice) ${simulatedTranscript}`);

          // Immediately stop publishing to simulate a single speech turn
          agoraClient.unpublish([localAudioTrack]).then(() => setIsListening(false));

          // Process the *transcribed* text locally for the chat window logic
          handleSimulatedSTT(simulatedTranscript);
        }
      }, 3000); // 3-second speaking window
    }
  };

  // --- Simulated Command Processing (for chat window display) ---

  const handleSimulatedSTT = (transcript: string) => {
    setIsTyping(true);
    // Simulate the server-side FastAPI -> LangGraph processing
    setTimeout(() => {
      const response = processCommand(transcript, false); // Process command without image
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
      // NOTE: In the real app, this text would be sent to Agora for TTS and audio playback
      // The user would HEAR this response, not just read it.
    }, 1000 + Math.random() * 1000);
  }

  // The rest of the logic remains largely the same...

  // @ts-ignore
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        toast.success('Image selected! Send your message to analyze it.');
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateOCR = (imageData: string): string => {
    const sampleTexts = [
      'Invoice #12345\nDate: Nov 12, 2025\nAmount: $1,234.56\nDue: Nov 30, 2025',
      'Meeting Notes\n- Discuss Q4 targets\n- Review budget\n- Team assignments',
    ];
    return sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
  };

  const processCommand = (command: string, hasImage: boolean): string => {
    // ... (Your existing logic for processing commands based on the chat history)
    const lowerCommand = command.toLowerCase();

    // Handle image OCR
    if (hasImage) {
      const ocrText = simulateOCR(selectedImage!);
      return `I've analyzed the image using OCR. Here's what I found:\n\n${ocrText}\n\nWould you like me to create a trigger based on this information?`;
    }

    // List triggers
    if (lowerCommand.includes('list') || lowerCommand.includes('show') || lowerCommand.includes('what')) {
      if (triggers.length === 0) {
        return 'You don\'t have any triggers yet. Would you like me to help you create one?';
      }
      const triggerList = triggers.slice(0, 5).map(
          (t) => `• ${t.name} (${t.status}, ${t.priority} priority)`
      ).join('\n\n');
      return `Here are your triggers:\n\n${triggerList}`;
    }

    // Create trigger
    if (lowerCommand.includes('create') || lowerCommand.includes('add') || lowerCommand.includes('new')) {
      const nameMatch = command.match(/(?:called|named|for)\s+["']?([^"']+?)["']?(?:\s|$)/i);
      const name = nameMatch?.[1]?.trim() || 'New Task';

      onAddTrigger({
        name,
        description: command,
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: lowerCommand.includes('urgent') || lowerCommand.includes('important') ? 'high' : 'medium',
        tags: ['assistant-created'],
      });

      return `I've created a new trigger called "${name}". It's set to pending with a due date in 7 days.`;
    }

    // ... (Other command logic like 'complete', 'help', 'stat')

    return 'I\'m here to help! You can ask me to create triggers, show your tasks, mark items complete, or upload images for OCR analysis. What would you like to do?';
  };

  const handleSend = () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input || '📷 Uploaded image for analysis',
      sender: 'user',
      timestamp: new Date(),
      image: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = processCommand(input, !!selectedImage);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
      setSelectedImage(null);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ... (handleQuickAction and playSimulatedChat remain the same)

  return (
      <Card className="flex flex-col h-[calc(100vh-200px)] bg-white">
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                AI
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-slate-900">AI Assistant</h3>
              <p className="text-slate-600 text-sm">
                Status: {isCalling ? '🎙️ In Call' : 'Offline'} • Voice & OCR enabled
              </p>
            </div>
            {/* New Call/End Button */}
            <div className='ml-auto'>
              {isCalling ? (
                  <Button variant="destructive" onClick={endCall} size="icon" title="End Voice Call">
                    <PhoneOff className="h-4 w-4" />
                  </Button>
              ) : (
                  <Button variant="default" onClick={startCall} size="icon" title="Start Voice Call">
                    <PhoneCall className="h-4 w-4" />
                  </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* ... (Message rendering logic remains the same) ... */}
          {messages.map((message) => (
              <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-slate-100 text-slate-900'
                    }`}
                >
                  {message.image && (
                      <img
                          src={message.image}
                          alt="Uploaded"
                          className="rounded-lg mb-2 max-w-full h-auto max-h-48 object-cover"
                      />
                  )}
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <p
                      className={`text-xs mt-2 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-slate-500'
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
                <div className="bg-slate-100 rounded-lg px-4 py-3">
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

        {/* ... (Selected Image and Quick Menu logic remains the same) ... */}

        {selectedImage && (
            <div className="px-6 py-3 border-t bg-blue-50">
              <div className="flex items-center gap-3">
                <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="text-slate-900 text-sm">Image ready for OCR analysis</p>
                  <p className="text-slate-600 text-xs">Send your message to analyze</p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
        )}

        {/* Quick Menu */}
        <div className="px-6 py-3 border-t bg-white">
          <div className="flex items-center justify-between mb-2">
            <button
                onClick={() => setShowQuickMenu(!showQuickMenu)}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>{showQuickMenu ? 'Hide' : 'Show'} Quick Actions</span>
            </button>
          </div>
        </div>


        <div className="p-4 border-t bg-slate-50">
          <div className="flex gap-2">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />
            {/* 5. Microphone Button now controls Agora publish/unpublish */}
            <Button
                variant="outline"
                size="icon"
                onClick={toggleVoiceInput}
                disabled={!isCalling}
                className={isListening ? 'bg-red-50 border-red-300' : ''}
                title={isListening ? 'Stop speaking' : 'Start voice input (Push to Talk)'}
            >
              {isListening ? (
                  <MicOff className="h-4 w-4 text-red-600" />
              ) : (
                  <Mic className="h-4 w-4" />
              )}
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                title="Upload image for OCR"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message or use voice input..."
                className="min-h-[60px] resize-none flex-1"
            />
            <Button onClick={handleSend} size="icon" className="h-[60px]">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
  );
}