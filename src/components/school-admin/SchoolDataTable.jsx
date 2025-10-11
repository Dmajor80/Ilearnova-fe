import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

/**
 * Reusable data table component for school admin.
 * Supports sorting, pagination, and actions with accessibility features.
 */
const SchoolDataTable = React.memo(function SchoolDataTable({
  title,
  data = [],
  columns = [],
  loading = false,
  error = null,
  onRowClick,
  onAction,
  actions = [],
  itemsPerPage = 8,
  showPagination = true,
  sortable = true,
  className = ""
}) {
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortField || !sortable) return data;

    return [...data].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle different data types
      if (typeof aValue === "string" && aValue.startsWith("$")) {
        aValue = parseFloat(aValue.replace("$", ""));
        bValue = parseFloat(bValue.replace("$", ""));
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [data, sortField, sortDirection, sortable]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage, showPagination]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleSort = (field) => {
    if (!sortable) return;
    
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (!sortable || sortField !== field) return null;
    return sortDirection === "asc" ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const handleRowClick = (row, index) => {
    if (onRowClick) {
      onRowClick(row, index);
    }
  };

  const handleRowKeyDown = (e, row, index) => {
    if ((e.key === "Enter" || e.key === " ") && onRowClick) {
      e.preventDefault();
      onRowClick(row, index);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
        <div className="p-4">
          <div className="h-6 bg-gray-300 rounded w-48 mb-4 animate-pulse"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-4 bg-gray-300 rounded flex-1 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded flex-1 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded flex-1 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
        <div className="p-4 md:p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Data</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      {title && (
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-[#303972]">{title}</h3>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto" role="table">
          <thead className="bg-[#ebebf5]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-semibold text-[#4D44B5] uppercase tracking-wider
                    ${sortable && column.sortable !== false ? "cursor-pointer hover:bg-gray-50" : ""}
                    ${column.align === "center" ? "text-center" : ""}
                    ${column.align === "right" ? "text-right" : ""}
                    ${column.className || ""}
                  `}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                  role="columnheader"
                  aria-sort={
                    sortField === column.key 
                      ? sortDirection === "asc" ? "ascending" : "descending"
                      : "none"
                  }
                >
                  <div className={`flex items-center gap-1 ${
                    column.align === "center" ? "justify-center" : 
                    column.align === "right" ? "justify-end" : ""
                  }`}>
                    {column.label}
                    {sortable && column.sortable !== false && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-right text-xs sm:text-sm font-semibold text-[#4D44B5] uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, index) => (
              <tr
                key={row.id || index}
                className={`
                  transition-colors
                  ${onRowClick ? "cursor-pointer hover:bg-blue-50" : ""}
                `}
                onClick={() => handleRowClick(row, index)}
                onKeyDown={(e) => handleRowKeyDown(e, row, index)}
                tabIndex={onRowClick ? 0 : -1}
                role="row"
                aria-label={onRowClick ? `View details for ${row.name || `row ${index + 1}`}` : undefined}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`
                      px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm
                      ${column.align === "center" ? "text-center" : ""}
                      ${column.align === "right" ? "text-right" : ""}
                      ${index === 0 ? "font-medium text-gray-900" : "text-gray-500"}
                      ${column.className || ""}
                    `}
                    role="cell"
                  >
                    {column.render ? column.render(row[column.key], row, index) : row[column.key]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAction && onAction(row, index);
                        }}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label={`Actions for ${row.name || `row ${index + 1}`}`}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="px-3 py-3 sm:px-4 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, data.length)} of {data.length} results
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 sm:p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            
            <span className="text-xs sm:text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 sm:p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default SchoolDataTable;
