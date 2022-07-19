import { Web3Consumer } from "../../helpers/connectAccount/Web3Context";
import React, { useContext, useEffect, useState } from "react";
import { useContractReader } from "eth-hooks";
import { Button, Card, Col, Divider, Form, notification } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { createWeapon, editWeapon, getWeaponById } from "../../store/weapon/weaponSlice";
import { uploadMultiple } from "../../store/upload/uploadSlice";
import axios from "axios";
import withAuth from "../../helpers/withAuth";
import StatWeaponView from "../../components/Weapon/StatWeaponView";
import AbilitiesView from "../../components/Weapon/AbilitiesView";
import InfoWeaponView from "../../components/Weapon/InfoWeaponView";
import { useRouter } from "next/router";
import { wrapper } from "../../store/store";
import { getWeaponByIdApi } from "../../store/weapon/weaponApi";

function DetailWeapon({ web3, weapon }) {
  const [form] = Form.useForm();
  const [imageUrlWeapon, setImageUrlWeapon] = useState();
  const [imageUrlAbilities, setImageUrlAbilities] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const { id } = router.query;
    if (weapon) {
      setImageUrlWeapon(weapon.img);
      console.log("DetailWeapon weapon ", weapon);
      let imageUrlAbilitiesClone = [...imageUrlAbilities];
      weapon.itemAbilities.map((ability, index) => {
        imageUrlAbilitiesClone.push({ index, url: ability.img });
      });
      setImageUrlAbilities(imageUrlAbilitiesClone);
    }
  }, []);
  const onFinish = info => {
    console.log("info ", info);
    let imgs = [];
    if (info.img && info.img[0]) {
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
            let weaponImg = imageUrlWeapon;
            //CHECK IF UPDATE IMGE WEAPON
            // info.img=null : NOT UPDATE, info.imge!=null UPDATE
            if (info.img && info.img[0].originFileObj) {
              let indexImgWeapon = images.findIndex(e => e.originalName == info.img[0].originFileObj.name);
              if (indexImgWeapon != -1) {
                weaponImg = images[indexImgWeapon].url;
              }
            }
            let abilitiesResult = [];
            if (info.abilities) {
              for (let i = 0; i < info.abilities.length; i++) {
                let item = info.abilities[i];
                let abilityImg;
                //CHECK IF UPDATE IMGE ITEM ABILITIES
                // info.img=null : NOT UPDATE, info.imge!=null UPDATE
                if (item.img && item.img[0].originFileObj) {
                  let indexWhere = images.findIndex(
                    e => item.img && item.img.length > 0 && e.originalName == item.img[0].originFileObj.name,
                  );
                  if (indexWhere != -1) {
                    abilityImg = images[indexWhere].url;
                  }
                }
                //imageUrlAbilities: [{index:0,url:test.jpg},]
                else {
                  let indexWhere = imageUrlAbilities.findIndex(e => e.index == i);
                  if (indexWhere != -1) {
                    abilityImg = imageUrlAbilities[indexWhere].url;
                  }
                }
                abilitiesResult.push({ ...item, img: abilityImg });
              }
            }
            const weapon = {
              img: weaponImg,
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
            console.log("update weapon ", weapon);
            onEditWeapon(weapon);
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

  const onEditWeapon = weapon => {
    const { id } = router.query;
    dispatch(
      editWeapon({
        params: {
          id: id,
          weapon: weapon,
        },
        onSuccess: data => {
          console.log("onEditWeapon data ", data);
           notification.success({
             message: "Success",
             description: "Edit Weapon Success",
           });
        },
        onError: err => {
          console.log("editWeapon err ", err);
          notification.error({
            message: "Error",
            description: err,
          });
        },
      }),
    );
  };

  const abilities = [];
  for (let i = 0; i < weapon.itemAbilities.length; i++) {
    const item = weapon.itemAbilities[i];
    abilities.push({ id: item.id, name: item.name, description: item.description, level: item.level });
  }
  return (
    <>
      {weapon ? (
        <Card bodyStyle={{ paddingRight: 0, paddingLeft: 0 }}>
          <div className="mr-5 ml-5">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                name: weapon.name,
                star: weapon.star,
                level: weapon.level,
                type: weapon.type,
                price: weapon.nft?.price,
                damage: weapon.itemStat.damage,
                speed: weapon.itemStat.speed,
                hp: weapon.itemStat.hp,
                critical: weapon.itemStat.critical,
                statId: weapon.itemStat.id,
                abilities: abilities,
              }}
              onFinish={onFinish}
            >
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </Form.Item>
              <InfoWeaponView imageUrlWeapon={imageUrlWeapon} setImageUrlWeapon={setImageUrlWeapon} />

              <StatWeaponView />
              <AbilitiesView imageUrlAbilities={imageUrlAbilities} setImageUrlAbilities={setImageUrlAbilities} />

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Card>
      ) : (
        <div className="flex justify-center mt-56 h-full w-full">
          <span className="text-3xl">Product not exits</span>
        </div>
      )}
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const { params } = context;
  const { id } = params;
  if (id != "requestProvider.js.map") {
    const result = await getWeaponByIdApi({ id: id });

    console.log("Detail weapons result ", result);
    return {
      props: {
        weapon: result.data.item,
      },
    };
  }
  // console.log("DetailWeapon context.query.id ", context.query.id);
  // const { weapon } = store.getState();
  // const { page, limit } = weapon;
  // const result = await getWeaponsApi({ page, limit });
  // console.log("getServerSideProps result ", result);
  // if (result.success) {
  //   store.dispatch(getWeaponsSuccess({ items: result.data.items, page: page }));
  // } else {
  //   console.log(result.message);
  // }
});
export default Web3Consumer(DetailWeapon);
