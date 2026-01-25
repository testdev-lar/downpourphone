import { interpolateColors } from "remotion";
import React from "react";

interface MountainsProps {
  clearingProgress: number;
}

export const Mountains: React.FC<MountainsProps> = ({ clearingProgress }) => {
  const farMountainColor = interpolateColors(
    clearingProgress,
    [0, 1],
    ["rgba(30, 41, 59, 0.3)", "rgba(100, 116, 139, 0.5)"]
  );

  const nearMountainColor = interpolateColors(
    clearingProgress,
    [0, 1],
    ["rgba(30, 41, 59, 0.5)", "rgba(71, 85, 105, 0.7)"]
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "25%",
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%" }}
      >
        {/* Far mountains */}
        <path
          d="M0 100 L0 60 L50 30 L100 50 L150 20 L200 45 L250 25 L300 55 L350 35 L400 50 L400 100 Z"
          fill={farMountainColor}
        />
        {/* Near mountains */}
        <path
          d="M0 100 L0 70 L80 45 L140 65 L200 40 L280 60 L340 50 L400 70 L400 100 Z"
          fill={nearMountainColor}
        />
      </svg>
    </div>
  );
};
