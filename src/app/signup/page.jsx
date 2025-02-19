"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
  
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    try {
      // Create userData with required fields and empty optional fields
      const userData = {
        email,
        password,
        username: "",
        contact_num: "",
        address: {
          street_num: "",
          barangay: "",
          city: "",
          zip_code: null,
        },
      };
  
      const response = await axios.post('/api/register', userData);
        
      if (response.status === 201) {
        router.push("/login");
      }      
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          setError(err.response.data.error);
        } else {
          setError(err.response.data.error || "An error occurred. Please try again later.");
        }
      } else if (err.request) {
        setError("No response received from server. Please try again.");
      } else {
        setError("Error setting up request. Please try again.");
      }
    }
  };

  return (
    <div className="flex h-screen">
      {/* Video Section */}
      <div className="flex-3 w-3/4 relative">
        <video
          className="w-full h-full object-cover"
          src="/signup/sign up video.webm"
          autoPlay
          muted
          loop
        ></video>
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30"></div>
      </div>

      {/* Login Form Section */}
      <div className="flex-1 w-1/4 flex justify-center bg-white shadow-lg">
        <div className="w-full max-w-md p-8">
          <h2 className="text-3xl font-semibold text-left mb-3">
            <span>Create an</span>
            <br />
            <span>account</span>
          </h2>

          <div className="mb-6">
            <h2>
              <span className="font-semibold text-lg">Sign up with email</span>
              <br />
              <div className="flex gap-2 text-sm">
                <span>Already have an account?</span>
                <Link href="/login">
                  <h2 className="text-[#0D3B66] font-medium cursor-pointer hover:underline">
                    Sign in
                  </h2>
                </Link>
              </div>
            </h2>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
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
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`mt-1 block w-full px-4 py-2 border rounded-md text-xs ${
                  confirmPassword && confirmPassword !== password
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="********"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-center font-light text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-12 bg-[#0D3B66] text-sm text-white py-2 rounded-lg hover:bg-[#145EA8] transition-colors"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;