import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Search, Download, Eye } from "lucide-react";
import "./EnhancedTable.css";

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
  striped = true,
  hoverable = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filters, setFilters] = useState({});
  const [visibleColumns, setVisibleColumns] = useState(
    Object.fromEntries(headers.map((h) => [h, true]))
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (searchTerm && !Object.values(item).some((v) =>
        String(v).toLowerCase().includes(searchTerm.toLowerCase())
      )) return false;

      for (const [col, val] of Object.entries(filters)) {
        if (val && String(item[col]).toLowerCase() !== val.toLowerCase()) return false;
      }
      return true;
    });
  }, [data, searchTerm, filters]);

  // Sorted data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage, pagination]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const visibleHeaders = headers.filter((h) => visibleColumns[h]);

  // Handlers
  const handleSort = (key) => {
    if (!sortable) return;
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleFilter = (column, value) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
    setCurrentPage(1);
  };

  const toggleColumn = (col) => setVisibleColumns((prev) => ({ ...prev, [col]: !prev[col] }));

  const exportCSV = () => {
    const csv = [
      visibleHeaders.join(","),
      ...sortedData.map((row) => visibleHeaders.map((h) => `"${row[h] || ""}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "table-data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const defaultRenderRow = (item, idx) => (
    <tr key={idx} className={`${hoverable ? "hover-row" : ""} ${striped && idx % 2 === 0 ? "striped-row" : ""}`}>
      {visibleHeaders.map((h) => <td key={h}>{item[h]}</td>)}
    </tr>
  );

  const rowRenderer = renderRow || defaultRenderRow;

  return (
    <div className="enhanced-table-container">
      {/* Controls */}
      <div className="controls-bar">
        {searchable && (
          <div className="search-box">
            <Search className="icon" />
            <input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        )}
        <div className="action-buttons">
          {columnVisibility && (
            <div className="dropdown">
              <button><Eye className="icon" /> Columns</button>
              <div className="dropdown-content">
                {headers.map((h) => (
                  <label key={h}>
                    <input type="checkbox" checked={visibleColumns[h]} onChange={() => toggleColumn(h)} /> {h}
                  </label>
                ))}
              </div>
            </div>
          )}
          {exportable && <button onClick={exportCSV}><Download className="icon" /> Export</button>}
        </div>
      </div>

      {/* Filters */}
      {filterable && (
        <div className="filters-bar">
          {visibleHeaders.map((h) => {
            const unique = [...new Set(data.map((item) => item[h]))].filter(Boolean);
            return (
              <div key={h}>
                <label>Filter {h}</label>
                <select value={filters[h] || ""} onChange={(e) => handleFilter(h, e.target.value)}>
                  <option value="">All</option>
                  {unique.map((val) => <option key={val} value={val}>{val}</option>)}
                </select>
              </div>
            );
          })}
        </div>
      )}

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {visibleHeaders.map((h) => (
                <th key={h} onClick={() => handleSort(h)}>
                  {h}
                  {sortable && sortConfig.key === h && (sortConfig.direction === "asc" ? <ChevronUp /> : <ChevronDown />)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? paginatedData.map(rowRenderer) : (
              <tr>
                <td colSpan={visibleHeaders.length} className="no-data">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="pagination-bar">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} className={currentPage === p ? "active" : ""} onClick={() => setCurrentPage(p)}>{p}</button>
          ))}
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
};

export default EnhancedTable;
