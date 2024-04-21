import React from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

const Gallery = ({ storage }) => {
  const navigate = useNavigate();

  console.log(storage);

  return (
    <div>
      <button onClick={() => navigate("/")}>Go To Camera</button>

      <div className="gallery">
        {storage.map((photo, index) => {
          return <img key={index} src={photo} alt="gallery" width={"200px"} />;
        })}
      </div>
    </div>
  );
};

export default Gallery;
