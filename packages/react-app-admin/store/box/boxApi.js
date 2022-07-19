import axiosClient from "../axiosClient";

export const createBoxApi = async params => {
  const url = `/box/createBox`;

  const { box } = params;
  let result = await axiosClient.post(url, box);
  console.log("createBoxApi result ", result);
  return result.data;
};
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
export const editBoxApi = async params => {
  const { id, box } = params;
  const url = `/box/editBox/${id}`;

  let result = await axiosClient.post(url, box);

  return result.data;
};
