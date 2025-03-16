"use client";

import React, { useState, useEffect } from "react";
import { ReactMediaRecorder } from "react-media-recorder";

const AudioInput = ({ setMedia }: { setMedia: any }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (timer) clearInterval(timer);
      setRecordingTime(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleStop = (blobUrl: string, blob: Blob) => {
    const audioFile = new File([blob], "audio-message.wav", {
      type: blob.type,
    });
    console.log(audioFile);
    setMedia(audioFile);
  };

  //   console.log(audioUrl, "audio");

  return (
    <div className="w-full flex items-center justify-between gap-3">
      <ReactMediaRecorder
        audio
        onStop={handleStop}
        render={({ status, startRecording, stopRecording }) => (
          <div className="flex items-center justify-start gap-4">
            {/* <p className="mb-2 text-gray-700">{status}</p> */}
            <p className=" text-gray-700">{formatTime(recordingTime)}</p>
            <button
              className={`py-2 px-4 rounded ${
                isRecording
                  ? "bg-red-500 text-white"
                  : "bg-green-500 text-white"
              }`}
              onClick={() => {
                if (isRecording) {
                  stopRecording();
                } else {
                  startRecording();
                }
                setIsRecording(!isRecording);
              }}
            >
              {isRecording ? "Stop" : "Start"}
            </button>
          </div>
        )}
      />
      {audioUrl && (
        <div className="border border-blue-500 w-[100px]">
          <audio controls src={audioUrl} className="w-full">
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioInput;
