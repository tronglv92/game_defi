import axiosClient from "../axiosClient";

export const getWeaponsApi = async params => {
  console.log("getWeaponsApi params ", params);
  // const url = `/weapon/getWeapons?page=${page}&limit=${limit}&priceFrom=${fromPrice}&priceTo=${toPrice}&type=${type}&star=${star}`;
  const url = `/weapon/getWeapons`;
  let result = await axiosClient.get(url, {
    params,
  });

  return result.data;
};
export const getWeaponByIdApi = async params => {
  const { id } = params;
  const url = `/weapon/getWeapon/${id}`;

  let result = await axiosClient.get(url);

  return result.data;
};
