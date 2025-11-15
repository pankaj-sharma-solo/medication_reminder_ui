import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Repeat, 
  Phone, 
  Bell, 
  Mail, 
  MessageSquare, 
  Calendar,
  Clock,
  Pill
} from 'lucide-react';
import type { Trigger } from '../App';

interface TriggerDetailDialogProps {
  open: boolean;
  trigger: Trigger | null;
  onClose: () => void;
}

export function TriggerDetailDialog({ open, trigger, onClose }: TriggerDetailDialogProps) {
  if (!trigger) return null;

  const getNotificationIcon = (channel: string) => {
    switch (channel) {
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'push':
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{trigger.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex gap-3 flex-wrap">
            <Badge className={getStatusColor(trigger.status)}>{trigger.status}</Badge>
            <Badge variant="outline" className={getPriorityColor(trigger.priority)}>
              {trigger.priority} priority
            </Badge>
            {trigger.isRecurring && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <Repeat className="h-3 w-3 mr-1" />
                Recurring
              </Badge>
            )}
          </div>

          {/* Description */}
          <Card className="p-4 bg-slate-50">
            <p className="text-slate-700">{trigger.description}</p>
          </Card>

          {/* Medications List */}
          {trigger.medications && trigger.medications.length > 0 && (
            <div>
              <h3 className="text-slate-900 mb-3 flex items-center gap-2">
                <Pill className="h-5 w-5 text-blue-600" />
                Medications
              </h3>
              <div className="space-y-3">
                {trigger.medications.map((med, index) => (
                  <Card key={index} className="p-4 border-l-4 border-l-blue-500">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="text-slate-900">{med.name}</h4>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {med.dosage}
                        </Badge>
                      </div>
                      <p className="text-slate-600 text-sm">{med.instructions}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Schedule Information */}
          <div>
            <h3 className="text-slate-900 mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Schedule
            </h3>
            <Card className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-600 text-sm mb-1">Due Date & Time</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <p className="text-slate-900">
                      {new Date(trigger.dueDate).toLocaleString()}
                    </p>
                  </div>
                </div>
                {trigger.isRecurring && trigger.recurringInterval && (
                  <div>
                    <p className="text-slate-600 text-sm mb-1">Recurring Pattern</p>
                    <div className="flex items-center gap-2">
                      <Repeat className="h-4 w-4 text-purple-600" />
                      <p className="text-slate-900">{trigger.recurringInterval}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-slate-900 mb-3 flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              Notification Settings
            </h3>
            <Card className="p-4">
              <div className="space-y-4">
                {/* Primary Contact */}
                {trigger.notificationNumber && (
                  <div>
                    <p className="text-slate-600 text-sm mb-2">Primary Contact Number</p>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <p className="text-slate-900">{trigger.notificationNumber}</p>
                    </div>
                  </div>
                )}

                {/* Backup Contact */}
                {trigger.backupNumber && (
                  <div>
                    <p className="text-slate-600 text-sm mb-2">Backup Contact Number</p>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <Phone className="h-4 w-4 text-amber-600" />
                      <p className="text-slate-900">{trigger.backupNumber}</p>
                    </div>
                  </div>
                )}

                {/* Notification Channels */}
                {trigger.notificationChannels && trigger.notificationChannels.length > 0 && (
                  <div>
                    <p className="text-slate-600 text-sm mb-2">Notification Channels</p>
                    <div className="flex gap-2 flex-wrap">
                      {trigger.notificationChannels.map((channel) => (
                        <div
                          key={channel}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                          {getNotificationIcon(channel)}
                          <span className="text-blue-900 text-sm capitalize">{channel}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Tags */}
          {trigger.tags && trigger.tags.length > 0 && (
            <div>
              <h3 className="text-slate-900 mb-3">Tags</h3>
              <div className="flex gap-2 flex-wrap">
                {trigger.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
