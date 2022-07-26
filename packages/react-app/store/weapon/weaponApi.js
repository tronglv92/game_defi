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
export const getSignatureMintApi = async params => {
  const { id, nftAddress, paymentErc20, price, buyer } = params;
  const url = `/weapon/getSignatureMint`;

  let result = await axiosClient.get(url, {
    params: {
      id,
      nftAddress,
      paymentErc20,
      price,
      buyer,
    },
  });

  return result.data;
};
export const updateMintWeaponApi = async params => {
  const { id, state, hashNFT, minted, buyer } = params;
  const url = `/weapon/updateWhenMinted/${id}`;

  let result = await axiosClient.post(url, { state, hashNFT, minted, buyer });

  return result.data;
};
