import { useContractReader } from "eth-hooks";
import React, { useContext } from "react";
import { Contract, Account, Header } from "../components";
import ExampleUI from "../components/Views/ExampleUI";

import Image from "next/image";
import { Row, Col, Card, Rate, Divider, Checkbox } from "antd";

import bow from "../public/bow.svg";

export default function Filter() {
  const onChangeWeaponClass = e => {
    console.log(`checked = ${e.target.checked}`);
  };
  return (
    <div style={{ paddingLeft: "20px", paddingRight: "50px" }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
        <span className="font-bold text-white text-lg">FILTER</span>
        <span className=" text-yellow-300 text-sm">Clear filter</span>
      </Row>
      <Col
        style={{
          minWidth: "300px",

          borderWidth: 1,
          borderColor: "#FFC700",

          padding: "20px",
        }}
      >
        <Col>
          <span className="text-lg font-semibold " style={{ color: "#F1CB8C" }}>
            Weapon class
          </span>
          <Row style={{ marginTop: "15px" }}>
            <Checkbox onChange={onChangeWeaponClass} />
            <img src={bow.src} width={"15px"} height="15px" style={{ marginLeft: "10px", marginRight: "10px" }} />
            <span className="text-white text-base">Sword</span>
          </Row>
          <Row style={{ marginTop: "15px" }}>
            <Checkbox onChange={onChangeWeaponClass} />
            <img src={bow.src} width={"15px"} height="15px" style={{ marginLeft: "10px", marginRight: "10px" }} />
            <span className="text-white text-base">Sword</span>
          </Row>
          <Row style={{ marginTop: "15px" }}>
            <Checkbox onChange={onChangeWeaponClass} />
            <img src={bow.src} width={"15px"} height="15px" style={{ marginLeft: "10px", marginRight: "10px" }} />
            <span className="text-white text-base">Sword</span>
          </Row>
        </Col>
        <Col style={{ marginTop: "30px" }}>
          <span className="text-lg font-semibold " style={{ color: "#F1CB8C" }}>
            Weapon star
          </span>
          <Row style={{ marginTop: "10px" }} align="middle">
            <Checkbox onChange={onChangeWeaponClass} />
            <Rate count={1} value={1} style={{ fontSize: "20px", marginLeft: "10px", marginBottom: "3px" }} />
          </Row>
          <Row style={{ marginTop: "10px" }} align="middle">
            <Checkbox onChange={onChangeWeaponClass} />
            <Rate count={2} value={2} style={{ fontSize: "20px", marginLeft: "10px", marginBottom: "3px" }} />
          </Row>
          <Row style={{ marginTop: "10px" }} align="middle">
            <Checkbox onChange={onChangeWeaponClass} />
            <Rate count={3} value={3} style={{ fontSize: "20px", marginLeft: "10px", marginBottom: "3px" }} />
          </Row>
        </Col>
        <Col>
          <span className="text-lg font-semibold " style={{ color: "#F1CB8C" }}>
            Price
          </span>
        </Col>
      </Col>
    </div>
  );
}
