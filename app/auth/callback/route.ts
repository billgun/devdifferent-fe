import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }

    // Store the access token in a cookie (with HttpOnly flag for security)
    const token = data.session.access_token;

    const headers = new Headers();
    headers.set(
      "Set-Cookie",
      `access_token=${token}; HttpOnly; Path=/; Max-Age=3600;`
    );

    return NextResponse.json(
      { message: "Logged in successfully", user: data.user },
      { headers }
    );
  }

  return NextResponse.json(
    { error: "Invalid or expired code" },
    { status: 400 }
  );
}
