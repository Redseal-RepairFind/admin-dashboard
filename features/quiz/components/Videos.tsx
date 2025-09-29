"use client";

import { useQuiz } from "../useQuiz";
import { useRef } from "react";

function VideoPlayer({ videoSrc }: { videoSrc: string }) {
  const { videoRef } = useQuiz();

  return (
    <video
      controls
      width="100%"
      ref={videoRef}
      height="360"
      className="rounded-[20px]"
    >
      <source src={videoSrc} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

export default VideoPlayer;
