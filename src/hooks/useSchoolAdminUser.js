import { useState, useEffect, useMemo } from "react";
import { getTokens } from "@/api/auth";
import usePrefersDarkMode from "@/hooks/usePrefersDarkMode";

/**
 * Hook that manages school admin user information and preferences.
 * Provides user data, theme preferences, and school-specific user utilities.
 */
export default function useSchoolAdminUser() {
  const darkMode = usePrefersDarkMode();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [schoolInfo, setSchoolInfo] = useState(null);

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
          console.log(userData)
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // Load school-specific information
          const schoolData = 
            store?.getItem("school_data") ||
            window.localStorage.getItem("school_data") ||
            window.sessionStorage.getItem("school_data");
          
          if (schoolData) {
            setSchoolInfo(JSON.parse(schoolData));
          }
        }
      } catch (error) {
        console.warn("Failed to load school admin user data:", error);
        setUser(null);
        setSchoolInfo(null);
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
    if (!user) return "School Admin";
    
    // Try different possible name fields
    if (user.display_name) return user.display_name;
    if (user.full_name) return user.full_name;
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.first_name) return user.first_name;
    if (user.username) return user.username;
    if (user.email) return user.email.split('@')[0];
    
    return "School Admin";
  }, [user]);

  /**
   * Get organization data from user's organizations array
   */
  const organizationData = useMemo(() => {
    if (!user?.organizations || !Array.isArray(user.organizations)) {
      return null;
    }

    // Get the first organization (or selected one in the future)
    const orgData = user.organizations[0];
    return orgData?.organization || null;
  }, [user]);

  /**
   * Get school/organization name with fallback
   */
  const schoolName = useMemo(() => {
    // Priority: organization data > school info > user school name > fallback
    if (organizationData?.name) return organizationData.name;
    if (schoolInfo?.name) return schoolInfo.name;
    if (user?.school_name) return user.school_name;
    return "Akademi School";
  }, [organizationData, schoolInfo, user]);

  /**
   * Get user's initials for avatar
   */
  const initials = useMemo(() => {
    if (!user) return "SA";
    
    const name = displayName;
    const words = name.split(' ').filter(word => word.length > 0);
    
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    } else if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    
    return "SA";
  }, [displayName]);

  /**
   * Get user's role information
   */
  const roleInfo = useMemo(() => {
    if (!user) return { role: "school_admin", permissions: [] };
    
    // Handle different role structures
    let role = "school_admin";
    let permissions = [];
    
    if (Array.isArray(user.roles)) {
      // Multiple roles structure
      const schoolAdminRole = user.roles.find(r => 
        r.role?.code === "school_admin" || 
        r.role?.name?.toLowerCase().includes("school") ||
        r.role?.name?.toLowerCase().includes("admin")
      );
      
      if (schoolAdminRole) {
        role = schoolAdminRole.role.code || "school_admin";
        permissions = schoolAdminRole.permissions || [];
      }
    } else if (user.role) {
      // Single role structure
      role = typeof user.role === "string" ? user.role : user.role.code || "school_admin";
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
   * Check if user is super admin (can manage multiple schools)
   */
  const isSuperAdmin = useMemo(() => {
    return roleInfo.role === "super_admin" || 
           roleInfo.permissions.includes("manage_multiple_schools") ||
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
   * Get organization logo with fallback
   */
  const organizationLogo = useMemo(() => {
    // Priority: organization logo > school info logo > user school logo
    if (organizationData?.logo) return organizationData.logo;
    if (schoolInfo?.logo) return schoolInfo.logo;
    if (user?.school_logo) return user.school_logo;
    return null;
  }, [organizationData, schoolInfo, user]);

  /**
   * Get organization initials for logo fallback
   */
  const organizationInitials = useMemo(() => {
    const name = schoolName;
    const words = name.split(' ').filter(word => word.length > 0);

    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    } else if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return "AS"; // Akademi School fallback
  }, [schoolName]);

  /**
   * Get school/organization information
   */
  const schoolDetails = useMemo(() => {
    return {
      name: schoolName,
      address: organizationData?.address || schoolInfo?.address || user?.school_address || "",
      phone: organizationData?.phone_number || schoolInfo?.phone || user?.school_phone || "",
      email: organizationData?.email || schoolInfo?.email || user?.school_email || "",
      website: organizationData?.website || schoolInfo?.website || user?.school_website || "",
      logo: organizationLogo,
      established: schoolInfo?.established || user?.school_established || "",
      type: schoolInfo?.type || user?.school_type || "Public School",
      code: organizationData?.code || "",
      id: organizationData?.id || "",
      initials: organizationInitials
    };
  }, [organizationData, schoolInfo, user, schoolName, organizationLogo, organizationInitials]);

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

  /**
   * Get school admin specific permissions
   */
  const schoolPermissions = useMemo(() => {
    const basePermissions = {
      canManageStudents: hasPermission("manage_students"),
      canManageTeachers: hasPermission("manage_teachers"),
      canManageParents: hasPermission("manage_parents"),
      canManageFood: hasPermission("manage_food"),
      canViewReports: hasPermission("view_reports"),
      canExportData: hasPermission("export_data"),
      canManageEvents: hasPermission("manage_events"),
      canManageCalendar: hasPermission("manage_calendar")
    };

    // If no specific permissions, assume school admin has basic permissions
    if (Object.values(basePermissions).every(p => !p) && user) {
      return {
        canManageStudents: true,
        canManageTeachers: true,
        canManageParents: true,
        canManageFood: true,
        canViewReports: true,
        canExportData: true,
        canManageEvents: true,
        canManageCalendar: true
      };
    }

    return basePermissions;
  }, [hasPermission, user]);

  /**
   * Get current year for dynamic copyright
   */
  const currentYear = useMemo(() => {
    return new Date().getFullYear();
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

    // Organization/School data
    organizationData,
    schoolName,
    schoolDetails,
    organizationLogo,
    organizationInitials,
    currentYear,

    // Permissions
    hasPermission,
    isSuperAdmin,
    schoolPermissions,

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
    "4D44B5", // school purple
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
