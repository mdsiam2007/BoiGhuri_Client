"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Camera,
  Loader2,
  Check,
  AlertCircle,
  Upload,
  X,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { signUp, signIn } from "@/lib/auth-client";
import { uploadImageToCloud } from "@/lib/imageUpload";
import { syncJwtToken } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t, language } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    document.title = language === "bn" ? "বইঘুরি | রেজিস্ট্রেশন" : "BoiGhuri | Register";
  }, [language]);

  // Password validation checks
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const isLengthValid = password.length >= 6;
  const isPasswordValid = hasUpperCase && hasLowerCase && isLengthValid;

  // Direct profile picture upload handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(
        language === "bn"
          ? "অনুগ্রহ করে একটি সঠিক ছবি নির্বাচন করুন (JPG, PNG, WEBP)"
          : "Please select a valid image file (JPG, PNG, WEBP)"
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        language === "bn"
          ? "ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারে"
          : "Image size must be less than 5MB"
      );
      return;
    }

    // Immediate local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    setUploadingImage(true);

    try {
      const uploadedUrl = await uploadImageToCloud(file);
      setPhotoURL(uploadedUrl);
      toast.success(t.photoUploadSuccess);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.photoUploadFailed;
      toast.error(msg);
      // Keep local preview if upload fails but allow user to re-try or provide URL
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewImage(null);
    setPhotoURL("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !email || !password) {
      const msg =
        language === "bn"
          ? "নাম, ইমেইল এবং পাসওয়ার্ড আবশ্যক!"
          : "Name, email and password are required!";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    // Strict password validation
    if (!hasUpperCase) {
      const msg =
        language === "bn"
          ? "পাসওয়ার্ডে অবশ্যই অন্তত একটি বড় হাতের অক্ষর (A-Z) থাকতে হবে!"
          : "Password must contain at least one uppercase letter (A-Z)!";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }
    if (!hasLowerCase) {
      const msg =
        language === "bn"
          ? "পাসওয়ার্ডে অবশ্যই অন্তত একটি ছোট হাতের অক্ষর (a-z) থাকতে হবে!"
          : "Password must contain at least one lowercase letter (a-z)!";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }
    if (!isLengthValid) {
      const msg =
        language === "bn"
          ? "পাসওয়ার্ডের দৈর্ঘ্য ন্যূনতম ৬ ক্যারেক্টার হতে হবে!"
          : "Password must be at least 6 characters long!";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    if (uploadingImage) {
      toast.loading(t.uploadingPhoto);
      return;
    }

    setLoading(true);

    try {
      const res = await signUp.email({
        name,
        email,
        password,
        image:
          photoURL ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      });

      if (res?.error) {
        const msg = res.error.message || t.registerFailed;
        setErrorMsg(msg);
        toast.error(msg);
      } else {
        // Sync JWT token with backend since BetterAuth automatically establishes active session on registration
        await syncJwtToken({
          email,
          name,
          image:
            photoURL ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
        });

        toast.success(t.registerSuccess);
        router.push("/");
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.registerFailed;
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
      toast.error(
        language === "bn"
          ? `${provider} লগইন চালু করতে সমস্যা হয়েছে`
          : `Failed to initiate ${provider} login`
      );
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/BoiGhuri_horizontal_logo.png"
              alt="BoiGhuri Logo"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t.registerTitle}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t.registerSubtitle}
          </p>
        </div>

        <Card className="border border-border/80 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-bold text-center">
              {t.registerCardTitle}
            </CardTitle>
            <CardDescription className="text-center text-xs">
              {t.registerCardDesc}
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
              {/* Profile Picture Direct Upload Section */}
              <div className="flex flex-col items-center justify-center space-y-2.5 pb-2">
                <div className="relative group">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative h-20 w-20 rounded-full border-2 border-dashed border-primary/40 hover:border-primary cursor-pointer overflow-hidden bg-muted flex items-center justify-center transition-all shadow-inner"
                  >
                    {previewImage || photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewImage || photoURL}
                        alt="Profile Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors">
                        <Camera className="h-7 w-7" />
                        <span className="text-[10px] mt-0.5 font-medium">
                          {t.uploadPhoto}
                        </span>
                      </div>
                    )}

                    {uploadingImage && (
                      <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center backdrop-blur-xs">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="text-[9px] font-semibold text-primary mt-1">
                          {t.uploadingPhoto}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Direct upload trigger button / Remove photo button */}
                  {previewImage || photoURL ? (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 shadow hover:bg-destructive/90 transition-transform active:scale-95"
                      title={t.removePhoto}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  ) : null}
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                <div className="flex items-center gap-3 text-xs">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="h-8 text-xs flex items-center gap-1.5"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>{previewImage || photoURL ? t.changePhoto : t.uploadPhoto}</span>
                  </Button>

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-muted-foreground hover:text-foreground text-[11px] underline flex items-center gap-1"
                  >
                    <LinkIcon className="h-3 w-3" />
                    <span>{t.orUrl}</span>
                  </button>
                </div>

                {/* Optional direct URL input fallback */}
                {showUrlInput && (
                  <div className="w-full pt-1.5 animate-in fade-in duration-200">
                    <Input
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={photoURL}
                      onChange={(e) => {
                        setPhotoURL(e.target.value);
                        setPreviewImage(e.target.value);
                      }}
                      className="text-xs h-8"
                    />
                  </div>
                )}
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {t.fullNameLabel}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t.fullNamePlaceholder}
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
                  {t.emailLabel}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {t.passwordLabel}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder={t.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>

                {/* Password Criteria Checklist */}
                {password.length > 0 && (
                  <div className="p-3 bg-muted/60 rounded-lg space-y-1.5 text-xs border">
                    <p className="font-semibold text-muted-foreground">{t.passwordReqTitle}</p>
                    <div className="flex items-center gap-1.5">
                      <span className={isLengthValid ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}>
                        {isLengthValid ? <Check className="h-3.5 w-3.5 inline text-emerald-500" /> : "•"} {t.passMinLength}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={hasUpperCase ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}>
                        {hasUpperCase ? <Check className="h-3.5 w-3.5 inline text-emerald-500" /> : "•"} {t.passUpper}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={hasLowerCase ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}>
                        {hasLowerCase ? <Check className="h-3.5 w-3.5 inline text-emerald-500" /> : "•"} {t.passLower}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || uploadingImage || (password.length > 0 && !isPasswordValid)}
                className="w-full font-semibold rounded-lg shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.registering}
                  </>
                ) : (
                  t.registerBtn
                )}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  {t.orSocial}
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
              {t.haveAccount}{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                {t.loginHere}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
