import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tags = searchParams.get("tag");
  const path = searchParams.get("path");
  try {
    if (!tags && !path) throw new Error("تگی ارسال نشده !");
    if (tags) {
      revalidateTag(tags);
    }
    if (path) {
      const slug = encodeURIComponent(path?.split('/')[2])
      const url = "/" + path?.split("/")[1] + "/" + slug
      revalidatePath(url);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { message: err || "با خطا مواجه شدیم!!!" },
      { status: 500 }
    );
  }
}
