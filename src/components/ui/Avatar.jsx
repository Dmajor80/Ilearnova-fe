import React, { useState } from "react";

/**
 * Generate initials from a name
 */
function getInitials(name) {
  if (!name) return "?";
  
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

/**
 * Generate a consistent color based on name
 */
function getAvatarColor(name) {
  if (!name) return "bg-gray-500";
  
  const colors = [
    "bg-blue-500",
    "bg-green-500", 
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500"
  ];
  
  // Generate a hash from the name to consistently pick a color
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Avatar component that handles image loading with fallback to initials
 */
const Avatar = React.memo(function Avatar({
  src,
  name,
  size = "w-8 h-8",
  textSize = "text-sm",
  className = "",
  alt,
  ...props
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(!!src);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // If no src provided or image failed to load, show initials
  const showInitials = !src || imageError;
  
  if (showInitials) {
    const initials = getInitials(name);
    const colorClass = getAvatarColor(name);
    
    return (
      <div
        className={`${size} ${colorClass} rounded-full flex items-center justify-center text-white font-medium ${textSize} ${className}`}
        title={name}
        {...props}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={`${size} rounded-full overflow-hidden ${className}`} {...props}>
      <img
        src={src}
        alt={alt || name}
        className={`w-full h-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
      />
      {imageLoading && (
        <div className={`${size} ${getAvatarColor(name)} rounded-full flex items-center justify-center text-white font-medium ${textSize} absolute inset-0`}>
          {getInitials(name)}
        </div>
      )}
    </div>
  );
});

/**
 * Simple initials-only avatar (no image loading)
 */
export const InitialsAvatar = React.memo(function InitialsAvatar({
  name,
  size = "w-8 h-8",
  textSize = "text-sm",
  className = "",
  ...props
}) {
  const initials = getInitials(name);
  const colorClass = getAvatarColor(name);
  
  return (
    <div
      className={`${size} ${colorClass} rounded-full flex items-center justify-center text-white font-medium ${textSize} ${className}`}
      title={name}
      {...props}
    >
      {initials}
    </div>
  );
});

/**
 * Avatar group component for showing multiple avatars
 */
export const AvatarGroup = React.memo(function AvatarGroup({
  avatars = [],
  maxVisible = 3,
  size = "w-8 h-8",
  className = "",
  ...props
}) {
  const visibleAvatars = avatars.slice(0, maxVisible);
  const remainingCount = avatars.length - maxVisible;
  
  return (
    <div className={`flex -space-x-2 ${className}`} {...props}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={avatar.id || index}
          src={avatar.src}
          name={avatar.name}
          size={size}
          className="border-2 border-white"
        />
      ))}
      {remainingCount > 0 && (
        <div className={`${size} bg-gray-500 rounded-full flex items-center justify-center text-white font-medium text-xs border-2 border-white`}>
          +{remainingCount}
        </div>
      )}
    </div>
  );
});

export default Avatar;
