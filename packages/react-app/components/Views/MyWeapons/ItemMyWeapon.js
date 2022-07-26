import { Row, Col, Card, Rate, Divider, Checkbox } from "antd";
import icStaff from "../../../public/ic-staff-small.svg";
import icSword from "../../../public/ic-sword-small.svg";
import icBow from "../../../public/ic-bow-small.svg";
import Image from "next/image";

import Link from "next/link";
import { formatCurrency } from "../../../helpers/helper";
import { WEAPON_CLASS } from "../../../constants/key";
import { MY_WEAPONS_PATH } from "../../../constants/path";
const ItemMyWeapon = props => {
  const { item, onClickProduct } = props;

  return (
    <Col xs={24} sm={12} md={24} lg={12} xl={8} xxl={6}>
      <Link href={`${MY_WEAPONS_PATH}/${item.id}`}>
        <div className="px-5 py-[15px] min-w-[222px] min-h-[348px] md:max-w-[300px] bg-blackop16 rounded-[4px] bg-[#c4c4c429] cursor-pointer">
          <Row style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}>
            <Row className="border-2 flex-wrap  rounded border-solid border-pink-300 px-2" align="middle">
              <Image
                src={
                  item.type == WEAPON_CLASS.Sword
                    ? icSword.src
                    : item.type == WEAPON_CLASS.Bow
                    ? icBow.src
                    : icStaff.src
                }
                width="14"
                height="14"
              />
              <span className="text-pink-300 text-[#9px] ml-1">#{item.id}</span>
            </Row>
            {item.star && <Rate value={item.star} count={item.star} style={{ fontSize: "15px" }} />}
          </Row>
          <div className="w-[158px] h-[237px] bg-[url('/item-frame-bg.png')] flex justify-center mx-auto mt-3">
            <img src={item.img} className="object-contain  max-w-[120px] max-h-[182px] my-auto" />
          </div>
        </div>
      </Link>
    </Col>
  );
};
export default ItemMyWeapon;
