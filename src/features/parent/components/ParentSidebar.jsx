import React from "react";
import { X } from "lucide-react";
import { groupOf } from "@/components/navigation/navGroups";
import { PARENT_GROUPS } from "../parentNav";
import { useNavigate } from "react-router-dom";

function ParentSidebar({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const navigate = useNavigate();

  const activeGroup = groupOf(PARENT_GROUPS, activeTab);

  // Every parent page is a tab of the dashboard.
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    navigate("/parent-dashboard", { state: { activeTab: tabId } });
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-white/10 z-40 md:hidden backdrop-blur-[2px]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-all duration-300 ease-in-out md:translate-x-0 border-r border-slate-200 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 md:p-6 bg-gradient-to-b from-white via-slate-50 to-blue-50 h-full">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <h2 className={`
                font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transition-all duration-300
                ${isMobileMenuOpen ? "block" : "hidden md:block"}
              `}>LEARNOVA</h2>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
              className="md:hidden p-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-slate-50 border border-slate-200"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          <nav className="space-y-1" aria-label="Parent dashboard">
            {PARENT_GROUPS.map((link) => (
              <div key={link.id} className="relative group">
                <button
                  onClick={() => handleTabClick(link.tabs[0].id)}
                  aria-current={activeGroup?.id === link.id ? "page" : undefined}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 min-h-[48px] group ${
                    activeGroup?.id === link.id
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02] border border-blue-500"
                      : "text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md border border-transparent hover:border-blue-200"
                  }`}
                  title={link.label}
                >
                  <span className={`mr-4 flex-shrink-0 transition-colors duration-200 ${
                    activeGroup?.id === link.id ? "text-white" : "text-slate-500 group-hover:text-blue-600"
                  }`}><link.icon size={20} /></span>
                  <span className={`
                    transition-all duration-300 font-medium
                    ${isMobileMenuOpen ? "block" : "hidden md:block"}
                  `}>
                    {link.label}
                  </span>
                </button>

                {/* Tooltip for collapsed state */}
                <div
                  className={`
                  absolute left-full top-1/2 transform -translate-y-1/2 ml-3
                  bg-slate-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg
                  opacity-0 pointer-events-none transition-opacity duration-200 z-50
                  group-hover:opacity-100
                  ${isMobileMenuOpen ? "hidden" : "block md:hidden"}
                `}
                >
                  {link.label}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-slate-900"></div>
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

export default ParentSidebar;
