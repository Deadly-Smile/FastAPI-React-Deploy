// src/features/auth/Register.tsx
import { useState } from "react";
import { registerUser } from "./api";
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

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser({ username, email, password });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <Card className="flex justify-center mx-auto w-[400px] mt-10">
      <CardHeader>
        <CardTitle className="text-2xl">Create Account</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {error && <p className="text-red-600">{error}</p>}
        <div className="flex flex-col gap-3">
          <Label htmlFor="username-create-account">Username</Label>
          <Input
            id="username-create-account"
            type="username"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="username-create-account">Email</Label>
          <Input
            id="email-create-account"
            type="email"
            placeholder="E-mail"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="password-create-account">Password</Label>
          <Input
            id="password-create-account"
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex-col">
        <p className="mb-4 text-start">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="text-blue-600 hover:underline hover:text-blue-800"
          >
            Login
          </Link>{" "}
          now
        </p>
        <Button onClick={handleSubmit} className="w-full">
          Create account
        </Button>
      </CardFooter>
    </Card>
  );
}
