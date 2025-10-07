import { Task } from '@/types/task';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import { getTaskStatus, formatDueDate, getStatusBadgeVariant, getStatusLabel } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = ({ task, onToggle, onEdit, onDelete }: TaskItemProps) => {
  const status = getTaskStatus(task.dueDate, task.completed);
  const badgeVariant = getStatusBadgeVariant(status);
  const statusLabel = getStatusLabel(status);

  return (
    <Card 
      className={cn(
        "p-4 transition-all duration-300 hover:shadow-md",
        task.completed && "opacity-60"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="pt-1">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            className="h-5 w-5"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 
              className={cn(
                "text-lg font-semibold text-foreground break-words",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </h3>
            <div className="flex gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(task)}
                className="h-8 w-8"
                disabled={task.completed}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(task.id)}
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {task.description && (
            <p 
              className={cn(
                "text-sm text-muted-foreground mb-3 break-words",
                task.completed && "line-through"
              )}
            >
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDueDate(task.dueDate)}</span>
            </div>
            <Badge variant={badgeVariant} className="text-xs">
              {statusLabel}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};
