"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, User, Mail, Lock, Image as ImageIcon, Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { signUp, signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Password validation checks
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const isLengthValid = password.length >= 6;
  const isPasswordValid = hasUpperCase && hasLowerCase && isLengthValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !email || !password) {
      setErrorMsg("নাম, ইমেইল এবং পাসওয়ার্ড আবশ্যক!");
      toast.error("সকল আবশ্যকীয় তথ্য পূরণ করুন");
      return;
    }

    // Strict password validation
    if (!hasUpperCase) {
      setErrorMsg("পাসওয়ার্ডে অবশ্যই অন্তত একটি বড় হাতের অক্ষর (A-Z) থাকতে হবে!");
      toast.error("পাসওয়ার্ডে অন্তত একটি বড় হাতের অক্ষর দিন");
      return;
    }
    if (!hasLowerCase) {
      setErrorMsg("পাসওয়ার্ডে অবশ্যই অন্তত একটি ছোট হাতের অক্ষর (a-z) থাকতে হবে!");
      toast.error("পাসওয়ার্ডে অন্তত একটি ছোট হাতের অক্ষর দিন");
      return;
    }
    if (!isLengthValid) {
      setErrorMsg("পাসওয়ার্ডের দৈর্ঘ্য ন্যূনতম ৬ ক্যারেক্টার হতে হবে!");
      toast.error("পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে");
      return;
    }

    setLoading(true);

    try {
      const res = await signUp.email({
        name,
        email,
        password,
        image: photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      });

      if (res?.error) {
        const msg = res.error.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে! পুনরায় চেষ্টা করুন।";
        setErrorMsg(msg);
        toast.error(msg);
      } else {
        toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! অনুগ্রহ করে লগইন করুন।");
        router.push("/login");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "রেজিস্ট্রেশন করতে সমস্যা হয়েছে";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    try {
      await signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch {
      toast.error(`${provider} লগইন চালু করতে সমস্যা হয়েছে`);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-105">
              <BookOpen className="h-6 w-6" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            নতুন অ্যাকাউন্ট তৈরি করুন
          </h1>
          <p className="text-sm text-muted-foreground">
            বইঘুরি পরিবারে যুক্ত হতে নিচের তথ্যগুলো পূরণ করুন
          </p>
        </div>

        <Card className="border border-border/80 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-bold text-center">
              রেজিস্ট্রেশন (Register)
            </CardTitle>
            <CardDescription className="text-center text-xs">
              বই ধার নেওয়া এবং লাইব্রেরির সকল সুবিধা পেতে নিবন্ধন করুন
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  আপনার পূর্ণ নাম
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="উদাঃ রহিম আহমেদ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  ইমেইল অ্যাড্রেস
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              {/* Photo URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  প্রোফাইল ছবির লিঙ্ক (Photo URL)
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  পাসওয়ার্ড
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="কমপক্ষে ৬ ক্যারেক্টার (বড় ও ছোট অক্ষর সহ)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>

                {/* Password Criteria Checklist */}
                {password.length > 0 && (
                  <div className="p-3 bg-muted/60 rounded-lg space-y-1.5 text-xs border">
                    <p className="font-semibold text-muted-foreground">পাসওয়ার্ডের শর্তাবলী:</p>
                    <div className="flex items-center gap-1.5">
                      <span className={isLengthValid ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                        {isLengthValid ? <Check className="h-3.5 w-3.5 inline" /> : "•"} ন্যূনতম ৬টি ক্যারেক্টার
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={hasUpperCase ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                        {hasUpperCase ? <Check className="h-3.5 w-3.5 inline" /> : "•"} অন্তত একটি বড় হাতের অক্ষর (A-Z)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={hasLowerCase ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                        {hasLowerCase ? <Check className="h-3.5 w-3.5 inline" /> : "•"} অন্তত একটি ছোট হাতের অক্ষর (a-z)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || (password.length > 0 && !isPasswordValid)}
                className="w-full font-semibold rounded-lg shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    নিবন্ধন হচ্ছে...
                  </>
                ) : (
                  "রেজিস্টার করুন (Register)"
                )}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  অথবা সোশ্যাল সাইনআপ
                </span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin("google")}
                className="w-full flex items-center justify-center gap-2 text-xs"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin("github")}
                className="w-full flex items-center justify-center gap-2 text-xs"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </Button>
            </div>

            <div className="text-center text-xs text-muted-foreground pt-2">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                এখানে লগইন করুন (Login)
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
