import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

interface TextRevealProps {
  text: string;
  showAt?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  letterSpacing?: number;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  showAt = 0,
  fontSize = 72,
  color = "#e8ecef",
  fontWeight = 300,
  letterSpacing = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = frame - showAt;

  if (adjustedFrame < 0) return null;

  const opacity = interpolate(adjustedFrame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const y = spring({
    frame: adjustedFrame,
    fps,
    config: {
      damping: 15,
      stiffness: 80,
      mass: 0.8,
    },
  });

  const translateY = interpolate(y, [0, 1], [30, 0]);

  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        fontSize,
        fontWeight,
        color,
        letterSpacing,
        opacity,
        transform: `translateY(${translateY}px)`,
        textAlign: "center",
      }}
    >
      {text}
    </div>
  );
};
