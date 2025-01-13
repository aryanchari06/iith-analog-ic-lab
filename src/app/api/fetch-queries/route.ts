import dbConnect from "@/lib/dbConnect";
import { ArticleModel } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const queries = await ArticleModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "queryOwner",
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
          path: "$queryOwner", // Unwind the queryOwner array
          preserveNullAndEmptyArrays: true, // Optional: Include documents even if queryOwner is empty
        },
      },
    ]);

    if (queries.length === 0) {
      throw new Error("Error while fetching user queries");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Queries fetched successfully!",
        data: queries,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while fetching queries: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch queries",
      },
      { status: 500 }
    );
  }
}
