import axiosClient from "../axiosClient";

export const uploadMultipleApi = async params => {
  const url = `/upload/multiple-file-upload`;

  const { imgs } = params;

  let form = new FormData();
  for (let i = 0; i < imgs.length; i++) {
    form.append("files", imgs[i]);
  }

  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };

  let result = await axiosClient.post(url, form, config);

  return result.data;
  // return result;
};
