import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import React from "react";

interface LightningProps {
  flashFrames: number[]; // Array of frame numbers when lightning should flash
}

export const Lightning: React.FC<LightningProps> = ({ flashFrames }) => {
  const frame = useCurrentFrame();

  // Check if we're within a flash window (flash lasts ~5 frames)
  const isFlashing = flashFrames.some((flashFrame) => {
    const diff = frame - flashFrame;
    return diff >= 0 && diff < 5;
  });

  // Double flash effect - some flashes have a second pulse
  const isDoubleFlash = flashFrames.some((flashFrame) => {
    const diff = frame - flashFrame;
    return diff >= 8 && diff < 12;
  });

  const shouldFlash = isFlashing || isDoubleFlash;

  if (!shouldFlash) return null;

  // Calculate flash intensity
  const currentFlash = flashFrames.find((f) => {
    const diff = frame - f;
    return (diff >= 0 && diff < 5) || (diff >= 8 && diff < 12);
  });

  const flashProgress = currentFlash
    ? (frame - currentFlash) % 12
    : 0;

  const intensity = interpolate(
    flashProgress < 5 ? flashProgress : flashProgress - 8,
    [0, 2, 5],
    [0, 0.2, 0],
    { extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: `rgba(255, 255, 255, ${intensity})`,
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  );
};
