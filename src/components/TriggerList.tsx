import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Edit2, Trash2 } from 'lucide-react';
import { TriggerEditDialog } from './TriggerEditDialog';
import type { Trigger } from '../App';

interface TriggerListProps {
  triggers: Trigger[];
  onUpdate: (id: string, updates: Partial<Trigger>) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function TriggerList({ triggers, onUpdate, onDelete, onToggle }: TriggerListProps) {
  const [editingTrigger, setEditingTrigger] = useState<Trigger | null>(null);

  if (triggers.length === 0) {
    return (
      <Card className="p-12 text-center bg-white">
        <p className="text-slate-500">
          No triggers yet. Use the chat to create your first trigger!
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {triggers.map((trigger) => (
          <Card key={trigger.id} className="p-6 bg-white hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="text-slate-900">{trigger.name}</h3>
                  <Badge
                    variant={trigger.isActive ? 'default' : 'secondary'}
                    className="mt-2"
                  >
                    {trigger.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <Switch
                  checked={trigger.isActive}
                  onCheckedChange={() => onToggle(trigger.id)}
                />
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-slate-600 text-sm">Condition:</p>
                  <p className="text-slate-900">{trigger.condition}</p>
                </div>
                <div>
                  <p className="text-slate-600 text-sm">Action:</p>
                  <p className="text-slate-900">{trigger.action}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setEditingTrigger(trigger)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(trigger.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {editingTrigger && (
        <TriggerEditDialog
          trigger={editingTrigger}
          onSave={(updates) => {
            onUpdate(editingTrigger.id, updates);
            setEditingTrigger(null);
          }}
          onClose={() => setEditingTrigger(null)}
        />
      )}
    </>
  );
}
