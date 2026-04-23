"use client";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/");
    });
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.replace("/");
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          background: "#fff",
          borderRadius: 2,
          p: 4,
          width: "100%",
          maxWidth: 360,
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 1 }}>
          <Box sx={{ color: "#1a6b1a", fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>
            ONE TAP
          </Box>
          <Box sx={{ color: "#666", fontSize: 12, mt: 0.5 }}>
            HEINEKEN Korea · Internal Dashboard
          </Box>
        </Box>

        <TextField
          label="Email"
          type="email"
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          autoFocus
        />

        <TextField
          label="Password"
          type="password"
          size="small"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        {error && (
          <Box sx={{ color: "error.main", fontSize: 13 }}>{error}</Box>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ background: "#1a6b1a", "&:hover": { background: "#145214" }, mt: 1 }}
        >
          {loading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Sign in"}
        </Button>
      </Box>
    </Box>
  );
}
