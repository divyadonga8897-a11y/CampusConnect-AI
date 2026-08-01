"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { adminService } from "@/services/adminService";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFields = z.infer<typeof loginSchema>;

export default function AdminLoginClient() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (data: LoginFields) => {
    setErrorMessage("");
    setSubmitting(true);
    
    const res = await adminService.login(data.email, data.password);
    setSubmitting(false);

    if (res.success) {
      router.push("/admin/dashboard");
    } else {
      setErrorMessage(res.error || "Invalid credentials. Access denied.");
    }
  };

  return (
    <main>
      <div>
        <Card>
          <div>
            <span>SSIET Admin Console</span>
            <h1>Gateway Login</h1>
            <p>
              Enter administrative credentials to access CMS control panels and parameters settings.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {errorMessage && (
              <div>
                <span>{errorMessage}</span>
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="admin@ssiet.ac.in"
              error={errors.email?.message}
              disabled={submitting}
              {...register("email")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              disabled={submitting}
              {...register("password")}
            />

            <Button
              type="submit"
              loading={submitting}
            >
              Sign In to Console
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
