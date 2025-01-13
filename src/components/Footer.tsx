"use client";

import { Button } from "@/components/ui/button"; // Import Button from ShadCN
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const { data: session } = useSession();
  return (
    <footer className="bg-gray-300 text-gray-800 py-6 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        {/* Copyright Section */}
        <div className="text-center sm:text-left flex items-center gap-2">
          <Image
            src="/IITH_LOGO_BLACK.svg"
            alt="IITH Logo"
            width={100}
            height={100}
            className="z-10"
          />
          <div className="flex flex-col ">
            <p className="text-md text-gray-600">
              &copy; {new Date().getFullYear()} Analog IC Design Lab IITH. All
              Rights Reserved.
            </p>
            <p className="text-sm text-gray-500">Developed by Aryan Chari</p>
          </div>
        </div>

        {/* Links & Button Section */}
        <div className="flex items-center justify-center sm:justify-end space-x-4">
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-black"
          >
            Home
          </Link>

          {session?.user ? (
            <Button
              className="bg-transparent text-sm text-gray-600 hover:text-black border border-gray-300 hover:border-black"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logout
            </Button>
          ) : (
            <Link
              href="/sign-in"
              className="text-sm text-gray-600 hover:text-black"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
