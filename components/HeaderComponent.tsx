// components/HeaderComponent.tsx
import Image from "next/image";
import { LogOut } from "lucide-react"; // Import LogOut icon

// Define a simpler type for currentUser prop for the header
interface CurrentUserHeaderInfo {
  fullName?: string;
  isSignedIn: boolean;
}

interface HeaderComponentProps {
  fullName: string; // Deceased's full name
  lifespan: string;
  portraitUrl: string;
  currentUser?: CurrentUserHeaderInfo | null; // Pass current user status
  onSignOut?: () => void; // Pass sign out handler
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  fullName,
  lifespan,
  portraitUrl,
  currentUser,
  onSignOut,
}) => {
  return (
    <header className="w-full py-6 md:py-8 px-4 text-center bg-white/80 backdrop-blur-sm shadow-sm">
      {/* Max-width container made relative for positioning the logout button */}
      <div className="max-w-xl mx-auto flex flex-col items-center space-y-4 relative">
        {/* Logout Button - positioned top-right of this container */}
        {currentUser?.isSignedIn &&
          onSignOut &&
          process.env.NODE_ENV === "development" && (
            <div className="absolute top-0 right-0 p-1 sm:p-0"> {/* Adjust padding as needed */}
              <button
                onClick={onSignOut}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title={`Sign out ${currentUser.fullName || ""} (Dev Only)`}
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          )}

        {/* Portrait - will be below the absolutely positioned logout button in stacking context but visually aligned by eye */}
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-slate-200 shadow-candle-light flex items-center justify-center mt-0 sm:mt-0"> {/* Adjusted margin-top if logout button is above */}
          <Image
            src={portraitUrl}
            alt={`${fullName}'s portrait`} 
            width={112}
            height={112}
            className="object-cover w-full h-full"
            priority
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-800">
          {fullName}
        </h1>
        <p className="text-md text-slate-600">{lifespan}</p>
      </div>
    </header>
  );
};

export default HeaderComponent;