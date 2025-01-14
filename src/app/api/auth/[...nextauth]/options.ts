import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email: ", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined): Promise<any> {
        if(!credentials) throw new Error("Credentials not provided")
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            email: credentials.email,
          });

          if (!user) throw new Error("No user found with this email");

          const isPasswordCorrect = await bcryptjs.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) throw new Error("Incorrect Password");
          return user;
        } catch (err) {
          throw new Error((err as Error).message);
        }
      },
    }),
  ],

  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.username = user?.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id?.toString();
        session.user.username = token.username;
      }
      return session;
    },
  },
};
