// // api.js
// const API_BASE = 'http://localhost:5000/api';

// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Avatar,
//   Paper,
//   Stack,
//   Button,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   DialogActions,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   CircularProgress,
//   Chip,
//   AppBar,
//   Toolbar,
//   Divider,
//   useTheme,
//   Tabs,
//   Tab,
//   Modal,
//   TextField,
//   LinearProgress,
//   Alert,
//   styled,
// } from "@mui/material";
// import {
//   FlightTakeoff as FlightTakeoffIcon,
//   CalendarToday as CalendarTodayIcon,
//   Info as InfoIcon,
//   PictureAsPdf,
//   Receipt,
//   Close as CloseIcon,
//   Logout as LogoutIcon,
//   CheckCircle,
//   Pending,
//   MonetizationOn,
//   ViewList,
//   Dashboard as DashboardIcon,
//   AccountBalanceWallet,
//   AccountBalance,
//   CheckCircle as CheckCircleIcon,
//   CreditCard,
//   AttachMoney,
// } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   fetchClaimsStart,
//   setSelectedClaim,
//   openReceiptDialog,
//   closeReceiptDialog,
//   requestReimbursementStart,
//   downloadPdfStart,
// } from "../../features/Employee/employeeClaimViewSlice";
// import { orange } from "@mui/material/colors";
// // Helper functions
// const formatDate = (dateStr) => {
//   const date = new Date(dateStr);
//   return isNaN(date)
//     ? "N/A"
//     : date.toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       });
// };

// const formatCurrency = (amount) =>
//   new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
//     amount
//   );

// const getTotalAmount = (expenses) =>
//   expenses?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;

// const getReceiptUrl = (path) =>
//   path ? `http://localhost:5000/${path.replace(/\\/g, "/")}` : null;

// const StatusChip = ({ status, reimbursementRequested }) => {
//   const statusMap = {
//     Pending: {
//       label: "Pending",
//       color: "warning",
//       icon: <Pending fontSize="small" />,
//     },
//     "Forwarded to Director": {
//       label: "Forwarded",
//       color: "info",
//       icon: <Pending fontSize="small" />,
//     },
//     "Director Approved": {
//       label: "Director Approved",
//       color: "primary",
//       icon: <CheckCircle fontSize="small" />,
//     },
//     "Director Rejected": {
//       label: "Director Rejected",
//       color: "error",
//       icon: <CloseIcon fontSize="small" />,
//     },
//     "Pending Review": {
//       label: "Pending Review",
//       color: "warning",
//       icon: <Pending fontSize="small" />,
//     },
//     "Reimbursement Requested": {
//       label: "Reimbursement Requested",
//       color: "warning",
//       icon: <MonetizationOn fontSize="small" />,
//     },
//     Approved: {
//       label: reimbursementRequested ? "Reimbursement Requested" : "Approved",
//       color: reimbursementRequested ? "warning" : "success",
//       icon: reimbursementRequested ? (
//         <MonetizationOn fontSize="small" />
//       ) : (
//         <CheckCircle fontSize="small" />
//       ),
//     },
//     Rejected: {
//       label: "Rejected",
//       color: "error",
//       icon: <CloseIcon fontSize="small" />,
//     },
//     Paid: {
//       label: "Paid",
//       color: "success",
//       icon: <MonetizationOn fontSize="small" />,
//     },
//   };

//   const config = statusMap[status] || {
//     label: status,
//     color: "default",
//     icon: <InfoIcon fontSize="small" />,
//   };

//   return (
//     <Chip
//       icon={config.icon}
//       label={config.label}
//       color={config.color}
//       size="small"
//       sx={{ fontWeight: 600 }}
//     />
//   );
// };

// const PaymentMethodCard = styled(Paper)(({ theme, selected }) => ({
//   padding: theme.spacing(2),
//   borderRadius: theme.shape.borderRadius,
//   cursor: "pointer",
//   transition: "all 0.2s",
//   border: `2px solid ${
//     selected ? theme.palette.primary.main : theme.palette.divider
//   }`,
//   backgroundColor: selected
//     ? theme.palette.primary.light
//     : theme.palette.background.paper,
//   "&:hover": {
//     borderColor: theme.palette.primary.main,
//   },
// }));

// const EmployeeClaimDashboard = () => {
//   const dispatch = useDispatch();
//   const {
//     claims,
//     loading,
//     error,

//     selectedClaim,
//     receiptDialog = { open: false, receipts: [], expenseType: "" }, // Default values
//   } = useSelector((state) => state.employeeClaim);
//   const user = useSelector((state) => state.auth.user);
//   const navigate = useNavigate();
//   const theme = useTheme();

//   const [viewMode, setViewMode] = useState("grid");
//   const [paymentModalOpen, setPaymentModalOpen] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [upiId, setUpiId] = useState("");
//   const [bankDetails, setBankDetails] = useState({
//     accountNumber: "",
//     ifscCode: "",
//     accountHolderName: "",
//   });
//   const [paymentProcessing, setPaymentProcessing] = useState(false);
//   const [paymentStatus, setPaymentStatus] = useState(null);
//   const [remarks, setRemarks] = useState("");

//   useEffect(() => {
//     dispatch(fetchClaimsStart());
//   }, [dispatch]);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     // Only fetch claims if authenticated
//     dispatch(fetchClaimsStart());
//   }, [dispatch, navigate]);

  
//   useEffect(() => {
//     console.log("Current receiptDialog state:", receiptDialog);
//   }, [receiptDialog]);
//   const showToast = (message, type = "success") => {
//     const toastConfig = {
//       position: "top-right",
//       autoClose: 4000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//     };

