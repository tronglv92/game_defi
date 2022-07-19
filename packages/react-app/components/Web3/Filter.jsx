import { useContractReader } from "eth-hooks";
import React, { useContext, useState, useEffect } from "react";

import { Row, Col, Card, Rate, Divider, Checkbox } from "antd";

import bow from "../../public/bow.svg";
import staff from "../../public/staff.svg";
import sword from "../../public/sword.svg";
import { WEAPON_CLASS } from "../../constants/key";
export default function Filter(props) {
  const { onFilter } = props;
  const [selectedWeaponClass, setSelectWeaponClass] = useState([]);
  const [selectedWeaponStar, setSelectWeaponStar] = useState([]);
  const [priceFrom, setPriceFrom] = useState();
  const [priceFromFilter, setPriceFromFilter] = useState();
  const [priceTo, setPriceTo] = useState();
  const [priceToFilter, setPriceToFilter] = useState();
  const onChangeWeaponClass = (checked, weaponClass) => {
    let index = selectedWeaponClass.findIndex(e => e == weaponClass);
    if (checked) {
      if (index == -1) {
        selectedWeaponClass.push(weaponClass);
      }
    } else {
      if (index != -1) {
        selectedWeaponClass.splice(index, 1);
      }
    }
    console.log("selectedWeaponClass ", selectedWeaponClass);
    setSelectWeaponClass(selectedWeaponClass);
    handlerFilter();
  };
  const onChangeWeaponStar = (checked, star) => {
    let index = selectedWeaponStar.findIndex(e => e == star);
    if (checked) {
      if (index == -1) {
        selectedWeaponStar.push(star);
      }
    } else {
      if (index != -1) {
        selectedWeaponStar.splice(index, 1);
      }
    }
    console.log("setSelectWeaponStar ", selectedWeaponStar);
    setSelectWeaponStar(selectedWeaponStar);
    handlerFilter();
  };
  const onChangeMin = e => {
    console.log("onChangeMin e ", e.target.value);
    if (e.target.value) {
      setPriceFrom(parseInt(e.target.value));
    } else {
      setPriceFrom(null);
    }
  };
  const onChangeMax = e => {
    console.log("onChangeMax e ", e.target.value);
    if (e.target.value) {
      setPriceTo(parseInt(e.target.value));
    } else {
      setPriceTo(null);
    }
  };
  let timeOutId;
  useEffect(() => {
    clearTimeout(timeOutId);
    timeOutId = setTimeout(() => {
      setPriceFromFilter(priceFrom);
    }, 500);
  }, [priceFrom]);
  useEffect(() => {
    clearTimeout(timeOutId);
    timeOutId = setTimeout(() => {
      setPriceToFilter(priceTo);
    }, 500);
  }, [priceTo]);
  useEffect(() => {
    handlerFilter();
  }, [priceFromFilter, priceToFilter]);
  const handlerFilter = () => {
    onFilter(selectedWeaponClass, selectedWeaponStar, priceFromFilter, priceToFilter);
  };
  const clearFilter = () => {
    setSelectWeaponStar([]);
    setSelectWeaponClass([]);
    setPriceFrom(null);
    setPriceTo(null);
    onFilter([], [], null, null);
  };

  const checkWeaponClassSelected = weaponClasse => {
    let index = selectedWeaponClass.findIndex(e => e == weaponClasse);
    return index != -1;
  };
  const checkWeaponStarSelected = star => {
    let index = selectedWeaponStar.findIndex(e => e == star);
    return index != -1;
  };
  return (
    <div style={{ paddingLeft: "20px", paddingRight: "50px" }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
        <span className="font-bold text-white text-lg">FILTER</span>
        <span className=" text-yellow-300 text-sm cursor-pointer" onClick={clearFilter}>
          Clear filter
        </span>
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
            <Checkbox
              onChange={e => onChangeWeaponClass(e.target.checked, WEAPON_CLASS.Sword)}
              checked={checkWeaponClassSelected(WEAPON_CLASS.Sword)}
            ></Checkbox>
            <img src={sword.src} width={"15px"} height="15px" style={{ marginLeft: "10px", marginRight: "10px" }} />
            <span className="text-white text-base">Sword</span>
          </Row>
          <Row style={{ marginTop: "15px" }}>
            <Checkbox
              onChange={e => onChangeWeaponClass(e.target.checked, WEAPON_CLASS.Bow)}
              checked={checkWeaponClassSelected(WEAPON_CLASS.Bow)}
            ></Checkbox>
            <img src={bow.src} width={"15px"} height="15px" style={{ marginLeft: "10px", marginRight: "10px" }} />
            <span className="text-white text-base">Bow</span>
          </Row>
          <Row style={{ marginTop: "15px" }}>
            <Checkbox
              onChange={e => onChangeWeaponClass(e.target.checked, WEAPON_CLASS.Staff)}
              checked={checkWeaponClassSelected(WEAPON_CLASS.Staff)}
            ></Checkbox>
            <img src={staff.src} width={"15px"} height="15px" style={{ marginLeft: "10px", marginRight: "10px" }} />
            <span className="text-white text-base">Staff</span>
          </Row>
        </Col>
        <Col style={{ marginTop: "30px" }}>
          <span className="text-lg font-semibold " style={{ color: "#F1CB8C" }}>
            Weapon star
          </span>
          <Row style={{ marginTop: "10px" }} align="middle">
            <Checkbox onChange={e => onChangeWeaponStar(e.target.checked, 1)} checked={checkWeaponStarSelected(1)} />
            <Rate count={1} value={1} style={{ fontSize: "20px", marginLeft: "10px", marginBottom: "3px" }} disabled />
          </Row>
          <Row style={{ marginTop: "10px" }} align="middle">
            <Checkbox onChange={e => onChangeWeaponStar(e.target.checked, 2)} checked={checkWeaponStarSelected(2)} />
            <Rate count={2} value={2} style={{ fontSize: "20px", marginLeft: "10px", marginBottom: "3px" }} disabled />
          </Row>
          <Row style={{ marginTop: "10px" }} align="middle">
            <Checkbox onChange={e => onChangeWeaponStar(e.target.checked, 3)} checked={checkWeaponStarSelected(3)} />
            <Rate count={3} value={3} style={{ fontSize: "20px", marginLeft: "10px", marginBottom: "3px" }} disabled />
          </Row>
        </Col>
        <Col className="mt-5">
          <span className="text-lg font-semibold " style={{ color: "#F1CB8C" }}>
            Price
          </span>
          <div className="flex items-center justify-between  mt-5">
            <div className="flex items-center">
              <span className="text-white text-lg mr-2">Min</span>
              <input
                onKeyPress={event => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                value={priceFrom || ""}
                onChange={onChangeMin}
                className="bg-[#1A1A1B] rounded-[4px] px-2 py-1 text-white border-white border-[1px] text-center w-[80px] "
              />
            </div>
            <div className="flex items-center">
              <span className="text-white text-lg mr-2">Max</span>
              <input
                onKeyPress={event => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                value={priceTo || ""}
                onChange={onChangeMax}
                className="bg-[#1A1A1B] rounded-[4px] px-2 py-1 text-white border-white border-[1px] text-center w-[80px] "
              />
            </div>
          </div>
        </Col>
      </Col>
    </div>
  );
}
