// src/features/auth/Login.tsx
import { useState } from "react";
import { loginUser } from "./api";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
    <Card className="flex justify-center mx-auto w-[400px] mt-10">
      <CardHeader>
        <CardTitle className="text-2xl">Log in</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {error && <p className="text-red-600">{error}</p>}
        <div className="flex flex-col gap-3">
          <Label htmlFor="username-login">Username</Label>
          <Input
            id="username-login"
            type="username"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="password-login">Password</Label>
          <Input
            id="password-login"
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex-col">
        <p className="mb-4 text-start">
          Don't have an account?{" "}
          <Link
            to={"/register"}
            className="text-blue-600 hover:underline hover:text-blue-800"
          >
            Register
          </Link>{" "}
          now
        </p>
        <Button onClick={handleSubmit} className="w-full">
          Log In
        </Button>
      </CardFooter>
    </Card>
  );
}