//     switch (type) {
//       case "success":
//         toast.success(message, toastConfig);
//         break;
//       case "error":
//         toast.error(message, toastConfig);
//         break;
//       case "info":
//         toast.info(message, toastConfig);
//         break;
//       default:
//         toast(message, toastConfig);
//     }
//   };

//   // eslint-disable-next-line no-unused-vars
//   const handleViewReceipts = (expense) => {
//     if (expense.receiptPath) {
//       dispatch(
//         openReceiptDialog({
//           receipts: [getReceiptUrl(expense.receiptPath)],
//           expenseType: expense.type,
//         })
//       );
//     } else {
//       showToast("No receipts available for this expense", "info");
//     }
//   };

//   const handlePDFDownload = (claim) => {
//     dispatch(downloadPdfStart({ claimId: claim._id }));
//   };

//   const handleReimbursementRequest = (claim) => {
//     dispatch(setSelectedClaim(claim));
//     setPaymentModalOpen(true);
//   };

//   const handleSubmitPaymentRequest = async () => {
//     if (!paymentMethod) {
//       showToast("Please select a payment method", "error");
//       return;
//     }

//     const payload = {
//       method: paymentMethod,
//       remarks,
//     };

//     if (paymentMethod === "UPI") {
//       payload.upiId = upiId;
//     } else if (paymentMethod === "Bank Transfer") {
//       payload.accountHolderName = bankDetails.accountHolderName;
//       payload.accountNumber = bankDetails.accountNumber;
//       payload.ifscCode = bankDetails.ifscCode;
//     }

//     try {
//       setPaymentProcessing(true);
//       setPaymentStatus("initiating");

//       dispatch(
//         requestReimbursementStart({
//           claimId: selectedClaim._id,
//           paymentDetails: payload,
//         })
//       );

//       setPaymentStatus("success");
//       showToast("Reimbursement request submitted!", "success");
//       setPaymentModalOpen(false);
//     } catch (error) {
//       setPaymentStatus("failed");
//       showToast(
//         error.response?.data?.error ||
//           "Failed to process reimbursement request",
//         "error"
//       );
//     } finally {
//       setPaymentProcessing(false);
//     }
//   };

//   const closePaymentModal = () => {
//     setPaymentModalOpen(false);
//     setPaymentMethod("");
//     setUpiId("");
//     setBankDetails({
//       accountNumber: "",
//       ifscCode: "",
//       accountHolderName: "",
//     });
//     setPaymentProcessing(false);
//     setPaymentStatus(null);
//     setRemarks("");
//   };

//   const openClaimDetails = (claim) => {
//     dispatch(setSelectedClaim(claim));
//   };

