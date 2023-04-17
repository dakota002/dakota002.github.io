import { useState } from "react";
import { useFetcher, useLoaderData } from "react-router-dom";
import AudioPlayer from "../components/AudioPlayer";
import { Container, Row, Col } from "react-bootstrap";

export default function Music() {
  const fetcher = useFetcher();
  const songNames = useLoaderData() as string[];
  const [nowPlaying, setNowPlaying] = useState<string>();
  const [currentContext, setCurrentCtx] = useState(new AudioContext());
  const [currentSource, setSource] = useState<AudioBufferSourceNode>(
    currentContext.createBufferSource()
  );

  if (!currentContext && !currentSource) {
    const ctx = new AudioContext();
    const source = ctx.createBufferSource();
    setCurrentCtx(ctx);
    setSource(source);
  }

  if (fetcher.data as AudioBuffer) {
    if (fetcher.data && currentSource.buffer !== fetcher.data) {
      let newSource = { ...currentSource };
      newSource.buffer = fetcher.data;
      setSource(newSource);
      currentSource.connect(currentContext.destination);
    }
  }

  function checkNowPlaying(targetValue: string) {
    console.log(targetValue);
    if (nowPlaying !== targetValue) {
      setNowPlaying(targetValue);
    }
  }

  return (
    <div className="">
      <Container>
        <Row className="">
          <Col md={{ span: 6, offset: 3 }} id="SongList">
            {songNames &&
              songNames.map((name) => (
                <Row
                  key={name}
                  className={
                    "songOption justify-content-center align-content-center " +
                    (nowPlaying === name ? "selected" : "")
                  }
                  onClick={() => checkNowPlaying(name)}
                >
                  {name === nowPlaying ? (
                    <AudioPlayer
                      audioUrl={`http://${process.env.REACT_APP_LIBRARY}/audio/${nowPlaying}`}
                    />
                  ) : (
                    <div className="songlist-text">{name}</div>
                  )}
                </Row>
              ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
