import React, { useState, useRef, useEffect } from "react";
import { Col, Row } from "react-bootstrap";

type Props = {
  audioUrl: string;
};

const AudioPlayer: React.FC<Props> = ({ audioUrl }) => {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const sourceNode = useRef<AudioBufferSourceNode | null>(null);
  const [pauseTime, setPauseTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAudioData() {
      setLoading(true);
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioContextInstance = new AudioContext();
      const decodedAudioData = await audioContextInstance.decodeAudioData(
        arrayBuffer
      );
      setAudioBuffer(decodedAudioData);
      audioContext.current = audioContextInstance;
      setLoading(false);
    }
    fetchAudioData();
  }, [audioUrl]);

  const handlePlay = () => {
    if (!audioBuffer || !audioContext.current) return;

    if (isPaused && pauseTime !== null) {
      sourceNode.current = audioContext.current.createBufferSource();
      sourceNode.current.buffer = audioBuffer;
      sourceNode.current.connect(audioContext.current.destination);
      sourceNode.current.start(0, pauseTime);
      setIsPlaying(true);
      setIsPaused(false);
      setPauseTime(null);
    } else {
      sourceNode.current = audioContext.current.createBufferSource();
      sourceNode.current.buffer = audioBuffer;
      sourceNode.current.connect(audioContext.current.destination);
      sourceNode.current.start();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (!sourceNode.current) return;

    sourceNode.current.stop();
    setIsPaused(true);
    setIsPlaying(false);
    console.log(audioContext.current!.currentTime);
    setPauseTime(audioContext.current!.currentTime);
  };

  const handleStop = () => {
    if (!sourceNode.current) return;

    sourceNode.current.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setPauseTime(null);
  };

  return (
    <>
      {loading ? (
        <div>
          <div className="loader"></div>
        </div>
      ) : (
        <Row>
          <PlaybackButton
            onClick={handlePlay}
            disabled={!audioBuffer || isPlaying}
            text="PLAY"
          />
          <PlaybackButton
            onClick={handlePause}
            disabled={!isPlaying || isPaused}
            text="PAUSE"
            middleButton
          />
          <PlaybackButton
            onClick={handleStop}
            disabled={!isPlaying}
            text="STOP"
          />
        </Row>
      )}
    </>
  );
};

export default AudioPlayer;

type PlaybackButtonProps = {
  onClick: () => void;
  disabled: boolean;
  text: string;
  middleButton?: boolean;
};

export function PlaybackButton({
  onClick,
  disabled,
  text,
  middleButton,
}: PlaybackButtonProps) {
  return (
    <Col
      onClick={onClick}
      className={"hover" + (middleButton ? " middlebutton" : "")}
    >
      <div className="pulse songlist-text">
        <button className="playback-buttons" disabled={disabled}>
          {text}
        </button>
      </div>
    </Col>
  );
}
