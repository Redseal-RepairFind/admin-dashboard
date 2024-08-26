import { useEffect, useState, useCallback } from "react";

// Define the type for the hook
const useSoundNotification = (url: string): (() => void) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const newAudio = new Audio(url);
    setAudio(newAudio);

    return () => {
      newAudio.pause();
      newAudio.src = "";
    };
  }, [url]);

  // Use useCallback to memoize the play function
  const play = useCallback(() => {
    if (audio) {
      audio
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    }
  }, [audio]);

  return play;
};

export default useSoundNotification;
