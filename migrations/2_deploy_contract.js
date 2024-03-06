var CriminalDataSender = artifacts.require("CriminalDataSender");

module.exports = function(deployer) {
  deployer.deploy(CriminalDataSender);
};
