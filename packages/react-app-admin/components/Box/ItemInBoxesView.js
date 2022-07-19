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

const ItemInBoxesView = props => {
  return (
    <Form.List
      name="itemInBoxes"
      rules={[
        {
          validator: async (_, itemInBoxes) => {
            console.log("value ", itemInBoxes);
            if (!itemInBoxes || itemInBoxes.length < 1) {
              return Promise.reject(new Error("At least 1 item in box"));
            }
            let sumPercent = 0;
            for (let i = 0; i < itemInBoxes.length; i++) {
              let percent = itemInBoxes[i].percent;

              if (percent != null) {
                sumPercent += percent;
              }
            }

            if (sumPercent != 100) {
              return Promise.reject(new Error("Sum percent item in box must be 100 "));
            }
            return Promise.resolve();
            // if (!abilities || abilities.length < 1) {
            //   return Promise.reject(new Error("At least 1 abilities"));
            // }
          },
        },
      ]}
    >
      {(fields, { add, remove }, { errors }) => (
        <>
          <Row align="middle" className="mt-16 mb-5">
            <p className="text-black font-bold text-3xl mb-0 mr-5 mt-0">Item In Box</p>
          </Row>

          <Divider style={{ marginTop: 0 }} />
          {fields.map((field, index) => {
            return (
              <Row key={field.key}>
                <Col span={12}>
                  <Form.Item
                    label={index == 0 ? "Level" : " "}
                    className="text-black font-bold"
                    name={[index, "level"]}
                  >
                    <Rate value={index + 1} disabled count={index + 1} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={"Percent"}
                    className="text-black font-bold"
                    name={[index, "percent"]}
                    rules={[
                      {
                        required: true,
                        message: "Please enter number",
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      max={100}
                      formatter={value => (value ? `${value}%` : "")}
                      parser={value => value.replace("%", "")}
                    />
                  </Form.Item>
                </Col>
              </Row>
            );
          })}
          <Form.ErrorList errors={errors} />
        </>
      )}
    </Form.List>
  );
};
export default ItemInBoxesView;
