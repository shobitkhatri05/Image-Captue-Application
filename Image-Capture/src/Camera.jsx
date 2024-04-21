import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Camera({ pushToGallery }) {
  const videoRef = useRef(null);
  const zoomRef = useRef(null);
  const navigate = useNavigate();

  const [cameraSettigns, setCameraSettigns] = useState({
    zoomDisabled: false,
    facingMode: "user",
    height: 500,
    width: 500,
  });

  const takePhoto = () => {
    const photoString = getBase64Image();
    pushToGallery(photoString);
  };

  const getBase64Image = (img) => {
    const canvas = document.createElement("canvas");
    const { width, height } = cameraSettigns;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    let video = videoRef.current;
    ctx.drawImage(video, 0, 0, width, height);

    const base64String = canvas.toDataURL("image/jpeg");
    return base64String;
  };

  const swapCamera = () => {
    setCameraSettigns({
      ...cameraSettigns,
      facingMode: cameraSettigns.facingMode === "user" ? "environment" : "user",
    });
  };

  useEffect(() => {
    async function initializeCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: cameraSettigns.facingMode,
            width: cameraSettigns.width,
            height: cameraSettigns.height,
          },
        });

        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        const settings = track.getSettings();

        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        // Check whether zoom is supported or not.
        if (!("zoom" in capabilities)) {
          return setCameraSettigns({
            ...cameraSettigns,
            zoomDisabled: true,
          });
        }

        // Map zoom to a slider element.
        const input = zoomRef.current;
        input.min = capabilities.zoom.min;
        input.max = capabilities.zoom.max;
        input.step = capabilities.zoom.step;
        input.value = settings.zoom;
        input.oninput = function (event) {
          track.applyConstraints({ advanced: [{ zoom: event.target.value }] });
        };
      } catch (error) {
        console.log(error);
      }
    }

    initializeCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraSettigns.facingMode, cameraSettigns.height]);

  const handleAspectRatioChange = (event) => {
    let height = 500;

    switch (event.target.value) {
      case "16/9":
        height = cameraSettigns.width / (16 / 9);
        break;

      case "4/3":
        height = cameraSettigns.width / (4 / 3);
        break;

      default:
        break;
    }

    setCameraSettigns((prev) => ({
      ...prev,
      height,
    }));
  };

  return (
    <div className="app">
      <div className="camera">
        <video
          ref={videoRef}
          width={cameraSettigns.width}
          height={cameraSettigns.height}
        ></video>
      </div>

      <div className="controls">
        <select defaultValue={"1/1"} onChange={handleAspectRatioChange}>
          <option value="1/1">1:1</option>
          <option value="4/3">4:3</option>
          <option value="16/9">16:9</option>
        </select>
        <button onClick={swapCamera}>Switch Camera</button>
        <button onClick={takePhoto}>SNAP</button>
        <button onClick={() => navigate("/gallery")}>Gallery</button>
        <input
          type="range"
          ref={zoomRef}
          disabled={cameraSettigns.zoomDisabled}
        />
      </div>
    </div>
  );
}

export default Camera;
