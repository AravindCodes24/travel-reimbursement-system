import { Box, Typography } from "@mui/material";
import { FaMapMarkedAlt, FaHotel, FaUmbrellaBeach } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background:
          "linear-gradient(135deg,rgb(15, 62, 83) 0%,rgb(16, 89, 123) 50%,rgb(18, 98, 124) 100%)",
        color: "white",
        py: 3,
        borderTop: "3px solid #ffab00",
        height: "50px",
        position: "relative",
        overflow: "hidden",
        mt: -6.6,
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Travel icons */}
        <Box display="flex" gap={4}>
          <motion.div whileHover={{ y: -5 }}>
            <FaMapMarkedAlt style={{ fontSize: "1.8rem", color: "#ffab00" }} />
          </motion.div>
          <motion.div whileHover={{ y: -5 }}>
            <FaHotel style={{ fontSize: "1.8rem", color: "#ffab00" }} />
          </motion.div>
          <motion.div whileHover={{ y: -5 }}>
            <FaUmbrellaBeach style={{ fontSize: "1.8rem", color: "#ffab00" }} />
          </motion.div>
        </Box>

        {/* Copyright text */}
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} Travel Reimbursement System
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
