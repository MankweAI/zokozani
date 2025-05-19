// app/login/page.tsx
"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Lock, Users, LogInIcon } from "lucide-react";

// Using the constant name from your provided code
const DECEASED_INFO_FOR_LOGIN = {
  fullName: "Lerato Nomvula Mnguni", // Used for display on login page
  portraitPlaceholderUrl: "/assets/images/portrait.png", // Ensure this image exists in public/assets/images
};

export const MOCK_USER_STORAGE_KEY = "tributeWall_mockUser_v1";

export interface MockUserData {
  fullName: string;
  relationship: string;
}

const LoginPage: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState(""); // For simulation purposes only
  const [relationship, setRelationship] = useState("");
  // Corrected loading states
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // For initial auth check
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserData = localStorage.getItem(MOCK_USER_STORAGE_KEY);
      if (storedUserData) {
        try {
          JSON.parse(storedUserData);
          router.replace("/");
          // No need to setIsCheckingAuth(false) here, as component will unmount
        } catch {
          localStorage.removeItem(MOCK_USER_STORAGE_KEY);
          setIsCheckingAuth(false); // Allow login form to render if data corrupted
        }
      } else {
        setIsCheckingAuth(false); // Allow login form to render if no user data
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

    setIsSubmitting(true); // Use isSubmitting for form action
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
        setIsSubmitting(false); // Reset on error
      }
    } else {
      setError(
        "An unexpected error occurred. Please check your connection or browser."
      );
      setIsSubmitting(false); // Reset on error
    }
  };

  if (isCheckingAuth) {
    // Show loader during initial auth check
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 to-slate-200">
        {/* This loader matches the one from your provided code */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-600"></div>
      </div>
    );
  }

  return (
    // Matching the overall page structure and styling from your provided code
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-stone-100 to-slate-200 p-4 selection:bg-amber-500 selection:text-white animate-fade-in">
      {/* Card styling from your provided code */}
      <div className="w-full max-w-sm bg-white shadow-2xl rounded-xl p-6 sm:p-10 space-y-6 transform transition-all hover:shadow-amber-200/50 duration-300 ease-out">
        {/* Header section from your provided code */}
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

        {/* Form structure from your provided code */}
        <form onSubmit={handleMockLogin} className="space-y-5">
          <div>
            {/* Using the Input component structure from your code */}
            <LoginInputComponent
              id="fullName"
              name="fullName" // Added name for consistency
              icon={
                <User className="h-5 w-5 text-slate-400" aria-hidden="true" />
              }
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              disabled={isSubmitting} // Use isSubmitting for form elements
              autoComplete="name"
            />
          </div>

          <div>
            <LoginInputComponent
              id="password"
              name="password" // Added name
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

            <LoginInputComponent
              id="relationship"
              name="relationship" // Added name
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
            // Error styling from your code
            <p className="text-xs text-red-600 bg-red-50 p-3 rounded-md text-center border border-red-200 animate-shake">
              {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting} // Use isSubmitting
              // Button styling from your code
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-150 ease-in-out group"
            >
              {isSubmitting ? ( // Check isSubmitting for spinner
                // Spinner from your code (adapted for button context)
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

        {/* Footer text from your code */}
        <p className="text-center text-xs text-slate-500 pt-4">
          By signing in, you agree to share tributes respectfully.
        </p>
      </div>

      <footer className="mt-8 text-center text-xs text-slate-400">
        <p>
          &copy; {new Date().getFullYear()} The Family of{" "}
          {DECEASED_INFO_FOR_LOGIN.fullName}.
        </p>
      </footer>
    </div>
  );
};

// Re-defining the Input component as it was in your provided snippet
// Renamed to LoginInputComponent to avoid conflict if MinimalInput exists elsewhere
const LoginInputComponent = ({
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  disabled = false,
  autoComplete, // Added autoComplete
  required = true, // Added required
}: {
  id: string;
  name: string; // Added name
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: React.ReactNode;
  disabled?: boolean;
  autoComplete?: string; // Added autoComplete
  required?: boolean; // Added required
}) => (
  // Styling from your provided Input component
  <div className="relative rounded-md shadow-sm">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}{" "}
      {/* Icon color is handled by the icon itself from lucide if default */}
    </div>
    <input
      id={id}
      name={name} // Use name prop
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled} // Pass disabled prop
      required={required} // Pass required prop
      autoComplete={autoComplete} // Pass autoComplete prop
      className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-colors"
    />
  </div>
);

export default LoginPage;
