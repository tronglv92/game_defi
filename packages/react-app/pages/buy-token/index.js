import React, { useContext, useState } from "react";

import { Button, Input, Pagination } from "antd";

const NumericInput = props => {
  const { value, onChange } = props;

  const handleChange = e => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;

    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      onChange(inputValue);
    }
  }; // '.' at the end or only '-' in the input box.

  const handleBlur = () => {
    let valueTemp = value;

    if (value.charAt(value.length - 1) === "." || value === "-") {
      valueTemp = value.slice(0, -1);
    }

    onChange(valueTemp.replace(/0*(\d+)/, "$1"));
  };

  return <Input {...props} onChange={handleChange} onBlur={handleBlur} placeholder="Input a number" maxLength={25} />;
};

function BuyToken({ web3 }) {
  const [value, setValue] = useState("");
  return (
    <div className="max-w-screen-2xl mx-auto mt-8 flex flex-col">
      <div className="flex flex-row items-center justify-center mt-28">
        <span className="text-3xl text-white my-auto mr-12">Number Token</span>

        <NumericInput
          style={{
            width: 300,
            fontSize: 20,
          }}
          value={value}
          onChange={setValue}
        />
        <Button type="primary" className="ml-5">
          Buy Token
        </Button>
      </div>
    </div>
  );
}
export default BuyToken;
