import { Web3Consumer } from "../../helpers/Web3Context";
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
  const [isBox, setIsBox] = useState(true);
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
              is_box: isBox,
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
              <Form.Item label="Box" name={"is_box"}>
                <Switch
                  defaultChecked={isBox}
                  onChange={isBox => {
                    console.log("isBox ", isBox);
                    setIsBox(isBox);
                  }}
                />
              </Form.Item>
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
                  label="Type"
                  name={"weapon_type"}
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
                    <Select.Option value={0}>Sworld</Select.Option>
                    <Select.Option value={1}>Magic</Select.Option>
                    <Select.Option value={2}>Bow</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row>
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
              <Col span={12}>
                <Form.Item
                  label="Level"
                  name={"weapon_level"}
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
            <Form.Item label="Star" className="text-black font-bold" name={"weapon_rate"}>
              <Rate onChange={setValue} value={value} count={3} />
            </Form.Item>

            {isBox == false && (
              <Col>
                <p className="text-black font-bold text-3xl  mt-16">Stat Weapon</p>
                <Divider style={{ marginTop: 0 }} />
                <Form.Item label="Damage" name="weapon_damage" className="text-black font-bold">
                  <Slider defaultValue={100} max={1000} min={1} />
                </Form.Item>
                <Form.Item label="Speed" name="weapon_speed" className="text-black font-bold">
                  <Slider defaultValue={1.5} max={2} min={1} step={0.1} />
                </Form.Item>
                <Form.Item label="Duration" name="weapon_duration" className="text-black font-bold">
                  <Slider defaultValue={30} max={100} min={0} />
                </Form.Item>
                <Form.Item label="Critical" name="weapon_critical" className="text-black font-bold">
                  <Slider defaultValue={11} max={100} min={1} />
                </Form.Item>
              </Col>
            )}

            {isBox == false && (
              <Col>
                <Row align="middle" className="mt-16 mb-5">
                  <p className="text-black font-bold text-3xl mb-0 mr-5 mt-0">Abilities</p>
                  <PlusCircleFilled style={{ fontSize: "32px", color: "blue" }} onClick={onAddAbilities} />
                </Row>

                <Divider style={{ marginTop: 0 }} />
                {abilities.map((item, index) => {
                  return (
                    <Row>
                      <Col span={4}>
                        <Form.Item label="Image" className="text-black font-bold">
                          <Upload
                            maxCount={1}
                            listType="picture-card"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            onChange={info => onChangeImgAbilities(info, index)}
                          >
                            {item.url ? (
                              <img
                                src={item.url}
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
                      </Col>
                      <Col span={10}>
                        <Form.Item label="Description" className="text-black font-bold" wrapperCol={{ span: 20 }}>
                          <TextArea value={item.des} onChange={e => onChangeDesAbilities(e, index)} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="Level" className="text-black font-bold">
                          <InputNumber
                            style={{
                              width: 200,
                            }}
                            value={item.level ? item.level : 1}
                            min="1"
                            max="10"
                            step="1"
                            stringMode
                            onChange={e => onChangeLevelAbilities(e, index)}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <div className="h-24 flex  justify-center items-center align-middle">
                          <DeleteOutlined
                            style={{ fontSize: "20px", color: "red" }}
                            onClick={() => onRemoveAbilities(index)}
                          />
                        </div>
                      </Col>
                    </Row>
                  );
                })}
              </Col>
            )}
            {isBox == true && (
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
            )}
          </Form>
        </div>
      </Card>
    </>
  );
}
export default Web3Consumer(CreateWeapon);
