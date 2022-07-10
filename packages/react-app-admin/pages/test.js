import { Upload } from "antd";
import axios from "axios";
import { Web3Consumer } from "../helpers/connectAccount/Web3Context";

function test({ web3 }) {
  const avatarUpload = file => {
    console.log("file ", file);
    const data = new FormData();
    data.append("file", file);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post("http://localhost:8000/upload/upload", data, config)
      .then(res => {
        console.log("res", res);
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <>
      <Upload name="avatar" action={avatarUpload} listType="picture-card">
        <p className="ant-upload-drag-icon"></p>
        <p className="ant-upload-text">Clique ou arraste um arquivo.</p>
      </Upload>
    </>
  );
}
export default Web3Consumer(test);
