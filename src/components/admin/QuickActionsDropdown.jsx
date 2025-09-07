import React, { useRef, useEffect } from "react";
import { 
  Plus, 
  Download, 
  BarChart3, 
  BookOpen, 
  Users,
  FileText,
  Settings,
  ChevronDown
} from "lucide-react";

/**
 * Quick actions dropdown component for admin dashboard.
 * Provides easy access to common admin actions.
 */
const QuickActionsDropdown = React.memo(function QuickActionsDropdown({
  isOpen,
  onToggle,
  onClose,
  actions = [],
  loading = false,
  className = ""
}) {
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      switch (event.key) {
        case "Escape":
          onClose();
          buttonRef.current?.focus();
          break;

        case "ArrowDown":
          event.preventDefault();
          const firstItem = dropdownRef.current?.querySelector('[role="menuitem"]');
          firstItem?.focus();
          break;

        case "ArrowUp":
          event.preventDefault();
          const lastItem = dropdownRef.current?.querySelector('[role="menuitem"]:last-child');
          lastItem?.focus();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleActionClick = (action) => {
    if (!loading && action.action) {
      action.action();
    }
  };

  const handleActionKeyDown = (e, action, index) => {
    if ((e.key === "Enter" || e.key === " ") && !loading) {
      e.preventDefault();
      action.action();
      return;
    }

    // Arrow key navigation within menu
    const menuItems = dropdownRef.current?.querySelectorAll('[role="menuitem"]');
    if (!menuItems) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        const nextIndex = (index + 1) % menuItems.length;
        menuItems[nextIndex]?.focus();
        break;

      case "ArrowUp":
        e.preventDefault();
        const prevIndex = (index - 1 + menuItems.length) % menuItems.length;
        menuItems[prevIndex]?.focus();
        break;

      case "Home":
        e.preventDefault();
        menuItems[0]?.focus();
        break;

      case "End":
        e.preventDefault();
        menuItems[menuItems.length - 1]?.focus();
        break;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={onToggle}
        disabled={loading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg border-2 
          transition-all duration-200 ease-in-out
          ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50"}
          border-blue-600 text-blue-600 font-semibold
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Quick actions menu"
      >
        <div className="p-1 rounded-full border-2 border-blue-600">
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </div>
        <span className="text-sm md:text-base">Quick Actions</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`
            absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl 
            border border-gray-200 z-50 overflow-hidden
            animate-in slide-in-from-top-2 duration-200
          `}
          role="menu"
          aria-label="Quick actions"
        >
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Quick Actions
            </h3>
            
            <div className="space-y-2">
              {actions.map((action, index) => {
                const IconComponent = getIconComponent(action.icon);

                return (
                  <button
                    key={action.id}
                    onClick={() => handleActionClick(action)}
                    onKeyDown={(e) => handleActionKeyDown(e, action, index)}
                    disabled={loading}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-lg
                      transition-all duration-200 ease-in-out text-left
                      ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50 focus:bg-blue-50"}
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
                    `}
                    role="menuitem"
                    aria-describedby={`${action.id}-description`}
                    tabIndex={isOpen ? 0 : -1}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      <IconComponent className="w-5 h-5" aria-hidden="true" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm">
                        {action.label}
                      </div>
                      {action.description && (
                        <div 
                          id={`${action.id}-description`}
                          className="text-xs text-gray-600 mt-1 line-clamp-2"
                        >
                          {action.description}
                        </div>
                      )}
                    </div>
                    
                    {/* Loading indicator for specific action */}
                    {loading && (
                      <div className="flex-shrink-0">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {actions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No actions available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

/**
 * Get the appropriate icon component based on type
 */
function getIconComponent(iconType) {
  const iconMap = {
    plus: Plus,
    download: Download,
    chart: BarChart3,
    book: BookOpen,
    users: Users,
    file: FileText,
    settings: Settings,
    default: Plus
  };
  
  return iconMap[iconType] || iconMap.default;
}

export default QuickActionsDropdown;