//   const closeClaimDetails = () => {
//     dispatch(setSelectedClaim(null));
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const getStatusCounts = () => {
//     const counts = {
//       total: claims.length,
//       approved: claims.filter(
//         (c) => c.status === "Approved" && !c.reimbursementRequested
//       ).length,
//       pending: claims.filter(
//         (c) => c.status === "Pending" || c.status === "Forwarded to Director"
//       ).length,
//       rejected: claims.filter((c) => c.status === "Rejected").length,
//       reimbursed: claims.filter((c) => c.reimbursementRequested).length,
//     };
//     return counts;
//   };

//   const renderPaymentModalContent = () => {
//     switch (paymentStatus) {
//       case "initiating":
//         return (
//           <Box sx={{ textAlign: "center", py: 4 }}>
//             <CircularProgress size={60} sx={{ mb: 2 }} />
//             <Typography variant="h6" gutterBottom>
//               Initiating Request...
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Preparing reimbursement request
//             </Typography>
//           </Box>
//         );
//       case "processing":
//         return (
//           <Box sx={{ textAlign: "center", py: 4 }}>
//             <CircularProgress size={60} sx={{ mb: 2 }} />
//             <Typography variant="h6" gutterBottom>
//               Processing Request...
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Please wait while we process your reimbursement request
//             </Typography>
//             <LinearProgress sx={{ mt: 2 }} />
//           </Box>
//         );
//       case "success":
//         return (
//           <Box sx={{ textAlign: "center", py: 4 }}>
//             <CheckCircleIcon
//               sx={{ fontSize: 60, color: "success.main", mb: 2 }}
//             />
//             <Typography variant="h6" gutterBottom>
//               Request Successful!
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               The reimbursement request has been submitted successfully.
//             </Typography>
//             <Box
//               sx={{ mt: 3, p: 2, bgcolor: "success.light", borderRadius: 2 }}
//             >
//               <Typography variant="subtitle2">
//                 Claim ID: {selectedClaim?._id}
//               </Typography>
//               <Typography variant="body2">
//                 Amount:{" "}
//                 {formatCurrency(getTotalAmount(selectedClaim?.expenses))}
//               </Typography>
//             </Box>
//             <Button
//               variant="contained"
//               onClick={closePaymentModal}
//               sx={{ mt: 3 }}
//             >
//               Close
//             </Button>
//           </Box>
//         );
//       case "failed":
//         return (
//           <Box sx={{ textAlign: "center", py: 4 }}>
//             <CheckCircleIcon
//               sx={{ fontSize: 60, color: "error.main", mb: 2 }}
//             />
//             <Typography variant="h6" gutterBottom>
//               Request Failed
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               There was an error processing your request. Please try again.
//             </Typography>
//             <Button
//               variant="contained"
//               onClick={() => setPaymentStatus(null)}
//               sx={{ mt: 3 }}
//             >
//               Try Again
//             </Button>
//           </Box>
//         );
//       default:
//         return (
//           <>
//             <Typography variant="subtitle1" fontWeight={600} mb={2}>
//               Select Payment Method for Reimbursement
//             </Typography>

//             <Grid container spacing={2} sx={{ mb: 3 }}>
//               <Grid item xs={12} sm={6}>
//                 <PaymentMethodCard
//                   selected={paymentMethod === "UPI"}
//                   onClick={() => setPaymentMethod("UPI")}
//                 >
//                   <Stack direction="row" alignItems="center" spacing={1} mb={1}>
//                     <AccountBalanceWallet
//                       color={paymentMethod === "UPI" ? "primary" : "action"}
//                     />
//                     <Typography fontWeight={600}>UPI Payment</Typography>
//                   </Stack>
//                   <Typography variant="body2" color="text.secondary">
//                     Receive payment directly to your UPI ID
//                   </Typography>
//                 </PaymentMethodCard>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <PaymentMethodCard
//                   selected={paymentMethod === "Bank Transfer"}
//                   onClick={() => setPaymentMethod("Bank Transfer")}
//                 >
//                   <Stack direction="row" alignItems="center" spacing={1} mb={1}>
//                     <AccountBalance
//                       color={
//                         paymentMethod === "Bank Transfer" ? "primary" : "action"
//                       }
//                     />
//                     <Typography fontWeight={600}>Bank Transfer</Typography>
//                   </Stack>
//                   <Typography variant="body2" color="text.secondary">
//                     Direct transfer to your bank account
//                   </Typography>
//                 </PaymentMethodCard>
//               </Grid>
//             </Grid>

//             {paymentMethod === "UPI" && (
//               <TextField
//                 label="Your UPI ID *"
//                 fullWidth
//                 sx={{ mb: 2 }}
//                 value={upiId}
//                 onChange={(e) => setUpiId(e.target.value)}
//                 placeholder="username@upi"
//                 helperText="Enter your UPI ID to receive payment"
//                 InputProps={{
//                   startAdornment: (
//                     <AccountBalanceWallet color="action" sx={{ mr: 1 }} />
//                   ),
//                 }}
//               />
//             )}

//             {paymentMethod === "Bank Transfer" && (
//               <>
//                 <TextField
//                   label="Account Holder Name *"
//                   fullWidth
//                   sx={{ mb: 2 }}
//                   value={bankDetails.accountHolderName}
//                   onChange={(e) =>
//                     setBankDetails((prev) => ({
//                       ...prev,
//                       accountHolderName: e.target.value,
//                     }))
//                   }
//                   InputProps={{
//                     startAdornment: (
//                       <AttachMoney color="action" sx={{ mr: 1 }} />
//                     ),
//                   }}
//                 />
//                 <TextField
//                   label="Account Number *"
//                   fullWidth
//                   sx={{ mb: 2 }}
//                   value={bankDetails.accountNumber}
//                   onChange={(e) =>
//                     setBankDetails({
//                       ...bankDetails,
//                       accountNumber: e.target.value,
//                     })
//                   }
//                   InputProps={{
//                     startAdornment: (
//                       <CreditCard color="action" sx={{ mr: 1 }} />
//                     ),
//                   }}
//                 />
//                 <TextField
//                   label="IFSC Code *"
//                   fullWidth
//                   sx={{ mb: 2 }}
//                   value={bankDetails.ifscCode}
//                   onChange={(e) =>
//                     setBankDetails({
//                       ...bankDetails,
//                       ifscCode: e.target.value,
//                     })
//                   }
//                   placeholder="e.g. SBIN0001234"
//                   InputProps={{
//                     startAdornment: (
//                       <AccountBalance color="action" sx={{ mr: 1 }} />
//                     ),
//                   }}
//                 />
//               </>
//             )}

//             <TextField
//               label="Remarks (Optional)"
//               fullWidth
//               multiline
//               rows={2}
//               value={remarks}
//               onChange={(e) => setRemarks(e.target.value)}
//               sx={{ mb: 2 }}
//               placeholder="Add any notes about this reimbursement request"
//             />

//             <Alert severity="info" sx={{ mb: 2 }}>
//               <Typography variant="body2">
//                 This will submit a reimbursement request to the office with your
//                 payment details. The office will process your payment based on
//                 the information provided.
//               </Typography>
//             </Alert>

//             <Box sx={{ display: "flex", gap: 2 }}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 onClick={closePaymentModal}
//                 sx={{ height: 48 }}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 fullWidth
//                 variant="contained"
//                 onClick={handleSubmitPaymentRequest}
//                 disabled={
//                   !paymentMethod ||
//                   (paymentMethod === "UPI" && !upiId) ||
//                   (paymentMethod === "Bank Transfer" &&
//                     (!bankDetails.accountNumber ||
//                       !bankDetails.ifscCode ||
//                       !bankDetails.accountHolderName)) ||
//                   paymentProcessing
//                 }
//                 sx={{
//                   backgroundColor: "primary.main",
//                   "&:hover": {
//                     backgroundColor: "primary.dark",
//                   },
//                   height: 48,
//                 }}
//               >
//                 {paymentProcessing ? (
//                   <CircularProgress size={24} color="inherit" />
//                 ) : (
//                   "Submit Request"
//                 )}
//               </Button>
//             </Box>
//           </>
//         );
//     }
//   };

//   const statusCounts = getStatusCounts();

//   if (loading && claims.length === 0) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         minHeight="80vh"
//       >
//         <CircularProgress size={60} thickness={4} />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           minHeight: "300px",
//           p: 4,
//           backgroundColor: "error.light",
//           color: "error.contrastText",
//           borderRadius: 2,
//           textAlign: "center",
//         }}
//       >
//         <Typography variant="h6" gutterBottom>
//           Error Loading Claims
//         </Typography>
//         <Typography variant="body1" sx={{ mb: 2 }}>
//           {error}
//         </Typography>
//         <Button
//           variant="contained"
//           color="error"
//           onClick={() => dispatch(fetchClaimsStart())}
//         >
//           Retry
//         </Button>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         backgroundColor: theme.palette.grey[50],
//         minHeight: "100vh",
//       }}
//     >
//       <ToastContainer
//         position="top-right"
//         autoClose={4000}
//         hideProgressBar={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />

//       {/* Receipt Viewer Dialog */}
//       <Dialog
//         open={receiptDialog.open || false}
//         onClose={() => dispatch(closeReceiptDialog())}
//         maxWidth="lg"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 2,
//             minHeight: "80vh",
//           },
//         }}
//       >
//         <DialogTitle
//           sx={{
//             backgroundColor: "primary.main",
//             color: "white",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <Box display="flex" alignItems="center" gap={2}>
//             <Receipt />
//             <Typography variant="h6" fontWeight={600}>
//               {receiptDialog.expenseType || "Expense"} Receipts
//             </Typography>
//           </Box>
//           <IconButton
//             onClick={() => dispatch(closeReceiptDialog())}
//             sx={{ color: "white" }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent sx={{ p: 0, height: "70vh" }}>
//           {!receiptDialog.receipts || receiptDialog.receipts.length === 0 ? (
//             <Box
//               display="flex"
//               flexDirection="column"
//               justifyContent="center"
//               alignItems="center"
//               height="100%"
//               p={4}
//             >
//               <Receipt sx={{ fontSize: 80, color: "grey.300", mb: 2 }} />
//               <Typography variant="h6" color="text.secondary">
//                 No receipts found for this expense
//               </Typography>
//             </Box>
//           ) : (
//             <Box
//               sx={{
//                 flex: 1,
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <img
//                 src={receiptDialog.receipts[0]}
//                 alt="Receipt"
//                 style={{
//                   maxWidth: "100%",
//                   maxHeight: "100%",
//                   objectFit: "contain",
//                 }}
//               />
//             </Box>
//           )}
//         </DialogContent>

//         <DialogActions sx={{ p: 2, justifyContent: "center" }}>
//           <Button
//             onClick={() => dispatch(closeReceiptDialog())}
//             variant="contained"
//             color="primary"
//           >
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Payment Request Modal */}
//       <Modal open={paymentModalOpen} onClose={closePaymentModal}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: { xs: "90%", sm: 500 },
//             bgcolor: "background.paper",
//             p: 3,
//             borderRadius: 2,
//             boxShadow: 24,
//             outline: "none",
//           }}
//         >
//           <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//             <Typography variant="h6" fontWeight="bold">
//               Request Reimbursement
//             </Typography>
//             <IconButton onClick={closePaymentModal} size="small">
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <Typography variant="subtitle2" color="text.secondary" mb={2}>
//             For: {selectedClaim?.employeeName} (
//             {formatCurrency(getTotalAmount(selectedClaim?.expenses))})
//           </Typography>

