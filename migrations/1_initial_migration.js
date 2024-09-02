var Migrations = artifacts.require("./Migrations.sol");
module.exports = function (deployer) {
  // const gasPrice = web3.utils.toWei("1", "gwei");
  deployer.deploy(Migrations,);
};
