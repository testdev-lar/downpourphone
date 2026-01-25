import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Sequence,
} from "remotion";
import React from "react";
import { Sky } from "./components/Sky";
import { Rain } from "./components/Rain";
import { Lightning } from "./components/Lightning";
import { Mountains } from "./components/Mountains";
import { TextReveal } from "./components/TextReveal";
import { DissolveCard } from "./components/DissolveCard";

export const DownpourAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Timeline (15 seconds at 30fps = 450 frames)
  // 0-90: Stormy intro with rain + logo
  // 90-150: Tagline appears
  // 150-240: Example journal entry appears and dissolves
  // 240-360: Sky clears transition
  // 360-450: Final message + CTA

  // Calculate clearing progress for sky transition
  const clearingProgress = interpolate(frame, [240, 400], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Lightning flashes (only during stormy phase)
  const lightningFrames = [45, 120, 180];

  return (
    <AbsoluteFill
      style={{
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Background layers */}
      <Sky clearingProgress={clearingProgress} />
      <Mountains clearingProgress={clearingProgress} />
      <Rain clearingProgress={clearingProgress} />
      <Lightning flashFrames={lightningFrames} />

      {/* Content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
        }}
      >
        {/* Phase 1: Logo intro (0-90) */}
        <Sequence from={0} durationInFrames={360}>
          <div
            style={{
              position: "absolute",
              top: "12%",
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <TextReveal
              text="Downpour"
              showAt={15}
              fontSize={56}
              fontWeight={400}
              color="#e8ecef"
            />
          </div>
        </Sequence>

        {/* Phase 2: Tagline (90-240) */}
        <Sequence from={75} durationInFrames={165}>
          <div
            style={{
              position: "absolute",
              top: "22%",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TextReveal
              text="Let it fall away"
              showAt={15}
              fontSize={24}
              fontWeight={400}
              color="#8b9299"
              letterSpacing={2}
            />
          </div>
        </Sequence>

        {/* Phase 3: Example entry dissolving (150-300) */}
        <Sequence from={135} durationInFrames={165}>
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              padding: "0 24px",
            }}
          >
            <DissolveCard
              text="I can't stop thinking about everything I should have done differently..."
              emotion="Overwhelmed"
              showAt={15}
              dissolveAt={90}
            />
          </div>
        </Sequence>

        {/* Phase 4: Clearing message (360-450) */}
        <Sequence from={330}>
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 32,
            }}
          >
            <TextReveal
              text="Let it go"
              showAt={30}
              fontSize={72}
              fontWeight={300}
              color="rgba(254, 243, 199, 0.95)"
            />
            <TextReveal
              text="And continue with your day"
              showAt={60}
              fontSize={36}
              fontWeight={300}
              color="rgba(254, 243, 199, 0.7)"
              letterSpacing={1}
            />
          </div>
        </Sequence>

        {/* CTA (400-450) */}
        <Sequence from={390}>
          <div
            style={{
              position: "absolute",
              bottom: "12%",
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <TextReveal
              text="Available on the App Store"
              showAt={10}
              fontSize={32}
              fontWeight={400}
              color="rgba(254, 243, 199, 0.85)"
              letterSpacing={1}
            />
          </div>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
