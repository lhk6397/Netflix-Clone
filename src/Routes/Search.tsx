import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { getSearchMovie, getSearchTv, IGetMovies, IGetTvs } from "../api";
import SearchRow from "../Components/SearchRow";
import { makeImagePath } from "../utils";

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  width: 100vw;
`;

const Tabs = styled.div`
  margin: 0 auto;
  width: 60vw;
  height: 50px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 30px;
`;

const MovieTab = styled.div<{ isActive: boolean }>`
  border-radius: 15px;
  padding: 20px;
  width: 40%;
  text-align: center;
  margin-bottom: 100px;
  cursor: pointer;
  color: ${(props) =>
    props.isActive ? props.theme.red : props.theme.white.darker};
  border: 1px solid
    ${(props) => (props.isActive ? props.theme.red : props.theme.white.darker)};
  &:hover {
    color: ${(props) => (props.isActive ? null : props.theme.white.lighter)};
    border: 2px solid
      ${(props) => (props.isActive ? null : props.theme.white.lighter)};
    transform: scale(1.1);
    font-weight: 600;
  }
`;

const TvTab = styled(MovieTab)``;

const Main = styled.div`
  height: 100vh;
  margin-top: 300px;
  display: flex;
  flex-direction: column;
`;

const NoData = styled.h1`
  width: 100vw;
  padding: 50px;
  font-size: 30px;
  color: ${(props) => props.theme.white.darker};
  text-align: center;
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
let clickedItem = {} as any;

const Search = () => {
  const navigate = useNavigate();
  const { scrollY } = useViewportScroll();
  const [searchParams, _] = useSearchParams();
  const keyword = searchParams.get("keyword") as string;
  const [movieShow, setMovieShow] = useState(false);
  const [tvShow, setTvShow] = useState(false);
  const bigMatch = useMatch(`/search?keyword=${keyword}/:itemId`);
  const { data: movieData, isLoading: movieLoading } = useQuery<IGetMovies>(
    "movieSearch",
    () => getSearchMovie(keyword)
  );

  const { data: tvData, isLoading: tvLoading } = useQuery<IGetTvs>(
    "tvSearch",
    () => getSearchTv(keyword)
  );

  const onClick = () => {
    setMovieShow((prev) => !prev);
    setTvShow((prev) => !prev);
  };

  const isLoading = movieLoading || tvLoading;
  useEffect(() => {
    if (movieData?.results.length !== 0) {
      setMovieShow(true);
    } else {
      setMovieShow(false);
      if (tvData?.results.length !== 0) {
        setTvShow(true);
      }
    }
  }, [movieData, tvData]);

  useEffect(() => {
    if (movieShow) {
      clickedItem =
        bigMatch?.params.itemId &&
        movieData?.results.find(
          (movie) => String(movie.id) === bigMatch.params.itemId
        );
    } else if (tvShow) {
      clickedItem =
        bigMatch?.params.itemId &&
        tvData?.results.find((tv) => String(tv.id) === bigMatch.params.itemId);
    }
  }, [movieShow, tvShow]);
  const onOverlayClick = () => {
    navigate(`/search?keyword=${keyword}`);
  };

  return (
    <Container>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Main>
            <Tabs>
              <MovieTab onClick={onClick} isActive={movieShow}>
                Movie
              </MovieTab>
              <TvTab onClick={onClick} isActive={tvShow}>
                Tv Series
              </TvTab>
            </Tabs>
            {movieShow ? (
              <SearchRow
                category={movieShow ? "movie" : "tv"}
                keyword={keyword}
                data={movieData}
              ></SearchRow>
            ) : tvShow ? (
              <SearchRow
                category={movieShow ? "movie" : "tv"}
                keyword={keyword}
                data={tvData}
              ></SearchRow>
            ) : (
              <NoData>Sorry, no search results</NoData>
            )}
          </Main>
          <AnimatePresence>
            {bigMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></Overlay>
                <BigMovie
                  scrolly={scrollY.get()}
                  layoutId={
                    movieShow
                      ? "movie" + bigMatch.params.itemId
                      : "tv" + bigMatch.params.itemId
                  }
                >
                  {clickedItem && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedItem.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>
                        {movieShow
                          ? clickedItem.title
                          : clickedItem.original_name}
                      </BigTitle>
                      <BigOverview>{clickedItem.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Container>
  );
};

export default Search;