//           {renderPaymentModalContent()}
//         </Box>
//       </Modal>

//       {/* Claim Detail Dialog */}
//       {selectedClaim && (
//         <Dialog
//           open={!!selectedClaim}
//           onClose={closeClaimDetails}
//           maxWidth="md"
//           fullWidth
//           PaperProps={{
//             sx: {
//               borderRadius: 3,
//               overflow: "hidden",
//             },
//           }}
//         >
//           <DialogTitle
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               bgcolor: "primary.main",
//               color: "white",
//               fontWeight: 600,
//               py: 2,
//             }}
//           >
//             <Box display="flex" alignItems="center">
//               <InfoIcon sx={{ mr: 1 }} />
//               Claim Details
//             </Box>
//             <IconButton
//               onClick={closeClaimDetails}
//               sx={{
//                 color: "white",
//                 "&:hover": {
//                   backgroundColor: "rgba(255,255,255,0.1)",
//                 },
//               }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>
//           <DialogContent dividers sx={{ p: 3 }}>
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 mb: 2,
//                 flexDirection: { xs: "column", sm: "row" },
//               }}
//             >
//               <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                 <Avatar
//                   sx={{
//                     bgcolor: theme.palette.primary.main,
//                     width: 56,
//                     height: 56,
//                     fontSize: 24,
//                     fontWeight: 600,
//                   }}
//                 >
//                   {selectedClaim.employeeName
//                     .split(" ")
//                     .map((n) => n[0])
//                     .join("")}
//                 </Avatar>
//                 <Box>
//                   <Typography fontWeight={700} variant="h6">
//                     {selectedClaim.employeeName}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {selectedClaim.employeeId} • {selectedClaim.department} •{" "}
//                     {selectedClaim.company}
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     Submitted on {formatDate(selectedClaim.createdAt)}
//                   </Typography>
//                 </Box>
//               </Box>
//               <Box
//                 display="flex"
//                 flexDirection="column"
//                 alignItems={{ xs: "flex-start", sm: "flex-end" }}
//                 mt={{ xs: 2, sm: 0 }}
//                 gap={1}
//               >
//                 <StatusChip
//                   status={selectedClaim.status}
//                   reimbursementRequested={selectedClaim.reimbursementRequested}
//                 />
//               </Box>
//             </Box>

//             <Divider sx={{ my: 2 }} />

