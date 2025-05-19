import React, { useState, useRef } from "react";
import {
  Music2,
  BookOpenText,
  Clapperboard,
  Salad,
  UtensilsCrossed,
  MapPin,
  Heart,
  Brush,
  Flower2,
  MessageSquareQuote,
  Pause,
  Play,
} from "lucide-react";
import type { LucideProps } from "lucide-react";

const iconMap: { [key: string]: React.FC<LucideProps> } = {
  Music2,
  BookOpenText,
  Clapperboard,
  Salad,
  UtensilsCrossed,
  MapPin,
  Heart,
  Brush,
  Flower2,
  MessageSquareQuote,
};

interface FavoriteItem {
  name: string;
  id: string;
  secondaryText?: string;
  note?: string;
  // Optionally, you could add a songUrl here in phase 2, for now, simulate only
}

interface FavoriteCategory {
  id: string;
  title: string;
  icon: string;
  items: FavoriteItem[];
}

export interface FavoritesData {
  pageTitleKey: string;
  introTextKey: string;
  categories: FavoriteCategory[];
}

interface FavoritesContentComponentProps {
  favoritesData: FavoritesData;
  deceasedName: string;
}

const FavoritesContentComponent: React.FC<FavoritesContentComponentProps> = ({
  favoritesData,
  // deceasedName,
}) => {
  // const pageTitle = favoritesData.pageTitleKey.replace(
  //   "{deceasedName}",
  //   deceasedName
  // );
  // const introText = favoritesData.introTextKey.replace(
  //   "{deceasedName}",
  //   deceasedName
  // );

  // State for music simulation
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimeout = useRef<NodeJS.Timeout | null>(null);

  // Find the music category (by convention: icon === 'Music2')
  const musicCategoryIndex = favoritesData.categories.findIndex(
    (cat) => cat.icon === "Music2"
  );

  // Helper for starting/stopping simulated music
  const handlePlayClick = (songIdx: number) => {
    // If clicking the same song, toggle play/pause
    if (playingIndex === songIdx && isPlaying) {
      setIsPlaying(false);
      if (playTimeout.current) clearTimeout(playTimeout.current);
      return;
    }
    setPlayingIndex(songIdx);
    setIsPlaying(true);

    // Simulate song duration (e.g., 10 seconds)
    if (playTimeout.current) clearTimeout(playTimeout.current);
    playTimeout.current = setTimeout(() => {
      setIsPlaying(false);
      setPlayingIndex(null);
    }, 10000);
  };

  // Pause music when unmounting
  React.useEffect(() => {
    return () => {
      if (playTimeout.current) clearTimeout(playTimeout.current);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 md:py-12 animate-fade-in">
      {/* <h2 className="text-3xl sm:text-4xl font-semibold text-center text-slate-800 mb-3">
        {pageTitle}
      </h2> */}
      {/* <p className="text-slate-500 text-center mb-12 sm:mb-16 text-sm sm:text-base">
        {introText}
      </p> */}

      <div className="space-y-10 md:space-y-12">
        {favoritesData.categories.map((category, categoryIndex) => {
          const IconComponent = iconMap[category.icon] || Heart;
          const isMusic = categoryIndex === musicCategoryIndex;
          return (
            <section key={category.id}>
              <div className="flex items-center mb-4">
                <IconComponent
                  size={20}
                  className="text-slate-500 mr-2.5 flex-shrink-0"
                />
                <h3 className="text-lg sm:text-xl font-semibold text-slate-700">
                  {category.title}
                </h3>
              </div>
              <ul className="space-y-2.5 list-none pl-0 md:pl-[30px]">
                {category.items.map((item, index) => (
                  <li
                    key={index}
                    className="text-slate-600 text-sm sm:text-base"
                  >
                    <div className="flex items-center">
                      {/* Show play button if music section */}
                      {isMusic ? (
                        <button
                          type="button"
                          onClick={() => handlePlayClick(index)}
                          className={`mr-2 w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 transition-colors ${
                            playingIndex === index && isPlaying
                              ? "bg-amber-100 border-amber-400"
                              : "hover:bg-slate-100"
                          }`}
                          aria-label={
                            playingIndex === index && isPlaying
                              ? `Pause ${item.name}`
                              : `Play ${item.name}`
                          }
                        >
                          {playingIndex === index && isPlaying ? (
                            <Pause size={20} className="text-amber-600" />
                          ) : (
                            <Play size={20} className="text-slate-500" />
                          )}
                        </button>
                      ) : null}

                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <span className="font-medium text-slate-700">
                            {item.name}
                          </span>
                          {item.secondaryText && (
                            <span className="text-xs text-slate-400 ml-1.5">
                              ({item.secondaryText})
                            </span>
                          )}
                          {/* Simulated playing indicator */}
                          {isMusic && playingIndex === index && isPlaying && (
                            <span className="ml-2 text-amber-600 text-xs animate-pulse">
                              Playing...
                            </span>
                          )}
                        </div>
                        {item.note && (
                          <p className="text-xs text-slate-500 mt-0.5 italic">
                            {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {categoryIndex < favoritesData.categories.length - 1 && (
                <hr className="mt-10 md:mt-12 border-slate-200" />
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default FavoritesContentComponent;
