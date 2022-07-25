import { atom } from "recoil";

export const categoryState = atom<"movie" | "tv">({
  key: "category",
  default: "movie",
});
