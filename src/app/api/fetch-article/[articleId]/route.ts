import dbConnect from "@/lib/dbConnect";
import { ArticleModel } from "@/models/user.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { articleId: string } }
) {
  await dbConnect();
  const { articleId } = params;
  console.log("ArticleID:", articleId);

  try {
    if (!articleId) {
      return NextResponse.json(
        { success: false, message: "Article ID is missing" },
        { status: 400 }
      );
    }

    const fetchedArticle = await ArticleModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(articleId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "articleOwner",
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
          path: "$articleOwner",
        },
      },
    ]);

    if (!fetchedArticle || fetchedArticle.length === 0) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Article fetched successfully!",
        data: fetchedArticle[0], // Assuming you want to return a single article
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while fetching article:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch article" },
      { status: 500 }
    );
  }
}
