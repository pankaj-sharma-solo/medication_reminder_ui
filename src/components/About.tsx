import { Card } from './ui/card';
import { Target, Users, Lightbulb, Rocket } from 'lucide-react';

export function About() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">About</h1>
        <p className="text-slate-600">
          Learn more about our AI-powered trigger management system
        </p>
      </div>

      <div className="max-w-4xl space-y-8">
        <Card className="p-8">
          <h2 className="text-slate-900 mb-4">Our Mission</h2>
          <p className="text-slate-600 text-lg mb-4">
            We are pioneering the future of personal health management by combining advanced 
            Conversational AI with robust Compliance Automation. Our goal is to eliminate medication 
            non-adherence, helping you manage complex regimens effortlessly through natural conversation 
            and proactive intervention.
          </p>
          <p className="text-slate-600">
            This prototype demonstrates how outbound voice calls, Deep Agent intelligence, and seamless 
            scheduling transform the critical task of taking medication, helping reduce complications 
            and the risk of avoidable hospitalization.
          </p>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-slate-900 mb-2">Vision</h3>
            <p className="text-slate-600">
              Create an AI health agent that profoundly understands your medication regimen and adapts 
              to your daily life, making lifesaving health compliance feel natural and effortless.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-slate-900 mb-2">Team</h3>
            <p className="text-slate-600">
              Built by a passionate team of developers, designers, and AI researchers dedicated 
              to improving patient compliance and safety through advanced automation.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center mb-4">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-slate-900 mb-2">Innovation</h3>
            <p className="text-slate-600">
              Leveraging cutting-edge AI technologies including natural language processing,
              speech recognition, Bidirectional Voice Technology (STT/TTS) and optical character recognition
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-slate-900 mb-2">Future</h3>
            <p className="text-slate-600">
              Continuously evolving with new features, integrations, and AI capabilities based
              on user feedback and emerging technologies.
            </p>
          </Card>
        </div>

        <Card className="p-8 bg-gradient-to-br from-slate-50 to-slate-100">
          <h2 className="text-slate-900 mb-4">Technology Stack</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-slate-900 mb-2">Frontend</p>
              <ul className="space-y-1 text-slate-600">
                <li>• React & TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• shadcn/ui Components</li>
              </ul>
            </div>
            <div>
              <p className="text-slate-900 mb-2">AI Features</p>
              <ul className="space-y-1 text-slate-600">
                <li>• Natural Language Processing</li>
                <li>• Web Speech API</li>
                <li>• OCR Technology</li>
                <li>• Bidirectional Voice Technology (STT/TTS) </li>
              </ul>
            </div>
            <div>
              <p className="text-slate-900 mb-2">Features</p>
              <ul className="space-y-1 text-slate-600">
                <li>• Voice Commands</li>
                <li>• Image Analysis</li>
                <li>• Smart Suggestions</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h2 className="text-slate-900 mb-2">Prototype Version 1.0</h2>
          <p className="text-slate-600 mb-4">
            This prototype showcases the Deep Agent's scheduling logic and UI scheduling representation. 
            The outbound voice call and full-duplex STT/TTS conversation are currently simulated to illustrate 
            the patient experience.
          </p>
          <p className="text-slate-600">
            Interested in seeing more or providing feedback? We'd love to hear from you!
          </p>
        </Card>
      </div>
    </div>
  );
}
