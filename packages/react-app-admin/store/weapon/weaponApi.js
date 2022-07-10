import axiosClient from "../axiosClient";

export const createWeaponApi = variables => {
  const url = `/weapon/createWeapon`;
  console.log("url ", url);

  return axiosClient.post(url, variables);
};
