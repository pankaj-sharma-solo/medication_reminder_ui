import { Card } from './ui/card';
import { Mic, Camera, Zap, Calendar, MessageSquare, BarChart3, Bell, CheckCircle } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: MessageSquare,
      title: 'AI Chat Assistant',
      description: 'Natural language interface to manage your triggers and tasks with conversational AI.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Mic,
      title: 'Voice Commands',
      description: 'Use voice input to create, update, and manage triggers hands-free.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Camera,
      title: 'OCR Image Analysis',
      description: 'Upload images of receipts, notes, or documents for automatic text extraction.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Intelligent due date tracking with automatic reminders and priority management.',
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: Zap,
      title: 'Quick Actions',
      description: 'Perform common tasks quickly with keyboard shortcuts and quick commands.',
      color: 'from-red-500 to-rose-500',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track your productivity with detailed statistics and completion rates.',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Get timely reminders and updates about your upcoming triggers and deadlines.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: CheckCircle,
      title: 'Progress Tracking',
      description: 'Monitor your progress with visual indicators and completion statistics.',
      color: 'from-teal-500 to-cyan-500',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Features</h1>
        <p className="text-slate-600">
          Powerful capabilities to help you stay organized and productive
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}
              >
                <Icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8 p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <h2 className="text-slate-900 mb-4">Coming Soon</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 mt-2 bg-green-600 rounded-full"></div>
            <div>
              <p className="text-slate-900">Calendar Integration</p>
              <p className="text-slate-600 text-sm">Sync with Google Calendar, Outlook, and more</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 mt-2 bg-orange-600 rounded-full"></div>
            <div>
              <p className="text-slate-900">Mobile Apps</p>
              <p className="text-slate-600 text-sm">Native iOS and Android applications</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
