const fs = require("fs");
const path = require("path");
const feHardhatContracts = "../../react-app/contracts/hardhat_contracts.json";
const beHardhatContracts = "../../backend/contracts/hardhat_contracts.json";

async function main() {
  const pathFe = path.join(__dirname, feHardhatContracts);
  const pathBe = path.join(__dirname, beHardhatContracts);

  fs.copyFile(pathFe, pathBe, (err) => {
    if (err) {
      console.log("Error Found:", err);
    }
  });
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
