// components/HeaderComponent.tsx
import Image from "next/image";

interface HeaderComponentProps {
  fullName: string;
  lifespan: string;
  portraitUrl: string;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  fullName,
  lifespan,
  portraitUrl,
}) => {
  return (
    // Reduced stickiness for the header itself if tabs below are to manage their own stickiness or scroll.
    // Or keep it fully sticky if tabs are part of the page flow below.
    // For now, let's make it a standard header that scrolls, and tabs can be made sticky if needed.
    <header className="w-full py-6 md:py-8 px-4 text-center bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="max-w-xl mx-auto flex flex-col items-center space-y-4">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-slate-200 shadow-candle-light flex items-center justify-center">
          <Image
            src={portraitUrl}
            alt={`${fullName}'s portrait placeholder`}
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
