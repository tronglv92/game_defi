import { Web3Consumer } from "../../helpers/connectAccount/Web3Context";
import React, { useContext, useState, useRef } from "react";
import { useContractReader } from "eth-hooks";
import { Button, Card, Col, Divider, Form, Input, InputNumber, message, notification } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { createWeapon } from "../../store/weapon/weaponSlice";
import { uploadMultiple } from "../../store/upload/uploadSlice";
import axios from "axios";
import withAuth from "../../helpers/withAuth";
import AbilitiesView from "../../components/Weapon/AbilitiesView";

import InfoWeaponView from "../../components/Weapon/InfoWeaponView";
import StatWeaponView from "../../components/Weapon/StatWeaponView";

function CreateWeapon({ web3 }) {
  const [form] = Form.useForm();
  const [imageUrlWeapon, setImageUrlWeapon] = useState();
  const [imageUrlAbilities, setImageUrlAbilities] = useState([]);
  const dispatch = useDispatch();
  // const counter = useSelector(state => state.counter.count);

  const onFinish = info => {
    console.log("info ", info);

    let imgs = [];
    if (info.img[0]) {
      imgs.push(info.img[0].originFileObj);
    }

    if (info.abilities) {
      for (let i = 0; i < info.abilities.length; i++) {
        let item = info.abilities[i];
        if (item.img && item.img.length > 0) {
          imgs.push(item.img[0].originFileObj);
        }
      }
    }

    dispatch(
      uploadMultiple({
        params: { imgs },
        onSuccess: data => {
          console.log("uploadMultiple data ", data);
          if (data) {
            const { images } = data;
            let indexImgWeapon = images.findIndex(e => e.originalName == info.img[0].originFileObj.name);
            if (indexImgWeapon == -1) {
              return;
            }
            let abilitiesResult = [];
            if (info.abilities) {
              for (let i = 0; i < info.abilities.length; i++) {
                let item = info.abilities[i];
                let index = images.findIndex(
                  e => item.img && item.img.length > 0 && e.originalName == item.img[0].originFileObj.name,
                );

                if (index != -1) {
                  abilitiesResult.push({ ...item, img: images[index].url });
                }
              }
            }

            const weapon = {
              img: images[indexImgWeapon].url,
              name: info.name,
              type: info.type,
              level: info.level,
              star: info.star,
              price: info.price,
              stat: {
                damage: parseFloat(info.damage),
                speed: parseFloat(info.speed),
                hp: parseFloat(info.hp),
                critical: parseFloat(info.critical),
              },
              abilities: abilitiesResult,
            };
            console.log("uploadMultiple weapon ", weapon);
            dispatch(
              createWeapon({
                params: {
                  weapon,
                },
                onSuccess: dataWp => {
                  console.log("uploadMultiple dataWp ", dataWp);

                  setImageUrlWeapon(null);
                  setImageUrlAbilities([]);
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
            <InfoWeaponView imageUrlWeapon={imageUrlWeapon} setImageUrlWeapon={setImageUrlWeapon} />

            <StatWeaponView />
            <AbilitiesView imageUrlAbilities={imageUrlAbilities} setImageUrlAbilities={setImageUrlAbilities} />

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
