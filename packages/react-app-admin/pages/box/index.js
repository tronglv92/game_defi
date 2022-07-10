import { Web3Consumer } from "../../helpers/connectAccount/Web3Context";
import React, { useContext } from "react";
import { useContractReader } from "eth-hooks";
import { Button, Card, Col, Divider, Pagination, Row } from "antd";
import { useRouter } from "next/router";
import { CREATE_BOX_PATH } from "../../constants/path";
function AdminBox({ web3 }) {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const router = useRouter();
  const onCreateBox = () => {
    router.push({
      pathname: CREATE_BOX_PATH,
    });
  };
  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };
  const renderItem = (item, index) => {
    return (
      <>
        <Divider style={{ margin: 0 }} />
        <div className={`${index % 2 == 0 ? "bg-white" : "bg-gray-50"} pr-5 pl-5 pt-5 pb-5`}>
          <Row gutter={[16, 16]} align="middle" key={index}>
            <Col span={2}>1012</Col>

            <Col span={4}>Sworld</Col>
            <Col span={4}>
              <img src="https://static.knightwar.io/staff/id1066_1214_1294.png" height={20} width={20} />
            </Col>
            <Col span={4}>0.01 eth</Col>
            <Col span={2}>true</Col>
            <Col span={2}>1000</Col>

            <Col span={6}>
              <p className="break-words">0xB6315C2D2f9186B5abEbA91e2cCC1C438458c1f5</p>
            </Col>
          </Row>
        </div>
      </>
    );
  };

  const renderHeadGrid = () => {
    return (
      <Row gutter={[16, 16]} className="pl-5 pr-5 pt-5 pb-5" align="middle" justify="center">
        <Col span={2} className="text-black font-bold">
          ID
        </Col>

        <Col span={4} className="text-black font-bold">
          Name
        </Col>
        <Col span={4} className="text-black font-bold">
          Image
        </Col>
        <Col span={4} className="text-black font-bold">
          Price
        </Col>
        <Col span={2} className="text-black font-bold">
          Minted
        </Col>
        <Col span={2} className="text-black font-bold">
          Token ID
        </Col>
        <Col span={6} className="text-black font-bold">
          Owner
        </Col>
      </Row>
    );
  };

  return (
    <>
      <Card bodyStyle={{ paddingRight: 0, paddingLeft: 0 }}>
        <Col>
          <Row className="ml-5 mr-5 flex">
            <Row className="flex-1">
              <Button type="primary" className="mr-5" onClick={onCreateBox}>
                Create Box
              </Button>
            </Row>
            <Pagination onShowSizeChange={onShowSizeChange} defaultCurrent={3} total={500} />
          </Row>
          <Divider style={{ margin: 0, marginTop: 30 }} />

          {renderHeadGrid()}
          {items.map((item, index) => {
            return renderItem(item, index);
          })}
          <Divider style={{ margin: 0, marginBottom: 30 }} />
          <Row justify="end" className="pr-5">
            <Pagination onShowSizeChange={onShowSizeChange} defaultCurrent={3} total={500} />
          </Row>
        </Col>
      </Card>
    </>
  );
}
export default Web3Consumer(AdminBox);
