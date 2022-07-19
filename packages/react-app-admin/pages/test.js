import axios from "axios";
import { Web3Consumer } from "../helpers/connectAccount/Web3Context";
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
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 20,
    },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 20,
      offset: 4,
    },
  },
};
const onFinish = values => {
  console.log("Received values of form:", values);
};
function test({ web3 }) {
  const avatarUpload = file => {
    console.log("file ", file);
    const data = new FormData();
    data.append("file", file);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post("http://localhost:8000/upload/upload", data, config)
      .then(res => {
        console.log("res", res);
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <>
      <Form name="dynamic_form_item" {...formItemLayoutWithOutLabel} onFinish={onFinish}>
        <Form.List
          name="names"
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 2) {
                  return Promise.reject(new Error("At least 2 passengers"));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => {
                console.log("field ", field);
                return (
                  <div key={field.key}>
                    <Row>
                      <Form.Item label="Name" name={[index, "name"]} className="text-black font-bold">
                        <Input
                          placeholder=" name"
                          style={{
                            width: "60%",
                          }}
                        />
                      </Form.Item>
                      <Form.Item label="Description" name={[index, "description"]} className="text-black font-bold">
                        <Input
                          placeholder="description"
                          style={{
                            width: "60%",
                          }}
                        />
                      </Form.Item>
                    </Row>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined className="dynamic-delete-button" onClick={() => remove(field.name)} />
                    ) : null}
                  </div>
                );
              })}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{
                    width: "60%",
                  }}
                  icon={<PlusOutlined />}
                >
                  Add field
                </Button>
                <Button
                  type="dashed"
                  onClick={() => {
                    add("The head item", 0);
                  }}
                  style={{
                    width: "60%",
                    marginTop: "20px",
                  }}
                  icon={<PlusOutlined />}
                >
                  Add field at head
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
export default Web3Consumer(test);
