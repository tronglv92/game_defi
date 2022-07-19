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
import { WEAPON_CLASS } from "../../constants/key";
const InfoWeaponView = props => {
  const { imageUrlWeapon, setImageUrlWeapon } = props;
  const [loadingWeapon, setLoadingWeapon] = useState(false);
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
  const uploadImgWeapon = info => {
    console.log("Upload event ", info);
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, url => {
        setLoadingWeapon(false);
        setImageUrlWeapon(url);
      });
    } else if (info.file.status === "error") {
      console.log(`${info.file.name} file upload failed.`);
    }
    if (Array.isArray(info)) {
      return info;
    }

    return info?.fileList;
  };
  const validateUrl = (rule, value) => {
    if (value) {
      return Promise.resolve();
    } else {
      if (imageUrlWeapon) {
        return Promise.resolve();
      } else {
        return Promise.reject(`Image is required `);
      }
    }
  };
  const uploadButton = (
    <div>
      {loadingWeapon ? <LoadingOutlined /> : <PlusOutlined />}

      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <>
      <p className="text-black font-bold text-3xl  mt-16">Info Weapon</p>
      <Divider style={{ marginTop: 0 }} />
      <div className="mt-16 mb-16">
        <Form.Item
          name="img"
          label="Image"
          valuePropName="fileList"
          getValueFromEvent={uploadImgWeapon}
          className="text-black font-bold "
          rules={[
            {
              validator: validateUrl,
            },
          ]}
        >
          <Upload
            maxCount={1}
            name="weapon_img"
            listType="picture-card"
            showUploadList={false}
            beforeUpload={beforeUpload}
          >
            {imageUrlWeapon ? (
              <img
                src={imageUrlWeapon}
                alt="avatar"
                style={{
                  height: "100px",
                  width: "100px",

                  objectFit: "contain",
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
            label="Type"
            name={"type"}
            className="text-black font-bold"
            wrapperCol={{
              span: 18,
            }}
            rules={[
              {
                required: true,
                message: "Please select weapon type",
              },
            ]}
          >
            <Select placeholder="Please select a type weapon">
              <Select.Option value={WEAPON_CLASS.Sword}>Sworld</Select.Option>
              <Select.Option value={WEAPON_CLASS.Staff}>Staff</Select.Option>
              <Select.Option value={WEAPON_CLASS.Bow}>Bow</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
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
              stringMode
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Level"
            name={"level"}
            className="text-black font-bold"
            rules={[
              {
                required: true,
                message: "Please select level",
              },
            ]}
          >
            <InputNumber
              style={{
                width: 200,
              }}
              defaultValue="1"
              min="1"
              max="10"
              step="1"
              stringMode
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Star" className="text-black font-bold" name={"star"}>
        <Rate count={3} />
      </Form.Item>
    </>
  );
};
export default InfoWeaponView;
