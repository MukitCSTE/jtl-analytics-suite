import { useState, useMemo } from 'react';
import { Text } from '@jtl-software/platform-ui-react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Download, ArrowUpDown, ArrowUp, ArrowDown, Calendar, X } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  dateField?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  title?: string;
  showSearch?: boolean;
  showDateFilter?: boolean;
  showExport?: boolean;
  pageSize?: number;
  dateField?: string;
  defaultStartDate?: string;
  defaultEndDate?: string;
}

function DataTable<T>({
  columns,
  data,
  emptyMessage = 'No data available',
  title,
  showSearch = true,
  showDateFilter = true,
  showExport = true,
  pageSize: defaultPageSize = 10,
  dateField = 'salesOrderDate',
  defaultStartDate = '2018-07-01',
  defaultEndDate = '2018-07-31',
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(row => {
        return columns.some(col => {
          const value = (row as Record<string, unknown>)[col.key as string];
          return value != null && String(value).toLowerCase().includes(term);
        });
      });
    }

    // Date filter
    if (startDate || endDate) {
      result = result.filter(row => {
        const dateValue = (row as Record<string, unknown>)[dateField] as string;
        if (!dateValue) return true;
        const rowDate = new Date(dateValue);
        if (startDate && rowDate < new Date(startDate)) return false;
        if (endDate && rowDate > new Date(endDate + 'T23:59:59')) return false;
        return true;
      });
    }

    // Sort
    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[sortColumn];
        const bVal = (b as Record<string, unknown>)[sortColumn];

        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        let comparison = 0;
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal;
        } else if (typeof aVal === 'string' && typeof bVal === 'string') {
          // Check if date
          if (/^\d{4}-\d{2}-\d{2}/.test(aVal)) {
            comparison = new Date(aVal).getTime() - new Date(bVal).getTime();
          } else {
            comparison = aVal.localeCompare(bVal);
          }
        } else {
          comparison = String(aVal).localeCompare(String(bVal));
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchTerm, sortColumn, sortDirection, startDate, endDate, columns, dateField]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  // Reset page when filters change
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('desc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    setCurrentPage(1);
  };

  const exportCSV = () => {
    const headers = columns.map(c => c.header).join(',');
    const rows = filteredData.map(row =>
      columns.map(col => {
        const value = (row as Record<string, unknown>)[col.key as string];
        const str = value == null ? '' : String(value);
        return `"${str.replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasFilters = searchTerm || startDate || endDate;

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {title && (
          <div style={{ marginRight: 'auto', fontWeight: 600, fontSize: '0.875rem' }}>
            {title}
          </div>
        )}

        {/* Search */}
        {showSearch && (
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                background: 'var(--base-background)',
                borderColor: 'var(--base-border)',
                color: 'var(--base-foreground)',
                width: '200px',
              }}
            />
          </div>
        )}

        {/* Date Filter */}
        {showDateFilter && (
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={e => { setStartDate(e.target.value); setCurrentPage(1); }}
              className="px-2 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                background: 'var(--base-background)',
                borderColor: 'var(--base-border)',
                color: 'var(--base-foreground)',
              }}
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={e => { setEndDate(e.target.value); setCurrentPage(1); }}
              className="px-2 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                background: 'var(--base-background)',
                borderColor: 'var(--base-border)',
                color: 'var(--base-foreground)',
              }}
            />
          </div>
        )}

        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-2 py-1.5 text-sm rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: 'var(--base-muted-foreground)' }}
          >
            <X size={14} />
            Clear
          </button>
        )}

        {/* Export */}
        {showExport && filteredData.length > 0 && (
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50 transition-colors"
            style={{ borderColor: 'var(--base-border)', color: 'var(--base-foreground)' }}
          >
            <Download size={14} />
            Export
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <Text type="xs" color="muted">
          Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredData.length)} of {filteredData.length} results
          {hasFilters && ` (filtered from ${data.length})`}
        </Text>
        <div className="flex items-center gap-2">
          <Text type="xs" color="muted">Per page:</Text>
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="px-2 py-1 text-sm rounded border"
            style={{
              background: 'var(--base-background)',
              borderColor: 'var(--base-border)',
              color: 'var(--base-foreground)',
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {paginatedData.length === 0 ? (
        <div className="p-8 text-center rounded-lg" style={{ background: 'var(--base-muted)' }}>
          <Text type="small" color="muted">
            {hasFilters ? 'No results match your filters' : emptyMessage}
          </Text>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--base-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--base-muted)' }}>
                {columns.map(col => (
                  <th
                    key={String(col.key)}
                    onClick={() => col.sortable !== false && handleSort(col.key as string)}
                    style={{
                      textAlign: col.align || 'left',
                      padding: '12px 14px',
                      borderBottom: '1px solid var(--base-border)',
                      fontWeight: 600,
                      color: 'var(--base-muted-foreground)',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      cursor: col.sortable !== false ? 'pointer' : 'default',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div className="flex items-center gap-1.5" style={{ justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start' }}>
                      {col.header}
                      {col.sortable !== false && (
                        <span className="opacity-50">
                          {sortColumn === col.key ? (
                            sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                          ) : (
                            <ArrowUpDown size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 transition-colors"
                  style={{ background: i % 2 === 0 ? 'transparent' : 'var(--base-muted)' }}
                >
                  {columns.map(col => {
                    const value = (row as Record<string, unknown>)[col.key as string];
                    return (
                      <td
                        key={String(col.key)}
                        style={{
                          textAlign: col.align || 'left',
                          padding: '12px 14px',
                          borderBottom: '1px solid var(--base-border)',
                          verticalAlign: 'middle',
                        }}
                      >
                        {col.render ? col.render(value, row) : formatValue(value)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1 mx-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-8 h-8 rounded text-sm font-medium transition-colors"
                  style={{
                    background: currentPage === pageNum ? '#3b82f6' : 'transparent',
                    color: currentPage === pageNum ? 'white' : 'var(--base-foreground)',
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function formatValue(value: unknown): string {
  if (value == null) return '-';
  if (typeof value === 'number') return value.toLocaleString('de-DE');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return new Date(value).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
  return String(value);
}

export default DataTable;
