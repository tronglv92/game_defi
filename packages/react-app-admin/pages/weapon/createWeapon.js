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
import { useSelector, useDispatch } from "react-redux";
import { createWeapon } from "../../store/weapon/weaponSlice";
import { uploadMultiple } from "../../store/upload/uploadSlice";
import axios from "axios";
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
  const [abilities, setAbilities] = useState([]);

  const [imageUrlWeapon, setImageUrlWeapon] = useState();

  const [loadingWeapon, setLoadingWeapon] = useState(false);

  const dispatch = useDispatch();
  // const counter = useSelector(state => state.counter.count);

  const onFinish = info => {
    console.log("info ", info);
    console.log("abilities ", abilities);
    // let imgs = [];
    // if (info.img[0]) {
    //   imgs.push(info.img[0].originFileObj);
    // }

    // for (let i = 0; i < abilities.length; i++) {
    //   let item = abilities[i];
    //   if (item.img && item.img.length > 0) {
    //     imgs.push(item.img[0].originFileObj);
    //   }
    // }

    // dispatch(
    //   uploadMultiple({
    //     imgs,
    //     onSuccess: data => {
    //       console.log("uploadMultiple data ", data);
    //       if (data) {
    //         const { images } = data;
    //         let indexImgWeapon = images.findIndex(e => e.originalName == info.img[0].originFileObj.name);
    //         if (indexImgWeapon == -1) {
    //           return;
    //         }
    //         let abilitiesResult = [];
    //         for (let i = 0; i < abilities.length; i++) {
    //           let item = abilities[i];
    //           let index = images.findIndex(
    //             e => item.img && item.img.length > 0 && e.originalName == item.img[0].originFileObj.name,
    //           );

    //           if (index != -1) {
    //             abilitiesResult.push({ ...item, img: images[index].url });
    //           }
    //         }

    //         const weapon = {
    //           img: images[indexImgWeapon].url,
    //           name: info.name,
    //           type: info.type,
    //           level: info.level,
    //           star: info.star,
    //           price: info.price,
    //           stat: {
    //             damage: parseFloat(info.damage),
    //             speed: parseFloat(info.speed),
    //             hp: parseFloat(info.hp),
    //             critical: parseFloat(info.critical),
    //           },
    //           abilities: abilitiesResult,
    //         };
    //         console.log("uploadMultiple weapon ", weapon);
    //         dispatch(
    //           createWeapon({
    //             weapon,
    //             onSuccess: dataWp => {
    //               console.log("uploadMultiple dataWp ", dataWp);
    //             },
    //             onError: err => {
    //               console.log("createWeapon err ", err);
    //               notification.error({
    //                 message: "Message",
    //                 description: err,
    //               });
    //             },
    //           }),
    //         );
    //       } else {
    //         notification.error({
    //           message: "Message",
    //           description: "Missing data when upload images",
    //         });
    //       }
    //     },
    //     onError: err => {
    //       console.log("uploadMultiple err ", err);
    //       notification.error({
    //         message: "Message",
    //         description: err,
    //       });
    //     },
    //   }),
    // );
  };

  const onAddAbilities = () => {
    let abilitiesClone = [...abilities];
    abilitiesClone.push({ img: null, description: null, level: null, name: null });
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
      console.log(`${info.file.name} file upload failed.`);
    }
    if (Array.isArray(info)) {
      return info;
    }

    return info?.fileList;
  };
  const onChangeName = (e, index) => {
    console.log("target ", e);
    let abilitiesClone = [...abilities];
    abilitiesClone[index].name = e.target.value;
    setAbilities(abilitiesClone);
  };
  const onChangeDesAbilities = (e, index) => {
    console.log("target ", e);
    let abilitiesClone = [...abilities];
    abilitiesClone[index].description = e.target.value;
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
              star: 1,
              level: 1,
              price: 1,
              damage: 111,
              speed: 1.1,
              hp: 100,
              critical: 55,
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
                name="img"
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
              <Rate onChange={setValue} value={value} count={3} />
            </Form.Item>
            <Col>
              <p className="text-black font-bold text-3xl  mt-16">Stat Weapon</p>
              <Divider style={{ marginTop: 0 }} />
              <Form.Item
                label="Damage"
                name="damage"
                className="text-black font-bold"
                rules={[
                  {
                    required: true,
                    message: "Please enter damage",
                  },
                ]}
              >
                <InputNumber
                  style={{
                    width: 200,
                  }}
                  stringMode
                />
                {/* <Slider defaultValue={100} max={1000} min={1} /> */}
              </Form.Item>
              <Form.Item
                label="Speed"
                name="speed"
                className="text-black font-bold"
                rules={[
                  {
                    required: true,
                    message: "Please enter speed",
                  },
                ]}
              >
                <InputNumber
                  style={{
                    width: 200,
                  }}
                  stringMode
                />
              </Form.Item>
              <Form.Item
                label="HP"
                name="hp"
                className="text-black font-bold"
                rules={[
                  {
                    required: true,
                    message: "Please enter hp",
                  },
                ]}
              >
                <InputNumber
                  style={{
                    width: 200,
                  }}
                  stringMode
                />
                {/* <Slider defaultValue={30} max={100} min={0} /> */}
              </Form.Item>
              <Form.Item
                label="Critical"
                name="critical"
                className="text-black font-bold"
                rules={[
                  {
                    required: true,
                    message: "Please enter critical",
                  },
                ]}
              >
                <InputNumber
                  style={{
                    width: 200,
                  }}
                  stringMode
                />
                {/* <Slider defaultValue={11} max={100} min={1} /> */}
              </Form.Item>
            </Col>

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
                      <Form.Item
                        label="Image"
                        className="text-black font-bold"
                        rules={[
                          {
                            required: true,
                            message: "Please upload ability image!",
                          },
                        ]}
                      >
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
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        label="Name"
                        className="text-black font-bold"
                        wrapperCol={{ span: 20 }}
                        rules={[
                          {
                            required: true,
                            message: "Please enter name",
                          },
                        ]}
                      >
                        <Input value={item.name} onChange={e => onChangeName(e, index)} />
                      </Form.Item>
                      <Form.Item
                        label="Description"
                        className="text-black font-bold"
                        wrapperCol={{ span: 20 }}
                        rules={[
                          {
                            required: true,
                            message: "Please enter description",
                          },
                        ]}
                      >
                        <TextArea value={item.des} onChange={e => onChangeDesAbilities(e, index)} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Level"
                        className="text-black font-bold"
                        rules={[
                          {
                            required: true,
                            message: "Please enter level",
                          },
                        ]}
                      >
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
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </>
  );
}
export default Web3Consumer(CreateWeapon);
