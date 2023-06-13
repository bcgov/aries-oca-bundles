import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#3E5C93",
      main: "#003366",
      dark: "#000C3A",
    },
    secondary: {
      light: "#FFF263",
      main: "#FBC02D",
      dark: "#C49000",
    },
    success: { main: "#2E8540" },
    error: { main: "#FF3E34" },
    warning: { main: "#FE7921" },
    contrastThreshold: 3,
    tonalOffset: 0.1,
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1080, // Default: 960
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: 14,
        },
      },
    },
  },
});

export default theme;
