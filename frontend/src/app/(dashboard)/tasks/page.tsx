"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiClient } from "@/lib/api-client";
import { Task, TaskCreateRequest, TaskUpdateRequest } from "@/types/task";
import { AddTaskModal } from "@/components/tasks/add-task-modal";
import { DeleteConfirmDialog } from "@/components/tasks/delete-confirm-dialog";
import { SearchBar } from "@/components/tasks/search-bar";
import { FilterBar } from "@/components/tasks/filter-bar";
import { SortDropdown } from "@/components/tasks/sort-dropdown";
import { ActiveFilters } from "@/components/tasks/active-filters";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useTaskQuery } from "@/hooks/use-task-query";

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const { queryParams, updateQuery, clearFilters, clearFilter } = useTaskQuery();
  const loadingRef = useRef(false);
  const lastQueryRef = useRef<string>("");

  const loadTasks = useCallback(async () => {
    if (!user?.id || loadingRef.current) return;
    const queryKey = JSON.stringify({ userId: user.id, ...queryParams });
    if (lastQueryRef.current === queryKey) return;
    lastQueryRef.current = queryKey;

    loadingRef.current = true;
    try {
      setIsLoading(true);
      const fetchedTasks = await apiClient.getTasks(user.id, queryParams);
      setTasks(fetchedTasks || []);
    } catch {
      setTasks([]);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [user?.id, queryParams]);

  useEffect(() => { if (user?.id) loadTasks(); }, [user?.id, loadTasks]);

  const handleSaveTask = async (data: TaskCreateRequest | TaskUpdateRequest) => {
    if (!user) return;
    try {
      if (editingTask) {
        const updatedTask = await apiClient.updateTask(user.id, editingTask.id, data as TaskUpdateRequest);
        setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
        setEditingTask(null);
      } else {
        const createdTask = await apiClient.createTask(user.id, data as TaskCreateRequest);
        setTasks([createdTask, ...tasks]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Save task error:", error);
      throw error;
    }
  };

  const handleToggleComplete = async (taskId: number) => {
    if (!user) return;
    const currentTask = tasks.find((t) => t.id === taskId);
    if (!currentTask) return;

    const originalTasks = [...tasks];
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)));

    try {
      const updatedTask = await apiClient.toggleTaskComplete(user.id, taskId);
      setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    } catch {
      setTasks(originalTasks);
    }
  };

  const handleDeleteTask = async () => {
    if (!user || !deletingTask) return;
    try {
      await apiClient.deleteTask(user.id, deletingTask.id);
      setTasks(tasks.filter((t) => t.id !== deletingTask.id));
      setDeletingTask(null);
    } catch (error) {
      console.error("Delete task error:", error);
    }
  };

  const handleEdit = (task: Task) => { setEditingTask(task); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingTask(null); };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ===== Top Bar: Add Task + Filters/Search ===== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 space-y-4">
            <SearchBar
              onSearch={(query) => updateQuery({ search: query || undefined })}
              placeholder="Search tasks..."
            />
            <div className="grid md:grid-cols-2 gap-4">
              <FilterBar
                status={queryParams.status || "all"}
                priority={queryParams.priority || ""}
                onStatusChange={(status) => updateQuery({ status })}
                onPriorityChange={(priority) => updateQuery({ priority: priority ? (priority as "high" | "medium" | "low") : undefined })}
              />
              <SortDropdown
                sortBy={queryParams.sort || "created_at"}
                order={queryParams.order || "desc"}
                onSortChange={(sort) => updateQuery({ sort })}
                onOrderChange={(order) => updateQuery({ order })}
              />
            </div>
            <ActiveFilters
              filters={{
                status: queryParams.status !== "all" ? queryParams.status : undefined,
                priority: queryParams.priority,
                search: queryParams.search,
              }}
              onClearFilter={clearFilter}
              onClearAll={clearFilters}
            />
          </div>

          {/* Add Task Button Top Right */}
          <div className="flex-shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              + Add Task
            </button>
          </div>
        </div>

        {/* ===== Task List Professional Cards ===== */}
        <div className="grid gap-4">
          {tasks.map(task => (
            <div
              key={task.id}
              className={`bg-white dark:bg-gray-900 rounded-xl shadow p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center`}
            >
              <div className="flex items-center gap-4 w-full">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id)}
                  className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary-500"
                />
                <div className="flex flex-col w-full">
                  <h3 className={`text-lg font-semibold ${task.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                  )}
                  {task.due_date && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  )}
                  <div className="mt-2 flex gap-2">
                    {task.priority === "high" && <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs font-medium">High</span>}
                    {task.priority === "medium" && <span className="px-2 py-0.5 bg-yellow-400 text-white rounded-full text-xs font-medium">Medium</span>}
                    {task.priority === "low" && <span className="px-2 py-0.5 bg-blue-500 text-white rounded-full text-xs font-medium">Low</span>}
                  </div>
                  {/* Bottom line / status */}
                  <div className="mt-2 h-[3px] w-full rounded-full bg-gray-200 dark:bg-gray-800">
                    <div
                      className={`h-[3px] rounded-full transition-all duration-500 ${task.completed ? "bg-green-500 w-full" : "bg-gray-400 w-1/4"}`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-3 sm:mt-0">
                <button
                  onClick={() => handleEdit(task)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg transition text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeletingTask(task)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg transition text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ===== Modals ===== */}
        <AddTaskModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveTask} editTask={editingTask} />
        <DeleteConfirmDialog
          isOpen={!!deletingTask}
          onClose={() => setDeletingTask(null)}
          onConfirm={handleDeleteTask}
          taskTitle={deletingTask?.title || ""}
        />
      </div>
    </DashboardLayout>
  );
}
