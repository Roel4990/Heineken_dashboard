import Papa from "papaparse";
import { supabase } from "./supabase";

export async function loadCsvFromSupabase(
  filePath: string
): Promise<Record<string, string>[]> {
  const { data, error } = await supabase.storage
    .from("nielsen-data")
    .download(filePath);

  if (error || !data) {
    throw new Error(`Failed to download ${filePath}: ${error?.message ?? "no data"}`);
  }

  const text = await data.text();
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data;
}
