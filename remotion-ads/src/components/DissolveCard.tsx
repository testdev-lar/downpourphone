import { interpolate, useCurrentFrame } from "remotion";
import React from "react";

interface DissolveCardProps {
  text: string;
  emotion?: string;
  showAt?: number;
  dissolveAt?: number;
}

export const DissolveCard: React.FC<DissolveCardProps> = ({
  text,
  emotion,
  showAt = 0,
  dissolveAt = 60,
}) => {
  const frame = useCurrentFrame();

  const adjustedFrame = frame - showAt;
  const dissolveFrame = frame - dissolveAt;

  if (adjustedFrame < 0) return null;

  // Fade in
  const fadeIn = interpolate(adjustedFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Dissolve animation
  const dissolveProgress = interpolate(dissolveFrame, [0, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dissolveOpacity = interpolate(dissolveProgress, [0, 0.6, 1], [1, 0.5, 0]);
  const dissolveScale = interpolate(dissolveProgress, [0, 0.3, 1], [1, 1.02, 0.85]);
  const dissolveY = interpolate(dissolveProgress, [0, 0.3, 1], [0, -20, -80]);
  const dissolveBlur = interpolate(dissolveProgress, [0, 0.3, 1], [0, 1, 8]);

  const opacity = fadeIn * dissolveOpacity;

  if (opacity < 0.01) return null;

  return (
    <div
      style={{
        backgroundColor: "rgba(35, 39, 48, 0.4)",
        border: "2px solid #3d444d",
        borderRadius: 24,
        padding: 48,
        backdropFilter: "blur(12px)",
        maxWidth: 700,
        width: "85%",
        opacity,
        transform: `translateY(${dissolveY}px) scale(${dissolveScale})`,
        filter: `blur(${dissolveBlur}px)`,
      }}
    >
      <p
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 36,
          lineHeight: 1.5,
          color: "#e8ecef",
          margin: 0,
          textAlign: "center",
        }}
      >
        {text}
      </p>
      {emotion && (
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              padding: "8px 24px",
              borderRadius: 999,
              fontSize: 24,
              color: "#a8b5c9",
              backgroundColor: "rgba(168, 181, 201, 0.15)",
            }}
          >
            {emotion}
          </span>
        </div>
      )}
    </div>
  );
};
