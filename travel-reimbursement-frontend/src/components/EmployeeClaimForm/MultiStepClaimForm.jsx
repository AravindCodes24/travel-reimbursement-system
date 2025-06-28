import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import StepOneBasicDetails from "./StepOneBasicDetails";
import StepTwoTravelDetails from "./StepTwoTravelDetails";
import StepThreeExpensesUpload from "./StepThreeExpensesUpload";
import StepFourSummary from "./StepFourSummary";
import {
  Box,
  Button,
  Container,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
  Avatar,
  Card,
  CardContent,
  styled,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Person as PersonIcon,
  Flight as FlightIcon,
  Receipt as ReceiptIcon,
  Checklist as ChecklistIcon,
} from "@mui/icons-material";
import {
  setClaimFormStep,
  updateEmployeeInfo,
  updateTravelDetails,
  updateExpenses,
  submitClaimStart,
} from "../../features/Employee/employeeClaimSlice";

const steps = [
  "Employee Info",
  "Travel Details",
  "Expense Upload",
  "Summary & Submit",
];

const StyledStepIcon = styled(Box)(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage: `linear-gradient(136deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage: `linear-gradient(136deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  }),
}));

function StepIcon(props) {
  const { active, completed, icon } = props;
  const icons = {
    1: <PersonIcon />,
    2: <FlightIcon />,
    3: <ReceiptIcon />,
    4: <ChecklistIcon />,
  };
  return (
    <StyledStepIcon ownerState={{ completed, active }}>
      {icons[String(icon)]}
    </StyledStepIcon>
  );
}

const MultiStepClaimForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const savedUser = useSelector((state) => state.auth.user);
  const {
    step,
    employeeInfo,
    travelDetails,
    expenses,
    submitStatus,
    submitError,
  } = useSelector((state) => state.employeeClaim.claimForm);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    // Initialize form with user data
    dispatch(
      updateEmployeeInfo({
        name: savedUser?.username || "",
        employeeId: savedUser?.employeeId || "",
        department: savedUser?.department || "",
        company: savedUser?.company || "",
      })
    );
  }, [savedUser, dispatch]);

  useEffect(() => {
    if (submitStatus === "succeeded") {
      setSnackbarOpen(true);
      const timer = setTimeout(() => {
        navigate("/employee/dashboard");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus, navigate]);

  const validateStep = () => {
    if (step === 0) {
      return (
        employeeInfo.name.trim() !== "" &&
        employeeInfo.employeeId.trim() !== "" &&
        employeeInfo.department.trim() !== ""
      );
    }
    if (step === 1) {
      return (
        travelDetails.from.trim() !== "" &&
        travelDetails.to.trim() !== "" &&
        travelDetails.purpose.trim() !== "" &&
        travelDetails.startDate !== "" &&
        travelDetails.endDate !== ""
      );
    }
    if (step === 2) {
      return (
        expenses.length > 0 &&
        expenses.every(
          (e) =>
            e.amount !== "" &&
            e.type.trim() !== "" &&
            e.description.trim() !== "" &&
            e.receiptFile != null
        )
      );
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    dispatch(setClaimFormStep(Math.min(step + 1, steps.length - 1)));
  };

  const prevStep = () => {
    dispatch(setClaimFormStep(Math.max(step - 1, 0)));
  };

  const handleSubmit = () => {
    dispatch(submitClaimStart({ employeeInfo, travelDetails, expenses }));
    setOpenConfirm(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: "white",
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => (window.location.href = "/")}
            sx={{
              position: "absolute",
              right: 16,
              fontWeight: "bold",
              borderColor: "white",
              color: "white",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderColor: "white",
              },
            }}
          >
            Logout
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" fontWeight="bold">
              Travel Reimbursement Claim
            </Typography>
            <Typography variant="subtitle1">
              Complete all steps to submit your expense claim
            </Typography>
          </Box>
        </Box>

        <CardContent>
          <Stepper
            activeStep={step}
            alternativeLabel={!isMobile}
            orientation={isMobile ? "vertical" : "horizontal"}
            sx={{ mb: 6, mt: 2 }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={StepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {submitStatus === "loading" && (
            <LinearProgress sx={{ height: 4, borderRadius: 2, mb: 4 }} />
          )}

          <Box sx={{ p: { xs: 1, sm: 3 }, borderRadius: 2 }}>
            {step === 0 && (
              <StepOneBasicDetails
                data={employeeInfo}
                updateForm={(data) => dispatch(updateEmployeeInfo(data))}
                disableFields
              />
            )}
            {step === 1 && (
              <StepTwoTravelDetails
                data={travelDetails}
                updateForm={(data) => dispatch(updateTravelDetails(data))}
              />
            )}
            {step === 2 && (
              <StepThreeExpensesUpload
                data={expenses}
                updateForm={(data) => dispatch(updateExpenses(data))}
              />
            )}
            {step === 3 && (
              <StepFourSummary
                employeeInfo={employeeInfo}
                travelDetails={travelDetails}
                expenses={expenses}
              />
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 4,
              gap: 2,
              flexDirection: { xs: "column-reverse", sm: "row" },
            }}
          >
            <Button
              variant="outlined"
              disabled={step === 0 || submitStatus === "loading"}
              onClick={prevStep}
              size="large"
              sx={{ px: 4, borderRadius: 2, fontWeight: "bold" }}
            >
              Back
            </Button>

            {step < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={nextStep}
                disabled={!validateStep() || submitStatus === "loading"}
                size="large"
                sx={{
                  px: 4,
                  borderRadius: 2,
                  fontWeight: "bold",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={() => setOpenConfirm(true)}
                disabled={submitStatus === "loading"}
                size="large"
                sx={{
                  px: 4,
                  borderRadius: 2,
                  fontWeight: "bold",
                  background: `linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)`,
                }}
              >
                Submit for Approval
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        PaperProps={{ sx: { borderRadius: 3, maxWidth: "500px" } }}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "white",
            fontWeight: "bold",
          }}
        >
          Confirm Submission
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.light,
                width: 60,
                height: 60,
              }}
            >
              <ChecklistIcon fontSize="large" />
            </Avatar>
          </Box>
          <DialogContentText
            sx={{
              textAlign: "center",
              fontSize: "1.1rem",
              color: "text.primary",
            }}
          >
            Are you sure you want to submit this claim for approval? You won't
            be able to make changes afterward.
          </DialogContentText>
          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: theme.palette.grey[100],
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              <strong>Note:</strong> Please verify all details before
              submission. Incorrect information may delay your reimbursement.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <Button
            onClick={() => setOpenConfirm(false)}
            variant="outlined"
            sx={{ px: 4, borderRadius: 2, fontWeight: "bold" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            autoFocus
            sx={{
              px: 4,
              borderRadius: 2,
              fontWeight: "bold",
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            }}
          >
            Confirm Submission
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={submitStatus === "succeeded" ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {submitStatus === "succeeded"
            ? "Claim submitted successfully! Redirecting..."
            : `Submission failed: ${submitError}`}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MultiStepClaimForm;
