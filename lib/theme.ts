"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary:    { main: "#1a6b1a", light: "#7bc142", dark: "#134f13" },
    secondary:  { main: "#7bc142" },
    error:      { main: "#c62828" },
    background: { default: "#f0f4ed", paper: "#ffffff" },
    text:       { primary: "#1a1a1a", secondary: "#666666" },
  },
  typography: {
    fontFamily: "var(--font-barlow), 'Barlow', sans-serif",
    h1: { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif", fontWeight: 700 },
    h2: { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif", fontWeight: 700 },
    h3: { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif", fontWeight: 700 },
    h4: { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif", fontWeight: 700 },
    h5: { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif", fontWeight: 700 },
    h6: { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif", fontWeight: 700 },
    button: { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.05em" },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
          fontWeight: 600,
          fontSize: "12px",
          letterSpacing: "1px",
          textTransform: "uppercase",
          color: "#666",
          minHeight: 44,
          padding: "11px 18px",
          "&.Mui-selected": { color: "#1a6b1a" },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: "#7bc142", height: 3 },
        root: { backgroundColor: "#fff", borderBottom: "1px solid #dde8d5" },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 8, boxShadow: "0 2px 10px rgba(0,0,0,.07)" },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: { fontSize: 12, padding: "5px 9px" },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& th": {
            fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "#666",
            backgroundColor: "#fff",
            borderBottom: "2px solid #dde8d5",
            whiteSpace: "nowrap",
            padding: "6px 9px",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { fontSize: 11, padding: "5px 9px", borderBottom: "1px solid #f0f0f0", whiteSpace: "nowrap" },
        body: { "&:first-of-type": { fontWeight: 600, color: "#666", textAlign: "left" } },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover td": { backgroundColor: "rgba(123,193,66,.05)" },
        },
      },
    },
  },
});

export default theme;
