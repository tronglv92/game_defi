import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  notification,
  Pagination,
  Rate,
  Row,
  Select,
  Slider,
  Switch,
  Upload,
} from "antd";

const StatWeaponView = props => {
  return (
    <Col>
      <p className="text-black font-bold text-3xl  mt-16">Stat Weapon</p>
      <Divider style={{ marginTop: 0 }} />
      <Form.Item name="statId" className="invisible h-0">
        <div />
      </Form.Item>
      <Form.Item
        label="Damage"
        name="damage"
        className="text-black font-bold"
        rules={[
          {
            required: true,
            message: "Please enter damage",
          },
        ]}
      >
        <InputNumber
          style={{
            width: 200,
          }}
          stringMode
        />
        {/* <Slider defaultValue={100} max={1000} min={1} /> */}
      </Form.Item>
      <Form.Item
        label="Speed"
        name="speed"
        className="text-black font-bold"
        rules={[
          {
            required: true,
            message: "Please enter speed",
          },
        ]}
      >
        <InputNumber
          style={{
            width: 200,
          }}
          stringMode
        />
      </Form.Item>
      <Form.Item
        label="HP"
        name="hp"
        className="text-black font-bold"
        rules={[
          {
            required: true,
            message: "Please enter hp",
          },
        ]}
      >
        <InputNumber
          style={{
            width: 200,
          }}
          stringMode
        />
        {/* <Slider defaultValue={30} max={100} min={0} /> */}
      </Form.Item>
      <Form.Item
        label="Critical"
        name="critical"
        className="text-black font-bold"
        rules={[
          {
            required: true,
            message: "Please enter critical",
          },
        ]}
      >
        <InputNumber
          style={{
            width: 200,
          }}
          stringMode
        />
        {/* <Slider defaultValue={11} max={100} min={1} /> */}
      </Form.Item>
    </Col>
  );
};
export default StatWeaponView;
