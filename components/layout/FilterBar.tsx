"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { BRAND } from "@/lib/colors";

interface Props {
  months:   string[];   // dynamic from CSV ["OCT 22", "NOV 22", ...]
  startIdx: number;
  endIdx:   number;
  onApply:  (s: number, e: number) => void;
}

const MON_ABBR = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"] as const;
const MON_KO   = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"] as const;

function labelToYM(label: string): { m: string; y: string } {
  const [m, yy] = label.split(" ");
  return { m: m ?? "", y: "20" + (yy ?? "") };
}

interface LS { sy: string; sm: string; ey: string; em: string }

export default function FilterBar({ months, startIdx, endIdx, onApply }: Props) {
  if (!months.length) return null;

  const years = Array.from(new Set(months.map(l => "20" + l.split(" ")[1]))).sort();

  function idxToLS(i: number): LS {
    const { m, y } = labelToYM(months[i] ?? months[0]);
    return { sm: m, sy: y, em: m, ey: y };
  }

  const [local, setLocal] = useState<LS>(() => ({
    ...idxToLS(startIdx),
    em: labelToYM(months[endIdx]).m,
    ey: labelToYM(months[endIdx]).y,
  }));
  const [preset, setPreset] = useState("");

  function findIdx(m: string, y: string): number {
    const label = `${m} ${y.slice(2)}`;
    const i = months.indexOf(label);
    return i < 0 ? 0 : i;
  }

  function syncLocal(s: number, e: number) {
    const a = labelToYM(months[s]), b = labelToYM(months[e]);
    setLocal({ sy: a.y, sm: a.m, ey: b.y, em: b.m });
  }

  function applyPreset(val: string) {
    setPreset(val);
    const n = months.length;
    if (!val) return;
    if (val === "all")      { onApply(0, n-1); syncLocal(0, n-1); }
    else if (val === "12m") { const s=Math.max(0,n-12); onApply(s,n-1); syncLocal(s,n-1); }
    else if (val === "6m")  { const s=Math.max(0,n-6);  onApply(s,n-1); syncLocal(s,n-1); }
    else {
      const yr = val.slice(2); // "22", "23", etc.
      const idxs = months.reduce<number[]>((a,m,i) => m.endsWith(yr) ? [...a,i] : a, []);
      if (idxs.length) { onApply(idxs[0], idxs[idxs.length-1]); syncLocal(idxs[0], idxs[idxs.length-1]); }
    }
  }

  function doApply() {
    let s = findIdx(local.sm, local.sy);
    let e = findIdx(local.em, local.ey);
    if (s > e) { const t = s; s = e; e = t; }
    onApply(s, e);
    setPreset("");
  }

  function doReset() {
    const n = months.length;
    onApply(0, n-1);
    syncLocal(0, n-1);
    setPreset("");
  }

  const cnt  = endIdx - startIdx + 1;
  const rdis = `${months[startIdx]} – ${months[endIdx]} · ${cnt}개월`;

  const selSx = {
    fontSize:12, height:32, minWidth:80,
    "& .MuiOutlinedInput-notchedOutline": { borderColor:"#dde8d5" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor:BRAND.g3 },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor:BRAND.g3 },
  };
  const btnSx = {
    fontSize:11, fontWeight:600, px:"12px", py:"4px",
    fontFamily:"var(--font-barlow-condensed),'Barlow Condensed',sans-serif",
    letterSpacing:"1px", border:"1.5px solid #dde8d5", color:"#666",
    textTransform:"uppercase", minWidth:0,
    "&:hover": { borderColor:BRAND.g3, color:BRAND.g1, background:"transparent" },
  };

  const setLoc = (key: keyof LS) => (e: { target: { value: unknown } }) =>
    setLocal(p => ({ ...p, [key]: e.target.value as string }));

  // Available months of selected year
  const smMonths = MON_ABBR.filter(m => months.includes(`${m} ${local.sy.slice(2)}`));
  const emMonths = MON_ABBR.filter(m => months.includes(`${m} ${local.ey.slice(2)}`));

  return (
    <Box sx={{ background:"#fff", borderBottom:"1px solid #dde8d5", px:"28px", py:"9px",
               display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
      <Box sx={{ fontFamily:"var(--font-barlow-condensed),'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"1px", textTransform:"uppercase", color:"#666" }}>
        📅 기간
      </Box>

      <Select value={local.sy} onChange={setLoc("sy") as never} size="small" sx={selSx}>
        {years.map(y => <MenuItem key={y} value={y} sx={{fontSize:12}}>{y}</MenuItem>)}
      </Select>
      <Select value={smMonths.includes(local.sm as typeof MON_ABBR[number]) ? local.sm : (smMonths[0] ?? "")}
              onChange={setLoc("sm") as never} size="small" sx={selSx}>
        {smMonths.map((m,i) => <MenuItem key={m} value={m} sx={{fontSize:12}}>{MON_KO[MON_ABBR.indexOf(m as typeof MON_ABBR[number])]}</MenuItem>)}
      </Select>

      <Box sx={{ fontSize:12, color:"#666" }}>~</Box>

      <Select value={local.ey} onChange={setLoc("ey") as never} size="small" sx={selSx}>
        {years.map(y => <MenuItem key={y} value={y} sx={{fontSize:12}}>{y}</MenuItem>)}
      </Select>
      <Select value={emMonths.includes(local.em as typeof MON_ABBR[number]) ? local.em : (emMonths[emMonths.length-1] ?? "")}
              onChange={setLoc("em") as never} size="small" sx={selSx}>
        {emMonths.map((m) => <MenuItem key={m} value={m} sx={{fontSize:12}}>{MON_KO[MON_ABBR.indexOf(m as typeof MON_ABBR[number])]}</MenuItem>)}
      </Select>

      <Box sx={{ width:"1px", height:"22px", background:"#dde8d5", mx:"4px" }} />

      <Box sx={{ fontFamily:"var(--font-barlow-condensed),'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"1px", textTransform:"uppercase", color:"#666" }}>
        프리셋
      </Box>
      <Select value={preset} onChange={(e) => applyPreset(e.target.value as string)}
              size="small" displayEmpty sx={selSx}>
        <MenuItem value="" sx={{fontSize:12}}>직접 선택</MenuItem>
        <MenuItem value="all"  sx={{fontSize:12}}>전체</MenuItem>
        {years.map(y => <MenuItem key={y} value={y} sx={{fontSize:12}}>{y}년</MenuItem>)}
        <MenuItem value="12m" sx={{fontSize:12}}>최근 12개월</MenuItem>
        <MenuItem value="6m"  sx={{fontSize:12}}>최근 6개월</MenuItem>
      </Select>

      <Button variant="outlined" onClick={doApply} sx={btnSx}>적용</Button>
      <Button variant="outlined" onClick={doReset} sx={btnSx}>↺ 초기화</Button>

      <Box sx={{ fontFamily:"var(--font-barlow-condensed),'Barlow Condensed',sans-serif", fontWeight:600, fontSize:13,
                 color:BRAND.g1, px:"10px", py:"4px", background:BRAND.g4, borderRadius:"10px" }}>
        {rdis}
      </Box>
    </Box>
  );
}
