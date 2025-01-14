import dbConnect from "@/lib/dbConnect";
import { CommentModel } from "@/models/user.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { articleId: string } }
) {
  await dbConnect();
  const { articleId } = params;
  // console.log("ArticleID:", articleId);
  try {
    if (!articleId) {
      return NextResponse.json(
        { success: false, message: "Article ID is missing" },
        { status: 400 }
      );
    }

    const comments = await CommentModel.aggregate([
      {
        $match: {
          article: new mongoose.Types.ObjectId(articleId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "commentOwner",
          pipeline: [
            {
              $project: {
                username: 1,
                email: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$commentOwner", // Flatten the 'commentOwner' array
        },
      },
    ]);

    if (!comments) {
      throw new Error("Could not fetch article comments");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Article comments fetched successfully!",
        data: comments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while fetching comments: ", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch article comments",
      },
      { status: 500 }
    );
  }
}