import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const provided = req.headers.get("x-revalidate-secret") ?? "";
  const expected = process.env.REVALIDATE_SECRET ?? "";

  const safe =
    provided.length === expected.length &&
    expected.length > 0 &&
    timingSafeEqual(Buffer.from(provided), Buffer.from(expected));

  if (!safe) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const path: string | undefined = body?.path;

  if (!path || !path.startsWith("/") || path.length > 200) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  revalidatePath(path);
  revalidatePath("/weekly");
  revalidatePath("/");

  return NextResponse.json({ revalidated: true, path });
}
