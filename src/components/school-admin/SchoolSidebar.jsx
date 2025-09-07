import React from "react";
import { 
  Home, 
  GraduationCap, 
  UserSquare, 
  Users, 
  Utensils, 
  Plus,
  ChevronDown,
  ChevronRight,
  User,
  FileText,
  Calendar
} from "lucide-react";

/**
 * School admin sidebar navigation component.
 * Provides hierarchical navigation with accessibility features.
 */
const SchoolSidebar = React.memo(function SchoolSidebar({
  activeRoute,
  expandedItems = {},
  sidebarItems = [],
  onNavigate,
  onToggleExpanded,
  schoolName = "Akademi School",
  organizationLogo = null,
  organizationInitials = "AS",
  currentYear = new Date().getFullYear(),
  onLogoClick,
  className = ""
}) {
  const getIcon = (iconName) => {
    const iconMap = {
      Home,
      GraduationCap,
      UserSquare,
      Users,
      Utensils,
      Plus,
      User,
      FileText,
      Calendar
    };
    
    const IconComponent = iconMap[iconName] || Home;
    return <IconComponent className="w-5 h-5" />;
  };

  const handleItemClick = (item) => {
    if (item.hasSubmenu) {
      onToggleExpanded(item.id);
    } else {
      onNavigate(item.id);
    }
  };

  const handleItemKeyDown = (e, item) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleItemClick(item);
    }
    
    // Arrow key navigation
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextItem = e.target.parentElement.nextElementSibling?.querySelector('[role="menuitem"]');
      nextItem?.focus();
    }
    
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevItem = e.target.parentElement.previousElementSibling?.querySelector('[role="menuitem"]');
      prevItem?.focus();
    }
  };

  const handleSubmenuItemClick = (submenuItem) => {
    onNavigate(submenuItem.id);
  };

  const handleSubmenuKeyDown = (e, submenuItem) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSubmenuItemClick(submenuItem);
    }
  };

  return (
    <aside
      className={`bg-white shadow-lg h-full flex flex-col ${className}`}
      role="navigation"
      aria-label="School admin navigation"
    >
      {/* School Header */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center">
          <button
            onClick={onLogoClick}
            className="w-10 h-10 bg-[#4D44B5] rounded-lg flex items-center justify-center mr-3 hover:bg-[#3D34A5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4D44B5] focus:ring-offset-2"
            aria-label="Organization logo - click to update"
            title="Click to update organization logo"
          >
            {organizationLogo ? (
              <img
                src={organizationLogo}
                alt={`${schoolName} logo`}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <span
              className={`text-white font-bold text-lg ${organizationLogo ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}
              style={{ display: organizationLogo ? 'none' : 'flex' }}
            >
              {organizationInitials}
            </span>
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-900 text-lg leading-tight truncate">
              {schoolName}
            </h2>
            <p className="text-gray-500 text-sm">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 flex-1 overflow-y-auto" role="menu">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.id} role="none">
              {/* Main Menu Item */}
              <button
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => handleItemKeyDown(e, item)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg text-left
                  transition-all duration-200 ease-in-out
                  ${activeRoute === item.id 
                    ? "bg-[#4D44B5] text-white shadow-md" 
                    : "text-gray-700 hover:bg-gray-100"
                  }
                  focus:outline-none focus:ring-2 focus:ring-[#4D44B5] focus:ring-offset-2
                `}
                role="menuitem"
                aria-expanded={item.hasSubmenu ? expandedItems[item.id] : undefined}
                aria-haspopup={item.hasSubmenu ? "true" : undefined}
                aria-label={item.label}
              >
                <div className="flex items-center">
                  <span className="mr-3" aria-hidden="true">
                    {getIcon(item.icon)}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </div>
                
                {item.hasSubmenu && (
                  <span 
                    className={`transition-transform duration-200 ${
                      expandedItems[item.id] ? "rotate-90" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </button>

              {/* Submenu */}
              {item.hasSubmenu && expandedItems[item.id] && (
                <ul 
                  className="mt-2 ml-4 space-y-1 border-l-2 border-gray-200 pl-4"
                  role="menu"
                  aria-label={`${item.label} submenu`}
                >
                  {item.submenu?.map((submenuItem) => (
                    <li key={submenuItem.id} role="none">
                      <button
                        onClick={() => handleSubmenuItemClick(submenuItem)}
                        onKeyDown={(e) => handleSubmenuKeyDown(e, submenuItem)}
                        className={`
                          w-full flex items-center px-3 py-2 rounded-md text-left text-sm
                          transition-all duration-200 ease-in-out
                          ${activeRoute === submenuItem.id 
                            ? "bg-[#4D44B5] text-white" 
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }
                          focus:outline-none focus:ring-2 focus:ring-[#4D44B5] focus:ring-offset-2
                        `}
                        role="menuitem"
                        aria-label={submenuItem.label}
                      >
                        <span className="mr-2" aria-hidden="true">
                          {getIcon(submenuItem.icon)}
                        </span>
                        <span>{submenuItem.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © {currentYear} {schoolName}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Version 1.0.0
          </p>
        </div>
      </div>
    </aside>
  );
});

/**
 * Compact sidebar for mobile or collapsed state
 */
export const CompactSchoolSidebar = React.memo(function CompactSchoolSidebar({
  activeRoute,
  sidebarItems = [],
  onNavigate,
  className = ""
}) {
  const getIcon = (iconName) => {
    const iconMap = {
      Home,
      GraduationCap,
      UserSquare,
      Users,
      Utensils
    };
    
    const IconComponent = iconMap[iconName] || Home;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <aside 
      className={`bg-white shadow-lg h-full ${className}`}
      role="navigation"
      aria-label="School admin navigation (compact)"
    >
      {/* School Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-[#4D44B5] rounded-lg flex items-center justify-center mx-auto">
          <span className="text-white font-bold text-lg">A</span>
        </div>
      </div>

      {/* Navigation Icons */}
      <nav className="p-2" role="menu">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.id} role="none">
              <button
                onClick={() => onNavigate(item.id)}
                className={`
                  w-full p-3 rounded-lg flex items-center justify-center
                  transition-all duration-200 ease-in-out
                  ${activeRoute === item.id 
                    ? "bg-[#4D44B5] text-white shadow-md" 
                    : "text-gray-700 hover:bg-gray-100"
                  }
                  focus:outline-none focus:ring-2 focus:ring-[#4D44B5] focus:ring-offset-2
                `}
                role="menuitem"
                aria-label={item.label}
                title={item.label}
              >
                {getIcon(item.icon)}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
});

export default SchoolSidebar;
