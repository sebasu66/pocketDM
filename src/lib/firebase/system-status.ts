/**
 * System Status API - Real-time monitoring of all system components
 */

import { collection, doc, getDocs, onSnapshot, Unsubscribe } from "firebase/firestore";
import { db } from "./config";

const SYSTEM_STATUS_COLLECTION = "system_status";

export type ComponentStatus = "healthy" | "warning" | "error" | "idle";

export type EventType = "info" | "success" | "warning" | "error";

export interface StatusEvent {
  timestamp: string;
  type: EventType;
  message: string;
  data: Record<string, any>;
}

export interface StatusError {
  timestamp: string;
  error: string;
  details: Record<string, any>;
}

export interface SystemStatus {
  id: string;
  component: string;
  status: ComponentStatus;
  last_update: any; // Firestore Timestamp
  campaign_id?: string;
  campaign_title?: string;
  events: StatusEvent[];
  errors: StatusError[];
  metrics: Record<string, any>;
}

/**
 * Get all system component statuses
 */
export const getAllSystemStatus = async (): Promise<SystemStatus[]> => {
  const querySnapshot = await getDocs(collection(db, SYSTEM_STATUS_COLLECTION));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SystemStatus));
};

/**
 * Get status for a specific component
 */
export const getComponentStatus = async (componentId: string): Promise<SystemStatus | null> => {
  const querySnapshot = await getDocs(collection(db, SYSTEM_STATUS_COLLECTION));
  const doc = querySnapshot.docs.find(d => d.id === componentId);
  return doc ? ({ id: doc.id, ...doc.data() } as SystemStatus) : null;
};

/**
 * Subscribe to real-time system status updates
 *
 * @param callback - Called whenever any component status changes
 * @returns Unsubscribe function
 */
export const subscribeToSystemStatus = (
  callback: (statuses: SystemStatus[]) => void
): Unsubscribe => {
  return onSnapshot(
    collection(db, SYSTEM_STATUS_COLLECTION),
    (snapshot) => {
      const statuses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as SystemStatus));
      callback(statuses);
    },
    (error) => {
      console.error("Error subscribing to system status:", error);
    }
  );
};

/**
 * Subscribe to a specific component's status
 */
export const subscribeToComponentStatus = (
  componentId: string,
  callback: (status: SystemStatus | null) => void
): Unsubscribe => {
  return onSnapshot(
    doc(db, SYSTEM_STATUS_COLLECTION, componentId),
    (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as SystemStatus);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error(`Error subscribing to ${componentId} status:`, error);
    }
  );
};

/**
 * Get status color for UI display
 */
export const getStatusColor = (status: ComponentStatus): string => {
  switch (status) {
    case "healthy":
      return "text-green-600 bg-green-100";
    case "warning":
      return "text-yellow-600 bg-yellow-100";
    case "error":
      return "text-red-600 bg-red-100";
    case "idle":
      return "text-gray-600 bg-gray-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

/**
 * Get event type color for UI display
 */
export const getEventTypeColor = (type: EventType): string => {
  switch (type) {
    case "success":
      return "text-green-600";
    case "warning":
      return "text-yellow-600";
    case "error":
      return "text-red-600";
    case "info":
    default:
      return "text-blue-600";
  }
};

/**
 * Get event icon for UI display
 */
export const getEventIcon = (type: EventType): string => {
  switch (type) {
    case "success":
      return "✅";
    case "warning":
      return "⚠️";
    case "error":
      return "❌";
    case "info":
    default:
      return "ℹ️";
  }
};

/**
 * Format timestamp for display
 */
export const formatTimestamp = (timestamp: any): string => {
  if (!timestamp) return "Never";

  // Handle Firestore Timestamp
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 10) return "just now";
  if (diffSecs < 60) return `${diffSecs} seconds ago`;
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
};
