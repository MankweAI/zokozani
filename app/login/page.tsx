// app/login/page.tsx
"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Lock, Users, LogInIcon } from "lucide-react";

const DECEASED_INFO_FOR_LOGIN = {
  fullName: "Lerato Nomvula Mnguni",
  portraitPlaceholderUrl: "/assets/images/portrait.png",
};

export const MOCK_USER_STORAGE_KEY = "tributeWall_mockUser_v1";

export interface MockUserData {
  fullName: string;
  relationship: string;
}

// Changed from React.FC to a standard function component definition
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
      const storedUserData = localStorage.getItem(MOCK_USER_STORAGE_KEY);
      if (storedUserData) {
        try {
          JSON.parse(storedUserData);
          router.replace("/");
          // Return to ensure no further state updates if redirecting
          return;
        } catch {
          localStorage.removeItem(MOCK_USER_STORAGE_KEY);
          setIsCheckingAuth(false);
        }
      } else {
        setIsCheckingAuth(false);
      }
    }
  }, [router]);

  const handleMockLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!fullName.trim() || !password.trim() || !relationship.trim()) {
      setError("Please complete all fields to continue.");
      return;
    }
    if (password.length < 1) {
      setError("Password is required for this simulation.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 750));

    if (typeof window !== "undefined") {
      try {
        const userData: MockUserData = {
          fullName: fullName.trim(),
          relationship: relationship.trim(),
        };
        localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(userData));
        router.push("/");
      } catch (e) {
        console.error("Error saving user data to localStorage", e);
        setError("An unexpected error occurred. Please try again.");
        setIsSubmitting(false);
      }
    } else {
      setError(
        "An unexpected error occurred. Please check your connection or browser."
      );
      setIsSubmitting(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 to-slate-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-stone-100 to-slate-200 p-4 selection:bg-amber-500 selection:text-white animate-fade-in">
      <div className="w-full max-w-sm bg-white shadow-2xl rounded-xl p-6 sm:p-10 space-y-6 transform transition-all hover:shadow-amber-200/50 duration-300 ease-out">
        <div className="text-center space-y-3 border-b border-slate-200 pb-6">
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-slate-100 shadow-md flex items-center justify-center ring-2 ring-amber-100">
            <Image
              src={DECEASED_INFO_FOR_LOGIN.portraitPlaceholderUrl}
              alt={`${DECEASED_INFO_FOR_LOGIN.fullName}'s portrait`}
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
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Your Full Name
            </label>
            <LoginInputComponent
              id="fullName"
              name="fullName"
              icon={
                <User className="h-5 w-5 text-slate-400" aria-hidden="true" />
              }
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              disabled={isSubmitting}
              autoComplete="name"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Password{" "}
              <span className="text-xs text-slate-400">(any characters)</span>
            </label>
            <LoginInputComponent
              id="password"
              name="password"
              type="password"
              icon={
                <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password for this visit"
              disabled={isSubmitting}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label
              htmlFor="relationship"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Your Relationship to{" "}
              {DECEASED_INFO_FOR_LOGIN.fullName.split(" ")[0]}
            </label>
            <LoginInputComponent
              id="relationship"
              name="relationship"
              icon={
                <Users className="h-5 w-5 text-slate-400" aria-hidden="true" />
              }
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="e.g., Friend, Daughter, Colleague"
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 p-3 rounded-md text-center border border-red-200 animate-shake">
              {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-150 ease-in-out group"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogInIcon
                    className="h-5 w-5 mr-2 -ml-1 group-hover:translate-x-0.5 transition-transform duration-200"
                    aria-hidden="true"
                  />
                  Access Tribute Wall
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-slate-500 pt-4">
          By signing in, you agree to share tributes respectfully.
        </p>
      </div>

      <footer className="mt-8 text-center text-xs text-slate-400">
        <p>
          &copy; {new Date().getFullYear()} The Family of{" "}
          {DECEASED_INFO_FOR_LOGIN.fullName}.
        </p>
        <p>Frontend-only simulation for tribute sharing.</p>
      </footer>
    </div>
  );
}

const LoginInputComponent = ({
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  disabled = false,
  autoComplete,
  required = true,
}: {
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: React.ReactNode;
  disabled?: boolean;
  autoComplete?: string;
  required?: boolean;
}) => (
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
      required={required}
      autoComplete={autoComplete || "off"}
      className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-colors"
    />
  </div>
);

// Removed the second export default LoginPage; as it was redundant.