//             <Grid container spacing={2}>
//               <Grid item xs={12} md={6}>
//                 <Paper
//                   variant="outlined"
//                   sx={{
//                     p: 2,
//                     borderRadius: 2,
//                     height: "90%",
//                     borderColor: theme.palette.divider,
//                   }}
//                 >
//                   <Stack spacing={1.5}>
//                     <Box display="flex" alignItems="center" gap={1.5}>
//                       <FlightTakeoffIcon fontSize="small" color="primary" />
//                       <Box>
//                         <Typography variant="caption" color="text.secondary">
//                           Travel Route
//                         </Typography>
//                         <Typography>
//                           {selectedClaim.travelFrom} → {selectedClaim.travelTo}
//                         </Typography>
//                       </Box>
//                     </Box>
//                     <Box display="flex" alignItems="center" gap={1.5}>
//                       <CalendarTodayIcon fontSize="small" color="primary" />
//                       <Box>
//                         <Typography variant="caption" color="text.secondary">
//                           Travel Dates
//                         </Typography>
//                         <Typography>
//                           {formatDate(selectedClaim.travelDate)} to{" "}
//                           {formatDate(selectedClaim.returnDate)}
//                         </Typography>
//                       </Box>
//                     </Box>
//                     <Box display="flex" alignItems="flex-start" gap={1.5}>
//                       <InfoIcon
//                         fontSize="small"
//                         color="primary"
//                         sx={{ mt: 0.5 }}
//                       />
//                       <Box>
//                         <Typography variant="caption" color="text.secondary">
//                           Purpose
//                         </Typography>
//                         <Typography>{selectedClaim.purpose}</Typography>
//                       </Box>
//                     </Box>
//                   </Stack>
//                 </Paper>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <Paper
//                   variant="outlined"
//                   sx={{
//                     p: 2,
//                     borderRadius: 2,
//                     borderColor: theme.palette.divider,
//                   }}
//                 >
//                   <Typography
//                     variant="subtitle1"
//                     fontWeight={600}
//                     gutterBottom
//                     color="primary"
//                   >
//                     Expense Details
//                   </Typography>
//                   <Table size="small">
//                     <TableHead>
//                       <TableRow>
//                         <TableCell sx={{ fontWeight: 600, pl: 0 }}>
//                           Type
//                         </TableCell>
//                         <TableCell sx={{ fontWeight: 600 }}>
//                           Description
//                         </TableCell>
//                         <TableCell sx={{ fontWeight: 600 }} align="right">
//                           Amount
//                         </TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {selectedClaim.expenses.map((exp, i) => (
//                         <TableRow key={i} hover>
//                           <TableCell sx={{ pl: 0 }}>{exp.type}</TableCell>
//                           <TableCell>{exp.description || "-"}</TableCell>
//                           <TableCell align="right">
//                             {formatCurrency(exp.amount)}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                       <TableRow>
//                         <TableCell
//                           colSpan={2}
//                           sx={{
//                             fontWeight: 600,
//                             pl: 0,
//                             borderTop: `1px solid ${theme.palette.divider}`,
//                           }}
//                         >
//                           Total Claim Amount
//                         </TableCell>
//                         <TableCell
//                           align="right"
//                           sx={{
//                             fontWeight: 700,
//                             borderTop: `1px solid ${theme.palette.divider}`,
//                             color: theme.palette.primary.main,
//                           }}
//                         >
//                           {formatCurrency(
//                             getTotalAmount(selectedClaim.expenses)
//                           )}
//                         </TableCell>
//                       </TableRow>
//                     </TableBody>
//                   </Table>
//                 </Paper>
//               </Grid>
//             </Grid>

//             <Box mt={3} display="flex" gap={2} flexWrap="wrap">
//               <Button
//                 variant="outlined"
//                 startIcon={<Receipt />}
//                 onClick={() => {
//                   const receiptPath = selectedClaim.expenses.find(
//                     (e) => e.receiptPath
//                   )?.receiptPath;
//                   if (receiptPath) {
//                     dispatch(
//                       openReceiptDialog({
//                         receipts: [getReceiptUrl(receiptPath)],
//                         expenseType:
//                           selectedClaim.expenses.find((e) => e.receiptPath)
//                             ?.type || "Expense",
//                       })
//                     );
//                   }
//                 }}
//                 disabled={!selectedClaim.expenses.some((e) => e.receiptPath)}
//                 sx={{
//                   borderRadius: 2,
//                   px: 3,
//                   textTransform: "none",
//                 }}
//               >
//                 View Receipts
//               </Button>

//               {selectedClaim.status === "Approved" &&
//                 !selectedClaim.reimbursementRequested && (
//                   <>
//                     <Button
//                       variant="outlined"
//                       startIcon={<PictureAsPdf />}
//                       onClick={() => handlePDFDownload(selectedClaim)}
//                       sx={{
//                         borderRadius: 2,
//                         px: 3,
//                         textTransform: "none",
//                       }}
//                     >
//                       Download PDF
//                     </Button>

//                     <Button
//                       variant="contained"
//                       color="success"
//                       onClick={() => handleReimbursementRequest(selectedClaim)}
//                       sx={{
//                         borderRadius: 2,
//                         px: 3,
//                         textTransform: "none",
//                         background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
//                         boxShadow: "none",
//                         "&:hover": {
//                           boxShadow: theme.shadows[2],
//                         },
//                       }}
//                     >
//                       Request Reimbursement
//                     </Button>
//                   </>
//                 )}
//             </Box>
//           </DialogContent>
//         </Dialog>
//       )}

