import { useDroppable } from "@dnd-kit/core";
import type { ColumnId, Task, TaskPriority } from "@/types/task";
import TaskCard from "./TaskCard";
import AddTaskForm from "./AddTaskForm";
import { cn } from "@/lib/utils";
import { Circle, Loader2, CheckCircle2 } from "lucide-react";

interface ColumnProps {
  id: ColumnId;
  title: string;
  tasks: Task[];
  onAddTask: (
    columnId: ColumnId,
    title: string,
    description: string,
    priority: TaskPriority
  ) => void;
  onUpdateTask: (
    id: string,
    updates: Partial<Omit<Task, "id" | "createdAt">>
  ) => void;
  onDeleteTask: (id: string) => void;
}

const columnIcons: Record<ColumnId, React.ReactNode> = {
  todo: <Circle className="w-4 h-4" />,
  "in-progress": <Loader2 className="w-4 h-4 animate-spin" />,
  done: <CheckCircle2 className="w-4 h-4" />,
};

const columnColors: Record<ColumnId, string> = {
  todo: "border-t-[3px] border-t-blue-500 shadow-[0_-2px_20px_rgba(59,130,246,0.35)]",
  "in-progress":
    "border-t-[3px] border-t-violet-500 shadow-[0_-2px_20px_rgba(139,92,246,0.35)]",
  done: "border-t-[3px] border-t-green-500 shadow-[0_-2px_20px_rgba(34,197,94,0.35)]",
};




export default function Column({
  id,
  title,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const taskCount = tasks.length;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col rounded-2xl p-4 min-h-[500px] transition-all duration-300",
        "bg-secondary/60",
        "border border-neutral-800/50",
        columnColors[id], 
        isOver &&
          "ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary/5"
      )}
    >
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "p-1.5 rounded-lg",
              id === "todo" && "bg-muted-foreground/10 text-muted-foreground",
              id === "in-progress" && "bg-primary/10 text-primary",
              id === "done" && "bg-priority-low/10 text-priority-low"
            )}
          >
            {columnIcons[id]}
          </div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        </div>
        <span
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-semibold",
            "bg-background text-muted-foreground"
          )}
        >
          {taskCount}
        </span>
      </header>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[400px] pr-1 scrollbar-thin">
        {taskCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
              {columnIcons[id]}
            </div>
            <p className="text-sm text-muted-foreground">No tasks yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Drag a card here or create one
            </p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <div
              key={task.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TaskCard
                task={task}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
              />
            </div>
          ))
        )}
      </div>

      <AddTaskForm columnId={id} onAddTask={onAddTask} />
    </div>
  );
}
