import dbConnect from "@/lib/dbConnect";
import { CommentModel } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { text, owner,article } = await request.json();
    console.log(text, owner, article)

    if (!text || !owner) {
      return NextResponse.json(
        { success: false, message: "Text and owner are required." },
        { status: 400 }
      );
    }

    const addedComment = await CommentModel.create({ text, owner, article });
    await addedComment.populate("owner", "username email"); // Populate owner details
    await addedComment.populate("article", "_id");

    
    return NextResponse.json(
      {
        success: true,
        message: "Comment added successfully!",
        comment: addedComment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while adding comment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add comment." },
      { status: 500 }
    );
  }
}
