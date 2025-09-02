
// This is a mock authentication system for demonstration purposes.
// In a real application, this would be handled by a proper authentication service.
import { User } from './firebase/types';

// Re-export User type for convenience
export type { User };

let users: (User & { password?: string })[] = [
  {
    id: "1",
    name: "Game Master",
    email: "gm@example.com",
    role: "master",
    avatar: "https://picsum.photos/100/100?random=99",
    password: "password",
    campaignId: "1",
  },
  {
    id: "2",
    name: "Alice",
    email: "player@example.com",
    role: "player",
    avatar: "https://picsum.photos/100/100?random=5",
    password: "password",
    campaignId: "1",
  },
];

export const getUserByEmail = (email: string): (User & { password?: string }) | undefined => {
  return users.find((user) => user.email === email);
};

export const getUserById = (id: string): (User & { password?: string }) | undefined => {
    return users.find((user) => user.id === id);
}

// In a real app, never handle passwords in plaintext on the client.
export const checkPassword = (user: User & { password?: string }, pass: string): boolean => {
  return user.password === pass;
};

// Mock update function
export const updateUser = (id: string, updatedData: Partial<User>): void => {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData };
    }
}
