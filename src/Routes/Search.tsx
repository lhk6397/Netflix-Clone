import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";

// ${BASE_PATH}/search/multi?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false

const Search = () => {
  const location = useLocation();
  const [searchParams, _] = useSearchParams();
  const keyword = searchParams.get("keyword");
  return <div></div>;
};

export default Search;
