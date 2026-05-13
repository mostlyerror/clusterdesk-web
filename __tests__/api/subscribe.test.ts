const mockInsert = jest.fn().mockResolvedValue({ error: null });

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      insert: mockInsert,
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

test("stores sanitized attribution fields", async () => {
  const req = new NextRequest("http://localhost/api/subscribe", {
    method: "POST",
    body: JSON.stringify({
      email: "Investor@Example.com",
      source: "ticker",
      ticker: " acme ",
      campaign: "weekly-friday-before-open",
      variant: "hero-a",
      referrer: "https://x.com/clusterdesk",
    }),
    headers: { "Content-Type": "application/json" },
  });

  const res = await POST(req);

  expect(res.status).toBe(200);
  expect(mockInsert).toHaveBeenLastCalledWith({
    email: "investor@example.com",
    signup_source: "ticker",
    signup_ticker: "ACME",
    signup_campaign: "weekly-friday-before-open",
    signup_variant: "hero-a",
    signup_referrer: "https://x.com/clusterdesk",
  });
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
