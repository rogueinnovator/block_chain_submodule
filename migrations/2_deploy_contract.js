var CriminalDataSender = artifacts.require("CriminalDataSender");

module.exports = function (deployer) {
  // const gasPrice = web3.utils.toWei("1", "gwei");
  deployer.deploy(CriminalDataSender);
};
