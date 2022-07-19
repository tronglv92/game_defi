import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  notification,
  Pagination,
  Rate,
  Row,
  Select,
  Slider,
  Switch,
  Upload,
} from "antd";
import { useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
const InfoBoxView = props => {
  const { imageUrlBox, setImageUrlBox } = props;
  const [loadingBox, setLoadingBox] = useState(false);
  const uploadImgBox = info => {
    console.log("Upload event ", info);
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, url => {
        setLoadingBox(false);
        setImageUrlBox(url);
      });
    } else if (info.file.status === "error") {
      console.log(i`${info.file.name} file upload failed.`);
    }
    if (Array.isArray(info)) {
      return info;
    }

    return info?.fileList;
  };
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
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
  const uploadButton = (
    <div>
      {loadingBox ? <LoadingOutlined /> : <PlusOutlined />}

      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const validateUrl = (rule, value) => {
    if (value) {
      return Promise.resolve();
    } else {
      if (imageUrlBox) {
        return Promise.resolve();
      } else {
        return Promise.reject(`Image is required `);
      }
    }
  };
  return (
    <>
      <p className="text-black font-bold text-3xl  mt-16">Info Box</p>
      <Divider style={{ marginTop: 0 }} />
      <div className="mt-16 mb-16">
        <Form.Item
          name="img"
          label="Image"
          valuePropName="fileList"
          getValueFromEvent={uploadImgBox}
          className="text-black font-bold "
          rules={[
            {
              validator: validateUrl,
            },
          ]}
        >
          <Upload maxCount={1} name="img" listType="picture-card" showUploadList={false} beforeUpload={beforeUpload}>
            {imageUrlBox ? (
              <img
                src={imageUrlBox}
                alt="avatar"
                style={{
                  width: "100%",
                }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
      </div>

      <Row>
        <Col span={12}>
          <Form.Item
            label="Name"
            name="name"
            className="text-black font-bold"
            wrapperCol={{
              span: 18,
            }}
            rules={[
              {
                required: true,
                message: "Name is not empty",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Price (KMS)"
            name={"price"}
            className="text-black font-bold"
            rules={[
              {
                required: true,
                message: "Please select price",
              },
            ]}
          >
            <InputNumber
              style={{
                width: 200,
              }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={value => value.replace(/\$\s?|(,*)/g, "")}
              defaultValue={1}
              min={1}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};
export default InfoBoxView;
