"use client";

import { useEffect, useState } from "react";
import Board from "@/components/Board";
import Header from "@/components/Header";
import type { Task } from "@/types/task";
import { loadTasks } from "@/lib/storage";

export default function Index() {
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);


  useEffect(() => {
    const saved = localStorage.getItem("taskflow-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (saved === "dark" || (!saved && prefersDark)) {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDark(false);
    }
  }, []);

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  const toggleTheme = () => {
    setDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("taskflow-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("taskflow-theme", "light");
      }
      return next;
    });
  };

  
  const totalTasks = tasks.length;
  const inProgress = tasks.filter((t) => t.columnId === "in-progress").length;
  const completed = tasks.filter((t) => t.columnId === "done").length;

  return (
    <main className="min-h-screen bg-background transition-colors duration-300">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <Header
          search={search}
          setSearch={setSearch}
          dark={dark}
          toggleTheme={toggleTheme}
          totalTasks={totalTasks}
          inProgress={inProgress}
          completed={completed}
        />

        <Board searchQuery={search} tasks={tasks} setTasks={setTasks} />
      </div>
    </main>
  );
}
