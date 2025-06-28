import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Stack,
  Divider,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import { useSelector } from "react-redux";

const EmployeeHome = () => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const firstName = user?.username?.split(" ")[0] || "Employee";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "70vh",
        background: "linear-gradient(to right top, #dfe9f3, #ffffff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
      }}
    >
      <Card
        sx={{
          maxWidth: 720,
          width: "100%",
          borderRadius: "24px",
          p: 4,
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent>
          {/* Logout Button inside card */}
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              variant="outlined"
              sx={{
                borderColor: "#d32f2f",
                color: "#d32f2f",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#ffebee",
                },
              }}
            >
              Logout
            </Button>
          </Box>

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Avatar
                  sx={{
                    bgcolor: "#1976d2",
                    width: 100,
                    height: 100,
                    fontSize: 42,
                    mx: "auto",
                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.5)",
                  }}
                >
                  {firstName[0]?.toUpperCase() || "E"}
                </Avatar>
                <Typography variant="h6" mt={1}>
                  {}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                ></Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={8}>
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Good day, {firstName}!
                </Typography>

                <Typography variant="body1" color="text.secondary" mb={2}>
                  You can submit a new travel claim or view your previous ones
                  below.
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent="flex-start"
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => navigate("/employee/claim")}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                      boxShadow: "0 6px 20px rgba(25, 118, 210, 0.3)",
                      fontWeight: "bold",
                    }}
                  >
                    Submit Claim
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<AssignmentIcon />}
                    onClick={() => navigate("/employee/dashboard")}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: "bold",
                      borderColor: "#1976d2",
                      color: "#1976d2",
                      "&:hover": {
                        backgroundColor: "#e3f2fd",
                      },
                    }}
                  >
                    View My Claims
                  </Button>
                </Stack>

                <Box
                  mt={3}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  color="text.secondary"
                  fontSize="14px"
                >
                  <WbSunnyRoundedIcon fontSize="small" />
                  <span style={{ color: "#1976d2" }}>
                    Tip: Keep your receipts ready for upload.
                  </span>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmployeeHome;
