"use client";

import React from "react";
import IITH_LOGO from "@/assets/IITH_LOGO.svg";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="relative px-6 py-10 m-4 text-white rounded-xl overflow-hidden shadow-xl">
      {/* Background image with filters and reduced opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80 filter brightness-75 saturate-150 z-0"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/5784339/pexels-photo-5784339.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
        }}
      ></div>

      {/* Vignette effect (black corners) */}
      <div className="absolute inset-0 bg-black opacity-25 z-0"></div>

      {/* Overlay for gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70 z-0"></div>

      {/* Content of the navbar */}
      <div className="flex items-center gap-8">
        {/* Logo Section */}
        <div className="z-10">
          <Image
            src="/IITH_LOGO.svg"
            alt="IITH Logo"
            width={100}
            height={100}
            className="z-10"
          />
        </div>

        <div className="w-full flex items-center justify-between">
          {" "}
          {/* Title Section */}
          <div className="flex items-center ">
            <h1 className="text-4xl font-semibold drop-shadow-lg text-center md:text-left">
              EE5188 - Analog IC Design Lab
            </h1>
          </div>
          {/* Profile Section */}
          <div className="flex items-center gap-4 justify-center md:justify-end md:w-1/6">
            <img
              src="https://iith.ac.in/assets/images/profiles/Ashudeb_Dutta.jpg"
              alt="Dr. Ashudeb Dutta"
              className="w-14 h-14 rounded-full bg-gray-300 border-4 border-white shadow-xl transform hover:scale-105 transition-all"
            />
            <p className="text-xl font-medium drop-shadow-lg">
              Dr. Ashudeb Dutta
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
