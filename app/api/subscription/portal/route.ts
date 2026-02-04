import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

const CREEM_API_BASE = "https://api.creem.io/v1";
const CREEM_API_KEY = process.env.CREEM_API_KEY || "";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get customer ID from subscription
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("subscriptions")
      .select("creem_customer_id")
      .eq("clerk_user_id", userId)
      .single();

    if (error || !data?.creem_customer_id) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 },
      );
    }

    // Call Creem API to get customer portal URL
    const response = await fetch(
      `${CREEM_API_BASE}/customers/${data.creem_customer_id}/billing-portal`,
      {
        method: "POST",
        headers: {
          "x-api-key": CREEM_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Creem API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to get portal URL" },
        { status: 500 },
      );
    }

    const portalData = await response.json();
    return NextResponse.json({ url: portalData.url });
  } catch (error) {
    console.error("Error getting customer portal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
