import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";
import "./RoomPage.css"; // Import the new CSS file

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [isMyWebcamOn, setIsMyWebcamOn] = useState(true);
  const [isRemoteWebcamOn, setIsRemoteWebcamOn] = useState(true);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  const toggleMyWebcam = () => {
    if (myStream) {
      const videoTrack = myStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsMyWebcamOn(videoTrack.enabled);
      }
    }
  };

  const toggleRemoteWebcam = () => {
    setIsRemoteWebcamOn(!isRemoteWebcamOn);
  };

  return (
    <div className="roompage-container">
      <h1 className="roompage-heading">Room Page</h1>
      <h4 className="roompage-subheading">{remoteSocketId ? "Connected" : "No one in room"}</h4>
      {myStream && (
        <button className="roompage-button" onClick={sendStreams}>
          Send Stream
        </button>
      )}
      {remoteSocketId && (
        <button className="roompage-button" onClick={handleCallUser}>
          CALL
        </button>
      )}
      {myStream && (
        <div className="roompage-stream-container">
          <h1 className="roompage-stream-heading">My Stream</h1>
          <ReactPlayer playing muted height="200px" width="500px" url={myStream} />
          <button className="roompage-button" onClick={toggleMyWebcam}>
            {isMyWebcamOn ? "Turn Webcam Off" : "Turn Webcam On"}
          </button>
        </div>
      )}
      {remoteStream && (
        <div className="roompage-stream-container">
          <h1 className="roompage-stream-heading">Remote Stream</h1>
          <ReactPlayer
            playing
            muted
            height="200px"
            width="500px"
            url={remoteStream}
            style={{ display: isRemoteWebcamOn ? "block" : "none" }}
          />
          <button className="roompage-button" onClick={toggleRemoteWebcam}>
            {isRemoteWebcamOn ? "Turn Remote Webcam Off" : "Turn Remote Webcam On"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomPage;
