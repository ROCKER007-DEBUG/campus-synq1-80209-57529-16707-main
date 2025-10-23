import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Clock, Play, Pause, Check, Edit, Trash2, Plus, X, Download, Upload } from 'lucide-react';
import { useXP, XP_ACTIONS } from '@/hooks/useXP';

interface Task {
  id: string;
  title: string;
  description: string;
  timeAllocated: number;
  timeRemaining: number;
  completed: boolean;
  date: string;
  isRunning: boolean;
}

interface TaskManagementProps {
  onClose: () => void;
}

export const TaskManagement = ({ onClose }: TaskManagementProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', timeAllocated: 30 });
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const { addXP } = useXP();

  useEffect(() => {
    const savedTasks = localStorage.getItem('campussynq_tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('campussynq_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    if (!activeTimer) return;

    const interval = setInterval(() => {
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.id === activeTimer && task.isRunning && task.timeRemaining > 0) {
            return { ...task, timeRemaining: task.timeRemaining - 1 };
          }
          return task;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.date);
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  });

  const completedTasks = todayTasks.filter(t => t.completed).length;
  const totalTasks = todayTasks.length;
  const activeTasks = todayTasks.filter(t => !t.completed).length;
  const totalTimeToday = todayTasks.reduce((sum, t) => sum + (t.timeAllocated * 60 - t.timeRemaining), 0);

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      timeAllocated: newTask.timeAllocated,
      timeRemaining: newTask.timeAllocated * 60,
      completed: false,
      date: new Date().toISOString(),
      isRunning: false,
    };

    setTasks(prev => [...prev, task]);
    setNewTask({ title: '', description: '', timeAllocated: 30 });
    setIsAddingTask(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    if (activeTimer === taskId) setActiveTimer(null);
  };

  const handleStartPause = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, isRunning: !task.isRunning } : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.isRunning) {
      setActiveTimer(taskId);
    } else {
      setActiveTimer(null);
    }
  };

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      addXP(XP_ACTIONS.TASK_COMPLETE, 'Task completed!');
    }
    
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, isRunning: false }
        : task
    ));
    
    if (activeTimer === taskId) setActiveTimer(null);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Track your productivity and manage your time</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Manual Entry
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Time Allocation (minutes)
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={newTask.timeAllocated}
                      onChange={(e) => setNewTask(prev => ({ ...prev, timeAllocated: parseInt(e.target.value) || 30 }))}
                    />
                  </div>
                  <Button onClick={handleAddTask} className="w-full">
                    Create Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Time Today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatTime(totalTimeToday)}</div>
              <p className="text-xs text-green-500 mt-1">↑ 12%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Tasks Completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedTasks}/{totalTasks}</div>
              <p className="text-xs text-green-500 mt-1">↑ 8%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeTasks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Productivity Score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">85%</div>
              <p className="text-xs text-green-500 mt-1">↑ 5%</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today's Tasks</CardTitle>
              <span className="text-sm text-muted-foreground">{totalTasks} total</span>
            </div>
          </CardHeader>
          <CardContent>
            {todayTasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No tasks yet. Create one to get started!
              </div>
            ) : (
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <Card key={task.id} className={`p-4 ${task.completed ? 'opacity-60 bg-muted/50' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-semibold ${task.completed ? 'line-through' : ''}`}>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4" />
                            <span className="font-mono">
                              {formatTime(task.timeRemaining)}
                            </span>
                          </div>

                          <Button
                            size="sm"
                            variant={task.isRunning ? "destructive" : "default"}
                            onClick={() => handleStartPause(task.id)}
                            disabled={task.completed || task.timeRemaining === 0}
                          >
                            {task.isRunning ? (
                              <>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Start
                              </>
                            )}
                          </Button>

                          <Button
                            size="sm"
                            variant={task.completed ? "outline" : "secondary"}
                            onClick={() => handleCompleteTask(task.id)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            {task.completed ? 'Undo' : 'Complete'}
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
