import { NextRequest } from "next/server";

export function isAdminRequest(req: NextRequest) {
  const key = process.env.ADMIN_KEY || "";
  if (!key) return false;
  const header = req.headers.get("x-admin-key") || "";
  return header === key;
}
