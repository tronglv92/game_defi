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

import { LoadingOutlined, PlusCircleFilled, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { uploadMultiple } from "../../store/upload/uploadSlice";
import { useSelector, useDispatch } from "react-redux";
import InfoBoxView from "../../components/Box/InfoBoxView";
import ItemInBoxesView from "../../components/Box/ItemInBoxesView";
import { createBox } from "../../store/box/boxSlice";
function CreateBox({ web3 }) {
  const [form] = Form.useForm();
  const [imageUrlBox, setImageUrlBox] = useState();

  const dispatch = useDispatch();

  const onFinish = info => {
    console.log("info ", info);
    let imgs = [];
    if (info.img[0]) {
      imgs.push(info.img[0].originFileObj);
    }
    dispatch(
      uploadMultiple({
        params: { imgs },
        onSuccess: data => {
          if (data && data.images.length > 0) {
            const { images } = data;
            const box = {
              ...info,
              img: images[0].url,
            };
            console.log("uploadMultiple box ", box);
            dispatch(
              createBox({
                params: {
                  box,
                },
                onSuccess: dataBox => {
                  console.log("createBox dataBox ", dataBox);

                  setImageUrlBox(null);

                  notification.success({
                    message: "Success",
                    description: "Create Weapon Success",
                  });
                  form.resetFields();
                },
                onError: err => {
                  console.log("createWeapon err ", err);
                  notification.error({
                    message: "Error",
                    description: err,
                  });
                },
              }),
            );
          } else {
            notification.error({
              message: "Error",
              description: "Missing data when upload images",
            });
          }
        },
        onError: err => {
          console.log("uploadMultiple err ", err);
          notification.error({
            message: "Message",
            description: err,
          });
        },
      }),
    );
  };

  return (
    <>
      <Card bodyStyle={{ paddingRight: 0, paddingLeft: 0 }}>
        <div className="mr-5 ml-5">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              price: 1,

              itemInBoxes: [
                {
                  level: 1,
                  percent: null,
                },
                {
                  level: 2,
                  percent: null,
                },
                {
                  level: 3,
                  percent: null,
                },
              ],
            }}
            onFinish={onFinish}
          >
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create
              </Button>
            </Form.Item>

            <InfoBoxView imageUrlBox={imageUrlBox} setImageUrlBox={setImageUrlBox} />
            <ItemInBoxesView />
            <Form.Item className="mt-5">
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
export default Web3Consumer(CreateBox);
