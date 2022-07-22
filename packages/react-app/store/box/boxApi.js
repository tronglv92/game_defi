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
export const updateNFTApi = async params => {
  const { id, state, hashNFT } = params;
  const url = `/box/updateNFT/${id}`;

  let result = await axiosClient.post(url, { state, hashNFT });

  return result.data;
};
export const getSignatureWhenBuyBoxApi = async params => {
  const { id, user, price, paymentErc20 } = params;
  const url = `/box/getSignature`;

  let result = await axiosClient.get(url, { params: { id: id, user: user, price: price, paymentErc20: paymentErc20 } });

  return result.data;
};
