import React from "react";
import { Composition } from "remotion";
import { DownpourAd } from "./DownpourAd";

// Instagram Reels / TikTok dimensions: 1080x1920 (9:16)
const REELS_WIDTH = 1080;
const REELS_HEIGHT = 1920;
const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main 15-second ad */}
      <Composition
        id="DownpourAd"
        component={DownpourAd}
        durationInFrames={450} // 15 seconds at 30fps
        fps={FPS}
        width={REELS_WIDTH}
        height={REELS_HEIGHT}
      />

      {/* Short 6-second teaser version */}
      <Composition
        id="DownpourTeaser"
        component={DownpourAd}
        durationInFrames={180} // 6 seconds
        fps={FPS}
        width={REELS_WIDTH}
        height={REELS_HEIGHT}
      />

      {/* Story format (same dimensions, 10 seconds) */}
      <Composition
        id="DownpourStory"
        component={DownpourAd}
        durationInFrames={300} // 10 seconds
        fps={FPS}
        width={REELS_WIDTH}
        height={REELS_HEIGHT}
      />
    </>
  );
};
