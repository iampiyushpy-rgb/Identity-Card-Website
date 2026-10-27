import React from 'react';
import { Search } from 'lucide-react';

export const Table = ({
  columns = [],
  data = [],
  loading = false,
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search records...',
  actions,
  emptyMessage = 'No records found.',
}) => {
  return (
    <div className="table-container">
      {(onSearchChange || actions) && (
        <div className="table-toolbar">
          {onSearchChange ? (
            <div className="table-search">
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
              />
            </div>
          ) : (
            <div />
          )}
          {actions && <div>{actions}</div>}
        </div>
      )}

      <div className="table-scroll-wrapper" style={{ overflowX: 'auto' }}>
        <table className="custom-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={col.style || {}}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                  Loading data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr key={row.id || rowIdx}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} style={col.cellStyle || {}}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
