"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from "react";

const page = () => {
  const selectedTab = useState("Home");

  const links = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Documents",
      href: "/",
    },
  ];

  const articles = [
    {
      img: "https://images.pexels.com/photos/3665442/pexels-photo-3665442.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "title 1",
      date: "01 January 2025",
      username: 'User 1',
      id: 1,
    },
    {
      img: "https://images.pexels.com/photos/39290/mother-board-electronics-computer-board-39290.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "title 2",
      date: "01 January 2025",
      username: 'User 1',
      id: 2,
    },
    {
      img: "https://images.pexels.com/photos/2517330/pexels-photo-2517330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "title 3",
      date: "01 January 2025",
      username: 'User 1',
      id: 3,
    },
    {
      img: "https://images.pexels.com/photos/40848/pins-cpu-processor-macro-40848.jpeg",
      title: "title 4",
      date: "01 January 2025",
      username: 'User 1',
      id: 4,
    },
  ];


  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center px-4 mb-8 bg-white shadow-md py-4 rounded-lg">
        <div className="flex items-center gap-8 text-xl text-gray-700 font-semibold">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-purple-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
        <Button className="bg-purple-600 text-white hover:bg-purple-700">
          Start a discussion
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <img
              src={article.img}
              alt=""
              className="h-40 w-full object-cover rounded-md mb-4"
            />
            <p className="text-lg font-medium text-gray-800">{article.title}</p>
            <span>{article.username}</span>
            <p className="italic text-gray-600">{article.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
