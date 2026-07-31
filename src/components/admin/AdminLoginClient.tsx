"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertTriangle, Sparkles } from "lucide-react";
import { adminService } from "@/services/adminService";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

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
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
      {/* Background radial shapes */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-blue-100/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-emerald-50/40 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Card variant="elevated" className="p-6 sm:p-10 border border-slate-200">
          <div className="text-center mb-8">
            <Badge variant="light" color="blue" className="mb-4">
              <Sparkles className="w-3.5 h-3.5" /> SSIET Admin Console
            </Badge>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none mb-2">
              Gateway Login
            </h1>
            <p className="text-xs text-slate-500">
              Enter administrative credentials to access CMS control panels and parameters settings.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-red-600 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="admin@ssiet.ac.in"
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              error={errors.email?.message}
              disabled={submitting}
              {...register("email")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              error={errors.password?.message}
              disabled={submitting}
              {...register("password")}
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={submitting}
              fullWidth
              className="mt-6"
            >
              Sign In to Console
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
