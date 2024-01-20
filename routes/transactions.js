//add TRFs and approve trfs
//buyers -> TRF
//seller
//authenticator : Minsitry
//escrow : xrpl feature
//seller signs the transfer document -> escrow amount gets transfered to seller and property ka NFT gets owned by buyer

const express = require('express');
const router = express.Router();
// const { generateTransactionId } = require('../utils');
const xrpService = require('../services/xrpService');
const transactionService = require('../services/transactionService');

router.post('/initiate', async (req, res) => {
  try {
    //fetching buy details from frontend form details
    const { xrpAmount, propertyId } = req.body;

    //escrow account creation
    const escrowAccount = await xrpService.createEscrowAccount();

    // Generate unique transaction ID
    const transactionId = generateTransactionId();

    // Create transaction document
    const transaction = {
      _id: transactionId,
      buyerAddress: req.user.xrpAddress, 
      sellerAddress:
      propertyId,
      escrowAccount,
      xrpAmount,
      status: 'pending',
      signatures: [],
    };

    // Send XRP payment to escrow account
    try {
      await xrpService.sendXRPToEscrow(req.user.xrpAddress, escrowAccount, xrpAmount);
    } catch (error) {
      console.error('Payment error:', error);
      transaction.status = 'failed'; 
    }

    // Store transaction in MongoDB
    await transactionService.create(transaction);

    res.json({ transactionId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to initiate transaction' });
  }
});