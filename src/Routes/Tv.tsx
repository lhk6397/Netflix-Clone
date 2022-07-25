import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import {
  getAirTodayTv,
  getOnTheAirTv,
  getPopularTv,
  getTopRatedTv,
  ITvs,
} from "../api";
import { makeImagePath } from "../utils";
import { useMatch, useNavigate, useParams } from "react-router-dom";
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

const Tv = () => {
  const { pp } = useParams();
  const navigate = useNavigate();
  const bigTvMatch = useMatch("/tv/:tvId");
  const { scrollY } = useViewportScroll();
  console.log(pp);
  const { data: airingTodayData, isLoading: airingTodayLoading } =
    useQuery<ITvs>(["tv", "airingToday"], getAirTodayTv);

  const { data: popularData, isLoading: popularLoading } = useQuery<ITvs>(
    ["tv", "popular"],
    getPopularTv
  );

  const { data: topRatedData, isLoading: topRatedLoading } = useQuery<ITvs>(
    ["tv", "topRated"],
    getTopRatedTv
  );
  const { data: onAirData, isLoading: onAirLoading } = useQuery<ITvs>(
    ["tv", "onAir"],
    getOnTheAirTv
  );

  const isLoading =
    airingTodayLoading || onAirLoading || topRatedLoading || popularLoading;

  const onOverlayClick = () => {
    navigate("/tv");
  };

  const clickedTv =
    bigTvMatch?.params.tvId &&
    (airingTodayData?.results.find(
      (tv) => String(tv.id) === bigTvMatch.params.tvId
    ) ||
      onAirData?.results.find(
        (tv) => String(tv.id) === bigTvMatch.params.tvId
      ) ||
      topRatedData?.results.find(
        (tv) => String(tv.id) === bigTvMatch.params.tvId
      ) ||
      popularData?.results.find(
        (tv) => String(tv.id) === bigTvMatch.params.tvId
      ));

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgImage={makeImagePath(
              airingTodayData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{airingTodayData?.results[0].original_name}</Title>
            <Overview>{airingTodayData?.results[0].overview}</Overview>
          </Banner>
          <Main>
            <Slider
              curPage="tv"
              data={airingTodayData}
              text="Airing Today"
            ></Slider>
            <Slider curPage="tv" data={onAirData} text="On Air"></Slider>
            <Slider curPage="tv" data={topRatedData} text="Top Rated"></Slider>
            <Slider curPage="tv" data={popularData} text="Popular"></Slider>
          </Main>
          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></Overlay>
                <BigMovie
                  scrolly={scrollY.get()}
                  layoutId={bigTvMatch.params.tvId}
                >
                  {clickedTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedTv.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTv.original_name}</BigTitle>
                      <BigOverview>{clickedTv.overview}</BigOverview>
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

export default Tv;
