import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { checkGoogleConnection } from "@/lib/google-calendar";
import { isPro } from "@/lib/subscription";

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    // 检查是否是 Pro 用户
    const userIsPro = await isPro();
    if (!userIsPro) {
        return NextResponse.json(
            { error: "Pro subscription required" },
            { status: 403 }
        );
    }

    const status = await checkGoogleConnection();

    return NextResponse.json(status);
}
