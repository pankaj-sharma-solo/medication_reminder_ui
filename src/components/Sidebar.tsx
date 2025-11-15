import { Home, Zap, Info, Settings } from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  currentView: 'home' | 'features' | 'about';
  onNavigate: (view: 'home' | 'features' | 'about') => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'features' as const, label: 'Features', icon: Zap },
    { id: 'about' as const, label: 'About', icon: Info },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white">AI</span>
          </div>
          <div>
            <h2 className="text-slate-900">AVA</h2>
            <p className="text-slate-500 text-sm">Prototype v1.0</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-200">
        <Button variant="outline" className="w-full" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </aside>
  );
}
