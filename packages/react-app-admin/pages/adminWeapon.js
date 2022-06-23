import { Web3Consumer } from "../helpers/Web3Context";
import React, { useContext } from "react";
import { useContractReader } from "eth-hooks";
import { Button, Col, Row } from "antd";
function AdminWeapon({ web3 }) {
  return (
    <>
      <div className="p-4">
        <Row>
          <Button type="primary" shape="round" className="mr-2">
            Create Weapon
          </Button>
          <Button type="primary" shape="round">
            Upload Market
          </Button>
        </Row>
      </div>
    </>
  );
}
export default Web3Consumer(AdminWeapon);
