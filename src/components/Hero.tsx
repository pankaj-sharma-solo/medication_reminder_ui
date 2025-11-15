import { Button } from './ui/button';
import { ArrowRight, Play } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            <span className="text-sm">New: Advanced Analytics Dashboard</span>
          </div>
          
          <h1 className="text-slate-900 mb-6">
            Transform Your Business with Innovative Solutions
          </h1>
          
          <p className="text-slate-600 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Empower your team with cutting-edge technology and seamless workflows. 
            Experience the future of digital transformation today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={onGetStarted}>
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <p className="text-slate-900">10K+</p>
              <p className="text-slate-600 text-sm">Active Users</p>
            </div>
            <div>
              <p className="text-slate-900">99.9%</p>
              <p className="text-slate-600 text-sm">Uptime</p>
            </div>
            <div>
              <p className="text-slate-900">4.9/5</p>
              <p className="text-slate-600 text-sm">User Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
