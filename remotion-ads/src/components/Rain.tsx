import { useCurrentFrame, useVideoConfig, interpolate, random } from "remotion";
import React from "react";

interface RaindropProps {
  id: number;
  clearingProgress: number;
}

const Raindrop: React.FC<RaindropProps> = ({ id, clearingProgress }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  // Random properties based on id (deterministic)
  const x = random(`x-${id}`) * 100;
  const speed = 0.8 + random(`speed-${id}`) * 0.6;
  const dropHeight = 15 + random(`height-${id}`) * 25;
  const delay = random(`delay-${id}`) * 60;
  const opacity = 0.2 + random(`opacity-${id}`) * 0.4;

  // Calculate vertical position (looping)
  const cycleLength = fps * speed;
  const adjustedFrame = (frame - delay + cycleLength * 10) % cycleLength;
  const progress = adjustedFrame / cycleLength;
  const y = progress * (height + dropHeight * 2) - dropHeight;

  // Fade out as sky clears
  const fadeOpacity = interpolate(clearingProgress, [0.3, 0.8], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Only show every 3rd drop when clearing
  const showDrop = clearingProgress < 0.5 || id % 3 === 0;

  if (!showDrop) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: y,
        width: 2,
        height: dropHeight,
        background: `rgba(255, 255, 255, ${opacity * fadeOpacity})`,
        borderRadius: 1,
      }}
    />
  );
};

interface RainProps {
  clearingProgress?: number;
  dropCount?: number;
}

export const Rain: React.FC<RainProps> = ({
  clearingProgress = 0,
  dropCount = 80,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: dropCount }).map((_, i) => (
        <Raindrop key={i} id={i} clearingProgress={clearingProgress} />
      ))}
    </div>
  );
};
