import {
  Box,
  Grid,
  TextField,
  Typography,
  Avatar,
  Divider,
  InputAdornment,
} from "@mui/material";
import {
  Person as PersonIcon,
  Badge as BadgeIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";

const StepOneBasicDetails = ({ data, updateForm, disableFields = false }) => {
  return (
    <Box>
      <Typography variant="subtitle2" color="primary" gutterBottom>
        Step 1 of 3
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
          <PersonIcon />
        </Avatar>
        <Typography variant="h6" fontWeight="bold">
          Employee Information
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Grid container columns={12} columnSpacing={3} rowSpacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Full Name"
            value={data.name}
            onChange={(e) => updateForm({ name: e.target.value })}
            variant="outlined"
            InputProps={{
              readOnly: disableFields,
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="info" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Employee ID"
            value={data.employeeId}
            onChange={(e) => updateForm({ employeeId: e.target.value })}
            variant="outlined"
            InputProps={{
              readOnly: disableFields,
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon color="info" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Department"
            value={data.department}
            onChange={(e) => updateForm({ department: e.target.value })}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WorkIcon color="info" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Company / Organization"
            value={data.company}
            onChange={(e) => updateForm({ company: e.target.value })}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon color="info" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Note:</strong> Please ensure your employee details are
          accurate as they will be used for reimbursement processing.
        </Typography>
      </Box>
    </Box>
  );
};

export default StepOneBasicDetails;
