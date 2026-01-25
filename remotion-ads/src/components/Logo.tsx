import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

interface LogoProps {
  showAt?: number; // Frame to start showing
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ showAt = 0, size = 120 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = frame - showAt;

  if (adjustedFrame < 0) return null;

  // Spring animation for entrance
  const scale = spring({
    frame: adjustedFrame,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
      mass: 0.5,
    },
  });

  const opacity = interpolate(adjustedFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* Cloud with raindrops icon - matching the app */}
      <svg
        viewBox="0 0 100 100"
        style={{ width: size, height: size }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="45"
          r="30"
          stroke="#a8b5c9"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M40 75 L45 85 L50 75 L55 85 L60 75"
          stroke="#a8b5c9"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35 65 L38 72 L42 65"
          stroke="#a8b5c9"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M58 68 L61 75 L65 68"
          stroke="#a8b5c9"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
