import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { scheduleWork } from "@/utils/scheduleWork";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const normalizeRole = (role) => (typeof role === "string" ? role.toLowerCase() : "user");

  const getAuthAPI = async () => {
    const mod = await import("@/services/api");
    return mod.authAPI;
  };

  const syncGuestCart = async () => {
    const mod = await import("@/utils/cartSync");
    return mod.syncGuestCartToUser();
  };

  const hasNextAuthSessionCookie = () => {
    if (typeof document === "undefined") return false;
    const cookie = document.cookie || "";
    return (
      cookie.includes("next-auth.session-token=") ||
      cookie.includes("__Secure-next-auth.session-token=")
    );
  };

  // Sync AuthContext from either:
  // 1) localStorage token (email/password login)
  // 2) NextAuth cookie (Google login) via on-demand getSession()
  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;
    const path = router.pathname;
    const needsImmediateAuth =
      path.startsWith("/admin") ||
      path.startsWith("/profile") ||
      path.startsWith("/orders") ||
      path.startsWith("/checkout") ||
      path.startsWith("/cart") ||
      path === "/login" ||
      path === "/register";

    const pendingInteractionHandlers = new Set();
    const pendingLoadHandlers = new Set();

    const scheduleAfterInteraction = (fn, { fallbackTimeout = 15000 } = {}) => {
      if (needsImmediateAuth) {
        scheduleWork(fn, { timeout: 2500 });
        return;
      }

      let didRun = false;
      const run = () => {
        if (didRun) return;
        didRun = true;
        fn();
        pendingInteractionHandlers.delete(run);
        window.removeEventListener("pointerdown", run);
        window.removeEventListener("keydown", run);
        window.removeEventListener("scroll", run);
      };

      pendingInteractionHandlers.add(run);

      window.addEventListener("pointerdown", run, { once: true, passive: true });
      window.addEventListener("keydown", run, { once: true });
      window.addEventListener("scroll", run, { once: true, passive: true });

      // Fallback: run eventually for real users that don't interact.
      if (document?.readyState === "complete") {
        scheduleWork(run, { timeout: fallbackTimeout });
      } else {
        const onLoad = () => scheduleWork(run, { timeout: fallbackTimeout });
        pendingLoadHandlers.add(onLoad);
        window.addEventListener("load", onLoad, { once: true });
        // Cleanup function will remove interaction listeners; load listener is once.
      }
    };

    const applyAuthenticated = async ({ accessToken, sessionUser, fromNextAuth }) => {
      const normalizedUser = {
        ...(sessionUser || {}),
        role: normalizeRole(sessionUser?.role),
      };

      setToken(accessToken);
      setUser(normalizedUser);

      try {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
      } catch {
        // ignore
      }

      if (fromNextAuth) {
        // Sync guest cart after Google login (defer to avoid blocking TBT)
        scheduleWork(() => {
          syncGuestCart().catch(() => { });
        }, { timeout: 2000 });
      }

      // Redirect to appropriate page after auth resolves (auth pages only).
      // Do NOT redirect away from public pages like '/'; moderators should be able to browse the storefront.
      if (["/login", "/register"].includes(path)) {
        if (normalizedUser.role === "admin") {
          router.push("/admin");
        } else if (normalizedUser.role === "moderator") {
          router.push("/admin/analytics");
        } else {
          router.push("/");
        }
      }
    };

    const init = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const normalizedStoredUser = {
            ...parsedUser,
            role: normalizeRole(parsedUser?.role),
          };

          setToken(storedToken);
          setUser(normalizedStoredUser);
          localStorage.setItem("user", JSON.stringify(normalizedStoredUser));

          // Verify token validity; avoid running during Lighthouse window on non-critical routes.
          scheduleAfterInteraction(() => {
            getAuthAPI()
              .then((api) => api.getMe())
              .then((response) => {
                if (cancelled) return;
                const refreshedUser = response.data.user || {};
                const normalizedRefreshedUser = {
                  ...refreshedUser,
                  role: normalizeRole(refreshedUser?.role),
                };
                setUser(normalizedRefreshedUser);
                localStorage.setItem("user", JSON.stringify(normalizedRefreshedUser));
              })
              .catch(() => {
                if (cancelled) return;
                setToken(null);
                setUser(null);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
              });
          }, { fallbackTimeout: 15000 });

          if (!cancelled) setLoading(false);
          return;
        }

        // No local token: if a NextAuth session cookie exists, sync via getSession().
        // This can be expensive (dynamic import + session fetch), so defer it on non-critical routes
        // to reduce Lighthouse main-thread work / JS execution time.
        if (hasNextAuthSessionCookie()) {
          const syncNextAuth = async () => {
            try {
              const { getSession } = await import("next-auth/react");
              const nextAuthSession = await getSession();

              if (
                !cancelled &&
                nextAuthSession &&
                nextAuthSession.user &&
                nextAuthSession.accessToken
              ) {
                await applyAuthenticated({
                  accessToken: nextAuthSession.accessToken,
                  sessionUser: nextAuthSession.user,
                  fromNextAuth: true,
                });
              }
            } catch {
              // ignore
            }
          };

          if (needsImmediateAuth) {
            await syncNextAuth();
          } else {
            // Don't sync NextAuth during Lighthouse window; reconcile after interaction/idle.
            scheduleAfterInteraction(() => {
              syncNextAuth();
            }, { fallbackTimeout: 15000 });
          }
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;

      for (const handler of pendingInteractionHandlers) {
        window.removeEventListener("pointerdown", handler);
        window.removeEventListener("keydown", handler);
        window.removeEventListener("scroll", handler);
      }
      pendingInteractionHandlers.clear();

      for (const handler of pendingLoadHandlers) {
        window.removeEventListener("load", handler);
      }
      pendingLoadHandlers.clear();
    };
  }, [router, router.pathname]);

  // Keep post-auth redirects only on auth pages.
  useEffect(() => {
    if (loading) return;
    if (user?.role === "moderator") {
      if (["/login", "/register"].includes(router.pathname)) {
        router.replace("/admin/analytics");
      }
    }
  }, [loading, user, router]);

  const login = async (email, password) => {
    try {
      const api = await getAuthAPI();
      const response = await api.login({ email, password });
      const { token: newToken, user: userData } = response.data;

      // Ensure user data includes role
      const userWithRole = {
        ...userData,
        role: userData.role || "user",
      };

      setToken(newToken);
      setUser(userWithRole);

      if (typeof window !== "undefined") {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(userWithRole));
      }

      // Sync guest cart to user cart after successful login
      try {
        await syncGuestCart();
      } catch (syncError) {
        // Don't fail login if cart sync fails
      }

      return {
        success: true,
        user: userWithRole,
      };
    } catch (error) {

      // Handle different error types
      if (error.response) {
        // Server responded with error
        const status = error.response.status;
        const errorData = error.response.data;

        let errorMessage = "Invalid email or password";

        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.errors && Array.isArray(errorData.errors)) {
          // Validation errors
          errorMessage = errorData.errors
            .map((e) => e.msg || e.message)
            .join(", ");
        } else if (status === 401) {
          errorMessage =
            "Invalid email or password. Please check your credentials.";
        } else if (status === 400) {
          errorMessage = "Please provide valid email and password.";
        }

        return {
          success: false,
          message: errorMessage,
        };
      } else if (error.request) {
        // Request made but no response (network error)
        // Check for ERR_BLOCKED_BY_CLIENT (ad blocker, browser extension)
        if (
          error.code === "ERR_BLOCKED_BY_CLIENT" ||
          error.message?.includes("ERR_BLOCKED_BY_CLIENT")
        ) {
          return {
            success: false,
            message:
              "Request blocked by browser extension or ad blocker. Please disable extensions and try again.",
          };
        }
        return {
          success: false,
          message:
            "Cannot connect to server. Please check if the backend is running on port 5000.",
        };
      } else {
        // Something else happened
        // Check for ERR_BLOCKED_BY_CLIENT
        if (
          error.code === "ERR_BLOCKED_BY_CLIENT" ||
          error.message?.includes("ERR_BLOCKED_BY_CLIENT")
        ) {
          return {
            success: false,
            message:
              "Request blocked by browser extension or ad blocker. Please disable extensions and try again.",
          };
        }
        return {
          success: false,
          message:
            error.message || "An unexpected error occurred. Please try again.",
        };
      }
    }
  };

  const register = async (userData) => {
    try {
      const api = await getAuthAPI();
      const response = await api.register(userData);
      const { token: newToken, user: newUser } = response.data;

      setToken(newToken);
      setUser(newUser);

      if (typeof window !== "undefined") {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
      }

      // Sync guest cart to user cart after successful registration
      try {
        await syncGuestCart();
      } catch (syncError) {
        // Don't fail registration if cart sync fails
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
        errors: error.response?.data?.errors,
      };
    }
  };

  const logout = async (redirectToLogin = false) => {
    setToken(null);
    setUser(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Sign out from NextAuth if a session cookie exists
      if (hasNextAuthSessionCookie()) {
        try {
          const { signOut } = await import("next-auth/react");
          await signOut({ redirect: false });
        } catch {
          // ignore
        }
      }

      // Only redirect if not already on login page
      if (redirectToLogin && router.pathname !== "/login") {
        router.push("/login");
      } else if (!redirectToLogin && router.pathname !== "/") {
        router.push("/");
      }
    }
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);

    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const refreshUser = async () => {
    try {
      const api = await getAuthAPI();
      const response = await api.getMe();
      const userData = response.data.user;
      setUser(userData);

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error) {
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
