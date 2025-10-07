import { Task } from '@/types/task';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { getTaskStatus } from '@/utils/dateUtils';

interface TaskStatsProps {
  tasks: Task[];
}

export const TaskStats = ({ tasks }: TaskStatsProps) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = tasks.filter(t => !t.completed).length;
  const overdue = tasks.filter(t => {
    const status = getTaskStatus(t.dueDate, t.completed);
    return status === 'overdue';
  }).length;

  const stats = [
    {
      label: 'Total Tasks',
      value: total,
      icon: Circle,
      color: 'text-primary',
    },
    {
      label: 'Active',
      value: active,
      icon: Circle,
      color: 'text-accent',
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      color: 'text-success',
    },
    {
      label: 'Overdue',
      value: overdue,
      icon: AlertCircle,
      color: 'text-destructive',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4">
          <div className="flex items-center gap-3">
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
