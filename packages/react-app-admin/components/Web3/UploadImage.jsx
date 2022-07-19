import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import antd, { message, Upload } from "antd";
import React, { useContext, useState } from "react";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const propsUpload = {
  name: "file",
  //   action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  //   headers: {
  //     authorization: "authorization-text",
  //   },
  listType: "picture-card",
  showUploadList: false,
  //   onChange(info) {
  //     if (info.file.status !== "uploading") {
  //       console.log(info.file, info.fileList);
  //     }

  //     if (info.file.status === "done") {
  //       message.success(`${info.file.name} file uploaded successfully`);
  //     } else if (info.file.status === "error") {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
};

function UploadImage() {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
    const beforeUpload = file => {
      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
      }

      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
      }

      return isJpgOrPng && isLt2M;
    };
  const onChange = info => {
    // console.log("fileList", fileList);
    // console.log("onChange info ", info);
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, url => {
        console.log("onChange url ", url);
        setLoading(false);
        setImageUrl(url);
      });
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  return (
    <Upload {...propsUpload} beforeUpload={() => false} onChange={onChange}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="avatar"
          style={{
            width: "100%",
          }}
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
}
export default UploadImage;
