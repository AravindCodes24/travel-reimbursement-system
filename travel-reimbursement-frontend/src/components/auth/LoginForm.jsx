import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "../../features/auth/authSlice";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
  CircularProgress,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
  FaPlane,
  FaPassport,
  FaReceipt,
  FaSuitcaseRolling,
  FaSignInAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);
  const planeRef = useRef(null);
  const suitcaseRef = useRef(null);
  const passportRef = useRef(null);
  const receiptRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case "hr":
          navigate("/hr/dashboard");
          break;
        case "employee":
          navigate("/employee/home");
          break;
        case "director":
          navigate("/director/dashboard");
          break;
        case "office":
          navigate("/office/dashboard");
          break;
        default:
          navigate("/");
      }
    }
  }, [user, navigate]);

  useEffect(() => {
      gsap.to(planeRef.current, {
      x: "100vw",
      duration: 20,
      ease: "none",
      repeat: -1,
      repeatDelay: 3,
    });

 
    gsap.to(suitcaseRef.current, {
      y: -5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });


    gsap.to(passportRef.current, {
      rotation: 5,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

   
    gsap.to(receiptRef.current, {
      x: 3,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginRequest({ email, password }));
  };

  return (
    <Container
      maxWidth="xs"
      sx={{ mt: 8, position: "relative", overflow: "hidden" }}
    >
      {/* Travel-themed floating icons */}
      <Box
        ref={planeRef}
        sx={{
          position: "absolute",
          top: 50,
          left: -50,
          color: "primary.main",
          fontSize: "1.5rem",
          zIndex: 0,
          opacity: 0.7,
        }}
      >
        <FaPlane />
      </Box>

      <Box
        ref={suitcaseRef}
        sx={{
          position: "absolute",
          top: "30%",
          right: 30,
          color: "secondary.main",
          fontSize: "1.2rem",
          zIndex: 0,
          opacity: 0.6,
        }}
      >
        <FaSuitcaseRolling />
      </Box>

      <Box
        ref={passportRef}
        sx={{
          position: "absolute",
          bottom: 100,
          left: 40,
          color: "warning.main",
          fontSize: "1.3rem",
          zIndex: 0,
          opacity: 0.6,
        }}
      >
        <FaPassport />
      </Box>

      <Box
        ref={receiptRef}
        sx={{
          position: "absolute",
          bottom: 150,
          right: 50,
          color: "success.main",
          fontSize: "1.1rem",
          zIndex: 0,
          opacity: 0.6,
        }}
      >
        <FaReceipt />
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            mt: 8,
            mb: 4,
            padding: 4,
            boxShadow: 7,
            borderRadius: 2, 
            backgroundColor: "background.light",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
            backdropFilter: "blur(2px)",
          }}
        >
          <Typography
            variant="h5"
            mb={3}
            color="primary.main"
            fontWeight="bold"
          >
            Expense Reimbursement
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email or Employee ID"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                endAdornment: (
                  <FaPassport style={{ opacity: 0.5, marginLeft: 8 }} />
                ),
              }}
            />

            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <FaReceipt style={{ opacity: 0.5, marginLeft: 8 }} />
                ),
              }}
            />

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                disabled={loading}
                startIcon={loading ? null : <FaSignInAlt />}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>
            </motion.div>
          </form>

          <Typography variant="body2" sx={{ mt: 2 }}>
            Don't have an account?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/register")}
              sx={{ cursor: "pointer" }}
            >
              Register here
            </Link>
          </Typography>
        </Box>
      </motion.div>
    </Container>
  );
}

