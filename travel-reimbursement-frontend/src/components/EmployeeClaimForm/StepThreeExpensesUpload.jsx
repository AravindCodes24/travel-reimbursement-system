import React from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Button,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";

// Expense type icons
import FastfoodIcon from "@mui/icons-material/Fastfood";
import HotelIcon from "@mui/icons-material/Hotel";
import FlightIcon from "@mui/icons-material/Flight";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

// Other field icons
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import NotesIcon from "@mui/icons-material/Notes";

const expenseTypes = [
  { value: "food", label: "Food", icon: <FastfoodIcon /> },
  { value: "stay", label: "Stay", icon: <HotelIcon /> },
  { value: "travel", label: "Travel", icon: <FlightIcon /> },
  { value: "other", label: "Other", icon: <HelpOutlineIcon /> },
];

const StepThreeExpensesUpload = ({ data = [], updateForm }) => {
  const handleAddExpense = () => {
    updateForm([
      ...data,
      { type: "", amount: "", description: "", receiptFile: null },
    ]);
  };

  const handleRemoveExpense = (index) => {
    if (data.length === 1) return; // prevent removing last expense
    const newExpenses = data.filter((_, i) => i !== index);
    updateForm(newExpenses);
  };

  const handleChange = (index, field, value) => {
    const newExpenses = data.map((expense, i) =>
      i === index ? { ...expense, [field]: value } : expense
    );
    updateForm(newExpenses);
  };

  const handleFileChange = (index, file) => {
    handleChange(index, "receiptFile", file);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Upload your expenses and receipts
      </Typography>
      {data.map((expense, index) => {
        const selectedType = expenseTypes.find((e) => e.value === expense.type);

        return (
          <Grid
            container
            spacing={2}
            key={index}
            alignItems="center"
            sx={{ mb: 2 }}
          >
            {/* Expense Type with icon */}
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth required>
                <InputLabel id={`expense-type-label-${index}`}>
                  Expense Type
                </InputLabel>
                <Select
                  labelId={`expense-type-label-${index}`}
                  id={`expense-type-select-${index}`}
                  value={expense.type}
                  label="Expense Type"
                  onChange={(e) => handleChange(index, "type", e.target.value)}
                  startAdornment={
                    selectedType ? (
                      <InputAdornment position="start">
                        {selectedType.icon}
                      </InputAdornment>
                    ) : null
                  }
                >
                  {expenseTypes.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Amount with money icon */}
            <Grid item xs={12} sm={3}>
              <TextField
                label="Amount"
                type="number"
                fullWidth
                value={expense.amount}
                onChange={(e) => handleChange(index, "amount", e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Description with notes icon */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Description"
                fullWidth
                value={expense.description}
                onChange={(e) =>
                  handleChange(index, "description", e.target.value)
                }
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NotesIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Upload with upload icon */}
            <Grid item xs={10} sm={1.5}>
              <InputLabel
                htmlFor={`receipt-upload-${index}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  color: expense.receiptFile ? "green" : "inherit",
                }}
              >
                <UploadIcon />
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  id={`receipt-upload-${index}`}
                  style={{ display: "none" }}
                  onChange={(e) =>
                    handleFileChange(
                      index,
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                />
              </InputLabel>
            </Grid>

            {/* Delete button */}
            <Grid item xs={2} sm={0.5}>
              <IconButton
                aria-label="delete"
                color="error"
                onClick={() => handleRemoveExpense(index)}
                disabled={data.length === 1}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        );
      })}

      <Button variant="outlined" onClick={handleAddExpense} sx={{ mt: 2 }}>
        Add Another Expense
      </Button>
    </Box>
  );
};

export default StepThreeExpensesUpload;
