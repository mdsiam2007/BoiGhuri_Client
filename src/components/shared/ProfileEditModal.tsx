"use client";

import { useState, useEffect } from "react";
import { User, Mail, Image as ImageIcon, Loader2, Save, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { fetchWithAuth, syncJwtToken } from "@/lib/api";
import { updateUser } from "@/lib/auth-client";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  onSuccess: (updatedName: string, updatedImage?: string) => void;
}

export default function ProfileEditModal({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}: ProfileEditModalProps) {
  const { t, language } = useLanguage();
  const [name, setName] = useState(currentUser.name || "");
  const [image, setImage] = useState(currentUser.image || "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(currentUser.name || "");
      setImage(currentUser.image || "");
    }
  }, [isOpen, currentUser.name, currentUser.image]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(
        language === "bn" ? "নামের ঘর খালি রাখা যাবে না" : "Name cannot be empty"
      );
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading(
      language === "bn" ? "প্রোফাইল আপডেট করা হচ্ছে..." : "Updating profile..."
    );

    try {
      const trimmedName = name.trim();
      const trimmedImage = image.trim();

      // 1. Proactively ensure JWT token exists in localStorage
      let token = typeof window !== "undefined" ? localStorage.getItem("boighuri_jwt_token") : null;
      if (!token && currentUser.email) {
        const syncRes = await syncJwtToken({
          email: currentUser.email,
          name: trimmedName,
          image: trimmedImage || currentUser.image || "",
        });
        if (syncRes?.token) {
          token = syncRes.token;
        }
      }

      // 2. Update Better-Auth session and database user document
      try {
        await updateUser({
          name: trimmedName,
          image: trimmedImage || undefined,
        });
      } catch (authErr) {
        console.warn("Better-auth updateUser warning:", authErr);
      }

      // 3. Update backend database (books, reviews, borrows, and user doc) and retrieve fresh JWT
      const res = await fetchWithAuth("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: trimmedName,
          image: trimmedImage,
        }),
      });

      if (res.success) {
        if (res.token) {
          localStorage.setItem("boighuri_jwt_token", res.token);
        }
        toast.success(
          res.message ||
            (language === "bn"
              ? "প্রোফাইল সফলভাবে পরিবর্তন করা হয়েছে!"
              : "Profile updated successfully!"),
          { id: toastId }
        );
        onSuccess(trimmedName, trimmedImage);
        onClose();

        // Refresh to allow full session and navigation states to re-render
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        toast.error(
          res.message ||
            (language === "bn" ? "প্রোফাইল পরিবর্তন করা যায়নি" : "Failed to update profile"),
          { id: toastId }
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error";
      toast.error(msg, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-primary" />
            <span>{t.editProfileTitle}</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            {t.editProfileDesc}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-4 pt-2">
          {/* Read-Only Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-primary" /> {t.emailReadOnly}
            </label>
            <Input
              type="email"
              value={currentUser.email || ""}
              disabled
              className="bg-muted text-muted-foreground cursor-not-allowed text-xs font-medium"
            />
          </div>

          {/* Editable Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary" /> {t.editNameLabel} *
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.fullNamePlaceholder}
              required
              className="text-sm font-medium"
            />
          </div>

          {/* Optional Profile Photo URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-primary" /> {t.editPhotoLabel}
            </label>
            <Input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              {t.cancel}
            </Button>
            <Button type="submit" disabled={submitting} className="gap-2">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.saving}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {t.saveChanges}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
