import dbConnect from "@/lib/dbConnect";
import { CommentModel } from "@/models/user.model"; // Ensure the correct model file and export
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { commentId } = await request.json();

    // Validate commentId
    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or missing comment ID",
        },
        { status: 400 }
      );
    }

    // Delete the comment
    const deletedComment = await CommentModel.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return NextResponse.json(
        {
          success: false,
          message: "Comment not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Comment deleted successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while deleting comment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete comment",
      },
      { status: 500 }
    );
  }
}
