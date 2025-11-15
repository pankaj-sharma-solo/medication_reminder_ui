import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import type { Trigger } from '../App';

interface TriggerEditDialogProps {
  trigger: Trigger;
  onSave: (updates: Partial<Trigger>) => void;
  onClose: () => void;
}

export function TriggerEditDialog({ trigger, onSave, onClose }: TriggerEditDialogProps) {
  const [name, setName] = useState(trigger.name);
  const [condition, setCondition] = useState(trigger.condition);
  const [action, setAction] = useState(trigger.action);
  const [isActive, setIsActive] = useState(trigger.isActive);

  const handleSave = () => {
    onSave({
      name,
      condition,
      action,
      isActive,
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Trigger</DialogTitle>
          <DialogDescription>
            Make changes to your trigger configuration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Trigger Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter trigger name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Textarea
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="When should this trigger activate?"
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="action">Action</Label>
            <Textarea
              id="action"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="What should happen when triggered?"
              className="min-h-[80px]"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="active">Active</Label>
            <Switch
              id="active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
