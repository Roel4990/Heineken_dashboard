"use client";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";
import { BRAND } from "@/lib/colors";
import { supabase } from "@/lib/supabase";

interface Props {
  currentMonth: string;
}

export default function AppHeader({ currentMonth }: Props) {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <Box
      component="header"
      sx={{
        background: "#fff",
        borderBottom: `3px solid ${BRAND.g3}`,
        px: "28px",
        py: "11px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 200,
        boxShadow: "0 2px 8px rgba(0,0,0,.08)",
      }}
    >
      {/* Left: logo + title */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "13px" }}>
        <Box
          sx={{
            background: `linear-gradient(135deg, ${BRAND.g1}, ${BRAND.g3})`,
            color: "#fff",
            fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: "19px",
            letterSpacing: "2px",
            px: "13px",
            py: "5px",
            borderRadius: "4px",
            lineHeight: 1.2,
          }}
        >
          one
          <Box
            component="small"
            sx={{ fontWeight: 300, fontSize: "9px", letterSpacing: "3px", display: "block", opacity: 0.85 }}
          >
            by CMI
          </Box>
          TAP
        </Box>

        <Box>
          <Box
            sx={{
              fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: "17px",
              color: BRAND.g1,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Off Premise Analysis
          </Box>
          <Box sx={{ fontWeight: 300, color: "#666", fontSize: "11px", letterSpacing: "2px" }}>
            Korea IPS Beer Market
          </Box>
        </Box>
      </Box>

      {/* Right: badge + brand */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "11px" }}>
        <Box
          sx={{
            background: BRAND.g1,
            color: "#fff",
            fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: "12px",
            px: "12px",
            py: "4px",
            borderRadius: "20px",
            letterSpacing: "1px",
          }}
        >
          {currentMonth}
        </Box>
        <Box
          sx={{
            fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: "14px",
            color: "#c0392b",
            letterSpacing: "2px",
          }}
        >
          ★ HEINEKEN
        </Box>
        <Tooltip title="Sign out">
          <IconButton onClick={handleLogout} size="small" sx={{ color: "#999", "&:hover": { color: BRAND.g1 } }}>
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
