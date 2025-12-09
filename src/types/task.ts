
export type ColumnId = "todo" | "in-progress" | "done" | string;

export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: ColumnId;
  createdAt: string;
  updatedAt: string;
  priority: TaskPriority;
}
