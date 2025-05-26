// components/HeaderComponent.tsx (Reverted to soft white shadows)

import Image from "next/image";

interface CurrentUserHeaderInfo {
  fullName?: string;
  isSignedIn: boolean;
}

interface HeaderComponentProps {
  fullName: string;
  lifespan: string;
  portraitUrl: string;
  currentUser?: CurrentUserHeaderInfo | null;
  onSignOut?: () => void;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  fullName,
  lifespan,
  portraitUrl,
}) => {
  return (
    <header className="relative w-full bg-white/70 shadow-md pb-10">
      <div className="absolute top-0 right-0 p-3">
      </div>

      <div className="max-w-xl mx-auto px-4 pt-20 flex flex-col items-center space-y-4 text-center">
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-200">
          <Image
            src={portraitUrl}
            alt={`${fullName}'s portrait`}
            width={112}
            height={112}
            className="object-cover w-full h-full"
            priority
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-800 tracking-tight">
          {fullName}
        </h1>
        <p className="text-sm text-slate-600 italic">{lifespan}</p>
      </div>
    </header>
  );
};

export default HeaderComponent;
