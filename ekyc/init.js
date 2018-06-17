var web3 = require('web3');
fs = require('fs');
solc  = require('solc');

web3 = new web3(new web3.providers.HttpProvider("http://localhost:8545"));
code = fs.readFileSync('eKYC.sol').toString();

//contract = web3.eth.compile.solidity(code);
contract = solc.compile(code);
//console.log(contract);

function after2Delay() {
    //contractInstance = kycContract.at(deployedContract.address);
    //console.log(contractInstance.address);
}

function afterDelay() {
    abiDefinition = JSON.parse(contract.contracts[':eKYC'].interface);
    byteCode = contract.contracts[':eKYC'].bytecode;
    kycContract = new web3.eth.Contract(abiDefinition);
    //deployedContract = kycContract.new({data: byteCode, from: web3.eth.accounts[0], gas: 4700000});
    kycContract.deploy({data: byteCode}).send({from: "0xc86706a49cffc025ed90be2a9fc58a690637f99e", gas: 4700000}).then((result) => {deployedContract = result; console.log(deployedContract.options.address);});
    //setTimeout(after2Delay, 3000);
}

setTimeout(afterDelay, 8000);
