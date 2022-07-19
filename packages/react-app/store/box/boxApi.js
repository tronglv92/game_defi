import axiosClient from "../axiosClient";

export const getAllBoxApi = async params => {
  const { page, limit } = params;
  const url = `/box/getAllBox?page=${page}&limit=${limit}`;

  let result = await axiosClient.get(url);

  return result.data;
};
export const getBoxByIdApi = async params => {
  const { id } = params;
  const url = `/box/getBox/${id}`;

  let result = await axiosClient.get(url);

  return result.data;
};
