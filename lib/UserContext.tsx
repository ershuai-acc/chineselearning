'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  deviceId: string;
  nickname: string | null;
  avatar: string | null;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  userId: string | null;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  userId: null,
});

export function useUser() {
  return useContext(UserContext);
}

function getOrCreateDeviceId(): string {
  const KEY = 'chinese-learner-device-id';
  let deviceId = localStorage.getItem(KEY);
  if (!deviceId) {
    deviceId = `device-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem(KEY, deviceId);
  }
  return deviceId;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const deviceId = getOrCreateDeviceId();

    // Auto-register/login via deviceId
    fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, userId: user?.id || null }}>
      {children}
    </UserContext.Provider>
  );
}
