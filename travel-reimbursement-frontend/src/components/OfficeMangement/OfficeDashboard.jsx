import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  Avatar,
  Typography,
  Chip,
  Button,
  Modal,
  TextField,
  IconButton,
  Paper,
  Stack,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Badge,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchOfficeClaims } from "../../features/office/officeSlice";
import { markClaimAsPaidApi } from "../../features/office/officeApi";
import { useSnackbar } from "notistack";
import {
  CalendarMonth as CalendarMonthIcon,
  Payment as PaymentIcon,
  Close as CloseIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  FilterAlt as FilterIcon,
  Clear as ClearIcon,
  Dashboard as DashboardIcon,
  ViewList,
  Paid as PaidIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

import { motion } from "framer-motion";

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 700,
  textTransform: "uppercase",
  fontSize: "0.7rem",
  ...(status === "Approved" && {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  }),
  ...(status === "Rejected" && {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  }),
  ...(status === "Reimbursement Requested" && {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  }),
  ...((status === "Pending" || status === "Pending Review") && {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  }),
  ...(status === "Paid" && {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  }),
}));

const OfficeDashboard = () => {
  const dispatch = useDispatch();
  const { claims, loading } = useSelector((state) => state.office);
  const { enqueueSnackbar } = useSnackbar();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptImage, setReceiptImage] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [filters, setFilters] = useState({
    status: "",
    department: "",
    dateRange: "",
    amountRange: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    dispatch(fetchOfficeClaims());
  }, [dispatch]);

  const handleOpenModal = (claim) => {
    setSelectedClaim(claim);
    setModalOpen(true);
    setPaymentStatus(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedClaim(null);
    setPaymentProcessing(false);
    setPaymentStatus(null);
    setRemarks("");
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      department: "",
      dateRange: "",
      amountRange: "",
    });
  };

  // Add this to your payment processing function (handleProcessPayment)
  const handleProcessPayment = async () => {
    if (!remarks?.trim()) {
      enqueueSnackbar("Please add payment remarks", { variant: "error" });
      return;
    }

    const reimbursementInfo = selectedClaim?.reimbursementInfo;
    if (!reimbursementInfo) {
      enqueueSnackbar("Reimbursement info missing for this claim", {
        variant: "error",
      });
      return;
    }

    const paymentMethod = reimbursementInfo.method;
    const bankDetails = reimbursementInfo.bankDetails || {};

    // 🔍 Validate Bank Transfer
    if (paymentMethod === "Bank Transfer") {
      const { accountNumber, ifscCode, accountHolderName } = bankDetails;
      if (!accountNumber || !ifscCode || !accountHolderName) {
        enqueueSnackbar("Employee's bank details are incomplete", {
          variant: "error",
        });
        return;
      }
    }

    // Validate UPI
    if (paymentMethod === "UPI") {
      const upiId = reimbursementInfo?.upiId; // FIXED

      if (!upiId) {
        enqueueSnackbar("Employee must submit their UPI ID", {
          variant: "error",
        });
        return;
      }

      const upiRegex = /^[\w.-]+@[a-zA-Z]+$/;
      if (!upiRegex.test(upiId)) {
        enqueueSnackbar("Invalid UPI ID format", { variant: "error" });
        return;
      }
    }

    setPaymentProcessing(true);
    setPaymentStatus("processing");

    try {
      const totalAmount = getTotalAmount(selectedClaim.expenses);

      const payoutPayload = {
        amount: totalAmount,
        remarks: remarks.trim(),
        method: paymentMethod,
        employeeName: selectedClaim.employeeName,
        employeeId: selectedClaim.employeeId,
        claimId: selectedClaim._id,
        bankDetails: {
          ...(paymentMethod === "UPI" && { upiId: reimbursementInfo.upiId }),
        },
      };

      // Send payout request
      const payoutRes = await axios.post("/api/payouts/process", payoutPayload);

      if (payoutRes.data.success) {
        const payoutData = payoutRes.data.data;
        const payoutId =
          payoutData.transferId || payoutData.referenceId || "N/A";

        // Mark claim as paid
        const updateRes = await markClaimAsPaidApi(selectedClaim._id, {
          paymentMethod,
          remarks: remarks.trim(),
          transactionId: payoutId,
          paymentDate: new Date().toISOString(),
          bankDetails: {
            ...bankDetails,
            ...(paymentMethod === "UPI" && { upiId: bankDetails.upiId }),
          },
        });

        if (updateRes.success) {
          enqueueSnackbar(`✅ Payment successful! TXN ID: ${payoutId}`, {
            variant: "success",
            autoHideDuration: 5000,
          });
          setPaymentStatus("success");
          dispatch(fetchOfficeClaims());
        } else {
          throw new Error("Payment succeeded, but claim status update failed.");
        }
      } else {
        throw new Error(payoutRes.data.error || "Payout failed.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setPaymentStatus("failed");
      enqueueSnackbar(
        err?.response?.data?.message || err.message || "Payment error occurred",
        { variant: "error", autoHideDuration: 4000 }
      );
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleViewReceipt = (path) => {
    setReceiptImage(path.replace("uploads\\", "/uploads/"));
    setReceiptOpen(true);
  };

  const getTotalAmount = (expenses) =>
    expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  const getStatusLabel = (status) => {
    switch (status) {
      case "Approved":
        return "APPROVED";
      case "Rejected":
        return "REJECTED";
      case "Reimbursement Requested":
        return "REIMBURSEMENT REQUESTED";
      case "Pending":
        return "PENDING REVIEW";
      case "Paid":
        return "PAID";
      default:
        return status.toUpperCase();
    }
  };

  // Filter and categorize claims
  const filteredClaims = claims.filter((claim) => {
    // Apply status filter
    if (filters.status && claim.status !== filters.status) return false;

    // Apply department filter
    if (filters.department && claim.department !== filters.department)
      return false;

    // Apply date range filter
    if (filters.dateRange) {
      const claimDate = new Date(claim.travelDate);
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);

      if (filters.dateRange === "last30" && claimDate < thirtyDaysAgo)
        return false;
      if (filters.dateRange === "last90") {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(now.getDate() - 90);
        if (claimDate < ninetyDaysAgo) return false;
      }
    }

    // Apply amount range filter
    if (filters.amountRange) {
      const totalAmount = getTotalAmount(claim.expenses);
      if (filters.amountRange === "lt5k" && totalAmount >= 5000) return false;
      if (filters.amountRange === "gt5k" && totalAmount < 5000) return false;
    }

    return true;
  });

  // Categorize filtered claims
  const pendingClaims = filteredClaims.filter(
    (claim) => claim.status === "Reimbursement Requested"
  );
  const processedClaims = filteredClaims.filter(
    (claim) => claim.status === "Paid" || claim.status === "Rejected"
  );

  // Get unique departments for filter dropdown
  const departments = [...new Set(claims.map((claim) => claim.department))];

  const renderPaymentStatus = () => {
    switch (paymentStatus) {
      case "processing":
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Processing Payment...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we process the payment
            </Typography>
            <LinearProgress sx={{ mt: 2 }} />
          </Box>
        );
      case "success":
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CheckCircleIcon
              sx={{ fontSize: 60, color: "success.main", mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              Payment Successful!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The reimbursement has been processed successfully.
            </Typography>
            <Box
              sx={{ mt: 3, p: 2, bgcolor: "success.light", borderRadius: 2 }}
            >
              <Typography variant="subtitle2">
                Transaction ID:{" "}
                {selectedClaim?.paymentDetails?.transactionId ||
                  `PAY-${Date.now()}`}
              </Typography>
              <Typography variant="body2">
                Amount: ₹
                {getTotalAmount(selectedClaim?.expenses || []).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                Method: {selectedClaim?.paymentDetails?.method}
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={handleCloseModal}
              sx={{ mt: 3 }}
            >
              Close
            </Button>
          </Box>
        );
      case "failed":
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CheckCircleIcon
              sx={{ fontSize: 60, color: "error.main", mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              Payment Failed
            </Typography>
            <Typography variant="body2" color="text.secondary">
              There was an error processing the payment. Please try again.
            </Typography>
            <Button
              variant="contained"
              onClick={() => setPaymentStatus(null)}
              sx={{ mt: 3 }}
            >
              Try Again
            </Button>
          </Box>
        );
      default:
        return (
          <>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Payment Details
            </Typography>

            {selectedClaim?.paymentDetails && (
              <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }} variant="outlined">
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  Employee Payment Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {selectedClaim.paymentDetails.method === "UPI" && (
                  <>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        Payment Method
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        UPI Transfer
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        UPI ID
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedClaim.paymentDetails.upiId}
                      </Typography>
                    </Box>
                  </>
                )}

                {selectedClaim?.reimbursementInfo?.method === "UPI" && (
                  <>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        Payment Method
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        UPI Transfer
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        UPI ID
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedClaim.reimbursementInfo.upiId ||
                          "Not provided"}
                      </Typography>
                    </Box>
                  </>
                )}

                {selectedClaim.paymentDetails.method === "Bank Transfer" && (
                  <>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        Payment Method
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        Bank Transfer
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        Account Holder
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedClaim.paymentDetails.accountHolderName}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        Account Number
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedClaim.paymentDetails.accountNumber}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        IFSC Code
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedClaim.paymentDetails.ifscCode}
                      </Typography>
                    </Box>
                  </>
                )}

                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    Requested On
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {new Date(selectedClaim.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Paper>
            )}

            <TextField
              label="Payment Remarks *"
              fullWidth
              multiline
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              sx={{ mb: 3 }}
              placeholder="Add payment processing notes"
              helperText="This will be recorded in the payment history"
            />

            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                This action will mark the claim as paid and record the payment
                details.
              </Typography>
            </Alert>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleCloseModal}
                sx={{ height: 48 }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleProcessPayment}
                disabled={!remarks || paymentProcessing}
                sx={{
                  backgroundColor: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  height: 48,
                }}
                startIcon={
                  paymentProcessing ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <PaidIcon />
                  )
                }
              >
                {paymentProcessing ? "Processing..." : "Confirm Payment"}
              </Button>
            </Box>
          </>
        );
    }
  };

  const renderClaimsGrid = (claims) => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (claims.length === 0) {
      return (
        <Paper
          sx={{
            p: 8,
            textAlign: "center",
            borderRadius: 3,
            boxShadow: "none",
            bgcolor: "background.paper",
          }}
        >
          <Box sx={{ maxWidth: 400, mx: "auto" }}>
            <CheckCircleIcon
              sx={{ fontSize: 80, color: "success.main", mb: 2 }}
            />
            <Typography
              variant="h5"
              fontWeight={600}
              color="text.secondary"
              gutterBottom
            >
              No claims found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {activeTab === "pending"
                ? "No pending reimbursement claims"
                : "No processed reimbursement claims"}
            </Typography>
          </Box>
        </Paper>
      );
    }

    return (
      <Grid container spacing={3}>
        {claims.map((claim) => (
          <Grid item xs={12} sm={6} md={4} key={claim._id}>
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ p: 3, flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          width: 56,
                          height: 56,
                        }}
                      >
                        {claim.employeeName?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          {claim.employeeName}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="text.primary"
                        >
                          {claim.department}
                        </Typography>
                      </Box>
                    </Box>
                    <StatusChip
                      status={claim.status}
                      label={getStatusLabel(claim.status)}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Stack spacing={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <CalendarMonthIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            <strong>Travel:</strong> {claim.travelFrom} →{" "}
                            {claim.travelTo}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <CalendarMonthIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            <strong>Dates:</strong>{" "}
                            {new Date(claim.travelDate).toLocaleDateString()} -{" "}
                            {new Date(claim.returnDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <ReceiptIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            <strong>Receipts:</strong>{" "}
                            {claim.expenses.filter((e) => e.receiptPath).length}
                            /{claim.expenses.length}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Box>

                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Total Claim Amount
                  </Typography>
                  <Typography variant="h5" color="primary" fontWeight={700}>
                    ₹{getTotalAmount(claim.expenses).toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ReceiptIcon />}
                    onClick={() => {
                      if (claim.expenses.some((e) => e.receiptPath)) {
                        handleViewReceipt(
                          claim.expenses.find((e) => e.receiptPath)?.receiptPath
                        );
                      }
                    }}
                    disabled={!claim.expenses.some((e) => e.receiptPath)}
                    sx={{ mb: 1 }}
                  >
                    View Receipts
                  </Button>

                  {activeTab === "pending" ? (
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<PaymentIcon />}
                      onClick={() => handleOpenModal(claim)}
                      sx={{
                        backgroundColor: "primary.main",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                      }}
                    >
                      Process Payment
                    </Button>
                  ) : (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", textAlign: "center", mt: 1 }}
                    >
                      Processed on:{" "}
                      {new Date(
                        claim.paidAt || claim.rejectedAt
                      ).toLocaleDateString()}
                    </Typography>
                  )}
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderClaimsList = (claims) => {
    if (loading) {
      return <LinearProgress sx={{ my: 2 }} />;
    }

    if (claims.length === 0) {
      return (
        <Paper
          sx={{
            p: 8,
            textAlign: "center",
            borderRadius: 3,
            boxShadow: "none",
            bgcolor: "background.paper",
          }}
        >
          <Box sx={{ maxWidth: 400, mx: "auto" }}>
            <CheckCircleIcon
              sx={{ fontSize: 80, color: "success.main", mb: 2 }}
            />
            <Typography
              variant="h5"
              fontWeight={600}
              color="text.secondary"
              gutterBottom
            >
              No claims found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {activeTab === "pending"
                ? "No pending reimbursement claims"
                : "No processed reimbursement claims"}
            </Typography>
          </Box>
        </Paper>
      );
    }

    return (
      <Grid container spacing={3}>
        {claims.map((claim) => (
          <Grid item xs={12} key={claim._id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                overflow: "visible",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{ bgcolor: "primary.main", width: 56, height: 56 }}
                    >
                      {claim.employeeName?.[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        {claim.employeeName}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="text.primary"
                      >
                        {claim.employeeId} • {claim.department} •{" "}
                        {claim.company}
                      </Typography>
                    </Box>
                  </Box>
                  <StatusChip
                    status={claim.status}
                    label={getStatusLabel(claim.status)}
                  />
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Stack spacing={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <CalendarMonthIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            <strong>Travel:</strong> {claim.travelFrom} →{" "}
                            {claim.travelTo}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <CalendarMonthIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            <strong>Dates:</strong>{" "}
                            {new Date(claim.travelDate).toLocaleDateString()} -{" "}
                            {new Date(claim.returnDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <ReceiptIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            <strong>Receipts:</strong>{" "}
                            {claim.expenses.filter((e) => e.receiptPath).length}
                            /{claim.expenses.length}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, borderRadius: 2, height: "90%" }}
                    >
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        Expense Summary
                      </Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="right">
                              Amount
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {claim.expenses.map((exp, i) => (
                            <TableRow key={i}>
                              <TableCell>{exp.type}</TableCell>
                              <TableCell align="right">
                                ₹{exp.amount.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow sx={{ "& td": { borderBottom: "none" } }}>
                            <TableCell sx={{ fontWeight: 600 }}>
                              Total
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              ₹{getTotalAmount(claim.expenses).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Paper>
                  </Grid>
                </Grid>

                {claim.paymentDetails && (
                  <Paper
                    sx={{ p: 2, mb: 3, borderRadius: 2 }}
                    variant="outlined"
                  >
                    <Typography variant="subtitle2" fontWeight={600} mb={1}>
                      Employee Payment Information
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        Method
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {claim.paymentDetails.method}
                      </Typography>
                    </Box>
                    {claim.paymentDetails.method === "UPI" && (
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          UPI ID
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {claim.paymentDetails.upiId}
                        </Typography>
                      </Box>
                    )}
                    {claim.paymentDetails.method === "Bank Transfer" && (
                      <>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          mb={1}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Account Holder
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {claim.paymentDetails.accountHolderName}
                          </Typography>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          mb={1}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Account Number
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {claim.paymentDetails.accountNumber}
                          </Typography>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          mb={1}
                        >
                          <Typography variant="body2" color="text.secondary">
                            IFSC Code
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {claim.paymentDetails.ifscCode}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Paper>
                )}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<ReceiptIcon />}
                    onClick={() => {
                      if (claim.expenses.some((e) => e.receiptPath)) {
                        handleViewReceipt(
                          claim.expenses.find((e) => e.receiptPath)?.receiptPath
                        );
                      }
                    }}
                    disabled={!claim.expenses.some((e) => e.receiptPath)}
                  >
                    View Receipts
                  </Button>

                  {activeTab === "pending" ? (
                    <Button
                      variant="contained"
                      startIcon={<PaymentIcon />}
                      onClick={() => handleOpenModal(claim)}
                      sx={{
                        backgroundColor: "primary.main",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                      }}
                    >
                      Process Payment
                    </Button>
                  ) : (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Processed on:{" "}
                        {new Date(
                          claim.paidAt || claim.rejectedAt
                        ).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Office Reimbursement Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Process employee travel expense claims
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "primary.main",
              color: "white",
            }}
          >
            <Typography variant="subtitle2">TOTAL CLAIMS</Typography>
            <Typography variant="h4" fontWeight={700}>
              {claims.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "warning.main",
              color: "white",
            }}
          >
            <Typography variant="subtitle2">PENDING CLAIMS</Typography>
            <Typography variant="h4" fontWeight={700}>
              {pendingClaims.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "success.main",
              color: "white",
            }}
          >
            <Typography variant="subtitle2">PROCESSED CLAIMS</Typography>
            <Typography variant="h4" fontWeight={700}>
              {processedClaims.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "secondary.main",
              color: "white",
            }}
          >
            <Typography variant="subtitle2">TOTAL AMOUNT PENDING</Typography>
            <Typography variant="h4" fontWeight={700}>
              ₹
              {pendingClaims
                .reduce((sum, claim) => sum + getTotalAmount(claim.expenses), 0)
                .toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filter and Tabs Section */}
      <Paper sx={{ mb: 3, p: 2, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{ minHeight: 48 }}
          >
            <Tab
              label={
                <Badge
                  badgeContent={pendingClaims.length}
                  color="warning"
                  sx={{ mr: 1 }}
                >
                  Pending Claims
                </Badge>
              }
              value="pending"
              sx={{ fontWeight: 600, minHeight: 48 }}
            />
            <Tab
              label={
                <Badge
                  badgeContent={processedClaims.length}
                  color="success"
                  sx={{ mr: 1 }}
                >
                  Processed Claims
                </Badge>
              }
              value="processed"
              sx={{ fontWeight: 600, minHeight: 48 }}
            />
          </Tabs>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant={viewMode === "grid" ? "contained" : "outlined"}
              onClick={() => setViewMode("grid")}
              startIcon={<DashboardIcon />}
              sx={{ height: 48 }}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "contained" : "outlined"}
              onClick={() => setViewMode("list")}
              startIcon={<ViewList />}
              sx={{ height: 48 }}
            >
              List
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ height: 48 }}
            >
              Filters
            </Button>
          </Box>
        </Box>

        {showFilters && (
          <Box
            sx={{ mt: 3, p: 3, bgcolor: "background.default", borderRadius: 2 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    label="Status"
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="Reimbursement Requested">
                      Reimbursement Requested
                    </MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Paid">Paid</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="department"
                    value={filters.department}
                    onChange={handleFilterChange}
                    label="Department"
                  >
                    <MenuItem value="">All Departments</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Date Range</InputLabel>
                  <Select
                    name="dateRange"
                    value={filters.dateRange}
                    onChange={handleFilterChange}
                    label="Date Range"
                  >
                    <MenuItem value="">All Dates</MenuItem>
                    <MenuItem value="last30">Last 30 Days</MenuItem>
                    <MenuItem value="last90">Last 90 Days</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Amount Range</InputLabel>
                  <Select
                    name="amountRange"
                    value={filters.amountRange}
                    onChange={handleFilterChange}
                    label="Amount Range"
                  >
                    <MenuItem value="">All Amounts</MenuItem>
                    <MenuItem value="lt5k">Less than ₹5,000</MenuItem>
                    <MenuItem value="gt5k">₹5,000 and above</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={resetFilters}
                sx={{ mr: 2 }}
              >
                Reset
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Claims List */}
      {activeTab === "pending"
        ? viewMode === "grid"
          ? renderClaimsGrid(pendingClaims)
          : renderClaimsList(pendingClaims)
        : viewMode === "grid"
        ? renderClaimsGrid(processedClaims)
        : renderClaimsList(processedClaims)}

      {/* Payment Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
            boxShadow: 24,
            outline: "none",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Process Payment
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="subtitle2" color="text.secondary" mb={2}>
            For: {selectedClaim?.employeeName} (₹
            {selectedClaim
              ? getTotalAmount(selectedClaim.expenses).toLocaleString()
              : 0}
            )
          </Typography>

          {renderPaymentStatus()}
        </Box>
      </Modal>

      {/* Receipt Modal */}
      <Dialog
        open={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "primary.main",
            color: "white",
            fontWeight: 600,
          }}
        >
          Receipt Preview
          <IconButton
            aria-label="close"
            onClick={() => setReceiptOpen(false)}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ minHeight: 500, p: 0 }}>
          {receiptImage ? (
            <img
              src={receiptImage}
              alt="Receipt"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "500px",
                objectFit: "contain",
              }}
            />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 300,
                color: "text.secondary",
              }}
            >
              <ReceiptIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography>No receipt available</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default OfficeDashboard;