//       <AppBar
//         position="static"
//         sx={{
//           background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
//           boxShadow: "none",
//           mb: 2,
//         }}
//       >
//         <Toolbar
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             maxWidth: 1800,
//             margin: "0 auto",
//             width: "100%",
//             px: 3,
//           }}
//         >
//           <Box display="flex" alignItems="center">
//             <MonetizationOn sx={{ mr: 1, fontSize: 32 }} />
//             <Typography variant="h6" fontWeight="bold">
//               Travel Expense Claim Portal
//             </Typography>
//           </Box>
//           <Box display="flex" alignItems="center" gap={2}>
//             <Chip
//               avatar={
//                 <Avatar sx={{ bgcolor: "white" }}>
//                   {user?.username?.charAt(0)}
//                 </Avatar>
//               }
//               label={`Hi, ${user?.username?.split(" ")[0] || "User"}`}
//               variant="outlined"
//               sx={{
//                 color: "white",
//                 borderColor: "rgba(255,255,255,0.5)",
//                 fontWeight: 600,
//               }}
//             />
//             <Button
//               onClick={handleLogout}
//               startIcon={<LogoutIcon />}
//               sx={{
//                 color: "#fff",
//                 fontWeight: 600,
//                 borderRadius: 2,
//                 px: 2,
//                 border: "1px solid rgba(255,255,255,0.3)",
//                 "&:hover": {
//                   background: "rgba(255,255,255,0.1)",
//                   borderColor: "rgba(255,255,255,0.5)",
//                 },
//               }}
//             >
//               Logout
//             </Button>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       <Box
//         sx={{
//           maxWidth: 1600,
//           margin: "0 auto",
//           px: { xs: 2, md: 4 },
//           pb: 4,
//         }}
//       >
//         <Box sx={{ mb: 4 }}>
//           <Typography
//             variant="h4"
//             gutterBottom
//             fontWeight={700}
//             sx={{
//               color: theme.palette.text.primary,
//               mb: 3,
//             }}
//           >
//             My Expense Claims
//           </Typography>
//           <Grid container spacing={3} sx={{ mb: 3 }}>
//             <Grid item xs={6} sm={3}>
//               <Paper
//                 sx={{
//                   p: 2,
//                   borderRadius: 3,
//                   borderLeft: `5px solid ${theme.palette.primary.main}`,
//                   boxShadow: theme.shadows[2],
//                 }}
//               >
//                 <Typography variant="subtitle2" color="text.secondary">
//                   Total Claims
//                 </Typography>
//                 <Typography variant="h4" fontWeight={700}>
//                   {statusCounts.total}
//                 </Typography>
//               </Paper>
//             </Grid>
//             <Grid item xs={6} sm={3}>
//               <Paper
//                 sx={{
//                   p: 2,
//                   borderRadius: 3,
//                   borderLeft: `4px solid ${theme.palette.success.main}`,
//                   boxShadow: theme.shadows[2],
//                 }}
//               >
//                 <Typography variant="subtitle2" color="text.secondary">
//                   Approved
//                 </Typography>
//                 <Typography variant="h4" fontWeight={700} color="success.main">
//                   {statusCounts.approved}
//                 </Typography>
//               </Paper>
//             </Grid>
//             <Grid item xs={6} sm={3}>
//               <Paper
//                 sx={{
//                   p: 2,
//                   borderRadius: 3,
//                   borderLeft: `4px solid ${theme.palette.warning.main}`,
//                   boxShadow: theme.shadows[2],
//                 }}
//               >
//                 <Typography variant="subtitle2" color="text.secondary">
//                   Pending
//                 </Typography>
//                 <Typography variant="h4" fontWeight={700} color="warning.main">
//                   {statusCounts.pending}
//                 </Typography>
//               </Paper>
//             </Grid>
//             <Grid item xs={6} sm={3}>
//               <Paper
//                 sx={{
//                   p: 2,
//                   borderRadius: 3,
//                   borderLeft: `4px solid ${theme.palette.error.main}`,
//                   boxShadow: theme.shadows[2],
//                 }}
//               >
//                 <Typography variant="subtitle2" color="text.secondary">
//                   Rejected
//                 </Typography>
//                 <Typography variant="h4" fontWeight={700} color="error.main">
//                   {statusCounts.rejected}
//                 </Typography>
//               </Paper>
//             </Grid>
//           </Grid>

//           <Box
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//             mb={3}
//           >
//             <Button
//               variant="contained"
//               onClick={() => navigate("/employee/claim")}
//               sx={{
//                 background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
//                 boxShadow: "none",
//                 borderRadius: 2,
//                 px: 3,
//                 textTransform: "none",
//               }}
//             >
//               Create New Claim
//             </Button>

//             <Tabs
//               value={viewMode}
//               onChange={(e, newValue) => setViewMode(newValue)}
//               sx={{
//                 "& .MuiTabs-indicator": {
//                   backgroundColor: theme.palette.primary.main,
//                 },
//               }}
//             >
//               <Tab
//                 value="grid"
//                 icon={<DashboardIcon />}
//                 label="Grid View"
//                 sx={{ minHeight: 48 }}
//               />
//               <Tab
//                 value="list"
//                 icon={<ViewList />}
//                 label="List View"
//                 sx={{ minHeight: 48 }}
//               />
//             </Tabs>
//           </Box>
//         </Box>

//         {claims.length === 0 ? (
//           <Paper
//             sx={{
//               p: 4,
//               textAlign: "center",
//               borderRadius: 3,
//               boxShadow: theme.shadows[1],
//             }}
//           >
//             <Typography variant="h6" color="text.secondary" gutterBottom>
//               No claims submitted yet
//             </Typography>
//             <Typography sx={{ mb: 3 }}>
//               You haven't submitted any travel expense claims. Click below to
//               create a new claim.
//             </Typography>
//             <Button
//               variant="contained"
//               size="large"
//               onClick={() => navigate("/employee/claim")}
//               sx={{
//                 background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
//                 boxShadow: "none",
//               }}
//             >
//               Create New Claim
//             </Button>
//           </Paper>
//         ) : viewMode === "grid" ? (
//           <Grid container spacing={3}>
//             {claims.map((claim) => (
//               <Grid item xs={12} sm={6} md={4} key={claim._id}>
//                 <Card
//                   elevation={2}
//                   sx={{
//                     height: "100%",
//                     borderRadius: 3,
//                     boxShadow: theme.shadows[2],
//                     transition: "all 0.3s ease-in-out",
//                     "&:hover": {
//                       boxShadow: theme.shadows[6],
//                     },
//                     display: "flex",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <CardContent sx={{ flexGrow: 1 }}>
//                     <Box display="flex" alignItems="center" gap={2} mb={2}>
//                       <Avatar
//                         sx={{
//                           bgcolor: theme.palette.primary.main,
//                           width: 48,
//                           height: 48,
//                           fontSize: 18,
//                           fontWeight: 600,
//                         }}
//                       >
//                         {claim.employeeName
//                           .split(" ")
//                           .map((n) => n[0])
//                           .join("")}
//                       </Avatar>
//                       <Box>
//                         <Typography fontWeight={700} variant="subtitle1">
//                           {claim.employeeName}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           {claim.department}
//                         </Typography>
//                       </Box>
//                     </Box>

