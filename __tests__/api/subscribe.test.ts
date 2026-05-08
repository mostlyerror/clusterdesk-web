jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null }),
    }),
  },
}));

import { POST } from "@/app/api/subscribe/route";
import { NextRequest } from "next/server";

test("returns 200 on valid email", async () => {
  const req = new NextRequest("http://localhost/api/subscribe", {
    method: "POST",
    body: JSON.stringify({ email: "test@example.com", source: "landing" }),
    headers: { "Content-Type": "application/json" },
  });
  const res = await POST(req);
  expect(res.status).toBe(200);
});

test("returns 400 on missing email", async () => {
  const req = new NextRequest("http://localhost/api/subscribe", {
    method: "POST",
    body: JSON.stringify({ source: "landing" }),
    headers: { "Content-Type": "application/json" },
  });
  const res = await POST(req);
  expect(res.status).toBe(400);
});
