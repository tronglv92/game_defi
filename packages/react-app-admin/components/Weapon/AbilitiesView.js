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
import { DeleteOutlined, LoadingOutlined, PlusCircleFilled, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
const AbilitiesView = props => {
  const { imageUrlAbilities, setImageUrlAbilities } = props;
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
  const uploadImgAbilities = (info, index) => {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, url => {
        let imageUrlAbilitiesClone = [...imageUrlAbilities];
        let whereIndex = imageUrlAbilitiesClone.findIndex(e => e.index == index);
        if (whereIndex == -1) {
          imageUrlAbilitiesClone.push({ index, url });
        } else {
          imageUrlAbilitiesClone[whereIndex] = { index, url };
        }
        setImageUrlAbilities(imageUrlAbilitiesClone);
      });
    } else if (info.file.status === "error") {
      console.log(`${info.file.name} file upload failed.`);
    }
    if (Array.isArray(info)) {
      return info;
    }

    return info?.fileList;
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
    <Form.List
      name="abilities"
      // rules={[
      //   {
      //     validator: async (_, abilities) => {
      //       if (!abilities || abilities.length < 1) {
      //         return Promise.reject(new Error("At least 1 abilities"));
      //       }
      //     },
      //   },
      // ]}
    >
      {(fields, { add, remove }, { errors }) => (
        <>
          <Row align="middle" className="mt-16 mb-5">
            <p className="text-black font-bold text-3xl mb-0 mr-5 mt-0">Abilities</p>
            <PlusCircleFilled style={{ fontSize: "32px", color: "blue" }} onClick={() => add()} />
          </Row>

          <Divider style={{ marginTop: 0 }} />
          {fields.map((field, index) => {
            let whereIndex = imageUrlAbilities.findIndex(e => e.index == index);
            return (
              <Row key={field.key}>
                <Form.Item name={[index, "id"]} className="invisible">
                  <div />
                </Form.Item>
                <Col span={4}>
                  <Form.Item
                    label="Image"
                    className="text-black font-bold"
                    getValueFromEvent={infor => uploadImgAbilities(infor, index)}
                    name={[index, "img"]}
                    rules={[
                      {
                        validator: (rule, value) => {
                          console.log("validator value ", value);
                          if (value) {
                            return Promise.resolve();
                          } else {
                            if (imageUrlAbilities[index]) {
                              return Promise.resolve();
                            } else {
                              return Promise.reject(`Image is required `);
                            }
                          }
                        },
                      },
                    ]}
                  >
                    <Upload maxCount={1} listType="picture-card" showUploadList={false} beforeUpload={beforeUpload}>
                      {whereIndex != -1 ? (
                        <img
                          src={imageUrlAbilities[whereIndex].url}
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
                    name={[index, "name"]}
                    className="text-black font-bold"
                    wrapperCol={{ span: 20 }}
                    rules={[
                      {
                        required: true,
                        message: "Please enter name",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Description"
                    name={[index, "description"]}
                    className="text-black font-bold"
                    wrapperCol={{ span: 20 }}
                    rules={[
                      {
                        required: true,
                        message: "Please enter description",
                      },
                    ]}
                  >
                    <TextArea />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Level"
                    name={[index, "level"]}
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
                      min={1}
                    />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <div className="h-24 flex  justify-center items-center align-middle">
                    <DeleteOutlined style={{ fontSize: "20px", color: "red" }} onClick={() => remove(field.name)} />
                  </div>
                </Col>
              </Row>
            );
          })}
          <Form.ErrorList errors={errors} />
        </>
      )}
    </Form.List>
  );
};
export default AbilitiesView;
