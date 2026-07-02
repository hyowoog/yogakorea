export function csvEscape(value: string) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildCsv(headers: string[], rows: string[][]) {
  const lines = [`\uFEFF${headers.map(csvEscape).join(",")}`];
  for (const row of rows) {
    lines.push(row.map((cell) => csvEscape(String(cell ?? ""))).join(","));
  }
  return lines.join("\n");
}

export function csvResponse(csv: string, filename: string) {
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
    },
  });
}
