import { useState } from 'react';
import { Task, FilterType } from '@/types/task';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TaskForm } from '@/components/TaskForm';
import { TaskItem } from '@/components/TaskItem';
import { TaskStats } from '@/components/TaskStats';
import { Button } from '@/components/ui/button';
import { Plus, ListFilter } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
    setShowForm(false);
    toast.success('Task added successfully!');
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!editingTask) return;
    
    setTasks(tasks.map(task => 
      task.id === editingTask.id 
        ? { ...task, ...taskData }
        : task
    ));
    setEditingTask(null);
    setShowForm(false);
    toast.success('Task updated successfully!');
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    const task = tasks.find(t => t.id === id);
    toast.success(task?.completed ? 'Task marked as incomplete' : 'Task completed!');
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('Task deleted successfully!');
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const filterButtons: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Task Manager</h1>
          <p className="text-primary-foreground/90 text-lg">
            Organize your tasks and stay productive
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Stats */}
        <TaskStats tasks={tasks} />

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between my-8">
          <Button
            onClick={() => {
              setEditingTask(null);
              setShowForm(!showForm);
            }}
            size="lg"
            className="w-full sm:w-auto"
          >
            <Plus className="h-5 w-5" />
            Add New Task
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ListFilter className="h-5 w-5 text-muted-foreground" />
            <div className="flex gap-2 flex-1 sm:flex-initial">
              {filterButtons.map(({ label, value }) => (
                <Button
                  key={value}
                  variant={filter === value ? 'default' : 'outline'}
                  onClick={() => setFilter(value)}
                  size="sm"
                  className="flex-1 sm:flex-initial"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Task Form */}
        {showForm && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <TaskForm
              task={editingTask || undefined}
              onSubmit={editingTask ? handleUpdateTask : handleAddTask}
              onCancel={handleCancelForm}
            />
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <ListFilter className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No tasks found
              </h3>
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? 'Get started by adding your first task!'
                  : `No ${filter} tasks at the moment.`}
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div 
                key={task.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-300"
              >
                <TaskItem
                  task={task}
                  onToggle={handleToggleTask}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
