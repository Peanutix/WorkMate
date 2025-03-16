import React from "react";
import heroPlaceHolder from "../assets/heroPlaceHolder.png";
import {useNavigate} from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  function handleGetStarted() {
    navigate("/login");
  }

  return (
    <div className=" text-black min-h-screen flex flex-col">
      {/* Hero Section */}
      <section
        id="home"
        className="flex flex-col  md:flex-row items-center justify-between max-w-7xl mx-auto px-4 py-16">
        {/* Text content */}
        <div className="md:w-1/2 space-y-6 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Welcome to <span className="text-[#3b82f6]">WorkMate</span>{" "}
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
          A collaborative platform designed for creators, thinkers, and problem-solvers to come together, draw freely, brainstorm ideas in real time, share knowledge, and build innovative solutions — all in one interactive space.
          </p>

          <div className="space-x-4">
            <button
              onClick={handleGetStarted}
              className="bg-[#3b82f6] text-white px-6 py-3 rounded font-medium hover:bg-[#2563eb] transition">
              Get Started
            </button>
            <button className="text-[#3b82f6] font-medium hover:underline">
              About
            </button>
          </div>
        </div>

        {/* Hero image */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={heroPlaceHolder}
            alt="Hero Placeholder"
            className="w[2000px]"
          />
        </div>
      </section>

    {/* Features Section */}
    <div className="bg-gray-300 py-16">
    <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">
            Our <span className="text-[#3b82f6]">Features</span>
        </h2>
        <p className="text-gray-600 mt-2">
            Powerful tools to help you learn and grow!
        </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
        {/* Card 1 */}
        <div className="bg-white p-6 shadow-md rounded hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Draw, Type and Design</h3>
            <p className="text-gray-600">
            Our toolbox has an array of tools to allow the users to make and draw whatever they want.
            </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 shadow-md rounded hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
            <p className="text-gray-600">
            Users can join one of many sessions in the lobby and join others to collab and solve problems!
            </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 shadow-md rounded hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Download and Share</h3>
            <p className="text-gray-600">
            Download your Whiteboard and share it with your friends!
            </p>
        </div>
        </div>
    </div>
    </div>


      {/* Footer */}
      <footer className="bg-black text-white py-6">
        <div className="mx-auto px-4 flex md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} WorkMate Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
