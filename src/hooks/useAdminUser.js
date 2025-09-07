import { useState, useEffect, useMemo } from "react";
import { getTokens } from "@/api/auth";
import usePrefersDarkMode from "@/hooks/usePrefersDarkMode";

/**
 * Hook that manages admin user information and preferences.
 * Provides user data, theme preferences, and user-related utilities.
 */
export default function useAdminUser() {
  const darkMode = usePrefersDarkMode();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Load user data from storage
   */
  useEffect(() => {
    const loadUserData = () => {
      try {
        const { store } = getTokens();
        const userData = 
          store?.getItem("user_data") ||
          window.localStorage.getItem("user_data") ||
          window.sessionStorage.getItem("user_data");
        
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.warn("Failed to load user data:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  /**
   * Get user's display name with fallback
   */
  const displayName = useMemo(() => {
    if (!user) return "Admin";
    
    // Try different possible name fields
    if (user.display_name) return user.display_name;
    if (user.full_name) return user.full_name;
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.first_name) return user.first_name;
    if (user.username) return user.username;
    if (user.email) return user.email.split('@')[0];
    
    return "Admin";
  }, [user]);

  /**
   * Get user's initials for avatar
   */
  const initials = useMemo(() => {
    if (!user) return "A";
    
    const name = displayName;
    const words = name.split(' ').filter(word => word.length > 0);
    
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    } else if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    
    return "A";
  }, [displayName]);

  /**
   * Get user's role information
   */
  const roleInfo = useMemo(() => {
    if (!user) return { role: "admin", permissions: [] };
    
    // Handle different role structures
    let role = "admin";
    let permissions = [];
    
    if (Array.isArray(user.roles)) {
      // Multiple roles structure
      const adminRole = user.roles.find(r => 
        r.role?.code === "admin" || 
        r.role?.name?.toLowerCase().includes("admin")
      );
      
      if (adminRole) {
        role = adminRole.role.code || "admin";
        permissions = adminRole.permissions || [];
      }
    } else if (user.role) {
      // Single role structure
      role = typeof user.role === "string" ? user.role : user.role.code || "admin";
      permissions = user.permissions || [];
    }
    
    return { role, permissions };
  }, [user]);

  /**
   * Check if user has specific permission
   */
  const hasPermission = (permission) => {
    if (!user) return false;
    return roleInfo.permissions.includes(permission);
  };

  /**
   * Check if user is super admin
   */
  const isSuperAdmin = useMemo(() => {
    return roleInfo.role === "super_admin" || 
           roleInfo.permissions.includes("super_admin") ||
           user?.is_superuser === true;
  }, [roleInfo, user]);

  /**
   * Get user's avatar URL or generate one
   */
  const avatarUrl = useMemo(() => {
    if (user?.avatar_url || user?.profile_picture) {
      return user.avatar_url || user.profile_picture;
    }
    
    // Generate a placeholder avatar URL based on initials
    const backgroundColor = getAvatarColor(displayName);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${backgroundColor}&color=fff&size=128&font-size=0.5`;
  }, [user, initials, displayName]);

  /**
   * Get user's last login information
   */
  const lastLoginInfo = useMemo(() => {
    if (!user?.last_login) return null;
    
    try {
      const lastLogin = new Date(user.last_login);
      const now = new Date();
      const diffMs = now - lastLogin;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else {
        return "Recently";
      }
    } catch {
      return null;
    }
  }, [user]);

  /**
   * Get welcome message based on time of day
   */
  const welcomeMessage = useMemo(() => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return "Good morning";
    } else if (hour < 17) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  }, []);

  return {
    // User data
    user,
    loading,
    displayName,
    initials,
    avatarUrl,
    roleInfo,
    lastLoginInfo,
    welcomeMessage,
    
    // Permissions
    hasPermission,
    isSuperAdmin,
    
    // Theme
    darkMode,
    
    // Utilities
    isAuthenticated: !!user
  };
}

/**
 * Generate a consistent color for avatar based on name
 */
function getAvatarColor(name) {
  const colors = [
    "3B82F6", // blue
    "10B981", // emerald
    "F59E0B", // amber
    "EF4444", // red
    "8B5CF6", // violet
    "06B6D4", // cyan
    "84CC16", // lime
    "F97316", // orange
    "EC4899", // pink
    "6366F1"  // indigo
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}
