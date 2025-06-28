import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  Avatar,
  Chip,
  Divider,
  Button,
  IconButton,
  Card,
  CardContent,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  PendingActions,
  ForwardToInbox,
  Paid,
  Receipt,
  Logout,
  Download,
  ZoomIn,
  ZoomOut,
  RotateLeft,
  RotateRight,
  FlightTakeoff,
  Hotel,
  Restaurant,
  DirectionsCar,
  Train,
  Business,
  AttachMoney,
  LocationOn,
  CalendarToday,
  Description,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchPendingClaimsStart,
  rejectClaimStart,
  forwardClaimStart,
  setClaimFilter,
} from "../../features/hr/hrClaimSlice";
import { logout } from "../../features/auth/authSlice";

// Utility functions
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return isNaN(date)
    ? "N/A"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const totalAmount = (expenses) =>
  expenses?.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0) || 0;

// Status Chip Component
const StatusChip = ({ status }) => {
  const statusMap = {
    Pending: { color: "warning", label: "Pending Approval" },
    Forwarded: { color: "primary", label: "Forwarded to Director" },
    Approved: { color: "success", label: "Approved" },
    Rejected: { color: "error", label: "Rejected" },
    Paid: { color: "success", label: "Paid" },
  };

  const config = statusMap[status] || { color: "default", label: status };

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      sx={{ fontWeight: 600 }}
    />
  );
};

