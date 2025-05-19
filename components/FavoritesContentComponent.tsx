// components/FavoritesContentComponent.tsx
import React from "react";
import {
  Music2,
  BookOpenText,
  Clapperboard,
  Salad,
  UtensilsCrossed,
  MapPin,
  Heart, // Default or fallback icon
  Brush,
  Flower2,
  MessageSquareQuote,
  // We don't need to import 'Icon as LucideIcon' for this fix
  // Instead, we'll type the map values appropriately
} from "lucide-react";
import type { LucideProps } from "lucide-react"; // Import LucideProps for typing

// Define the type for the icon components in the map
// React.FC<LucideProps> is a more specific type for Lucide functional components
// React.ElementType is a more general type for any React component type
const iconMap: { [key: string]: React.FC<LucideProps> } = {
  // CORRECTED TYPE
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
  secondaryText?: string;
  note?: string;
}

interface FavoriteCategory {
  id: string;
  title: string;
  icon: string; // Icon name as string (key for iconMap)
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
  deceasedName,
}) => {
  const pageTitle = favoritesData.pageTitleKey.replace(
    "{deceasedName}",
    deceasedName
  );
  const introText = favoritesData.introTextKey.replace(
    "{deceasedName}",
    deceasedName
  );

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 md:py-12 animate-fade-in">
      <h2 className="text-3xl sm:text-4xl font-semibold text-center text-slate-800 mb-3">
        {pageTitle}
      </h2>
      <p className="text-slate-500 text-center mb-12 sm:mb-16 text-sm sm:text-base">
        {introText}
      </p>

      <div className="space-y-10 md:space-y-12">
        {favoritesData.categories.map((category, categoryIndex) => {
          const IconComponent = iconMap[category.icon] || Heart; // Fallback to Heart icon
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
                    <div className="flex flex-col">
                      <div>
                        <span className="font-medium text-slate-700">
                          {item.name}
                        </span>
                        {item.secondaryText && (
                          <span className="text-xs text-slate-400 ml-1.5">
                            ({item.secondaryText})
                          </span>
                        )}
                      </div>
                      {item.note && (
                        <p className="text-xs text-slate-500 mt-0.5 italic">
                          {item.note}
                        </p>
                      )}
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
