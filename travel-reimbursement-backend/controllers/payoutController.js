exports.processPayout = async (req, res) => {
  const { upiId, name, amount } = req.body;

  try {
    // Simulated success response (instead of real Cashfree call)
    const fakeResponse = {
      transferId: `claim_${Date.now()}`,
      upiId,
      name,
      amount,
      status: "SUCCESS",
      message: "Payout simulated successfully",
    };

    console.log("✅ Simulated payout success:", fakeResponse);

    res.status(200).json({ success: true, data: fakeResponse });
  } catch (err) {
    console.error("❌ Simulated payout error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};



