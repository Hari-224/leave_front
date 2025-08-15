// import React from "react";

// const Table = ({ headers, data, renderRow }) => {
//   return (
//     <table border="1" cellPadding="5" cellSpacing="0">
//       <thead>
//         <tr>
//           {headers.map((header) => (
//             <th key={header}>{header}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>{data.map(renderRow)}</tbody>
//     </table>
//   );
// };

// export default Table;

import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Search, Filter, Download, Eye, EyeOff } from "lucide-react";

const EnhancedTable = ({ 
  headers = [], 
  data = [], 
  renderRow,
  searchable = true,
  sortable = true,
  filterable = true,
  exportable = true,
  columnVisibility = true,
  pagination = true,
  itemsPerPage = 10,
  className = "",
  striped = true,
  hoverable = true
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});
  const [visibleColumns, setVisibleColumns] = useState(
    Object.fromEntries(headers.map(header => [header, true]))
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search filter
      if (searchTerm) {
        const searchMatch = Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (!searchMatch) return false;
      }

      // Column filters
      for (const [column, filterValue] of Object.entries(filters)) {
        if (filterValue && String(item[column]).toLowerCase() !== filterValue.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [data, searchTerm, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage, pagination]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Get visible headers
  const visibleHeaders = headers.filter(header => visibleColumns[header]);

  // Handle sorting
  const handleSort = (key) => {
    if (!sortable) return;
    
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle column filter
  const handleFilter = (column, value) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
    setCurrentPage(1);
  };

  // Toggle column visibility
  const toggleColumnVisibility = (column) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvContent = [
      visibleHeaders.join(','),
      ...sortedData.map(row => 
        visibleHeaders.map(header => `"${row[header] || ''}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Default row renderer
  const defaultRenderRow = (item, index) => (
    <tr key={index} className={`transition-colors duration-200 ${hoverable ? 'hover:bg-gray-50' : ''}`}>
      {visibleHeaders.map(header => (
        <td key={header} className="px-4 py-3 text-sm text-gray-900">
          {item[header]}
        </td>
      ))}
    </tr>
  );

  const rowRenderer = renderRow || defaultRenderRow;

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Controls Bar */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
        {/* Search */}
        {searchable && (
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search table..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Column Visibility */}
          {columnVisibility && (
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Eye className="w-4 h-4" />
                Columns
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 hidden group-hover:block min-w-48">
                {headers.map(header => (
                  <label key={header} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleColumns[header]}
                      onChange={() => toggleColumnVisibility(header)}
                      className="mr-2"
                    />
                    {header}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Export */}
          {exportable && (
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {filterable && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap gap-4">
            {visibleHeaders.map(header => {
              const uniqueValues = [...new Set(data.map(item => item[header]))].filter(Boolean);
              
              return (
                <div key={header} className="min-w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by {header}
                  </label>
                  <select
                    value={filters[header] || ''}
                    onChange={(e) => handleFilter(header, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">All</option>
                    {uniqueValues.map(value => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              {visibleHeaders.map(header => (
                <th
                  key={header}
                  onClick={() => handleSort(header)}
                  className={`px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider ${
                    sortable ? 'cursor-pointer hover:bg-gray-700 transition-colors' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {header}
                    {sortable && sortConfig.key === header && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUp className="w-4 h-4" />
                        : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={striped ? 'divide-y divide-gray-200' : ''}>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => rowRenderer(item, index))
            ) : (
              <tr>
                <td colSpan={visibleHeaders.length} className="px-4 py-8 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded text-sm ${
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Demo component to show the enhanced table in action
const TableDemo = () => {
  const sampleHeaders = ['ID', 'Name', 'Email', 'Department', 'Status', 'Salary'];
  const sampleData = [
    { ID: 1, Name: 'John Doe', Email: 'john@example.com', Department: 'Engineering', Status: 'Active', Salary: 75000 },
    { ID: 2, Name: 'Jane Smith', Email: 'jane@example.com', Department: 'Marketing', Status: 'Active', Salary: 65000 },
    { ID: 3, Name: 'Bob Johnson', Email: 'bob@example.com', Department: 'Sales', Status: 'Inactive', Salary: 55000 },
    { ID: 4, Name: 'Alice Brown', Email: 'alice@example.com', Department: 'Engineering', Status: 'Active', Salary: 80000 },
    { ID: 5, Name: 'Charlie Wilson', Email: 'charlie@example.com', Department: 'HR', Status: 'Active', Salary: 60000 },
    { ID: 6, Name: 'Diana Davis', Email: 'diana@example.com', Department: 'Marketing', Status: 'Active', Salary: 70000 },
    { ID: 7, Name: 'Eva Martinez', Email: 'eva@example.com', Department: 'Sales', Status: 'Inactive', Salary: 58000 },
    { ID: 8, Name: 'Frank Garcia', Email: 'frank@example.com', Department: 'Engineering', Status: 'Active', Salary: 85000 },
    { ID: 9, Name: 'Grace Lee', Email: 'grace@example.com', Department: 'HR', Status: 'Active', Salary: 62000 },
    { ID: 10, Name: 'Henry Rodriguez', Email: 'henry@example.com', Department: 'Marketing', Status: 'Active', Salary: 68000 },
    { ID: 11, Name: 'Ivy Chen', Email: 'ivy@example.com', Department: 'Engineering', Status: 'Active', Salary: 90000 },
    { ID: 12, Name: 'Jack Thompson', Email: 'jack@example.com', Department: 'Sales', Status: 'Active', Salary: 52000 },
  ];

  // Custom row renderer example
  const customRenderRow = (item, index) => (
    <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.ID}</td>
      <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{item.Name}</td>
      <td className="px-4 py-3 text-sm text-blue-600">{item.Email}</td>
      <td className="px-4 py-3 text-sm text-gray-900">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {item.Department}
        </span>
      </td>
      <td className="px-4 py-3 text-sm">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.Status === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {item.Status}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-900 font-semibold">
        ${item.Salary.toLocaleString()}
      </td>
    </tr>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Enhanced Table Component</h1>
      <EnhancedTable
        headers={sampleHeaders}
        data={sampleData}
        renderRow={customRenderRow}
        searchable={true}
        sortable={true}
        filterable={true}
        exportable={true}
        columnVisibility={true}
        pagination={true}
        itemsPerPage={5}
        striped={true}
        hoverable={true}
      />
    </div>
  );
};

export default TableDemo;