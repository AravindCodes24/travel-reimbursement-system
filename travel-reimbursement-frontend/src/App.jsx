import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider, enqueueSnackbar } from "notistack"; // ✅ for toast
import { useEffect } from "react";

import "./App.css";
import "./index.css";
import AppRoutes from "./routes/AppRoutes";

function App() {
  useEffect(() => {
    const listener = (e) => {
      const { message, variant } = e.detail;
      enqueueSnackbar(message, { variant }); 
    };
    window.addEventListener("SHOW_SNACKBAR", listener);
    return () => window.removeEventListener("SHOW_SNACKBAR", listener);
  }, []);

  return (
    <BrowserRouter>
      <SnackbarProvider maxSnack={3} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <AppRoutes />
      </SnackbarProvider>
    </BrowserRouter>
  );
}

export default App;
