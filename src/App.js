/* eslint-disable */
import "./App.css";

import React, { useState, useEffect, useRef } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";

import { styled } from "@mui/material/styles";

import Guitar from "./assets/images/guitar.jpg";
import AddIcon from "@mui/icons-material/Add";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import LoopIcon from "@mui/icons-material/Loop";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import DragHandleIcon from "@mui/icons-material/DragHandle";

import { Button, Container, TextField, Typography } from "@mui/material";

import Axios from "axios";
import { PauseCircle } from "@mui/icons-material";

const MainImage = styled("img")(`
  max-width: "80%"
`);

function App() {
  const [value] = React.useState(30);
  const [text, setText] = React.useState("");

  const [data, setData] = React.useState([]);

  const [playlist, setPlayList] = React.useState([]);

  const [trackIndex, setTrackIndex] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Refs
  // const { title, artist, color, image, audioSrc } = playlist[trackIndex];
  const audioRef = useRef(new Audio(""));
  const intervalRef = useRef();
  const isReady = useRef(false);

  // Destructure for conciseness
  const { duration } = audioRef.current;

  useEffect(() => {
    if (isPlaying) {
      console.log(audioRef.current.src);
      if (audioRef.current.src) {
        audioRef.current.play();
      } else {
        let audioSrc = playlist[trackIndex]?.preview;
        console.log(audioSrc);
        audioRef.current = new Audio(audioSrc);
        setTrackProgress(audioRef.current.currentTime);
        isReady.current = true;
        audioRef.current.play();
        startTimer();
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  // Handle setup when changing tracks
  useEffect(() => {
    audioRef.current.pause();
    let audioSrc = playlist[trackIndex]?.preview;
    console.log(audioSrc);
    audioRef.current = new Audio(audioSrc);
    setTrackProgress(audioRef.current.currentTime);

    if (isReady.current) {
      //audioRef.current.media.muted = true;
      if (playlist.length > 0) {
        audioRef.current.play();
        setIsPlaying(true);
      }

      startTimer();
      console.log("playing");
    } else {
      // Set the isReady ref as true for the next pass
      isReady.current = true;
      audioRef.current.play();
      startTimer();
    }
  }, [trackIndex]);

  const playCurrent = (id) => {
    const index = playlist.findIndex((el) => el.id == id);
    console.log(index);
    setTrackIndex(index);
  };

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        toNextTrack();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, [1000]);
  };

  const toNextTrack = () => {
    if (playlist.length - 1 >= trackIndex + 1) {
      setTrackIndex(trackIndex + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handleSearch = () => {
    const options = {
      method: "GET",
      url: "https://deezerdevs-deezer.p.rapidapi.com/search",
      params: { q: text },
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_KEY_DEZEER,
        "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
      },
    };

    Axios.request(options)
      .then(function (response) {
        /* eslint-disable */
        console.log(response.data);
        /* eslint-disable */

        setData(response.data.data);
      })
      .catch(function (error) {
        /* eslint-disable */
        console.error(error);
        /* eslint-disable */
      });
  };

  const getTopChart = async () => {
    const options = {
      method: "GET",
      url: "https://deezerdevs-deezer.p.rapidapi.com/chart",
      headers: {
        "X-RapidAPI-Key": "2e8ca36d00mshb16d6cb4759edb3p1b5730jsnf1536a764290",
        "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
      },
    };

    // Axios.request(options)
    //   .then(function (response) {
    //     /* eslint-disable */
    //     console.log(response.data);
    //     /* eslint-disable */

    //     setData(response.data.data);
    //   })
    //   .catch(function (error) {
    //     /* eslint-disable */
    //     console.error(error);
    //     /* eslint-disable */
    //   });
  };

  const addToPlayList = (item) => {
    console.log(item);
    let isExist = playlist.find((r) => r.id == item.id);

    if (!isExist) {
      setPlayList([...playlist, item]);
    }
  };

  React.useEffect(() => {
    getTopChart();
  }, []);

  React.useEffect(() => {
    console.log(trackProgress);
  }, [trackProgress, setTrackProgress]);

  return (
    <Container
      maxWidth={"lg"}
      style={{ backgroundColor: "white", padding: "0" }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Grid container>
          <Grid
            item
            xs={3}
            sx={{
              display: { xs: "none", md: "block" },
            }}
            style={{
              padding: "0",
              maxHeight: "100vh",
              overflowY: "scroll",
            }}
          >
            <Box style={{ backgroundColor: "white" }}>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "0px",
                  padding: "16px",
                  marginTop: "0",
                  position: "sticky",
                  top: "0",
                  backgroundColor: "white",
                  fontSize: "32px",
                  fontWeight: "700",
                }}
              >
                Discover New music
              </h3>

              <Typography
                variant="p"
                component="p"
                style={{
                  fontSize: "14px",
                  color: "#828282",
                  textAlign: "left",
                  marginBottom: "16px",
                  padding: "0 16px",
                }}
              >
                Top-Chart
              </Typography>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                style={{ padding: "0 16px", marginBottom: "16px" }}
              >
                <TextField
                  id="outlined-basic"
                  label="Artist"
                  variant="standard"
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                />

                <Button onClick={handleSearch} variant="contained">
                  Search
                </Button>
              </Stack>

              <Grid container spacing={2} style={{ padding: "0 16px" }}>
                {data.map((item, index) => {
                  return (
                    <Grid
                      onClick={() => addToPlayList(item)}
                      key={"popular-" + index}
                      item
                      xs={6}
                    >
                      <MainImage
                        src={item.album.cover_medium}
                        style={{
                          width: "120px",
                          height: "120px",
                          borderRadius: "4px",
                          boxShadow: "0px 4px 8px 1px rgba(0, 0, 0, 0.08)",
                          margin: "0",
                        }}
                        alt="welcome"
                      />
                      <Typography
                        variant="p"
                        component="p"
                        style={{
                          fontSize: "14px",
                          color: "#333333",
                          textAlign: "left",
                          marginBottom: "2px",
                          fontWeight: "500",
                        }}
                      >
                        {item.title_short}
                      </Typography>

                      <Typography
                        variant="p"
                        component="p"
                        style={{
                          fontSize: "12px",
                          color: "#828282",
                          textAlign: "left",
                          fontWeight: "400",
                        }}
                      >
                        {item.artist.name}, {item?.tracks?.rank}
                      </Typography>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Grid>
          <Grid
            style={{ backgroundColor: "#FAFAFA", height: "100vh" }}
            item
            xs={12}
            md={6}
          >
            <Stack spacing={2}>
              <h3
                style={{
                  textAlign: "center",
                  marginBottom: "16px",
                  marginTop: "0px",
                }}
              >
                Now Playing
              </h3>
              <MainImage
                src={
                  playlist.length > 0
                    ? playlist[trackIndex].album.cover_big
                    : Guitar
                }
                style={{
                  width: "300px",
                  height: "300px",
                  borderRadius: "6px",
                  boxShadow: " 0px 4px 8px 1px rgba(0, 0, 0, 0.08)",
                  margin: "0 auto 15px",
                  display: "flex",
                }}
                alt="welcome"
              />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                style={{ width: "300px", margin: "0 auto 10px" }}
              >
                <AddIcon />
                <Box>
                  <h4 style={{ marginTop: "0", marginBottom: "5px" }}>
                    {playlist.length > 0 ? playlist[trackIndex].title : "-"}
                  </h4>
                  <h5 style={{ margin: "0" }}>
                    {playlist.length > 0
                      ? playlist[trackIndex].artist.name
                      : "-"}
                  </h5>
                </Box>
                <FavoriteBorderIcon />
              </Stack>

              <Stack
                spacing={2}
                direction="column"
                sx={{ mb: 1 }}
                alignItems="center"
                style={{ width: "396px", margin: "0 auto 36px" }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                  style={{ width: "396px", margin: "0" }}
                >
                  <Typography
                    variant="h4"
                    component="h4"
                    style={{ fontSize: "14px", color: "#828282" }}
                  >
                    {Math.ceil(trackProgress)}
                  </Typography>
                  <Typography
                    variant="h4"
                    component="h4"
                    style={{ fontSize: "14px", color: "#828282" }}
                  >
                    -
                    {audioRef.current?.duration
                      ? Math.ceil(audioRef.current?.duration - trackProgress)
                      : "00:00"}
                  </Typography>
                </Stack>
                <Slider
                  aria-label="Volume"
                  value={(trackProgress * 100) / audioRef.current?.duration}
                  style={{ marginTop: "0px" }}
                />
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                style={{ width: "316px", margin: "0 auto 16px" }}
              >
                <ShuffleIcon />
                <FastRewindIcon />
                {isPlaying ? (
                  <PauseCircle
                    onClick={() => setIsPlaying(!isPlaying)}
                    style={{ width: "64px", height: "64px" }}
                  />
                ) : (
                  <PlayCircleIcon
                    onClick={() => setIsPlaying(!isPlaying)}
                    style={{ width: "64px", height: "64px" }}
                  />
                )}

                <FastForwardIcon />
                <LoopIcon />
              </Stack>

              <Stack
                spacing={2}
                direction="row"
                sx={{ mb: 1 }}
                alignItems="center"
                style={{ width: "316px", margin: "0 auto 10px" }}
              >
                <VolumeDown />
                <Slider aria-label="Volume" value={0} />
                <VolumeUp />
              </Stack>
            </Stack>
          </Grid>
          <Grid
            item
            xs={3}
            sx={{
              display: { xs: "none", md: "block" },
            }}
            style={{ padding: "21px 14px" }}
          >
            <h3
              style={{
                textAlign: "center",
                marginBottom: "21px",
                marginTop: "0",
              }}
            >
              Now Playing
            </h3>
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
              style={{ width: "100%", margin: "0 0 12px" }}
            >
              <ShuffleIcon />
              <LoopIcon />
            </Stack>

            <Stack
              direction="Column"
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={2}
              style={{ width: "100%", margin: "0" }}
            >
              <Typography
                variant="p"
                component="p"
                style={{
                  fontSize: "14px",
                  color: "#828282",
                  textAlign: "left",
                  marginBottom: "16px",
                }}
              >
                Playing next
              </Typography>

              {playlist.map((item, index) => {
                return (
                  <Stack
                    key={"playlist-" + item.id}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={2}
                    style={{ width: "100%", margin: "0 auto 6px" }}
                    onClick={() => playCurrent(item.id)}
                  >
                    <DragHandleIcon style={{ color: "#BDBDBD" }} />
                    <MainImage
                      src={item.album.cover_small}
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "4px",
                        boxShadow: "0px 4px 8px 1px rgba(0, 0, 0, 0.08)",
                        margin: "0 6px",
                      }}
                      alt="welcome"
                    />
                    <div style={{ margin: "0" }}>
                      <Typography
                        variant="p"
                        component="p"
                        style={{
                          fontSize: "14px",
                          color: "#333333",
                          textAlign: "left",
                          fontWeight: "500",
                        }}
                      >
                        {item.title_short}
                      </Typography>
                      <Typography
                        variant="p"
                        component="p"
                        style={{
                          fontSize: "12px",
                          color: "#828282",
                          textAlign: "left",
                        }}
                      >
                        {item.artist.name}
                      </Typography>
                    </div>

                    <div style={{ marginLeft: "auto" }}>
                      <Typography
                        variant="p"
                        component="p"
                        style={{
                          fontSize: "14px",
                          color: "#333333",
                          textAlign: "left",
                          fontWeight: "500",
                        }}
                      >
                        3:14
                      </Typography>
                      <Typography
                        variant="p"
                        component="p"
                        style={{
                          fontSize: "12px",
                          color: "#828282",
                          textAlign: "left",
                        }}
                      >
                        {item?.tracks?.rank}
                      </Typography>
                    </div>
                  </Stack>
                );
              })}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App;
