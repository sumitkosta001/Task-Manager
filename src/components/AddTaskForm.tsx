import { useState, FormEvent } from "react";
import type { ColumnId, TaskPriority } from "@/types/task";
import { cn } from "@/lib/utils";
import { Plus, X, Sparkles } from "lucide-react";

interface AddTaskFormProps {
  columnId: ColumnId;
  onAddTask: (
    columnId: ColumnId,
    title: string,
    description: string,
    priority: TaskPriority
  ) => void;
}

export default function AddTaskForm({ columnId, onAddTask }: AddTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  const reset = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask(columnId, title.trim(), description.trim(), priority);
    reset();
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl",
          "border-2 border-dashed border-border/60",
          "text-sm font-medium text-muted-foreground",
          "hover:border-primary/40 hover:text-primary hover:bg-primary/5",
          "transition-all duration-200 group"
        )}
      >
        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
        Add task
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2 flex flex-col gap-3 rounded-xl border-2 border-primary/30 bg-card p-4 shadow-lg animate-scale-in"
    >
      <div className="flex items-center gap-2 text-primary mb-1">
        <Sparkles className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">
          New Task
        </span>
      </div>

      <input
        className="w-full rounded-lg bg-secondary px-3 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        required
      />

      <textarea
        className="w-full rounded-lg bg-secondary px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
        placeholder="Add more details..."
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1">
          {(["high", "medium", "low"] as TaskPriority[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all",
                priority === p
                  ? p === "high"
                    ? "bg-priority-high/20 text-priority-high ring-1 ring-priority-high/30"
                    : p === "medium"
                    ? "bg-priority-medium/20 text-priority-medium ring-1 ring-priority-medium/30"
                    : "bg-priority-low/20 text-priority-low ring-1 ring-priority-low/30"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              reset();
              setIsOpen(false);
            }}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Add Task
          </button>
        </div>
      </div>
    </form>
  );
}
