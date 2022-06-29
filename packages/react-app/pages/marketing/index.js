import { useContractReader } from "eth-hooks";
import React, { useContext, useState } from "react";

import { Web3Consumer } from "../../helpers/Web3Context";
import Image from "next/image";
import { Row, Col, Card, Rate, Divider, Checkbox } from "antd";
import icStaff from "../../public/ic-staff-small.svg";

import { FilterOutlined } from "@ant-design/icons";
import Filter from "../../components/Filter";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";
import { MARKETING_DETAIL_PATH } from "../../constants/path";
function Marketing({ web3 }) {
  console.log("web3 ", web3);
  const {
    readContracts,
    yourAccount,
    userSigner,
    mainnetProvider,
    localProvider,
    yourLocalBalance,
    writeContracts,
    price,
    tx,
  } = web3;
  const purpose = useContractReader(readContracts, "YourContract", "purpose");
  const number = useContractReader(readContracts, "YourContract", "number");
  const items = [1, 2, 3, 4, 5, 6, 7, 9];
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const [visibleFilter, setVisibleFilter] = useState(false);
  const router = useRouter();
  // console.log("purpose ", purpose);
  // console.log("number ", number ? number.toString() : "");
  const onClickFilter = () => {
    setVisibleFilter(!visibleFilter);
  };
  const onClickProduct = (item, index) => {
    router.push({
      pathname: MARKETING_DETAIL_PATH,
    });
  };
  return (
    <>
      <div className="flex max-w-screen-2xl mx-auto mt-20">
        {/* Filter */}
        {!isMobile && <Filter />}
        {/* List Weapon */}
        <div
          style={{
            borderLeftWidth: "1px",
            borderLeftColor: "#333333",
          }}
        >
          <Row
            style={{ paddingLeft: "20px", paddingBottom: "20px", borderBottomWidth: 1, borderBottomColor: "#333333" }}
            justify="space-between"
            align="middle"
          >
            <span className="text-white text-lg">250 items</span>
            {isMobile && (
              <FilterOutlined
                style={{ fontSize: "25px", color: "white" }}
                onClick={onClickFilter}
                className="cursor-pointer"
              />
            )}
          </Row>
          {isMobile && visibleFilter && <Filter />}
          <Row gutter={[16, 16]} style={{ marginTop: "20px", marginLeft: "20px" }}>
            {items.map((item, index) => {
              return (
                <Col xs={24} sm={12} md={24} lg={12} xl={8} xxl={6}>
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
                    onClick={() => onClickProduct(item, index)}
                  >
                    <Row style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}>
                      <Row className="border-2 flex-wrap  rounded border-solid border-pink-300" align="middle">
                        <Image src={icStaff.src} width="14" height="14" />
                        <span className="text-pink-300 " style={{ fontSize: "10px" }}>
                          #100105
                        </span>
                      </Row>
                      <Rate value={3} count={3} style={{ fontSize: "15px" }} />
                    </Row>
                    <Row justify="center">
                      <Image src="/item-frame-bg.png" width="158" height="237" />
                    </Row>

                    <Row style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", fontWeight: "bold", color: "white" }}>$2.83</span>
                      <span style={{ fontSize: "16px", fontWeight: "bold", color: "#FFC700" }}>400.00 KWS</span>
                    </Row>
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    </>
  );
}

export default Web3Consumer(Marketing);
