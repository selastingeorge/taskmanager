"use client"

import Task from "@/components/ui/task";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import empty_state from "@/public/general-empty-state.svg"

interface Task {
  id: number;
  title: string;
  description?: string;
  date?: string;
  completed: boolean;
}

export default function Home() {
  const [addTask, setAddTask] = useState(false);
  const [date, setDate] = useState<Date>();
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast()

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${process.env.apiUrl}/tasks`);
        if (response.ok) {
          const data: Task[] = await response.json(); // Cast data to TaskType[]
          setTasks(data);
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
      finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTaskItem = async () => {
    const title = document.getElementById('title') as HTMLInputElement;
    const description = document.getElementById('description') as HTMLInputElement;

    if (!title.value.trim() || !description.value.trim() || !date) {
      toast({
        title: "Error",
        description: "Please fillout all the fields",
        variant: "destructive",
      });
      return;
    }

    const task = {
      title: title.value,
      description: description.value,
      date: format(date, 'yyyy-MM-dd'),
      completed: false,
    };

    try {
      const response = await fetch(`${process.env.apiUrl}/tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Task created successfully:', data);
        toast({
          title: "Task added",
          description: `"${title.value}" has been added to the list`,
        });
        setTasks((prevTasks) => [...prevTasks, data.data]);
        setAddTask(false);
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        toast({
          title: "Error",
          description: "Unable to add new task, please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: "Unable to add new task, please try again",
        variant: "destructive",
      });
    }
  };


  const updateTaskStatus = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(`${process.env.apiUrl}/tasks/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(prevTasks =>
          prevTasks.map(task => (task.id === id ? updatedTask.data : task))
        );
        toast({
          title: "Task Updated",
          description: `"${updatedTask.data.title}" has been marked as ${completed ? 'completed' : 'pending'}`,
        });
      } else {
        console.error('Failed to update task status');
        toast({
          title: "Error",
          description: "Unable to update the task, please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: "Error",
        description: "Unable to update the task, please try again",
        variant: "destructive",
      });
    }
  };


  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`${process.env.apiUrl}/tasks/${id}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        toast({
          title: "Task Deleted",
          description: "Task has been deleted",
        });
      } else {
        console.error('Failed to delete task');
        toast({
          title: "Error",
          description: "Unable to delete the task, please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Unable to delete the task, please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="w-full h-full bg-light flex items-center justify-center py-5 ">
      <section className="w-full h-full px-6 py-5 border max-w-[700px] rounded-lg border-light bg-white overflow-auto">
        <div className="w-full h-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Task Manager</h1>
          {tasks.length > 0 ?(<button className="px-4 py-2 text-sm rounded-full font-semibold text-white bg-violet-600 hover:bg-violet-700 transition" onClick={() => setAddTask(true)}>Add Task</button>):''}
        </div>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          </div>
        ) : (
          <div className="flex flex-col pt-5 gap-4 overflow-hidden">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <Task
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                date={task.date}
                completed={task.completed}
                onStatusChange={(id: number, completed: boolean) =>
                  updateTaskStatus(id, completed)
                }
                onDelete={() => deleteTask(task.id)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center text-gray-600">
              <Image
                src={empty_state}
                alt="No Tasks"
                className="w-40 h-40 mb-5"
                width={150}
                height={150}
              />
              <h2 className="text-2xl font-semibold">No tasks available</h2>
              <p className="text-sm text-gray-500 mt-5 max-w-[300px]">
                You don&apos;t have any tasks yet. Click the button above to add your first task.
              </p>
              <button className="px-4 mt-5 py-2 text-sm rounded-full font-semibold text-white bg-violet-600 hover:bg-violet-700 transition" onClick={() => setAddTask(true)}>Add a new task</button>
            </div>
          )}
        </div>
        )}
      </section>


      {
        // Add Task Dialog
      }
      <Dialog open={addTask} onOpenChange={setAddTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription className="text-gray-700">
              Update the title, description, and due date of your task.
            </DialogDescription>
            <div className="flex flex-col py-4 gap-5">
              <div className="w-full flex flex-col gap-2.5">
                <Label htmlFor="title" className="text-start">
                  Title
                </Label>
                <Input id="title" placeholder="Enter the task title" />
              </div>
              <div className="w-full flex flex-col gap-2.5">
                <Label htmlFor="description" className="text-start">
                  Description
                </Label>
                <Textarea id="description" rows={3} placeholder="Enter the task description" />
              </div>
              <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                <PopoverTrigger asChild>
                  <div className="flex flex-col gap-2.5">
                    <Label className="text-start">
                      Due Date
                    </Label>
                    <Button className={cn("w-full h-[45px] bg-white border text-black font-normal flex items-center justify-start hover:bg-white", openDatePicker && "ring-2 ring-ring", !date && "text-muted-foreground")}>
                      <CalendarDays />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} />
                </PopoverContent>
              </Popover>
            </div>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-start">
            <Button type="button" variant="default" className="rounded-lg px-8" onClick={() => { addTaskItem() }}>
              Create Task
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}