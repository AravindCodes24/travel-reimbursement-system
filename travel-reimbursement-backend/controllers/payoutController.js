// controllers/payoutController.js
const axios = require('axios');

exports.processPayout = async (req, res) => {
  const { upiId, name, amount } = req.body;

  try {
    const result = await axios.post(
      'https://payout-api.cashfree.com/payout/v1/requestTransfer',
      {
        transferId: `claim_${Date.now()}`,
        amount,
        upi: upiId,
        name,
        transferMode: 'upi',
        remarks: 'Travel Reimbursement'
      },
      {
        headers: {
          'X-Client-Id': process.env.CASHFREE_CLIENT_ID,
          'X-Client-Secret': process.env.CASHFREE_SECRET_KEY,
          'Content-Type': 'application/json',
          'x-api-version': '2022-01-01'
        }
      }
    );

    res.status(200).json({ success: true, data: result.data });
  } catch (err) {
    console.error('Cashfree Payout Error:', err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.response?.data || err.message });
  }
};


