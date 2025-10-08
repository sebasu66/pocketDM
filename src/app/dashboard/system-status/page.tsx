"use client";

import { useEffect, useState } from "react";
import { SystemStatus, subscribeToSystemStatus, ComponentStatus } from "@/lib/firebase/system-status";
import ComponentStatusCard from "./components/ComponentStatusCard";

export default function SystemStatusPage() {
  const [statuses, setStatuses] = useState<SystemStatus[]>([]);
  const [filter, setFilter] = useState<ComponentStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToSystemStatus((newStatuses) => {
      // Sort: errors first, then warnings, then healthy, then idle
      const sorted = newStatuses.sort((a, b) => {
        const order = { error: 0, warning: 1, healthy: 2, idle: 3 };
        return order[a.status] - order[b.status];
      });
      setStatuses(sorted);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter statuses
  const filteredStatuses = statuses.filter((status) => {
    // Filter by status
    if (filter !== "all" && status.status !== filter) return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        status.component.toLowerCase().includes(query) ||
        status.campaign_title?.toLowerCase().includes(query) ||
        status.campaign_id?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Status counts
  const statusCounts = {
    healthy: statuses.filter((s) => s.status === "healthy").length,
    warning: statuses.filter((s) => s.status === "warning").length,
    error: statuses.filter((s) => s.status === "error").length,
    idle: statuses.filter((s) => s.status === "idle").length,
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading system status...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Monitor</h1>
        <p className="text-gray-600">Real-time status of all DM Santa components</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-600">Healthy</div>
          <div className="text-2xl font-bold text-green-600">{statusCounts.healthy}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="text-sm text-gray-600">Warnings</div>
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.warning}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="text-sm text-gray-600">Errors</div>
          <div className="text-2xl font-bold text-red-600">{statusCounts.error}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-500">
          <div className="text-sm text-gray-600">Idle</div>
          <div className="text-2xl font-bold text-gray-600">{statusCounts.idle}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("healthy")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "healthy"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Healthy
            </button>
            <button
              onClick={() => setFilter("warning")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "warning"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Warning
            </button>
            <button
              onClick={() => setFilter("error")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "error"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Error
            </button>
          </div>
        </div>
      </div>

      {/* Components List */}
      <div className="space-y-4">
        {filteredStatuses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No components found matching your filters.
          </div>
        ) : (
          filteredStatuses.map((status) => (
            <ComponentStatusCard key={status.id} status={status} />
          ))
        )}
      </div>

      {/* Auto-refresh indicator */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Real-time updates active
        </span>
      </div>
    </div>
  );
}
