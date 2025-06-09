// src/features/auth/Login.tsx
import { useState } from "react";
import { loginUser } from "./api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser({ username, password });
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="gap-2">
          <span>Don't have an account yet?</span>
          <Link
            className="text-blue-800 hover:underline hover:text-purple-800 mx-1"
            to={"/register"}
          >
            Register
          </Link>
        </p>
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