//                     <Box mb={2}>
//                       <StatusChip
//                         status={claim.status}
//                         reimbursementRequested={claim.reimbursementRequested}
//                       />
//                     </Box>

//                     <Box display="flex" justifyContent="space-between" mb={1}>
//                       <Typography variant="caption" color="text.secondary">
//                         Travel Dates
//                       </Typography>
//                       <Typography variant="body2">
//                         {formatDate(claim.travelDate)} -{" "}
//                         {formatDate(claim.returnDate)}
//                       </Typography>
//                     </Box>

//                     <Box display="flex" justifyContent="space-between" mb={1}>
//                       <Typography variant="caption" color="text.secondary">
//                         Route
//                       </Typography>
//                       <Typography variant="body2">
//                         {claim.travelFrom} → {claim.travelTo}
//                       </Typography>
//                     </Box>

//                     <Box display="flex" justifyContent="space-between" mb={2}>
//                       <Typography variant="caption" color="text.secondary">
//                         Total Amount
//                       </Typography>
//                       <Typography
//                         variant="body1"
//                         fontWeight={600}
//                         color="primary"
//                       >
//                         {formatCurrency(getTotalAmount(claim.expenses))}
//                       </Typography>
//                     </Box>

//                     <Divider sx={{ my: 1 }} />

//                     <Typography variant="caption" color="text.secondary">
//                       Submitted on {formatDate(claim.createdAt)}
//                     </Typography>
//                   </CardContent>

//                   <Box sx={{ p: 2, pt: 0 }}>
//                     <Button
//                       fullWidth
//                       variant="outlined"
//                       size="small"
//                       startIcon={<InfoIcon />}
//                       onClick={() => openClaimDetails(claim)}
//                       sx={{ mb: 1, borderRadius: 2 }}
//                     >
//                       View Details
//                     </Button>

//                     {claim.status === "Approved" &&
//                       !claim.reimbursementRequested && (
//                         <Button
//                           fullWidth
//                           variant="contained"
//                           size="small"
//                           color="success"
//                           onClick={() => handleReimbursementRequest(claim)}
//                           sx={{ borderRadius: 2 }}
//                         >
//                           Request Reimbursement
//                         </Button>
//                       )}
//                   </Box>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         ) : (
//           <Grid container spacing={3}>
//             {claims.map((claim) => (
//               <Grid item xs={12} key={claim._id}>
//                 <Card
//                   elevation={0}
//                   sx={{
//                     borderRadius: 3,
//                     border: `1px solid ${theme.palette.divider}`,
//                     "&:hover": {
//                       boxShadow: theme.shadows[4],
//                       transform: "translateY(-2px)",
//                       transition: "all 0.3s ease",
//                     },
//                   }}
//                 >
//                   <CardContent>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         mb: 2,
//                         flexDirection: { xs: "column", sm: "row" },
//                       }}
//                     >
//                       <Box
//                         sx={{ display: "flex", alignItems: "center", gap: 2 }}
//                       >
//                         <Avatar
//                           sx={{
//                             bgcolor: theme.palette.primary.main,
//                             width: 56,
//                             height: 56,
//                             fontSize: 24,
//                             fontWeight: 600,
//                           }}
//                         >
//                           {claim.employeeName
//                             .split(" ")
//                             .map((n) => n[0])
//                             .join("")}
//                         </Avatar>
//                         <Box>
//                           <Typography fontWeight={700} variant="h6">
//                             {claim.employeeName}
//                           </Typography>
//                           <Typography variant="body2" color="text.secondary">
//                             {claim.employeeId} • {claim.department} •{" "}
//                             {claim.company}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary">
//                             Submitted on {formatDate(claim.createdAt)}
//                           </Typography>
//                         </Box>
//                       </Box>
//                       <Box
//                         display="flex"
//                         flexDirection="column"
//                         alignItems={{ xs: "flex-start", sm: "flex-end" }}
//                         mt={{ xs: 2, sm: 0 }}
//                         gap={1}
//                       >
//                         <StatusChip
//                           status={claim.status}
//                           reimbursementRequested={claim.reimbursementRequested}
//                         />
//                       </Box>
//                     </Box>

//                     <Divider sx={{ my: 2 }} />

