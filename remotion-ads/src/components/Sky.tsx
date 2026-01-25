import { interpolate, interpolateColors } from "remotion";
import React from "react";

interface SkyProps {
  clearingProgress: number; // 0 = stormy, 1 = clear sunny
}

export const Sky: React.FC<SkyProps> = ({ clearingProgress }) => {
  // Downpour color palette
  const stormyTop = "#1a1d23"; // bg-primary
  const stormyMid = "#232730"; // bg-secondary
  const stormyBottom = "#2d333b"; // border

  const clearTop = "#60a5fa"; // blue-400
  const clearMid = "#93c5fd"; // blue-300
  const clearBottom = "#fef3c7"; // amber-100

  const topColor = interpolateColors(
    clearingProgress,
    [0, 1],
    [stormyTop, clearTop]
  );
  const midColor = interpolateColors(
    clearingProgress,
    [0, 1],
    [stormyMid, clearMid]
  );
  const bottomColor = interpolateColors(
    clearingProgress,
    [0, 1],
    [stormyBottom, clearBottom]
  );

  // Sun glow appears as sky clears
  const sunOpacity = interpolate(clearingProgress, [0.5, 1], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(to bottom, ${topColor}, ${midColor} 50%, ${bottomColor})`,
      }}
    >
      {/* Sun glow */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "200%",
          height: "60%",
          background:
            "radial-gradient(ellipse at center, rgba(251, 191, 36, 0.4), rgba(251, 191, 36, 0.1) 40%, transparent 70%)",
          opacity: sunOpacity,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
