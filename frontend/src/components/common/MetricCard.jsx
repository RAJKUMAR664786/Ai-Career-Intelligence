import React from "react";

const MetricCard = ({ label, value, subtext, badgeText, badgeType = "success", icon: Icon }) => {
  return (
    <div className="metric-card shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="metric-label">{label}</span>
        {Icon && <Icon size={18} className="text-secondary" />}
      </div>
      <div className="metric-value my-1">
        {value}
        {subtext && <span className="metric-sub">{subtext}</span>}
      </div>
      {badgeText && (
        <div className="mt-2">
          <span className={`badge badge-soft-${badgeType} rounded-pill px-2.5 py-1`} style={{ fontSize: "0.75rem", fontWeight: 600 }}>
            {badgeText}
          </span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