//                     <Grid container spacing={2}>
//                       <Grid item xs={12} md={6}>
//                         <Paper
//                           variant="outlined"
//                           sx={{
//                             p: 2,
//                             borderRadius: 2,
//                             height: "90%",
//                             borderColor: theme.palette.divider,
//                           }}
//                         >
//                           <Stack spacing={1.5}>
//                             <Box display="flex" alignItems="center" gap={1.5}>
//                               <FlightTakeoffIcon
//                                 fontSize="small"
//                                 color="primary"
//                               />
//                               <Box>
//                                 <Typography
//                                   variant="caption"
//                                   color="text.secondary"
//                                 >
//                                   Travel Route
//                                 </Typography>
//                                 <Typography>
//                                   {claim.travelFrom} → {claim.travelTo}
//                                 </Typography>
//                               </Box>
//                             </Box>
//                             <Box display="flex" alignItems="center" gap={1.5}>
//                               <CalendarTodayIcon
//                                 fontSize="small"
//                                 color="primary"
//                               />
//                               <Box>
//                                 <Typography
//                                   variant="caption"
//                                   color="text.secondary"
//                                 >
//                                   Travel Dates
//                                 </Typography>
//                                 <Typography>
//                                   {formatDate(claim.travelDate)} to{" "}
//                                   {formatDate(claim.returnDate)}
//                                 </Typography>
//                               </Box>
//                             </Box>
//                             <Box
//                               display="flex"
//                               alignItems="flex-start"
//                               gap={1.5}
//                             >
//                               <InfoIcon
//                                 fontSize="small"
//                                 color="primary"
//                                 sx={{ mt: 0.5 }}
//                               />
//                               <Box>
//                                 <Typography
//                                   variant="caption"
//                                   color="text.secondary"
//                                 >
//                                   Purpose
//                                 </Typography>
//                                 <Typography>{claim.purpose}</Typography>
//                               </Box>
//                             </Box>
//                           </Stack>
//                         </Paper>
//                       </Grid>

//                       <Grid item xs={12} md={6}>
//                         <Paper
//                           variant="outlined"
//                           sx={{
//                             p: 2,
//                             borderRadius: 2,
//                             borderColor: theme.palette.divider,
//                           }}
//                         >
//                           <Typography
//                             variant="subtitle1"
//                             fontWeight={600}
//                             gutterBottom
//                             color="primary"
//                           >
//                             Expense Details
//                           </Typography>
//                           <Table size="small">
//                             <TableHead>
//                               <TableRow>
//                                 <TableCell sx={{ fontWeight: 600, pl: 0 }}>
//                                   Type
//                                 </TableCell>
//                                 <TableCell sx={{ fontWeight: 600 }}>
//                                   Description
//                                 </TableCell>
//                                 <TableCell
//                                   sx={{ fontWeight: 600 }}
//                                   align="right"
//                                 >
//                                   Amount
//                                 </TableCell>
//                               </TableRow>
//                             </TableHead>
//                             <TableBody>
//                               {claim.expenses.map((exp, i) => (
//                                 <TableRow key={i} hover>
//                                   <TableCell
//                                     sx={{
//                                       fontWeight: 700,
//                                       color: orange[600],
//                                       pl: 0,
//                                     }}
//                                   >
//                                     {exp.type}
//                                   </TableCell>
//                                   <TableCell>
//                                     {exp.description || "-"}
//                                   </TableCell>
//                                   <TableCell align="right">
//                                     {formatCurrency(exp.amount)}
//                                   </TableCell>
//                                 </TableRow>
//                               ))}
//                               <TableRow>
//                                 <TableCell
//                                   colSpan={2}
//                                   sx={{
//                                     fontWeight: 600,
//                                     pl: 0,
//                                     borderTop: `1px solid ${theme.palette.divider}`,
//                                   }}
//                                 >
//                                   Total Claim Amount
//                                 </TableCell>
//                                 <TableCell
//                                   align="right"
//                                   sx={{
//                                     fontWeight: 700,
//                                     borderTop: `1px solid ${theme.palette.divider}`,
//                                     color: theme.palette.primary.main,
//                                   }}
//                                 >
//                                   {formatCurrency(
//                                     getTotalAmount(claim.expenses)
//                                   )}
//                                 </TableCell>
//                               </TableRow>
//                             </TableBody>
//                           </Table>
//                         </Paper>
//                       </Grid>
//                     </Grid>

//                     <Box mt={3} display="flex" gap={2} flexWrap="wrap">
//                       <Button
//                         variant="outlined"
//                         startIcon={<Receipt />}
//                         onClick={() => {
//                           const receiptPath = claim.expenses.find(
//                             (e) => e.receiptPath
//                           )?.receiptPath;
//                           if (receiptPath) {
//                             dispatch(
//                               openReceiptDialog({
//                                 receipts: [getReceiptUrl(receiptPath)],
//                                 expenseType: claim.expenses.find(
//                                   (e) => e.receiptPath
//                                 )?.type,
//                               })
//                             );
//                           }
//                         }}
//                         disabled={!claim.expenses.some((e) => e.receiptPath)}
//                         sx={{
//                           borderRadius: 2,
//                           px: 3,
//                           textTransform: "none",
//                         }}
//                       >
//                         View Receipts
//                       </Button>

//                       {claim.status === "Approved" &&
//                         !claim.reimbursementRequested && (
//                           <>
//                             <Button
//                               variant="outlined"
//                               startIcon={<PictureAsPdf />}
//                               onClick={() => handlePDFDownload(claim)}
//                               sx={{
//                                 borderRadius: 2,
//                                 px: 3,
//                                 textTransform: "none",
//                               }}
//                             >
//                               Download PDF
//                             </Button>

//                             <Button
//                               variant="contained"
//                               color="success"
//                               onClick={() => handleReimbursementRequest(claim)}
//                               sx={{
//                                 borderRadius: 2,
//                                 px: 3,
//                                 textTransform: "none",
//                                 background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
//                                 boxShadow: "none",
//                                 "&:hover": {
//                                   boxShadow: theme.shadows[2],
//                                 },
//                               }}
//                             >
//                               Request Reimbursement
//                             </Button>
//                           </>
//                         )}
//                     </Box>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default EmployeeClaimDashboard;
