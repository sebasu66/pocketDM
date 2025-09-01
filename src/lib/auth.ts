// This is a mock authentication system for demonstration purposes.
// In a real application, this would be handled by a proper authentication service.

export interface User {
  id: string;
  name: string;
  email: string;
  role: "master" | "player";
  avatar: string;
  password?: string; // Only for mock purposes
}

const users: User[] = [
  {
    id: "1",
    name: "Game Master",
    email: "gm@example.com",
    role: "master",
    avatar: "https://picsum.photos/100/100?random=99",
    password: "password",
  },
  {
    id: "2",
    name: "Alice",
    email: "player@example.com",
    role: "player",
    avatar: "https://picsum.photos/100/100?random=5",
    password: "password",
  },
];

export const getUserByEmail = (email: string): User | undefined => {
  return users.find((user) => user.email === email);
};

export const getUserById = (id: string): User | undefined => {
    return users.find((user) => user.id === id);
}

// In a real app, never handle passwords in plaintext on the client.
export const checkPassword = (user: User, pass: string): boolean => {
  return user.password === pass;
};
