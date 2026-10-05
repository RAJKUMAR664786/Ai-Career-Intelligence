import React from "react";

export const ProgressBar = ({ label, percentage, color = "#2563eb", showLabel = true, height = 8 }) => {
  return (
    <div className="mb-3">
      {showLabel && (
        <div className="d-flex justify-content-between align-items-center mb-1.5" style={{ fontSize: "0.85rem" }}>
          <span className="fw-semibold text-dark">{label}</span>
          <span className="text-secondary fw-medium">{percentage}%</span>
        </div>
      )}
      <div 
        className="progress" 
        style={{ 
          height: `${height}px`, 
          backgroundColor: "#f1f5f9", 
          borderRadius: "8px", 
          overflow: "hidden" 
        }}
      >
        <div
          className="progress-bar"
          role="progressbar"
          style={{
            width: `${Math.min(Math.max(percentage, 0), 100)}%`,
            backgroundColor: color,
            borderRadius: "8px",
            transition: "width 0.6s ease"
          }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
};

export const CircularGauge = ({ 
  value = 82, 
  max = 100, 
  size = 110, 
  strokeWidth = 10, 
  color = "#2563eb", 
  label = "",
  sublabel = "",
  textColor = "#0f172a" 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const strokeDashoffset = circumference - (normalizedValue / max) * circumference;

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <div className="position-relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            stroke="#f1f5f9"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: "stroke-dashoffset 0.8s ease-in-out" }}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div 
          className="position-absolute top-50 start-50 translate-middle text-center"
          style={{ width: "100%", pointerEvents: "none" }}
        >
          <div style={{ fontSize: `${size * 0.22}px`, fontWeight: 800, color: textColor, lineHeight: 1 }}>
            {value}{max === 100 && !sublabel ? "%" : ""}
          </div>
          {sublabel && (
            <div style={{ fontSize: `${size * 0.12}px`, color: "#64748b", fontWeight: 500, marginTop: "2px" }}>
              {sublabel}
            </div>
          )}
        </div>
      </div>
      {label && <span className="mt-2 fw-semibold text-secondary" style={{ fontSize: "0.85rem" }}>{label}</span>}
    </div>
  );
};

export default ProgressBar;
