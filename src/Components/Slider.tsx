import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath } from "../utils";

interface SliderProps {
  curPage: string;
  data: any;
  text: string;
}

const Container = styled.div`
  height: 300px;
`;

const Title = styled.h1`
  font-size: 25px;
  font-weight: 600;
  color: ${(props) => props.theme.white.darker};
  padding: 20px 20px;
`;

const Row = styled(motion.div)`
  padding: 0 20px;
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgImage: string }>`
  background-color: #fff;
  height: 200px;
  background-image: url(${(props) => props.bgImage});
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 20px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const NxtButton = styled.div`
  width: 50px;
  height: 70%;
  background-color: rgba(0, 0, 0, 0.8);
  color: ${(props) => props.theme.white.lighter};
  position: absolute;
  top: 50px;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
  z-index: 999;
`;

const rowVariants = {
  hidden: {
    x: window.innerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth - 5,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

const Slider = ({ curPage, data, text }: SliderProps) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const loopIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalItems = data.results.length - 1;
      const maxIndex = Math.floor(totalItems / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (itemId: number) => {
    navigate(`/${curPage}/${itemId}`);
  };
  return (
    <Container>
      <Title>{text}</Title>
      <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
        <Row
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
          key={index}
        >
          {data?.results
            .slice(1)
            .slice(offset * index, offset * index + offset)
            .map((item: any) => (
              <Box
                // layoutId={item.id + ""}
                key={item.id}
                whileHover="hover"
                initial="normal"
                variants={boxVariants}
                transition={{ type: "tween" }}
                onClick={() => onBoxClicked(item.id)}
                bgImage={makeImagePath(item.backdrop_path, "w500")}
              >
                <Info variants={infoVariants}>
                  <h4>{item.title ?? item.original_name}</h4>
                </Info>
              </Box>
            ))}
          <NxtButton onClick={loopIndex}>Next</NxtButton>
        </Row>
      </AnimatePresence>
    </Container>
  );
};

export default Slider;
