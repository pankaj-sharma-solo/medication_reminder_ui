import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trash2, Plus, Edit2, Power, PowerOff } from 'lucide-react';
import type { HistoryEntry } from '../App';

interface HistorySummaryProps {
  history: HistoryEntry[];
  onClear: () => void;
}

export function HistorySummary({ history, onClear }: HistorySummaryProps) {
  const getIcon = (type: HistoryEntry['type']) => {
    switch (type) {
      case 'create':
        return <Plus className="h-4 w-4" />;
      case 'edit':
        return <Edit2 className="h-4 w-4" />;
      case 'delete':
        return <Trash2 className="h-4 w-4" />;
      case 'toggle':
        return <Power className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: HistoryEntry['type']) => {
    switch (type) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'edit':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'toggle':
        return 'bg-amber-100 text-amber-800';
    }
  };

  const getSummary = () => {
    const counts = history.reduce(
      (acc, entry) => {
        acc[entry.type] = (acc[entry.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return counts;
  };

  const summary = getSummary();

  if (history.length === 0) {
    return (
      <Card className="p-12 text-center bg-white">
        <PowerOff className="h-12 w-12 mx-auto mb-4 text-slate-300" />
        <p className="text-slate-500">No activity yet. Start managing triggers to see history!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-slate-900">Activity Summary</h2>
          <Button variant="outline" size="sm" onClick={onClear}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-green-900">Created</p>
            <p className="text-green-600">{summary.create || 0}</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-900">Edited</p>
            <p className="text-blue-600">{summary.edit || 0}</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-red-900">Deleted</p>
            <p className="text-red-600">{summary.delete || 0}</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <p className="text-amber-900">Toggled</p>
            <p className="text-amber-600">{summary.toggle || 0}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white">
        <h2 className="text-slate-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className={`p-2 rounded-full ${getTypeColor(entry.type)}`}>
                {getIcon(entry.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="capitalize">
                    {entry.type}
                  </Badge>
                  <span className="text-slate-900">{entry.triggerName}</span>
                </div>
                <p className="text-slate-600 text-sm">{entry.details}</p>
                <p className="text-slate-400 text-xs mt-1">
                  {new Date(entry.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
