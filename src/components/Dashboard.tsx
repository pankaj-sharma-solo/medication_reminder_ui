import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, Plus, Edit2, Trash2, CheckCircle2, Repeat } from 'lucide-react';
import { TriggerDialog } from './TriggerDialog';
import { TriggerDetailDialog } from './TriggerDetailDialog';
import type { Trigger } from '../App';

interface DashboardProps {
  triggers: Trigger[];
  onAddTrigger: (trigger: Omit<Trigger, 'id'>) => void;
  onUpdateTrigger: (id: string, updates: Partial<Trigger>) => void;
  onDeleteTrigger: (id: string) => void;
}

export function Dashboard({
  triggers,
  onAddTrigger,
  onUpdateTrigger,
  onDeleteTrigger,
}: DashboardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<Trigger | null>(null);
  const [detailTrigger, setDetailTrigger] = useState<Trigger | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const activeTriggers = triggers.filter((t) => t.status === 'active');
  const pendingTriggers = triggers.filter((t) => t.status === 'pending');
  const completedTriggers = triggers.filter((t) => t.status === 'completed');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const handleEdit = (trigger: Trigger) => {
    setEditingTrigger(trigger);
    setDialogOpen(true);
  };

  const handleSave = (triggerData: Omit<Trigger, 'id'>) => {
    if (editingTrigger) {
      onUpdateTrigger(editingTrigger.id, triggerData);
    } else {
      onAddTrigger(triggerData);
    }
    setDialogOpen(false);
    setEditingTrigger(null);
  };

  const handleCardClick = (trigger: Trigger, e: React.MouseEvent) => {
    // Don't open detail if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setDetailTrigger(trigger);
    setDetailDialogOpen(true);
  };

  const renderTriggerCard = (trigger: Trigger) => (
    <Card 
      key={trigger.id} 
      className="p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
      onClick={(e) => handleCardClick(trigger, e)}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-2 mb-2">
              <h3 className="text-slate-900 flex-1">{trigger.name}</h3>
              {trigger.isRecurring && (
                <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 rounded-full" title={trigger.recurringInterval}>
                  <Repeat className="h-3 w-3 text-purple-600" />
                  <span className="text-purple-700 text-xs">
                    {trigger.recurringPattern}
                  </span>
                </div>
              )}
            </div>
            <p className="text-slate-600 text-sm">{trigger.description}</p>
          </div>
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(trigger)}
            >
              <Edit2 className="h-4 w-4 text-slate-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteTrigger(trigger.id)}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Badge className={getStatusColor(trigger.status)}>{trigger.status}</Badge>
          <Badge variant="outline" className={getPriorityColor(trigger.priority)}>
            {trigger.priority}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(trigger.dueDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{new Date(trigger.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {trigger.recurringInterval && (
          <div className="flex items-center gap-2 text-sm text-purple-700 bg-purple-50 px-3 py-2 rounded-lg">
            <Repeat className="h-4 w-4" />
            <span>{trigger.recurringInterval}</span>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {trigger.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {trigger.status !== 'completed' && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onUpdateTrigger(trigger.id, { status: 'completed' });
            }}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark as Complete
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <p className="text-blue-900 mb-1">Active</p>
          <p className="text-blue-600">{activeTriggers.length}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <p className="text-amber-900 mb-1">Pending</p>
          <p className="text-amber-600">{pendingTriggers.length}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <p className="text-green-900 mb-1">Completed</p>
          <p className="text-green-600">{completedTriggers.length}</p>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-slate-900">What's Next</h2>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Trigger
        </Button>
      </div>

      {activeTriggers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-slate-900">Active Triggers</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {activeTriggers.map(renderTriggerCard)}
          </div>
        </div>
      )}

      {pendingTriggers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-slate-900">Pending</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {pendingTriggers.map(renderTriggerCard)}
          </div>
        </div>
      )}

      {completedTriggers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-slate-900">Completed</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {completedTriggers.map(renderTriggerCard)}
          </div>
        </div>
      )}

      {triggers.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-slate-500 mb-4">No triggers yet. Create your first trigger to get started!</p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Trigger
          </Button>
        </Card>
      )}

      <TriggerDialog
        open={dialogOpen}
        trigger={editingTrigger}
        onClose={() => {
          setDialogOpen(false);
          setEditingTrigger(null);
        }}
        onSave={handleSave}
      />

      <TriggerDetailDialog
        open={detailDialogOpen}
        trigger={detailTrigger}
        onClose={() => {
          setDetailDialogOpen(false);
          setDetailTrigger(null);
        }}
      />
    </div>
  );
}