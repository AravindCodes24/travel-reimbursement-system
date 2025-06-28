// import React from "react";
// import {
//   Box,
//   Grid,
//   TextField,
//   Typography,
//   Avatar,
//   Divider,
//   InputAdornment,
// } from "@mui/material";
// import {
//   Place as PlaceIcon,
//   Description as DescriptionIcon,
//   DateRange as DateRangeIcon,
//   Flight as FlightIcon,
// } from "@mui/icons-material";

// const StepTwoTravelDetails = ({ data, updateForm }) => {
//   return (
//     <Box>
//       <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
//         <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
//           <FlightIcon />
//         </Avatar>
//         <Typography variant="h6" fontWeight="bold">
//           Travel Information
//         </Typography>
//       </Box>
//       <Divider sx={{ mb: 4 }} />

//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <TextField
//             fullWidth
//             label="From Location"
//             value={data.from}
//             onChange={(e) => updateForm({ from: e.target.value })}
//             variant="outlined"
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <PlaceIcon color="action" />
//                 </InputAdornment>
//               ),
//             }}
//           />
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <TextField
//             fullWidth
//             label="To Location"
//             value={data.to}
//             onChange={(e) => updateForm({ to: e.target.value })}
//             variant="outlined"
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <PlaceIcon color="action" />
//                 </InputAdornment>
//               ),
//             }}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             label="Purpose of Travel"
//             value={data.purpose}
//             onChange={(e) => updateForm({ purpose: e.target.value })}
//             variant="outlined"
//             multiline
//             rows={2}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <DescriptionIcon color="action" />
//                 </InputAdornment>
//               ),
//             }}
//           />
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <TextField
//             fullWidth
//             label="Start Date"
//             type="date"
//             value={data.startDate}
//             onChange={(e) => updateForm({ startDate: e.target.value })}
//             variant="outlined"
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <DateRangeIcon color="action" />
//                 </InputAdornment>
//               ),
//             }}
//             InputLabelProps={{ shrink: true }}
//           />
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <TextField
//             fullWidth
//             label="End Date"
//             type="date"
//             value={data.endDate}
//             onChange={(e) => updateForm({ endDate: e.target.value })}
//             variant="outlined"
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <DateRangeIcon color="action" />
//                 </InputAdornment>
//               ),
//             }}
//             InputLabelProps={{ shrink: true }}
//           />
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default StepTwoTravelDetails;



import React, { useState} from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Avatar,
  Divider,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import {
  Place as PlaceIcon,
  Description as DescriptionIcon,
  DateRange as DateRangeIcon,
  Flight as FlightIcon,
} from "@mui/icons-material";

const StepTwoTravelDetails = ({ data, updateForm }) => {
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [loadingFrom, setLoadingFrom] = useState(false);
  const [loadingTo, setLoadingTo] = useState(false);

  const fetchLocations = async (query, setSuggestions, setLoading) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1`
      );
      const data = await response.json();
      setSuggestions(data.slice(0, 5)); // Limit to 5 suggestions
    } catch (error) {
      console.error("Error fetching locations:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFromLocationChange = (value) => {
    updateForm({ from: value });
    fetchLocations(value, setFromSuggestions, setLoadingFrom);
  };

  const handleToLocationChange = (value) => {
    updateForm({ to: value });
    fetchLocations(value, setToSuggestions, setLoadingTo);
  };

  const selectSuggestion = (suggestion, field) => {
    const displayName = suggestion.display_name.split(",")[0]; // Get the first part of the name
    updateForm({ [field]: displayName });
    if (field === "from") {
      setFromSuggestions([]);
    } else {
      setToSuggestions([]);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
          <FlightIcon />
        </Avatar>
        <Typography variant="h6" fontWeight="bold">
          Travel Information
        </Typography>
      </Box>
      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box position="relative">
            <TextField
              fullWidth
              label="From Location"
              value={data.from}
              onChange={(e) => handleFromLocationChange(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PlaceIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: loadingFrom && (
                  <InputAdornment position="end">
                    <CircularProgress size={20} />
                  </InputAdornment>
                ),
              }}
            />
            {fromSuggestions.length > 0 && (
              <Paper
                elevation={3}
                sx={{
                  position: "absolute",
                  width: "100%",
                  zIndex: 1,
                  mt: 0.5,
                  maxHeight: 200,
                  overflow: "auto",
                }}
              >
                <List dense>
                  {fromSuggestions.map((suggestion, index) => (
                    <ListItem
                      button
                      key={index}
                      onClick={() => selectSuggestion(suggestion, "from")}
                    >
                      <ListItemIcon>
                        <PlaceIcon color="action" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={suggestion.display_name.split(",")[0]} 
                        secondary={suggestion.display_name.split(",").slice(1).join(",")} 
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box position="relative">
            <TextField
              fullWidth
              label="To Location"
              value={data.to}
              onChange={(e) => handleToLocationChange(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PlaceIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: loadingTo && (
                  <InputAdornment position="end">
                    <CircularProgress size={20} />
                  </InputAdornment>
                ),
              }}
            />
            {toSuggestions.length > 0 && (
              <Paper
                elevation={3}
                sx={{
                  position: "absolute",
                  width: "100%",
                  zIndex: 1,
                  mt: 0.5,
                  maxHeight: 200,
                  overflow: "auto",
                }}
              >
                <List dense>
                  {toSuggestions.map((suggestion, index) => (
                    <ListItem
                      button
                      key={index}
                      onClick={() => selectSuggestion(suggestion, "to")}
                    >
                      <ListItemIcon>
                        <PlaceIcon color="action" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={suggestion.display_name.split(",")[0]} 
                        secondary={suggestion.display_name.split(",").slice(1).join(",")} 
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Purpose of Travel"
            value={data.purpose}
            onChange={(e) => updateForm({ purpose: e.target.value })}
            variant="outlined"
            multiline
            rows={2}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={data.startDate}
            onChange={(e) => updateForm({ startDate: e.target.value })}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DateRangeIcon color="action" />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={data.endDate}
            onChange={(e) => updateForm({ endDate: e.target.value })}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DateRangeIcon color="action" />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StepTwoTravelDetails;