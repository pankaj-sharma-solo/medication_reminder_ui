import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ChatAssistant } from './components/ChatAssistant';
import { Features } from './components/Features';
import { About } from './components/About';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

export interface Trigger {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'pending' | 'completed';
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'custom';
  recurringInterval?: string; // e.g., "Every day at 8:00 AM", "Every Sunday"
  notificationNumber?: string;
  backupNumber?: string;
  notificationChannels?: ('sms' | 'email' | 'push')[];
  medications?: {
    name: string;
    dosage: string;
    instructions: string;
  }[];
}

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'features' | 'about'>('home');
  const [triggers, setTriggers] = useState<Trigger[]>([
    {
      id: '1',
      name: 'Morning Dose (Type 2 Diabetes)',
      description: 'Metformin 500 mg, taken with breakfast.',
      status: 'active', // Indicates the dose is upcoming/due
      dueDate: '2025-11-14T08:00:00', // Set for 8:00 AM today
      priority: 'high',
      tags: ['daily', 'diabetes', 'critical'],
      isRecurring: true,
      recurringPattern: 'daily',
      recurringInterval: 'Every day at 8:00 AM',
      notificationNumber: '+1 (555) 123-4567',
      backupNumber: '+1 (555) 987-6543',
      notificationChannels: ['sms', 'push'],
      medications: [
        { name: 'Metformin', dosage: '500 mg', instructions: 'Take with breakfast' },
      ],
    },
    {
      id: '2',
      name: 'Afternoon Dose (Antibiotic)',
      description: 'Amoxicillin 250 mg, must be taken 12 hours after the night dose.',
      status: 'pending', // Indicates the next dose is pending
      dueDate: '2025-11-14T14:30:00', // Set for 2:30 PM today
      priority: 'medium',
      tags: ['7-day course', 'infection'],
      isRecurring: true,
      recurringPattern: 'daily',
      recurringInterval: 'Every 12 hours',
      notificationNumber: '+1 (555) 123-4567',
      backupNumber: '+1 (555) 987-6543',
      notificationChannels: ['sms', 'email'],
      medications: [
        { name: 'Amoxicillin', dosage: '250 mg', instructions: 'Take 12 hours after previous dose' },
      ],
    },
    {
      id: '3',
      name: 'Nightly Supplement (Vitamin)',
      description: 'Multivitamin capsule, taken one hour before bed.',
      status: 'active',
      dueDate: '2025-11-14T21:00:00', // Set for 9:00 PM tonight
      priority: 'low',
      tags: ['supplement', 'daily'],
      isRecurring: true,
      recurringPattern: 'daily',
      recurringInterval: 'Every day at 9:00 PM',
      notificationNumber: '+1 (555) 123-4567',
      notificationChannels: ['push'],
      medications: [
        { name: 'Multivitamin', dosage: '1 capsule', instructions: 'Take 1 hour before bed' },
      ],
    },
    {
      id: '4',
      name: 'Weekly Dose (Chronic Condition)',
      description: 'Folic Acid 5 mg, taken every Sunday morning.',
      status: 'pending',
      dueDate: '2025-11-16T09:00:00', // Set for next Sunday
      priority: 'medium',
      tags: ['weekly', 'chronic'],
      isRecurring: true,
      recurringPattern: 'weekly',
      recurringInterval: 'Every Sunday at 9:00 AM',
      notificationNumber: '+1 (555) 123-4567',
      backupNumber: '+1 (555) 987-6543',
      notificationChannels: ['sms', 'push', 'email'],
      medications: [
        { name: 'Folic Acid', dosage: '5 mg', instructions: 'Take on empty stomach' },
      ],
    },
  ]);

  const addTrigger = (trigger: Omit<Trigger, 'id'>) => {
    const newTrigger: Trigger = {
      ...trigger,
      id: crypto.randomUUID(),
    };
    setTriggers((prev) => [...prev, newTrigger]);
  };

  const updateTrigger = (id: string, updates: Partial<Trigger>) => {
    setTriggers((prev) =>
      prev.map((trigger) => (trigger.id === id ? { ...trigger, ...updates } : trigger))
    );
  };

  const deleteTrigger = (id: string) => {
    setTriggers((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-1 ml-64">
        {currentView === 'home' && (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-slate-900 mb-2">Welcome Back</h1>
              <p className="text-slate-600">Manage your triggers and chat with your AI assistant</p>
            </div>

            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="bg-white border border-slate-200">
                <TabsTrigger value="dashboard">What's Next</TabsTrigger>
                <TabsTrigger value="assistant">Chat with Assistant</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                <Dashboard
                  triggers={triggers}
                  onAddTrigger={addTrigger}
                  onUpdateTrigger={updateTrigger}
                  onDeleteTrigger={deleteTrigger}
                />
              </TabsContent>

              <TabsContent value="assistant" className="space-y-6">
                <ChatAssistant
                  triggers={triggers}
                  onAddTrigger={addTrigger}
                  onUpdateTrigger={updateTrigger}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {currentView === 'features' && <Features />}
        {currentView === 'about' && <About />}
      </main>
    </div>
  );
}