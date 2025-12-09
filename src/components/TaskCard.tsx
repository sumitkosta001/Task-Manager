import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { Task, TaskPriority } from "@/types/task";
import { cn } from "@/lib/utils";
import { GripVertical, Pencil, Trash2, X, Check, Clock } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onUpdateTask: (
    id: string,
    updates: Partial<Omit<Task, "id" | "createdAt">>
  ) => void;
  onDeleteTask: (id: string) => void;
}
function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",

        priority === "high" &&
          "bg-red-500/10 text-red-400 ring-1 ring-red-500/30",

        priority === "medium" &&
          "bg-yellow-400/10 text-yellow-400 ring-1 ring-yellow-400/30",

        priority === "low" &&
          "bg-green-500/10 text-green-400 ring-1 ring-green-500/30"
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",

          priority === "high" && "bg-red-500",
          priority === "medium" && "bg-yellow-400",
          priority === "low" && "bg-green-500"
        )}
      />
      {priority}
    </span>
  );
}


export default function TaskCard({
  task,
  onUpdateTask,
  onDeleteTask,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [draftDescription, setDraftDescription] = useState(task.description);
  const [draftPriority, setDraftPriority] = useState<TaskPriority>(
    task.priority
  );

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const handleSave = () => {
    if (!draftTitle.trim()) return;
    onUpdateTask(task.id, {
      title: draftTitle.trim(),
      description: draftDescription.trim(),
      priority: draftPriority,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftTitle(task.title);
    setDraftDescription(task.description);
    setDraftPriority(task.priority);
    setIsEditing(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "group relative rounded-xl border bg-card p-4 transition-all duration-200",
        "shadow-card hover:shadow-card-hover",
        "hover:border-primary/20",

        task.priority === "high" &&
          "border-l-[4px] border-l-red-500 shadow-[0_0_20px_rgba(239,68,68,0.35)]",
        task.priority === "medium" &&
          "border-l-[4px] border-l-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.35)]",
        task.priority === "low" &&
          "border-l-[4px] border-l-green-500 shadow-[0_0_20px_rgba(34,197,94,0.35)]",

        isDragging && "opacity-50 rotate-2 scale-105 shadow-glow z-50"
      )}
    >
      {/* Drag Handle */}
      <div
        {...listeners}
        className="absolute -left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-3 animate-fade-in">
          <input
            className="w-full rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            placeholder="Task title"
            autoFocus
          />
          <textarea
            className="w-full rounded-lg bg-secondary px-3 py-2 text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            value={draftDescription}
            onChange={(e) => setDraftDescription(e.target.value)}
            placeholder="Add a description..."
            rows={3}
          />
          <div className="flex items-center justify-between gap-2">
            <select
              className="text-xs rounded-lg bg-secondary px-3 py-2 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={draftPriority}
              onChange={(e) => setDraftPriority(e.target.value as TaskPriority)}
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={handleSave}
                disabled={!draftTitle.trim()}
                className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                type="button"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <header className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-2">
              {task.title}
            </h3>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteTask(task.id)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </header>

          {task.description && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          <footer className="flex items-center justify-between pt-2 border-t border-border/50">
            <PriorityBadge priority={task.priority} />
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="w-3 h-3" />
              {formatTime(task.updatedAt)}
            </span>
          </footer>
        </>
      )}
    </article>
  );
}
