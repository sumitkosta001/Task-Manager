import { Search, Sun, Moon, Sparkles, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  search: string;
  setSearch: (value: string) => void;
  dark: boolean;
  toggleTheme: () => void;

  totalTasks: number;
  inProgress: number;
  completed: number;
}

export default function Header({
  search,
  setSearch,
  dark,
  toggleTheme,
  totalTasks,
  inProgress,
  completed,
}: HeaderProps) {
  return (
    <header className="mb-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Logo and Title */}
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 shadow-[0_0_40px_rgba(99,102,241,0.6)] animate-float">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                TaskFlow
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Pro
              </span>
            </div>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Organize your work with beautiful Kanban boards
            </p>
          </div>
        </div>

        {/* Search and Theme Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm",
                "bg-card border border-border",
                "text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
                "transition-all duration-200"
              )}
            />
          </div>

          <button
            onClick={toggleTheme}
            className={cn(
              "p-2.5 rounded-xl",
              "bg-card border border-border",
              "text-foreground hover:text-primary",
              "hover:border-primary/50 hover:bg-primary/5",
              "transition-all duration-200",
              "group"
            )}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? (
              <Sun className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>

      {/* ✅ STATS BAR — NOW DYNAMIC */}
      <div className="mt-6 flex flex-wrap gap-3">
        {[
          {
            label: "Total Tasks",
            value: totalTasks,
            color: "bg-indigo-500/10 text-indigo-400",
          },
          {
            label: "In Progress",
            value: inProgress,
            color: "bg-yellow-400/10 text-yellow-400",
          },
          {
            label: "Completed",
            value: completed,
            color: "bg-green-500/10 text-green-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={cn(
              "px-4 py-2 rounded-xl border border-border/50 bg-card/50",
              "flex items-center gap-3 animate-slide-in"
            )}
          >
            <span
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                stat.color
              )}
            >
              {stat.value}
            </span>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
