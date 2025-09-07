import { useState, useCallback } from 'react';
import { uploadOrganizationLogo, uploadUserProfilePicture, updateUserProfile, updateOrganization } from '@/api/schoolAdminApi';
// import { parseError, getUserFriendlyMessage, getNotificationType } from '@/utils/errorUtils';

/**
 * Hook for managing user profile and organization logo uploads
 */
export default function useProfileManagement() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Upload organization logo
   */
  const uploadLogo = useCallback(async (logoFile, organizationId, onSuccess, onError) => {
    if (!logoFile || !organizationId) {
      const errorMsg = 'Logo file and organization ID are required';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(logoFile.type)) {
      const errorMsg = 'Please select a valid image file (JPEG, PNG, GIF, or WebP)';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (logoFile.size > maxSize) {
      const errorMsg = 'Logo file size must be less than 5MB';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await uploadOrganizationLogo(logoFile, organizationId);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const data = await response.json();
        onSuccess?.(data);
        
        // Update local storage with new logo URL
        updateUserDataInStorage(userData => ({
          ...userData,
          organizations: userData.organizations?.map(org => 
            org.organization?.id === organizationId 
              ? { ...org, organization: { ...org.organization, logo: data.logo } }
              : org
          ) || []
        }));

        return { success: true, data };
      } else {
        throw new Error(`Upload failed: ${response.status}`);
      }
    } catch (err) {
      const userMessage = err.message || 'Failed to upload organization logo';

      setError(userMessage);
      onError?.(userMessage);

      return { success: false, error: userMessage };
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, []);

  /**
   * Upload user profile picture
   */
  const uploadProfilePicture = useCallback(async (profileFile, onSuccess, onError) => {
    if (!profileFile) {
      const errorMsg = 'Profile picture file is required';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(profileFile.type)) {
      const errorMsg = 'Please select a valid image file (JPEG, PNG, GIF, or WebP)';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (profileFile.size > maxSize) {
      const errorMsg = 'Profile picture file size must be less than 2MB';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await uploadUserProfilePicture(profileFile);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const data = await response.json();
        onSuccess?.(data);
        
        // Update local storage with new profile picture URL
        updateUserDataInStorage(userData => ({
          ...userData,
          profile_picture: data.profile_picture,
          avatar_url: data.profile_picture
        }));

        return { success: true, data };
      } else {
        throw new Error(`Upload failed: ${response.status}`);
      }
    } catch (err) {
      const userMessage = err.message || 'Failed to upload profile picture';

      setError(userMessage);
      onError?.(userMessage);

      return { success: false, error: userMessage };
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, []);

  /**
   * Open file picker for logo upload
   */
  const openLogoFilePicker = useCallback((organizationId, onSuccess, onError) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        uploadLogo(file, organizationId, onSuccess, onError);
      }
    };
    input.click();
  }, [uploadLogo]);

  /**
   * Open file picker for profile picture upload
   */
  const openProfileFilePicker = useCallback((onSuccess, onError) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        uploadProfilePicture(file, onSuccess, onError);
      }
    };
    input.click();
  }, [uploadProfilePicture]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    uploading,
    uploadProgress,
    error,
    
    // Actions
    uploadLogo,
    uploadProfilePicture,
    openLogoFilePicker,
    openProfileFilePicker,
    clearError
  };
}

/**
 * Helper function to update user data in storage
 */
function updateUserDataInStorage(updateFn) {
  try {
    const userData = JSON.parse(
      localStorage.getItem('user_data') || 
      sessionStorage.getItem('user_data') || 
      '{}'
    );
    
    const updatedData = updateFn(userData);
    
    const dataString = JSON.stringify(updatedData);
    localStorage.setItem('user_data', dataString);
    sessionStorage.setItem('user_data', dataString);
  } catch (error) {
    console.warn('Failed to update user data in storage:', error);
  }
}
