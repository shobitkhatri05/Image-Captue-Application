import React from "react";
import { Routes, Route } from "react-router-dom";
import Camera from "./Camera";
import Gallery from "./Gallery";

const App = () => {
  const [storage, setPhotoStorage] = React.useState([]);

  const pushToGallery = (photo) => {
    setPhotoStorage((pre) => [...pre, photo]);
  };

  return (
    <Routes>
      <Route path="/" element={<Camera pushToGallery={pushToGallery} />} />
      <Route path="gallery" element={<Gallery storage={storage} />} />
    </Routes>
  );
};

export default App;
