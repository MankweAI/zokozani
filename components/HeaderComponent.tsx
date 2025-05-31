// components/HeaderComponent.tsx (Redesigned with Cover Image and Dynamic Text Color)

import Image from "next/image";
import type { CSSProperties } from "react";

interface CurrentUserHeaderInfo {
  fullName?: string;
  isSignedIn: boolean;
}

interface HeaderComponentProps {
  fullName: string;
  lifespan: string;
  portraitUrl: string;
  coverImageUrl?: string; // New optional prop for cover image
  currentUser?: CurrentUserHeaderInfo | null;
  onSignOut?: () => void;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  fullName,
  lifespan,
  portraitUrl,
  coverImageUrl,
  currentUser,
  onSignOut,
}) => {
  // Determine text color based on cover image presence
  // If there's a cover image, use white text for better contrast.
  // Otherwise, use a darker slate text.
  const textColorClass = coverImageUrl ? "text-white" : "text-slate-800";
  const lifespanColorClass = coverImageUrl
    ? "text-slate-200"
    : "text-slate-600";
  const borderColorClass = coverImageUrl ? "border-amber-400" : "border-white";

  // Inline style for background image for dynamic sizing
  const coverImageStyle: CSSProperties = coverImageUrl
    ? { backgroundImage: `url(${coverImageUrl})` }
    : {};

  return (
    <header className="relative w-full bg-white/70 shadow-md">
      {/* Cover Image Section */}
      {coverImageUrl && (
        <div
          className="relative w-full h-48 bg-cover bg-center bg-no-repeat" // Increased height for better visual impact
          style={coverImageStyle}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      )}

      <div
        className={`relative max-w-xl mx-auto px-4 pt-8 pb-10 flex flex-col items-center text-center 
        ${coverImageUrl ? "-mt-24" : "pt-20"}`}
      >
        {/* User Sign Out (if applicable) - repositioned for better visual flow */}
        {currentUser && currentUser.isSignedIn && onSignOut && (
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onSignOut}
              className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full shadow-md transition-colors"
            >
              Sign Out ({currentUser.fullName || "User"})
            </button>
          </div>
        )}

        <div
          className={`relative w-28 h-28 rounded-full overflow-hidden border-4 ${borderColorClass} shadow-lg transition-all duration-300 transform hover:scale-105`}
        >
          <Image
            src={portraitUrl}
            alt={`${fullName}'s portrait`}
            layout="fill" // Use layout="fill" for better responsive images with parent sizing
            objectFit="cover"
            priority
          />
        </div>

        <h1
          className={`text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 ${textColorClass} transition-colors duration-300`}
        >
          {fullName}
        </h1>
        <p
          className={`text-base italic mb-4 ${lifespanColorClass} transition-colors duration-300`}
        >
          {lifespan}
        </p>
      </div>
    </header>
  );
};

export default HeaderComponent;
