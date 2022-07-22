import { getAuth } from "../../helpers/local";
import axiosClient from "../axiosClient";
export const getMyBoxesApi = async params => {
  const { page, limit } = params;
  console.log("getMyBoxesApi auth ", getAuth());
  const url = `/box/getMyBoxes?page=${page}&limit=${limit}`;

  let result = await axiosClient.get(url);

  return result.data;
};
