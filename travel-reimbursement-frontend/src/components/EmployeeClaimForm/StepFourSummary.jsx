import {
  Box,
  Typography,
  Avatar,
  Divider,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import {
  Person as PersonIcon,
  Badge as BadgeIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Flight as FlightIcon,
  Place as PlaceIcon,
  Description as DescriptionIcon,
  DateRange as DateRangeIcon,
  Receipt as ReceiptIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";

const StepFourSummary = ({ employeeInfo, travelDetails, expenses }) => {
  const totalAmount = expenses.reduce(
    (sum, item) => sum + parseFloat(item.amount || 0),
    0
  );

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
          <DescriptionIcon />
        </Avatar>
        <Typography variant="h6" fontWeight="bold">
          Review Your Claim
        </Typography>
      </Box>
      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="bold"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <PersonIcon color="primary" /> Employee Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Name"
                  secondary={employeeInfo.name || "Not provided"}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <BadgeIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Employee ID"
                  secondary={employeeInfo.employeeId || "Not provided"}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <WorkIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Department"
                  secondary={employeeInfo.department || "Not provided"}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <BusinessIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Company"
                  secondary={employeeInfo.company || "Not provided"}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="bold"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <FlightIcon color="primary" /> Travel Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <PlaceIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="From"
                  secondary={travelDetails.from || "Not provided"}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PlaceIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="To"
                  secondary={travelDetails.to || "Not provided"}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DescriptionIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Purpose"
                  secondary={travelDetails.purpose || "Not provided"}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DateRangeIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Dates"
                  secondary={
                    travelDetails.startDate && travelDetails.endDate
                      ? `${new Date(
                          travelDetails.startDate
                        ).toLocaleDateString()} - ${new Date(
                          travelDetails.endDate
                        ).toLocaleDateString()}`
                      : "Not provided"
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="bold"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <ReceiptIcon color="primary" /> Expense Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {expenses.map((item, index) => (
              <Paper
                key={index}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 1,
                  backgroundColor: "background.default",
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <Chip
                      label={item.type || "No type"}
                      color="primary"
                      variant="outlined"
                      icon={<ReceiptIcon />}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Box display="flex" alignItems="center">
                      <AttachMoneyIcon color="action" sx={{ mr: 1 }} />
                      <Typography>{item.amount || "0.00"}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Typography variant="body2">
                      {item.description || "No description"}
                    </Typography>
                    {item.receipt && (
                      <Typography variant="caption" color="text.secondary">
                        Receipt: {item.receipt.name}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            ))}
            <Box
              sx={{
                mt: 3,
                p: 2,
                backgroundColor: "primary.light",
                color: "primary.contrastText",
                borderRadius: 2,
                textAlign: "right",
              }}
            >
              <Typography variant="h6">
                Total Claim Amount: ₹{totalAmount.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StepFourSummary;
