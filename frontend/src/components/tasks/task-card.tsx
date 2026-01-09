"use client";

import { Task } from "@/types/task";
import { PriorityBadge } from "./priority-badge";
import { TagChip } from "./tag-chip";
import { useState } from "react";
import { useI18n } from "@/contexts/i18n-context";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const { t } = useI18n();

  const handleToggleComplete = async () => {
    if (isCompleting) return; // Prevent multiple clicks
    
    setIsCompleting(true);
    try {
      console.log("TaskCard: Toggling task:", task.id, "Current status:", task.completed);
      await onToggleComplete(task.id);
    } catch (error) {
      console.error("TaskCard: Error toggling task:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date() && !task.completed;

  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow ${
        task.completed ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          disabled={isCompleting}
          className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer disabled:opacity-50"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              className={`text-lg font-semibold text-gray-900 dark:text-white ${
                task.completed ? "line-through" : ""
              }`}
            >
              {task.title}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(task)}
                className="text-gray-500 hover:text-primary transition-colors"
                aria-label={t("common.edit")}
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(task)}
                className="text-gray-500 hover:text-danger transition-colors"
                aria-label={t("common.delete")}
              >
                🗑️
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Priority, Tags, and Due Date */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <PriorityBadge priority={task.priority} />

            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag, index) => (
                  <TagChip key={index} tag={tag} />
                ))}
              </div>
            )}
          </div>

          {/* Due Date - separate row for better visibility */}
          {task.due_date && (
            <div className="mb-2">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  isOverdue
                    ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                }`}
              >
                📅 {new Date(task.due_date).toLocaleDateString()}
                {isOverdue && ` • ${t("tasks.overdue")}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
