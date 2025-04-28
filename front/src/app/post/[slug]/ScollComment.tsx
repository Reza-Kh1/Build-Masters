"use client";
import React from "react";
import { FaComments } from "react-icons/fa";

export default function ScollComment({
  totalComments,
}: {
  totalComments: number;
}) {
  const scrollToComments = () => {
    const element = document.getElementById("comments");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <button
      onClick={scrollToComments}
      type="button"
      className="flex gap-1 md:gap-2 items-center cursor-pointer hover:text-blue-400 transition-all"
    >
      <FaComments />
      {totalComments || 0}
    </button>
  );
}
