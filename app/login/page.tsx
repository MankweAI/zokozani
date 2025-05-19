// app/login/page.tsx
"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Lock, Users, LogInIcon } from "lucide-react";
import { MOCK_USER_STORAGE_KEY, type MockUserData } from "@/lib/constants";

const DECEASED_INFO_FOR_LOGIN = {
  fullName: "Lerato Nomvula Mnguni",
  portraitPlaceholderUrl: "/assets/images/portrait.png",
};

export default function LoginPage() {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [relationship, setRelationship] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(MOCK_USER_STORAGE_KEY);
      if (raw) {
        try {
          JSON.parse(raw);
          router.replace("/");
          return;
        } catch {
          localStorage.removeItem(MOCK_USER_STORAGE_KEY);
        }
      }
    }
    setIsCheckingAuth(false);
  }, [router]);

  const handleMockLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !password.trim() || !relationship.trim()) {
      setError("Please complete all fields to continue.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 750));

    try {
      const userData: MockUserData = {
        fullName: fullName.trim(),
        relationship: relationship.trim(),
      };
      localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(userData));
      router.replace("/");
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 to-slate-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-stone-100 to-slate-200 p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white shadow-2xl rounded-xl p-6 space-y-6">
        <div className="text-center space-y-3 border-b border-slate-200 pb-6">
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-slate-100 shadow-md flex items-center justify-center ring-2 ring-amber-100">
            <Image
              src={DECEASED_INFO_FOR_LOGIN.portraitPlaceholderUrl}
              alt={`${DECEASED_INFO_FOR_LOGIN.fullName} portrait`}
              width={80}
              height={80}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <p className="text-sm text-slate-500">In loving memory of</p>
          <h1 className="text-2xl font-semibold text-slate-800">
            {DECEASED_INFO_FOR_LOGIN.fullName}
          </h1>
          <p className="text-xs text-slate-400">
            Please sign in to share your tribute.
          </p>
        </div>

        <form onSubmit={handleMockLogin} className="space-y-5">
          <LabeledInput
            id="fullName"
            name="fullName"
            icon={<User className="h-5 w-5 text-slate-400" />}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            disabled={isSubmitting}
            autoComplete="name"
          />

          <LabeledInput
            id="password"
            name="password"
            type="password"
            icon={<Lock className="h-5 w-5 text-slate-400" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a password for this visit"
            disabled={isSubmitting}
            autoComplete="new-password"
          />

          <LabeledInput
            id="relationship"
            name="relationship"
            icon={<Users className="h-5 w-5 text-slate-400" />}
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            placeholder="e.g., Husband, Daughter"
            disabled={isSubmitting}
          />

          {error && (
            <p className="text-xs text-red-600 bg-red-50 p-3 rounded-md text-center border border-red-200 animate-shake">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg disabled:opacity-70 transition"
          >
            {isSubmitting ? (
              <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full" />
            ) : (
              <>
                <LogInIcon className="h-5 w-5 mr-2" />
                Access Tribute Wall
              </>
            )}
          </button>
        </form>
      </div>

      <footer className="mt-8 text-xs text-slate-400 text-center">
        © {new Date().getFullYear()} The Family of{" "}
        {DECEASED_INFO_FOR_LOGIN.fullName}
      </footer>
    </div>
  );
}

function LabeledInput({
  id,
  name,
  type = "text",
  icon,
  value,
  onChange,
  placeholder,
  disabled,
  autoComplete,
}: {
  id: string;
  name: string;
  type?: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700 mb-1.5"
      >
        {/* {label} */}
      </label>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          {icon}
        </div>
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete || "off"}
          className="pl-10 pr-3 py-2.5 w-full border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-colors"
        />
      </div>
    </div>
  );
}



// Removed the second export default LoginPage; as it was redundant.
