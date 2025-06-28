import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDirectorClaimsRequest,
  updateClaimStatusRequest,
} from "../../features/director/directorSlice";
import {
  Box,
  Grid,
  Card,
  Avatar,
  Typography,
  Chip,
  Button,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";

import { useSnackbar } from "notistack";
import { styled } from "@mui/material/styles";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PictureAsPdf as PdfIcon,
  Receipt as ReceiptIcon,
  Logout as LogoutIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon,
  FlightTakeoff as FlightIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
  ...(status === "Forwarded" && {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  }),
  ...(status === "Paid" && {
    backgroundColor: theme.palette.info.light,
    color: theme.palette.info.dark,
  }),
}));

const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatCurrency = (amount) =>
  `₹${parseFloat(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;

const getReceiptUrl = (path) => {
  if (!path) return null;
  const cleanPath = path.replace(/\\/g, "/");
  return `http://localhost:5000/${cleanPath}`;
};

const DirectorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { claims, loading, actionLoading, stats } = useSelector(
    (state) => state.director
  );

  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchDirectorClaimsRequest());
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDecision = (claimId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this claim?`))
      return;
    dispatch(updateClaimStatusRequest({ claimId, status }));
  };

  const getTotalAmount = (expenses) =>
    expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  const handlePDFDownload = (claim) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;

      // Company Header
      doc.setFillColor(25, 118, 210);
      doc.rect(0, 0, pageWidth, 45, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("TRAVEL EXPENSE CLAIM", pageWidth / 2, 20, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Official Expense Reimbursement Report", pageWidth / 2, 32, {
        align: "center",
      });

      let currentY = 60;
      const lineHeight = 8;
      const sectionSpacing = 15;

      // Claim Information Box
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(248, 249, 250);
      doc.roundedRect(
        margin,
        currentY - 5,
        pageWidth - 2 * margin,
        25,
        3,
        3,
        "FD"
      );

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("CLAIM ID:", margin + 5, currentY + 5);
      doc.setFont("helvetica", "normal");
      doc.text(claim._id || "N/A", margin + 25, currentY + 5);

      doc.setFont("helvetica", "bold");
      doc.text("CREATED:", margin + 5, currentY + 12);
      doc.setFont("helvetica", "normal");
      doc.text(formatDate(claim.createdAt), margin + 25, currentY + 12);

      // Status badge
      const statusColor = getStatusColor(claim.status);
      doc.setFillColor(...statusColor);
      doc.roundedRect(pageWidth - margin - 35, currentY, 30, 15, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(
        (claim.status || "UNKNOWN").toUpperCase(),
        pageWidth - margin - 20,
        currentY + 9,
        { align: "center" }
      );

      currentY += 40;

      // Employee Information Section
      doc.setTextColor(25, 118, 210);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("EMPLOYEE INFORMATION", margin, currentY);

      doc.setDrawColor(25, 118, 210);
      doc.setLineWidth(1);
      doc.line(margin, currentY + 2, margin + 60, currentY + 2);

      currentY += 12;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);

      const employeeInfo = [
        ["Employee Name:", claim.employeeName || "N/A"],
        ["Employee ID:", claim.employeeId || "N/A"],
        ["Department:", claim.department],
        ["Company:", claim.company],
      ];

      employeeInfo.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold");
        doc.text(label, margin, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(String(value), margin + 45, currentY);
        currentY += lineHeight;
      });

      currentY += sectionSpacing;

      // Travel Information Section
      doc.setTextColor(25, 118, 210);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("TRAVEL INFORMATION", margin, currentY);

      doc.setDrawColor(25, 118, 210);
      doc.line(margin, currentY + 2, margin + 60, currentY + 2);

      currentY += 12;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);

      // Calculate trip duration
      const travelDate = new Date(claim.travelDate);
      const returnDate = new Date(claim.returnDate);
      const durationDays =
        Math.ceil((returnDate - travelDate) / (1000 * 60 * 60 * 24)) + 1;

      const travelInfo = [
        [
          "Travel Route:",
          `${claim.travelFrom || "N/A"} → ${claim.travelTo || "N/A"}`,
        ],
        ["Travel Date:", formatDate(claim.travelDate)],
        ["Return Date:", formatDate(claim.returnDate)],
        ["Duration:", `${durationDays} day(s)`],
        ["Purpose:", claim.purpose || "N/A"],
      ];

      travelInfo.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold");
        doc.text(label, margin, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(String(value), margin + 45, currentY);
        currentY += lineHeight;
      });

      currentY += sectionSpacing;

      // Expense Details Section
      doc.setTextColor(25, 118, 210);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("EXPENSE BREAKDOWN", margin, currentY);

      doc.setDrawColor(25, 118, 210);
      doc.line(margin, currentY + 2, margin + 60, currentY + 2);

      currentY += 15;

      // Prepare expense table data
      const tableColumns = [
        "Expense Type",
        "Description",
        "Amount (₹)",
        "Receipt",
      ];
      const tableRows = [];

      if (claim.expenses && Array.isArray(claim.expenses)) {
        claim.expenses.forEach((expense, index) => {
          const expenseType = expense.type
            ? expense.type.charAt(0).toUpperCase() + expense.type.slice(1)
            : "Other";

          tableRows.push([
            expenseType,
            expense.description || "No description provided",
            formatCurrency(expense.amount || 0),
            expense.receiptPath ? "Available" : "Not provided",
          ]);
        });
      }

      // Add total row
      const totalAmount = getTotalAmount(claim.expenses);
      tableRows.push([
        {
          content: "TOTAL CLAIMED",
          styles: { fontStyle: "bold", fillColor: [240, 240, 240] },
        },
        {
          content: "",
          styles: { fontStyle: "bold", fillColor: [240, 240, 240] },
        },
        {
          content: formatCurrency(totalAmount),
          styles: {
            fontStyle: "bold",
            fillColor: [240, 240, 240],
            halign: "right",
          },
        },
        {
          content: "",
          styles: { fontStyle: "bold", fillColor: [240, 240, 240] },
        },
      ]);

      // Generate expense table
      if (typeof doc.autoTable === "function") {
        doc.autoTable({
          startY: currentY,
          head: [tableColumns],
          body: tableRows,
          theme: "striped",
          headStyles: {
            fillColor: [25, 118, 210],
            textColor: 255,
            fontStyle: "bold",
            fontSize: 10,
            halign: "center",
          },
          bodyStyles: {
            fontSize: 9,
            cellPadding: 4,
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
          margin: { left: margin, right: margin },
          columnStyles: {
            0: { cellWidth: 35, halign: "left" },
            1: { cellWidth: "auto", halign: "left" },
            2: { cellWidth: 35, halign: "right" },
            3: { cellWidth: 30, halign: "center" },
          },
        });
        currentY = doc.lastAutoTable.finalY + 20;
      }

      // Summary Box
      if (currentY > pageHeight - 60) {
        doc.addPage();
        currentY = 30;
      }

      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(248, 249, 250);
      doc.roundedRect(
        margin,
        currentY - 5,
        pageWidth - 2 * margin,
        35,
        3,
        3,
        "FD"
      );

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("CLAIM SUMMARY", margin + 5, currentY + 8);

      doc.setFontSize(10);
      doc.text(
        `Total Amount Claimed: ${formatCurrency(totalAmount)}`,
        margin + 5,
        currentY + 18
      );
      doc.text(
        `Number of Expenses: ${claim.expenses ? claim.expenses.length : 0}`,
        margin + 5,
        currentY + 25
      );

      // Status information
      currentY += 45;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      const statusText = `Current Status: ${(
        claim.status || "Unknown"
      ).toUpperCase()}`;
      doc.setTextColor(...getStatusColor(claim.status));
      doc.text(statusText, margin, currentY);

      // Add approval section if approved
      if (claim.status === "Approved") {
        currentY += 15;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text("Approved by: Finance Department", margin, currentY);
        doc.text(
          `Approval Date: ${new Date().toLocaleDateString("en-IN")}`,
          margin,
          currentY + 8
        );
      }

      // Footer
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);

      doc.setTextColor(128, 128, 128);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        "This is a system-generated document. No signature required.",
        pageWidth / 2,
        pageHeight - 18,
        { align: "center" }
      );
      doc.text(
        `Generated on: ${new Date().toLocaleString("en-IN")}`,
        pageWidth / 2,
        pageHeight - 12,
        { align: "center" }
      );

      // Generate filename and save
      const sanitizedName = (claim.employeeName || "Unknown").replace(
        /[^a-zA-Z0-9]/g,
        "_"
      );
      const fileName = `TravelExpense_${
        claim.employeeId || "Unknown"
      }_${sanitizedName}_${new Date().toISOString().split("T")[0]}.pdf`;

      doc.save(fileName);
      enqueueSnackbar("Travel expense PDF downloaded successfully!", {
        variant: "success",
      });
    } catch (error) {
      console.error("PDF Generation Error:", error);
      enqueueSnackbar(`Failed to generate PDF: ${error.message}`, {
        variant: "error",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return [34, 139, 34]; // Green
      case "rejected":
        return [220, 20, 60]; // Red
      case "forwarded":
        return [255, 140, 0]; // Orange
      case "paid":
        return [0, 123, 255]; // Blue
      default:
        return [128, 128, 128]; // Gray
    }
  };

  const filteredClaims = claims.filter((claim) => {
    if (statusFilter === "All") return true;
    return claim.status === statusFilter;
  });

  const openReceipt = (url) => {
    // Simple implementation - opens in new tab
    window.open(url, "_blank");
  };

  const renderClaimsGrid = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (filteredClaims.length === 0) {
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
            <ReceiptIcon sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
            <Typography
              variant="h5"
              fontWeight={600}
              color="text.secondary"
              gutterBottom
            >
              No claims found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {statusFilter === "All"
                ? "There are no expense claims submitted yet."
                : `No ${statusFilter.toLowerCase()} claims found.`}
            </Typography>
          </Box>
        </Paper>
      );
    }

    return (
      <Grid container spacing={3}>
        {filteredClaims.map((claim) => (
          <Grid item xs={12} sm={6} md={4} key={claim._id}>
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
                  <StatusChip status={claim.status} label={claim.status} />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Stack spacing={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <FlightIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>Travel:</strong> {claim.travelFrom} →{" "}
                          {claim.travelTo}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>Dates:</strong> {formatDate(claim.travelDate)}{" "}
                          - {formatDate(claim.returnDate)}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <InfoIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>Purpose:</strong> {claim.purpose}
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
                  {formatCurrency(getTotalAmount(claim.expenses))}
                </Typography>
              </Box>

              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ReceiptIcon />}
                  onClick={() => {
                    if (claim.expenses.some((e) => e.receiptPath)) {
                      openReceipt(
                        getReceiptUrl(
                          claim.expenses.find((e) => e.receiptPath)?.receiptPath
                        )
                      );
                    }
                  }}
                  disabled={!claim.expenses.some((e) => e.receiptPath)}
                  sx={{ mb: 1 }}
                >
                  View Receipts
                </Button>

                {claim.status === "Forwarded" && (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleDecision(claim._id, "Approved")}
                      disabled={actionLoading === claim._id + "Approved"}
                    >
                      {actionLoading === claim._id + "Approved" ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Approve"
                      )}
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => handleDecision(claim._id, "Rejected")}
                      disabled={actionLoading === claim._id + "Rejected"}
                    >
                      {actionLoading === claim._id + "Rejected" ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Reject"
                      )}
                    </Button>
                  </Box>
                )}

                {(claim.status === "Approved" || claim.status === "Paid") && (
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PdfIcon />}
                    onClick={() => handlePDFDownload(claim)}
                  >
                    Download PDF
                  </Button>
                )}
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Director Claims Approval Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Review and approve employee travel expense claims
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ height: "fit-content" }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "secondary.main",
              color: "white",
            }}
          >
            <Typography variant="subtitle2">TOTAL CLAIMS</Typography>
            <Typography variant="h4" fontWeight={700}>
              {stats.total}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "success.light" }}>
            <Typography variant="subtitle2" color="success.dark">
              APPROVED
            </Typography>
            <Typography variant="h4" fontWeight={700} color="success.dark">
              {stats.approved}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "error.light" }}>
            <Typography variant="subtitle2" color="error.dark">
              REJECTED
            </Typography>
            <Typography variant="h4" fontWeight={700} color="error.dark">
              {stats.rejected}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filter Controls */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            Filter by Status:
          </Typography>
          {["All", "Forwarded", "Approved", "Rejected", "Paid"].map(
            (status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "contained" : "outlined"}
                onClick={() => setStatusFilter(status)}
                size="small"
              >
                {status}
              </Button>
            )
          )}
        </Stack>
      </Box>

      {/* Claims List */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Claims List ({filteredClaims.length})
        </Typography>
        {renderClaimsGrid()}
      </Box>
    </Box>
  );
};

export default DirectorDashboard;
