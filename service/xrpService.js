// agreement residing on IPFs -> gets signed by buyer+seller
//sign verification 

const { Wallet } = require('xrpl.js');

async function createEscrowAccount() {
  const wallet = new Wallet('myEscrowWalletSeed'); // Replace with your escrow wallet seed
  const escrowAccount = await wallet.generateAddress();
  //logic for time based cancellation
  return escrowAccount;
}

async function sendXRPToEscrow(fromAddress, escrowAccount, amount) {
  const fromWallet = new Wallet('fromAddressSeed'); // Replace with sender's wallet seed
  const transaction = await xrpl.transaction.payment({
    account: fromAddress,
    destination: escrowAccount,
    amount: amount.toString(), //Amount in drops
    fee: '10', //Example fee
  });
  await fromWallet.sign(transaction);
  await xrpl.rippled.submit(transaction);
}
