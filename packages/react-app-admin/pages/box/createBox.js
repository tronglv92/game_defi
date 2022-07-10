import { Web3Consumer } from "../../helpers/connectAccount/Web3Context";
import React, { useContext, useState } from "react";
import { useContractReader } from "eth-hooks";
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
import UploadImage from "../../components/UploadImage";
import TextArea from "antd/lib/input/TextArea";
import { DeleteOutlined, LoadingOutlined, PlusCircleFilled, PlusOutlined, UploadOutlined } from "@ant-design/icons";
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

function CreateWeapon({ web3 }) {
  const [value, setValue] = useState(3);
  const [abilities, setAbilities] = useState([{ img: null, des: null, level: null, url: null }]);
  const [itemsInBox, setItemInBox] = useState([
    { star: 1, percent: null },
    { star: 2, percent: null },
    { star: 3, percent: null },
  ]);
  const [imageUrlWeapon, setImageUrlWeapon] = useState();

  const [loadingWeapon, setLoadingWeapon] = useState(false);

  const onFinish = info => {
    info.abilities = abilities;
    info.itemsInBox = itemsInBox;
    console.log("info ", info);
    let sumPercent = 0;
    for (let i = 0; i < itemsInBox.length; i++) {
      let percent = itemsInBox[i].percent;

      if (percent != null) {
        sumPercent += percent;
      }
    }

    if (info.is_box == true && sumPercent != 100) {
      notification.error({
        message: "Add Product",
        description: "Sum percent item in box must be 100 ",
      });
      return;
    }
  };
  const onAddAbilities = () => {
    let abilitiesClone = [...abilities];
    abilitiesClone.push({ img: null, des: null, level: null });
    console.log("abilitiesClone ", abilitiesClone);
    setAbilities(abilitiesClone);
  };
  const onRemoveAbilities = index => {
    let abilitiesClone = [...abilities];
    abilitiesClone.splice(index - 1, 1);
    console.log("abilitiesClone ", abilitiesClone);
    setAbilities(abilitiesClone);
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
      console.log(i`${info.file.name} file upload failed.`);
    }
    if (Array.isArray(info)) {
      return info;
    }

    return info?.fileList;
  };
  const onChangeDesAbilities = (e, index) => {
    console.log("target ", e);
    let abilitiesClone = [...abilities];
    abilitiesClone[index].des = e.target.value;
    setAbilities(abilitiesClone);
  };
  const onChangeLevelAbilities = (level, index) => {
    console.log("target ", level);
    let abilitiesClone = [...abilities];
    abilitiesClone[index].level = level;
    setAbilities(abilitiesClone);
  };
  const onChangeImgAbilities = (info, index) => {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      let abilitiesClone = [...abilities];
      abilitiesClone[index].img = info?.fileList;
      getBase64(info.file.originFileObj, url => {
        setLoadingWeapon(false);
        abilitiesClone[index].url = url;
        setAbilities(abilitiesClone);
      });
    } else if (info.file.status === "error") {
      console.log(i`${info.file.name} file upload failed.`);
    }
  };
  const onChangePercentItemInBox = (percent, index) => {
    let itemsInBoxClone = [...itemsInBox];
    itemsInBoxClone[index].percent = percent;
    setItemInBox(itemsInBoxClone);
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
      <Card bodyStyle={{ paddingRight: 0, paddingLeft: 0 }}>
        <div className="mr-5 ml-5">
          <Form
            layout="vertical"
            initialValues={{
              weapon_rate: 1,
              weapon_level: 1,
              weapon_price: 1,
              weapon_damage: 111,
              weapon_speed: 1.1,
              weapon_duration: 100,
              weapon_critical: 55,
            }}
            onFinish={onFinish}
          >
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create
              </Button>
            </Form.Item>
            <p className="text-black font-bold text-3xl  mt-16">Info Weapon</p>
            <Divider style={{ marginTop: 0 }} />
            <div className="mt-16 mb-16">
              <Form.Item
                name="weapon_img"
                label="Image"
                valuePropName="fileList"
                getValueFromEvent={uploadImgWeapon}
                className="text-black font-bold "
                rules={[
                  {
                    required: true,
                    message: "Please upload weapon image!",
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
                  name="weapon_name"
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
                  label="Price"
                  name={"weapon_price"}
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
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={value => value.replace(/\$\s?|(,*)/g, "")}
                    defaultValue={1}
                    min={1}
                    max={10000000}
                    step={1}
                    stringMode
                  />
                </Form.Item>
              </Col>
            </Row>

            <Col>
              <Row align="middle" className="mt-16 mb-5">
                <p className="text-black font-bold text-3xl mb-0 mr-5 mt-0">Item In Box</p>
              </Row>

              <Divider style={{ marginTop: 0 }} />
              {itemsInBox.map((item, index) => {
                return (
                  <Row>
                    <Col span={12}>
                      <Form.Item label={index == 0 ? "Star" : " "} className="text-black font-bold">
                        <Rate value={item.star} disabled count={item.star} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={index == 0 ? "Percent" : " "} className="text-black font-bold">
                        <InputNumber
                          defaultValue={0}
                          value={item.percent ? item.percent : 0}
                          min={0}
                          max={100}
                          formatter={value => `${value}%`}
                          onChange={percent => {
                            onChangePercentItemInBox(percent, index);
                          }}
                          parser={value => value.replace("%", "")}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                );
              })}
            </Col>
          </Form>
        </div>
      </Card>
    </>
  );
}
export default Web3Consumer(CreateWeapon);
