import { differenceInDays, isPast, isToday, isTomorrow, format } from 'date-fns';

export const getTaskStatus = (dueDate: string, completed: boolean) => {
  if (completed) return 'completed';
  
  const due = new Date(dueDate);
  const diff = differenceInDays(due, new Date());
  
  if (isPast(due) && !isToday(due)) return 'overdue';
  if (isToday(due)) return 'today';
  if (isTomorrow(due)) return 'tomorrow';
  if (diff <= 3) return 'soon';
  
  return 'upcoming';
};

export const formatDueDate = (dueDate: string) => {
  const due = new Date(dueDate);
  
  if (isToday(due)) return 'Today';
  if (isTomorrow(due)) return 'Tomorrow';
  
  return format(due, 'MMM dd, yyyy');
};

export const getStatusBadgeVariant = (status: string): "success" | "warning" | "destructive" | "default" => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'overdue':
      return 'destructive';
    case 'today':
    case 'tomorrow':
      return 'warning';
    default:
      return 'default';
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'overdue':
      return 'Overdue';
    case 'today':
      return 'Due Today';
    case 'tomorrow':
      return 'Due Tomorrow';
    case 'soon':
      return 'Due Soon';
    default:
      return 'Upcoming';
  }
};
