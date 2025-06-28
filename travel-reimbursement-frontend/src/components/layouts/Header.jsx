import { useLocation, useNavigate } from "react-router-dom";
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Box, 
  Tooltip, 
  Avatar,
  useMediaQuery,
  useTheme
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import HomeIcon from "@mui/icons-material/Home";
import { FaPlane } from "react-icons/fa";
import { motion } from "framer-motion";

const Header = ({
  showHome = true,
  showBack = true,
  user,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleBack = () => navigate(-1);
  const handleHome = () => navigate("/");

  const userInitial = user?.name?.[0]?.toUpperCase() || "U";

  return (
    <AppBar
      position="sticky"
      elevation={4}
      sx={{
        background: "linear-gradient(135deg,rgb(9, 58, 70) 0%,rgb(14, 76, 131) 50%,rgb(49, 87, 117) 100%)",
        borderBottom: "3px solid #ffab00",
        py: 1
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left-side controls */}
        <Box display="flex" alignItems="center" gap={2}>
          {showBack && location.pathname !== "/" && (
            <Tooltip title="Go Back">
              <motion.div whileHover={{ scale: 1.1 }}>
                <IconButton 
                  onClick={handleBack} 
                  sx={{ 
                    color: "white",
                    backgroundColor: "#ffab00",
                    "&:hover": {
                      backgroundColor: "#ffc400"
                    }
                  }}
                >
                  <ArrowBackIosNewIcon />
                </IconButton>
              </motion.div>
            </Tooltip>
          )}

          <Box display="flex" alignItems="center" gap={1}>
            <FaPlane style={{ color: "#ffab00", fontSize: "1.8rem" }} />
            <Typography
              variant={isMobile ? "h6" : "h5"}
              fontWeight="bold"
              sx={{ 
                color: "white",
                fontFamily: "'Montserrat', sans-serif",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}
            >
              Travel Reimbursement System
            </Typography>
          </Box>
        </Box>

        {/* Right-side user and nav */}
        <Box display="flex" alignItems="center" gap={3}>
          {user?.name && (
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#ffab00",
                  color: "#1a237e",
                  fontWeight: "bold",
                  border: "2px solid white"
                }}
              >
                {userInitial}
              </Avatar>
              {!isMobile && (
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: "white",
                    fontWeight: 500
                  }}
                >
                  {user.name}
                </Typography>
              )}
            </Box>
          )}

          {showHome && (
            <Tooltip title="Home">
              <motion.div whileHover={{ scale: 1.1 }}>
                <IconButton 
                  onClick={handleHome} 
                  sx={{ 
                    color: "white",
                    backgroundColor: "#ffab00",
                    "&:hover": {
                      backgroundColor: "#ffc400"
                    }
                  }}
                >
                  <HomeIcon />
                </IconButton>
              </motion.div>
            </Tooltip>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;