"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";

export type AuthUser = {
  name?: string;
  email?: string;
  sub?: string | number;
  id?: string | number;
  [key: string]: unknown;
} | null;

type AuthPayload = {
  user?: Record<string, unknown>;
  [key: string]: unknown;
};

const normalizeUser = (payload: unknown): AuthUser => {
  if (!payload || typeof payload !== "object") return null;

  const base =
    "user" in payload && typeof (payload as AuthPayload).user === "object"
      ? (payload as AuthPayload).user
      : payload;

  if (!base || typeof base !== "object") return null;

  const record = base as Record<string, unknown>;
  const sub = record.sub ?? record.id;

  return {
    ...record,
    ...(sub !== undefined ? { sub } : {}),
  } as AuthUser;
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/auth/me", { withCredentials: true });
      setUser(normalizeUser(response.data));
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Ignore logout errors and clear local state.
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  return {
    user,
    loading,
    logout,
    loadUser,
  };
}

export default useAuth;
