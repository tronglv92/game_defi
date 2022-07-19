import { Row, Col, Card, Rate, Divider, Checkbox } from "antd";
import icStaff from "../../public/ic-staff-small.svg";
import icSword from "../../public/ic-sword-small.svg";
import icBow from "../../public/ic-bow-small.svg";
import Image from "next/image";
import { MARKETING_DETAIL_PATH } from "../../constants/path";

import Link from "next/link";
import { formatCurrency } from "../../helpers/helper";
import { WEAPON_CLASS } from "../../constants/key";
const ItemWeapon = props => {
  const { item, onClickProduct } = props;

  return (
    <Col xs={24} sm={12} md={24} lg={12} xl={8} xxl={6}>
      <Link href={`/marketing/${item.id}`}>
        <div
          style={{
            minWidth: "222px",
            minHeight: "348px",
            maxWidth: "300px",
            backgroundColor: "#c4c4c429",
            display: "flex",
            flexDirection: "column",
            borderRadius: "4px",
            padding: "15px 20px",
            cursor: "pointer",
          }}
        >
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
          <Row justify="center">
            <div className="w-[158px] h-[237px] bg-[url('/item-frame-bg.png')] flex justify-center">
              <Image src={item.img} height="30" width="30" className="object-contain h-9 w-9 " />
            </div>
          </Row>

          <Row style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", fontWeight: "bold", color: "white" }}>$2.83</span>
            <span style={{ fontSize: "16px", fontWeight: "bold", color: "#FFC700" }}>
              {item.nft ? formatCurrency(item.nft.price) : "0"} KWS
            </span>
          </Row>
        </div>
      </Link>
    </Col>
  );
};
export default ItemWeapon;
