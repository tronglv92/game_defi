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
import { getBoxByIdApi } from "../../store/box/boxApi";
import InfoBoxView from "../../components/Box/InfoBoxView";
import ItemInBoxesView from "../../components/Box/ItemInBoxesView";
import { editBox } from "../../store/box/boxSlice";

function DetailBox({ web3, box }) {
  const [form] = Form.useForm();
  const [imageUrlBox, setImageUrlBox] = useState();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const { id } = router.query;
    if (box) {
      setImageUrlBox(box.img);
    }
  }, []);
  const onFinish = info => {
    console.log("info ", info);
    let imgs = [];
    if (info.img && info.img[0]) {
      imgs.push(info.img[0].originFileObj);
    }
    dispatch(
      uploadMultiple({
        params: { imgs },
        onSuccess: data => {
          console.log("uploadMultiple data ", data);
          if (data) {
            const { images } = data;

            //CHECK IF UPDATE IMGE WEAPON
            // info.img=null : NOT UPDATE, info.imge!=null UPDATE

            const box = {
              ...info,
              img: images.length > 0 ? images[0].url : imageUrlBox,
            };
            console.log("update box ", box);
            onEditBox(box);
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

  const onEditBox = box => {
    const { id } = router.query;
    dispatch(
      editBox({
        params: {
          id: id,
          box: box,
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
  return (
    <>
      {box ? (
        <Card bodyStyle={{ paddingRight: 0, paddingLeft: 0 }}>
          <div className="mr-5 ml-5">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                name: box.name,

                price: box.nft?.price,

                itemInBoxes: box.itemInBoxes,
              }}
              onFinish={onFinish}
            >
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </Form.Item>
              <InfoBoxView imageUrlBox={imageUrlBox} setImageUrlBox={setImageUrlBox} />
              <ItemInBoxesView />

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
    const result = await getBoxByIdApi({ id: id });

    console.log("Detail weapons result ", result);
    return {
      props: {
        box: result.data.item,
      },
    };
  }
});
export default Web3Consumer(DetailBox);
