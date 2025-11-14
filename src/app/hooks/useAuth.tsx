"use client";

import { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

export type AuthUser = {
  name?: string;
  email?: string;
  [key: string]: unknown;
} | null;

export type JWTPayload = {
  sub?: string;
  name?: string;
  email?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const decodeToken = useCallback((token: string): JWTPayload | null => {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      console.log("Token decodificado:", decoded);
      return decoded;
    } catch (error) {
      console.error("Erro ao decodificar token JWT:", error);
      return null;
    }
  }, []);

  const isTokenExpired = useCallback((token: string): boolean => {
    try {
      const decoded = decodeToken(token);
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Date.now() / 1000;
      const isExpired = decoded.exp < currentTime;
      console.log("Token expirado?", isExpired, "Exp:", decoded.exp, "Current:", currentTime);
      return isExpired;
    } catch {
      return true;
    }
  }, [decodeToken]);

  const loadUser = useCallback(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      if (isTokenExpired(token)) {
        sessionStorage.removeItem("token");
        setUser(null);
        setLoading(false);
        return;
      }

      const decodedToken = decodeToken(token);
      
      if (decodedToken) {
        const userData = {
          name: decodedToken.name,
          email: decodedToken.email,
          sub: decodedToken.sub,
          ...decodedToken
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      setUser(null);
      setLoading(false);
    }
  }, [decodeToken, isTokenExpired]);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("token");
    }
    setUser(null);
  }, []);

  useEffect(() => {
    const initializeAuth = () => {
      if (typeof window === "undefined") {
        console.log("Não está no cliente ainda (window não definida)");
        setLoading(false);
        return;
      }

      try {
        const token = sessionStorage.getItem("token");
        
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        if (isTokenExpired(token)) {
          setUser(null);
          setLoading(false);
          return;
        }

        const decodedToken = decodeToken(token);
        
        if (decodedToken) {
          const userData = {
            name: decodedToken.name,
            email: decodedToken.email,
            sub: decodedToken.sub,
            ...decodedToken
          };
          setUser(userData);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      } catch (error) {
        setUser(null);
        setLoading(false);
      }
    };

    initializeAuth();

    if (typeof window !== "undefined") {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "token") {
          initializeAuth();
        }
      };

      window.addEventListener("storage", handleStorageChange);
      
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, [decodeToken, isTokenExpired]);

  return { 
    user, 
    loading, 
    logout,
    loadUser,
    decodeToken,
    isTokenExpired
  };
}

export default useAuth;