// Receipt Viewer Component (extracted for better organization)
const ReceiptViewer = ({ open, onClose, receipts, expenseType }) => {
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));
  const handleRotateLeft = () => setRotation((prev) => prev - 90);
  const handleRotateRight = () => setRotation((prev) => prev + 90);

  const resetView = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleDownload = (receiptUrl, filename) => {
    const link = document.createElement("a");
    link.href = receiptUrl;
    link.download = filename || "receipt";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (!open) {
      setSelectedReceipt(null);
      resetView();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: "80vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Receipt />
          <Typography variant="h6" fontWeight={600}>
            {expenseType} Receipts
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <Cancel />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, height: "70vh" }}>
        {!receipts || receipts.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100%"
            p={4}
          >
            <Receipt sx={{ fontSize: 80, color: "grey.300", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No receipts found for this expense
            </Typography>
          </Box>
        ) : (
          <Box display="flex" height="100%">
            <Box
              sx={{
                width: 300,
                borderRight: "1px solid #e0e0e0",
                overflow: "auto",
                p: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Receipts ({receipts.length})
              </Typography>
              {receipts.map((receipt, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 1,
                    mb: 2,
                    cursor: "pointer",
                    border:
                      selectedReceipt === index
                        ? "2px solid primary.main"
                        : "1px solid #e0e0e0",
                    borderRadius: 1,
                  }}
                  onClick={() => setSelectedReceipt(index)}
                >
                  <Box
                    sx={{
                      height: 120,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={receipt.url || receipt}
                      alt={`Receipt ${index + 1}`}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1}
                  >
                    <Typography variant="body2">Receipt {index + 1}</Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(
                          receipt.url || receipt,
                          `receipt_${index + 1}`
                        );
                      }}
                    >
                      <Download fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </Box>

            <Box sx={{ flex: 1, p: 2 }}>
              {selectedReceipt !== null ? (
                <>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      Receipt {selectedReceipt + 1} of {receipts.length}
                    </Typography>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Zoom Out">
                        <IconButton
                          onClick={handleZoomOut}
                          disabled={zoom <= 0.5}
                        >
                          <ZoomOut />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reset View">
                        <Button onClick={resetView} size="small">
                          {Math.round(zoom * 100)}%
                        </Button>
                      </Tooltip>
                      <Tooltip title="Zoom In">
                        <IconButton onClick={handleZoomIn} disabled={zoom >= 3}>
                          <ZoomIn />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Rotate Left">
                        <IconButton onClick={handleRotateLeft}>
                          <RotateLeft />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Rotate Right">
                        <IconButton onClick={handleRotateRight}>
                          <RotateRight />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton
                          onClick={() =>
                            handleDownload(
                              receipts[selectedReceipt].url ||
                                receipts[selectedReceipt],
                              `receipt_${selectedReceipt + 1}`
                            )
                          }
                        >
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      height: "calc(100% - 40px)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "grey.100",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={
                        receipts[selectedReceipt].url ||
                        receipts[selectedReceipt]
                      }
                      alt={`Receipt ${selectedReceipt + 1}`}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        transform: `scale(${zoom}) rotate(${rotation}deg)`,
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </Box>
                </>
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                  color="text.secondary"
                >
                  <Typography variant="h6" mb={2}>
                    Select a receipt to view
                  </Typography>
                  <Typography variant="body2">
                    Click on a receipt from the left panel
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Claim Card Component
const ClaimCard = ({
  claim,
  onViewReceipts,
  onForward,
  onReject,
  actionLoading,
}) => {
  const getExpenseIcon = (type) => {
    const iconProps = { sx: { fontSize: 16, color: "primary.main", mr: 1 } };
    switch (type.toLowerCase()) {
      case "flight":
        return <FlightTakeoff {...iconProps} />;
      case "hotel":
        return <Hotel {...iconProps} />;
      case "food":
        return <Restaurant {...iconProps} />;
      case "transport":
        return <DirectionsCar {...iconProps} />;
      case "train":
        return <Train {...iconProps} />;
      case "registration":
        return <Business {...iconProps} />;
      default:
        return <AttachMoney {...iconProps} />;
    }
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                backgroundColor: "primary.main",
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {claim.employeeName?.charAt(0) || "E"}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {claim.employeeName}
              </Typography>
              <Box display="flex" gap={1} mt={0.5}>
                <Chip
                  label={`ID: ${claim.employeeId}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={claim.department}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
          <StatusChip status={claim.status} />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Travel Info with Headings */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle2"
              color="secondary"
              fontWeight={700}
            >
              From → To
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
              <LocationOn color="primary" />
              <Typography variant="body1" fontWeight={500}>
                {claim.travelFrom} → {claim.travelTo}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle2"
              color="secondary"
              fontWeight={700}
            >
              Travel Dates
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
              <CalendarToday color="primary" />
              <Typography variant="body1">
                {formatDate(claim.travelDate)} - {formatDate(claim.returnDate)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle2"
              color="secondary"
              fontWeight={700}
            >
              Purpose
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
              <Description color="primary" />
              <Typography variant="body1" fontWeight={500}>
                {claim.purpose}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="subtitle1" fontWeight={600} mb={2} color="primary">
          Expense Breakdown
        </Typography>

        <Grid container spacing={2} mb={2}>
          {claim.expenses?.map((exp, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  "&:hover": {
                    transform: "scale(1.02)",
                    transition: "transform 0.2s",
                  },
                }}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  {getExpenseIcon(exp.type)}
                  <Typography variant="subtitle2" fontWeight={600}>
                    {exp.type}
                  </Typography>
                  {exp.receiptPath && (
                    <IconButton
                      size="small"
                      onClick={() => onViewReceipts(exp)}
                      sx={{ ml: "auto" }}
                    >
                      <Receipt fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  {exp.description}
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary">
                  ₹{parseFloat(exp.amount).toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            Total Amount:
          </Typography>
          <Typography variant="h5" fontWeight={700} color="success.main">
            ₹{totalAmount(claim.expenses).toLocaleString()}
          </Typography>
        </Box>

        {claim.status === "Pending" && (
          <Box display="flex" gap={2} mt={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={
                actionLoading === claim._id + "Forwarded" ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <ForwardToInbox />
                )
              }
              onClick={() => onForward(claim._id)}
              disabled={actionLoading === claim._id + "Forwarded"}
              sx={{ py: 1.5, fontWeight: 600 }}
            >
              Forward to Director
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={
                actionLoading === claim._id + "Rejected" ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Cancel />
                )
              }
              onClick={() => onReject(claim._id)}
              disabled={actionLoading === claim._id + "Rejected"}
              sx={{ py: 1.5, fontWeight: 600 }}
            >
              Reject
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Main Component
const HrClaimApprovalDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pendingClaims, loading, error, filter } = useSelector(
    (state) => state.hrClaim
  );

  const [receiptDialog, setReceiptDialog] = useState({
    open: false,
    receipts: [],
    expenseType: "",
  });
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    dispatch(fetchPendingClaimsStart());
  }, [dispatch]);

  const handleViewReceipts = (expense) => {
    if (expense.receiptPath) {
      const receiptUrl = `http://localhost:5000/${expense.receiptPath.replace(
        /\\/g,
        "/"
      )}`;
      setReceiptDialog({
        open: true,
        receipts: [receiptUrl],
        expenseType: expense.type,
      });
    } else {
      toast.info("No receipts available for this expense");
    }
  };

  const handleForward = (claimId) => {
    setActionLoading(claimId + "Forwarded");
    dispatch(forwardClaimStart(claimId));
  };

  const handleReject = (claimId) => {
    setActionLoading(claimId + "Rejected");
    dispatch(rejectClaimStart(claimId));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSetFilter = (newFilter) => {
    dispatch(setClaimFilter(newFilter));
  };

  // Calculate statistics
  const getStatusStats = () => {
    const stats = {
      all: { count: 0, amount: 0, icon: <PendingActions />, color: "primary" },
      pending: {
        count: 0,
        amount: 0,
        icon: <PendingActions />,
        color: "warning",
      },
      forwarded: {
        count: 0,
        amount: 0,
        icon: <ForwardToInbox />,
        color: "info",
      },
      approved: {
        count: 0,
        amount: 0,
        icon: <CheckCircle />,
        color: "success",
      },
      rejected: { count: 0, amount: 0, icon: <Cancel />, color: "error" },
      paid: { count: 0, amount: 0, icon: <Paid />, color: "success" },
    };

    pendingClaims.forEach((claim) => {
      const amount = totalAmount(claim.expenses);
      stats.all.count += 1;
      stats.all.amount += amount;

      if (claim.status === "Pending") {
        stats.pending.count += 1;
        stats.pending.amount += amount;
      } else if (claim.status === "Forwarded") {
        stats.forwarded.count += 1;
        stats.forwarded.amount += amount;
      } else if (claim.status === "Approved") {
        stats.approved.count += 1;
        stats.approved.amount += amount;
      } else if (claim.status === "Rejected") {
        stats.rejected.count += 1;
        stats.rejected.amount += amount;
      } else if (claim.status === "Paid") {
        stats.paid.count += 1;
        stats.paid.amount += amount;
      }
    });

    return stats;
  };

  const statusStats = getStatusStats();

  const filteredClaims = pendingClaims.filter((claim) => {
    if (filter === "all") return true;
    return (
      claim.status ===
      (filter === "forwarded"
        ? "Forwarded"
        : filter.charAt(0).toUpperCase() + filter.slice(1))
    );
  });

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h5" fontWeight={600}>
          Loading Claims...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "300px",
          p: 4,
          backgroundColor: "error.light",
          color: "error.contrastText",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Error Loading Claims
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={() => dispatch(fetchPendingClaimsStart())}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight={700}>
          HR Claims Dashboard
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Logout />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} mb={4}>
        {Object.entries(statusStats).map(([key, stat]) => (
          <Grid item xs={6} sm={4} md={2} key={key}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 2,
                cursor: "pointer",
                backgroundColor:
                  filter === key ? "primary.light" : "background.paper",
                "&:hover": { backgroundColor: "action.hover" },
              }}
              onClick={() => handleSetFilter(key)}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  sx={{
                    backgroundColor: `${stat.color}.light`,
                    color: `${stat.color}.contrastText`,
                    width: 48,
                    height: 48,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    {stat.count}
                  </Typography>
                  <Typography variant="body2">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Claims Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" fontWeight={600}>
            {filter === "all"
              ? "All Claims"
              : filter.charAt(0).toUpperCase() + filter.slice(1)}{" "}
            ({filteredClaims.length})
          </Typography>
          <Typography variant="h6" color="primary">
            Total Amount: ₹
            {filteredClaims
              .reduce((total, claim) => total + totalAmount(claim.expenses), 0)
              .toLocaleString()}
          </Typography>
        </Box>

        {filteredClaims.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="300px"
            p={4}
          >
            <CheckCircle sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No {filter === "all" ? "" : filter + " "}claims found
            </Typography>
          </Box>
        ) : (
          <Box>
            {filteredClaims.map((claim) => (
              <ClaimCard
                key={claim._id}
                claim={claim}
                onViewReceipts={handleViewReceipts}
                onForward={handleForward}
                onReject={handleReject}
                actionLoading={actionLoading}
              />
            ))}
          </Box>
        )}
      </Paper>

      {/* Receipt Viewer Dialog */}
      <ReceiptViewer
        open={receiptDialog.open}
        onClose={() =>
          setReceiptDialog({ open: false, receipts: [], expenseType: "" })
        }
        receipts={receiptDialog.receipts}
        expenseType={receiptDialog.expenseType}
      />
    </Box>
  );
};

export default HrClaimApprovalDashboard;
