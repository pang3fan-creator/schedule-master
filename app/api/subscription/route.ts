import { getUserSubscription } from "@/lib/subscription";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const subscription = await getUserSubscription();
    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { plan: "free", status: "active", expiresAt: null, customerId: null },
      { status: 500 },
    );
  }
}
