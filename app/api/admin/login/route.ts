import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

export async function POST(req: NextRequest) {
  const { secret } = await req.json().catch(() => ({}));
  const expected = process.env.REVALIDATE_SECRET ?? "";

  const valid =
    typeof secret === "string" &&
    secret.length === expected.length &&
    expected.length > 0 &&
    timingSafeEqual(Buffer.from(secret), Buffer.from(expected));

  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", expected, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
