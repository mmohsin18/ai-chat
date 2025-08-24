"use client";

import FXBackground from "@/components/Layout/FXBackground";
import React from "react";
import QouteLeft from "./QouteLeft";
import LoginForm from "./LoginForm";

export default function Login() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[rgb(10,10,10)] text-white">
      <FXBackground />

      <div className="relative z-10 mx-auto flex items-center justify-center h-screen">
        <div className="w-[90%] h-[85%] flex items-center  overflow-hidden rounded-xl ring-1 ring-white/10">
          {/* Left: color preview */}
          <div className="w-[50%] flex items-center justify-center h-full">
            <QouteLeft />
          </div>

          {/* Right: quote block */}
          <div className="w-[50%] h-full flex flex-col justify-between">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
