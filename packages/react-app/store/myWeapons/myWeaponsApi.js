import { getAuth } from "../../helpers/local";
import axiosClient from "../axiosClient";
export const getMyWeaponsApi = async params => {
  const { page, limit } = params;
  console.log("getMyBoxesApi auth ", getAuth());
  const url = `/weapon/myWeapons?page=${page}&limit=${limit}`;

  let result = await axiosClient.get(url);

  return result.data;
};
