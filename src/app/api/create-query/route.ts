import dbConnect from "@/lib/dbConnect";
import { ArticleModel } from "@/models/user.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect(); // Connect to the database

  try {
    const { title, imgUrl, owner, description } = await request.json();

    // Validate required fields
    if (!title || !imgUrl || !owner || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields (title, imgUrl, owner) are required",
        },
        { status: 400 }
      );
    }

    // Validate owner as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid owner ID format",
        },
        { status: 400 }
      );
    }

    // Create and save the query
    const createdQuery = new ArticleModel({
      title,
      imgUrl,
      owner,
      description
    });

    await createdQuery.save();

    return NextResponse.json(
      {
        success: true,
        message: "Query created successfully",
        data: createdQuery,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error while creating query:", error.message || error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create user query",
        error: error.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
