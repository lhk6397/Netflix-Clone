import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Favorite from "./Routes/Favorite";
import Home from "./Routes/Home";
import Movies from "./Routes/Movies";
import New from "./Routes/New";
import Search from "./Routes/Search";
import Subtitle from "./Routes/Subtitle";
import Tv from "./Routes/Tv";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="movie/:movieId" element={<Home />} />
        </Route>
        <Route path="/tv" element={<Tv />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/movies" element={<Movies />}></Route>
        <Route path="/new" element={<New />}></Route>
        <Route path="/favorite" element={<Favorite />}></Route>
        <Route path="/subtitle" element={<Subtitle />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
