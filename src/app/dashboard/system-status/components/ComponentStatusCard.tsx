"use client";

import { useState } from "react";
import {
  SystemStatus,
  getStatusColor,
  formatTimestamp,
  getEventTypeColor,
  getEventIcon,
} from "@/lib/firebase/system-status";

interface ComponentStatusCardProps {
  status: SystemStatus;
}

export default function ComponentStatusCard({ status }: ComponentStatusCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getComponentDisplayName = () => {
    if (status.component === "frontend") return "Frontend (Next.js)";
    if (status.component === "orchestrator") return "Orchestrator";
    if (status.component.startsWith("dm_")) {
      return `DM Container${status.campaign_title ? `: ${status.campaign_title}` : ""}`;
    }
    return status.component;
  };

  const recentEvents = status.events?.slice(-10).reverse() || [];
  const recentErrors = status.errors?.slice(-5).reverse() || [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header - Always Visible */}
      <div
        className="p-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Component Name */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {getComponentDisplayName()}
            </h3>

            {/* Status Badge */}
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  status.status
                )}`}
              >
                {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
              </span>
              <span className="text-sm text-gray-500">
                {formatTimestamp(status.last_update)}
              </span>
            </div>

            {/* Metrics */}
            {status.metrics && Object.keys(status.metrics).length > 0 && (
              <div className="flex flex-wrap gap-4 text-sm">
                {Object.entries(status.metrics).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-gray-600 capitalize">
                      {key.replace(/_/g, " ")}:
                    </span>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Latest Event */}
            {recentEvents.length > 0 && (
              <div className="mt-3 text-sm text-gray-600">
                <span className={getEventTypeColor(recentEvents[0].type)}>
                  {getEventIcon(recentEvents[0].type)}
                </span>{" "}
                {recentEvents[0].message}
              </div>
            )}
          </div>

          {/* Expand/Collapse Icon */}
          <div className="ml-4">
            <svg
              className={`w-6 h-6 text-gray-400 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-200 bg-gray-50">
          {/* Errors Section */}
          {recentErrors.length > 0 && (
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-red-600 mb-3">
                Recent Errors ({recentErrors.length})
              </h4>
              <div className="space-y-2">
                {recentErrors.map((error, index) => (
                  <div
                    key={index}
                    className="bg-red-50 border border-red-200 rounded-lg p-3"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-red-600">❌</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-red-900">
                          {error.error}
                        </div>
                        <div className="text-xs text-red-600 mt-1">
                          {new Date(error.timestamp).toLocaleString()}
                        </div>
                        {error.details && Object.keys(error.details).length > 0 && (
                          <div className="mt-2 text-xs text-red-800">
                            <pre className="whitespace-pre-wrap font-mono">
                              {JSON.stringify(error.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events Section */}
          <div className="p-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Recent Events ({recentEvents.length})
            </h4>
            <div className="space-y-2">
              {recentEvents.length === 0 ? (
                <div className="text-sm text-gray-500">No recent events</div>
              ) : (
                recentEvents.map((event, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-start gap-2">
                      <span className={getEventTypeColor(event.type)}>
                        {getEventIcon(event.type)}
                      </span>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">{event.message}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(event.timestamp).toLocaleString()}
                        </div>
                        {event.data && Object.keys(event.data).length > 0 && (
                          <div className="mt-2 text-xs text-gray-600">
                            {Object.entries(event.data).map(([key, value]) => (
                              <div key={key}>
                                <span className="font-medium">{key}:</span> {String(value)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
