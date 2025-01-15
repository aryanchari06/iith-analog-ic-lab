"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { LockIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Owner {
  _id: string;
  email: string;
  username: string;
}

interface Article {
  _id: string;
  title: string;
  owner: string;
  createdAt: Date;
  imgUrl: string;
  queryOwner: Owner;
}

const Page = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedTab, setSelectedTab] = useState("Home");
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const queries = await axios.get("/api/fetch-queries");
        setArticles(queries.data.data);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  const navigators = [{ name: "Home" }, { name: "Documents" }];

  const links = [
    { href: "https://www.youtube.com/", id: 1 }, 
    { href: "https://www.youtube.com/", id: 2 },
    { href: "https://www.youtube.com/", id: 3 },
    { href: "https://www.youtube.com/", id: 4 },
    { href: "https://www.youtube.com/", id: 5 },
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen text-gray-800">
      {/* Header with animation */}
      <motion.header
        className="sticky top-0 bg-white shadow-md py-4 px-4 sm:px-6 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <div className="flex items-center gap-4">
            {navigators.map((link) => (
              <Button
                key={link.name}
                onClick={() => setSelectedTab(link.name)}
                className={`text-lg font-medium bg-transparent hover:bg-transparent ${
                  link.name === selectedTab
                    ? "text-black underline"
                    : "text-gray-700 hover:text-black"
                } transition-colors`}
              >
                {link.name}
              </Button>
            ))}
          </div>
          {session?.user && (
            <Link href="/start-discussion">
              <Button className="bg-black text-white hover:bg-gray-800  sm:mt-0">
                Start a Discussion
              </Button>
            </Link>
          )}
        </div>
      </motion.header>

      {/* Welcome Section */}
      <motion.section
        className="mt-6 px-4 sm:px-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {session?.user ? (
          <p className="text-lg sm:text-xl text-gray-800 mb-6">
            Welcome,{" "}
            <span className="font-semibold">{session.user.username}</span>!
          </p>
        ) : (
          <p className="text-lg sm:text-xl text-gray-600 mb-6">
            Please{" "}
            <Link href="/sign-in" className="underline text-black">
              sign in
            </Link>{" "}
            to start a discussion on our forum.
          </p>
        )}
      </motion.section>

      {/* Articles Section */}
      {selectedTab === "Home" ? (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="px-4 sm:px-10"
        >
          {loading ? (
            <p className="text-center text-gray-500">Loading articles...</p>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles
                .slice()
                .reverse()
                .map((article) => (
                  <motion.div
                    key={article._id}
                    className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href={`/article/${article._id}`} target="_blank">
                      <div>
                        <img
                          src={article.imgUrl || "/default-placeholder.png"}
                          alt={article.title}
                          className="h-40 w-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-700 mb-1">
                          By {article.queryOwner.username}
                        </p>
                        <p className="text-sm text-gray-600 italic">
                          {new Date(article.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No articles to display.</p>
          )}
        </motion.section>
      ) : (
        <div className="px-4 sm:px-10">
          <motion.h1
            className="text-lg sm:text-xl font-semibold text-black mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            Important Links
          </motion.h1>
          {session?.user._id ? (
            <ul className="space-y-2">
              {links.map((link) => (
                <motion.li
                  key={link.id}
                  className="border-b py-1 border-gray-400"
                  whileHover={{ scale: 1.005 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className="text-blue-800 hover:underline hover:text-black"
                  >
                    {link.href}
                  </Link>
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <LockIcon className="text-gray-500" />
              <p className="text-gray-700">Sign In to view document links</p>
              <div className="flex space-x-4">
                <Link
                  href="/sign-in"
                  className="text-blue-800 hover:underline hover:text-black"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="text-blue-800 hover:underline hover:text-black"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
