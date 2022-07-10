import axiosClient from "../axiosClient";

export const uploadMultipleApi = async variables => {
  const url = `/upload/multiple-file-upload`;

  const { imgs } = variables;

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
