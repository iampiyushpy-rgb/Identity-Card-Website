import React from 'react';

export const StatsCard = ({ title, value, icon: Icon, color = '#4f46e5', trend }) => {
  return (
    <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Top micro badge clip accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '32px',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '0 0 4px 4px',
        }}
      />

      <div className="stat-info">
        <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
          {title}
        </div>
        <div className="stat-value">{value}</div>
        {trend && (
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '0.4rem', fontWeight: '600' }}>
            {trend}
          </div>
        )}
      </div>

      <div
        className="stat-icon"
        style={{
          background: `radial-gradient(circle, ${color}33 0%, ${color}11 100%)`,
          border: `1px solid ${color}44`,
          color: color,
          boxShadow: `0 4px 12px ${color}22`,
        }}
      >
        <Icon size={24} />
      </div>
    </div>
  );
};
export default StatsCard;
