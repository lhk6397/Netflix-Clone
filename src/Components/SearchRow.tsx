import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath } from "../utils";

interface ISearchRow {
  category: string;
  data: any;
  keyword: string;
}

const Row = styled.div`
  padding: 0 100px;
  display: grid;
  gap: 10px;
  row-gap: 50px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  margin-bottom: 50px;
`;

const Box = styled(motion.div)<{ bgImage: string }>`
  background-color: #fff;
  height: 150px;
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

const SearchRow = ({ category, keyword, data }: ISearchRow) => {
  const navigate = useNavigate();
  const onBoxClicked = (itemId: number) => {
    navigate(`/search?keyword=${keyword}/${itemId}`);
    navigate(0);
  };
  return (
    <Row>
      {data?.results.map((item: any) => (
        <Box
          layoutId={category + item.id}
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
    </Row>
  );
};

export default SearchRow;
