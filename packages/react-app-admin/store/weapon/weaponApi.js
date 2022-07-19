import axiosClient from "../axiosClient";

export const createWeaponApi = async params => {
  const url = `/weapon/createWeapon`;

  const { weapon } = params;
  let result = await axiosClient.post(url, weapon);
  console.log("createWeaponApi result ", result);
  return result.data;
};
export const getWeaponsApi = async params => {
  const { page, limit } = params;
  const url = `/weapon/getWeapons?page=${page}&limit=${limit}`;

  let result = await axiosClient.get(url);

  return result.data;
};
export const getWeaponByIdApi = async params => {
  const { id } = params;
  const url = `/weapon/getWeapon/${id}`;

  let result = await axiosClient.get(url);

  return result.data;
};
export const editWeaponApi = async params => {
  const { id, weapon } = params;
  const url = `/weapon/editWeapon/${id}`;

  let result = await axiosClient.post(url, weapon);

  return result.data;
};
