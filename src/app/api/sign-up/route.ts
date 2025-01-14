import dbConnect from "@/lib/dbConnect";
import {UserModel} from "@/models/user.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    // const existingUserVerifiedByUsername = await UserModel.findOne({
    //   username,
    //   isVerified: true,
    // });

    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
      return Response.json(
        {
          success: false,
          message: "User with this email already exists",
        },
        { status: 400 }
      );
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        email,
        username,
        password: hashedPassword,
      });
      await newUser.save();
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
