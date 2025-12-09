"use client";
import { useState } from "react";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Column from "./Column";
import TaskCard from "./TaskCard";
import type { Task, ColumnId, TaskPriority } from "@/types/task";

const COLUMNS: { id: ColumnId; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

const generateId = () => crypto.randomUUID();

interface BoardProps {
  searchQuery: string;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function Board({ searchQuery, tasks, setTasks }: BoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleAddTask = (
    columnId: ColumnId,
    title: string,
    description: string,
    priority: TaskPriority
  ) => {
    const now = new Date().toISOString();

    setTasks((prev) => [
      ...prev,
      {
        id: generateId(),
        title,
        description,
        columnId,
        createdAt: now,
        updatedAt: now,
        priority,
      },
    ]);
  };

  const handleUpdateTask = (
    id: string,
    updates: Partial<Omit<Task, "id" | "createdAt">>
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskId = String(active.id);
    const newColumn = String(over.id) as ColumnId;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              columnId: newColumn,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={filteredTasks.filter((t) => t.columnId === col.id)}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="rotate-3 scale-105">
            <TaskCard
              task={activeTask}
              onUpdateTask={() => {}}
              onDeleteTask={() => {}}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
