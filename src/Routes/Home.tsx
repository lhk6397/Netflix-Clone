import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import {
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  IGetMovies,
} from "../api";
import { makeImagePath } from "../utils";
import { useMatch, useNavigate } from "react-router-dom";
import Slider from "../Components/Slider";

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgImage: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgImage});
  background-size: cover;
`;

const Main = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  position: relative;
  top: -100px;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)<{ scrolly: number }>`
  position: absolute;
  width: 40vw;
  height: 80vh;
  background-color: blue;
  top: ${(props) => props.scrolly + 100}px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const Home = () => {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movie/:movieId");
  const { scrollY } = useViewportScroll();

  const { data: nowPlayingData, isLoading: nowPlayingLoading } =
    useQuery<IGetMovies>(["movies", "nowPlaying"], getNowPlayingMovies);

  const { data: popularData, isLoading: popularLoading } = useQuery<IGetMovies>(
    ["movies", "latest"],
    getPopularMovies
  );

  const { data: topRatedData, isLoading: topRatedLoading } =
    useQuery<IGetMovies>(["movies", "topRated"], getTopRatedMovies);
  const { data: upComingData, isLoading: upComingLoading } =
    useQuery<IGetMovies>(["movies", "upComing"], getUpcomingMovies);

  const isLoading =
    nowPlayingLoading || upComingLoading || topRatedLoading || popularLoading;

  const onOverlayClick = () => {
    navigate("/");
  };

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    (nowPlayingData?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    ) ||
      topRatedData?.results.find(
        (movie) => String(movie.id) === bigMovieMatch.params.movieId
      ) ||
      popularData?.results.find(
        (movie) => String(movie.id) === bigMovieMatch.params.movieId
      ) ||
      upComingData?.results.find(
        (movie) => String(movie.id) === bigMovieMatch.params.movieId
      ));

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgImage={makeImagePath(
              nowPlayingData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlayingData?.results[0].title}</Title>
            <Overview>{nowPlayingData?.results[0].overview}</Overview>
          </Banner>
          <Main>
            <Slider
              curPage="movie"
              data={nowPlayingData}
              text="Now Playing"
            ></Slider>
            <Slider
              curPage="movie"
              data={topRatedData}
              text="Top Rated"
            ></Slider>
            <Slider curPage="movie" data={popularData} text="Popular"></Slider>
            <Slider
              curPage="movie"
              data={upComingData}
              text="Upcoming"
            ></Slider>
          </Main>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></Overlay>
                <BigMovie
                  scrolly={scrollY.get()}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};

export default Home;
