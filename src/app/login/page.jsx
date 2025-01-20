"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc"; // Google icon
import { FaFacebook } from "react-icons/fa"; // Facebook icon
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // For showing error messages
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form refresh
    setError(null); // Clear previous errors

    try {
      const response = await axios.post("/api/login", { email, password });

      if (response.status === 201) {
        router.push("/"); // Redirect on successful login
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          setError("Invalid email or password."); // Wrong credentials
        } else if (err.response.status === 404) {
          setError(" The password you’ve entered is incorrect."); // Account not found
        } else {
          setError("An error occurred. Please try again later."); // General error
        }
      } else {
        setError("An error occurred. Please try again later."); // General error
      }
    }
  };

  return (
    <div className="flex h-screen">
      {/* Video Section */}
      <div className="flex-3 w-3/4 relative">
        <video
          className="w-full h-full object-cover"
          src="/login/login video.webm" // Replace with your video path
          autoPlay
          muted
          loop
        ></video>
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30"></div>
      </div>

      {/* Login Form Section */}
      <div className="flex-1 w-1/4 flex justify-center bg-white shadow-lg">
        <div className="w-full max-w-md p-8">
          <h2 className="text-3xl font-semibold text-left mt-6 mb-3">Log In</h2>

          {/* New User? Create An Account */}
          <div className="flex mb-8 gap-2 items-center whitespace-nowrap">
            <h2 className="font-light text-xs">Don&apos;t have an account?</h2>
            <Link href="/signup">
              <h2 className="text-[#0D3B66] text-xs font-medium cursor-pointer hover:underline">
                Create an Account
              </h2>
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-xs"
                placeholder="user@example.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-xs"
                placeholder="********"
                required
              />
            </div>

            <div className="mt-12">
              <button
                type="submit" // Ensure this button submits the form
                className="w-full bg-[#0D3B66] text-sm text-white py-2 rounded-lg hover:bg-[#145EA8] transition-colors"
              >
                Login
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-center mb-4 font-light text-xs">
                {error}
              </div>
            )}
          </form>

          <p className="text-center text-xs text-gray-600 mt-4 ml-3">
            <a
              href="/login"
              className="text-[#0D3B66] hover:underline font-light text-center"
            >
              Forgot Password?
            </a>
          </p>

          {/* Social Login Buttons */}
          <div className="mt-16 space-y-4">
            <button
              type="button"
              className="w-full flex items-center justify-center bg-white text-black py-2 border rounded-md shadow-sm hover:bg-gray-100 transition-colors"
              onClick={() => alert("Google login clicked!")}
            >
              <FcGoogle className="h-6 w-6 mr-2" />
              <span className="text-xs leading-none text-gray-700">
                Continue with Google
              </span>
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center bg-white text-black py-2 border rounded-md shadow-sm hover:bg-gray-100 transition-colors"
              onClick={() => alert("Facebook login clicked!")}
            >
              <FaFacebook className="h-6 w-6 mr-2 text-blue-600" />
              <span className="text-xs leading-none text-gray-700">
                Continue with Facebook
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
