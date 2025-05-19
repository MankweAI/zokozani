// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import HeaderComponent from "@/components/HeaderComponent";
import TributeFeedComponent from "@/components/TributeFeedComponent";
// Assuming TributeCardData interface (defined in TributeCardComponent.tsx)
// now includes 'relationship: string;' as a required field.
import { type TributeCardData } from "@/components/TributeCardComponent";
import TributeInputComponent, {
  type NewTributeDataFromInput,
} from "@/components/TributeInputComponent";
import {
  loadTributesFromLocalStorage,
  saveTributesToLocalStorage,
} from "@/lib/localStorageUtils";
import {
  Info,
  MessageSquareText,
  // LogOut,
  CheckCircle,
  Heart, // Icon for Favorites tab
} from "lucide-react";
import { MOCK_USER_STORAGE_KEY, type MockUserData } from "./login/page";

// Import the Favorites component
import FavoritesContentComponent, {
  type FavoritesData,
} from "@/components/FavoritesContentComponent";

// Updated TabName type (Gallery removed)
type TabName = "Tributes" | "About" | "Favorites";

const deceasedInfo = {
  fullName: "Lerato Nomvula Mnguni",
  lifespan: "1976 – 2025",
  portraitPlaceholderUrl: "/assets/images/portrait.png", // Ensure this image exists
};

// Favorites Data for Nomvula Mkhize
const deceasedFavoritesData: FavoritesData = {
  pageTitleKey: "Celebrating Lerato's favorite things",
  introTextKey:
    "",
  categories: [
    {
      id: "music",
      title: "Music",
      icon: "Music2",
      items: [
        {
          name: "Bayede Nkosi",
          secondaryText: "Joyous Celebration",
          note: "A song that brought her to tears during worship.",
        },
        {
          name: "Wena Uyingcwele",
          secondaryText: "Rebecca Malope",
          note: "Often played in the house on Sunday mornings.",
        },
        {
          name: "Ke Na Le Modisa",
          secondaryText: "Solly Mahlangu",
          note: "A song she called her personal prayer.",
        },
        {
          name: "Lihle Izulu",
          secondaryText: "Spirit of Praise",
          note: "Her comfort during difficult times.",
        },
      ],
    },
    {
      id: "books",
      title: "Books",
      icon: "BookOpenText",
      items: [
        {
          name: "The Bible",
          secondaryText: "King James Version",
          note: "Her daily source of strength and wisdom.",
        },
        {
          name: "The Purpose Driven Life",
          secondaryText: "Rick Warren",
          note: "Shaped how she understood her calling.",
        },
        {
          name: "Quiet Strength",
          secondaryText: "Tony Dungy",
          note: "She admired its message of faith and leadership.",
        },
      ],
    },
    {
      id: "movies_tv",
      title: "Movies & TV",
      icon: "Clapperboard",
      items: [
        {
          name: "The Color Purple",
          note: "Moved her deeply with its story of resilience and sisterhood.",
        },
        {
          name: "Faith Like Potatoes",
          secondaryText: "South African Film",
          note: "She loved the message of faith against all odds.",
        },
        {
          name: "Generations (Classic episodes)",
          secondaryText: "TV Show",
          note: "A nostalgic favourite from family evenings.",
        },
      ],
    },
    {
      id: "food",
      title: "Foods",
      icon: "Salad",
      items: [
        {
          name: "Umngqusho",
          secondaryText: "Samp and Beans",
          note: "Her comfort food after church on Sundays.",
        },
        {
          name: "Mogodu",
          secondaryText: "Traditional Tripe",
          note: "Often prepared for family gatherings.",
        },
        {
          name: "Pumpkin with Cinnamon",
          secondaryText: "Sweet Traditional Side",
        },
        {
          name: "Chakalaka",
          secondaryText: "Spicy Vegetable Relish",
        },
        {
          name: "Homemade Ginger Biscuits",
          note: "A family favourite she baked with love.",
        },
      ],
    },
    {
      id: "restaurants",
      title: "Restaurants",
      icon: "UtensilsCrossed",
      items: [
        {
          name: "Wimpy",
          secondaryText: "Tembisa",
          note: "A special treat with the kids after church.",
        },
        {
          name: "Moyo",
          secondaryText: "Melrose Arch",
          note: "She enjoyed the cultural ambiance and music.",
        },
        {
          name: "The Fish & Chip Co.",
          note: "Her go-to for quick seafood on Fridays.",
        },
      ],
    },
    {
      id: "places_sa",
      title: "Places",
      icon: "MapPin",
      items: [
        {
          name: "Kruger National Park",
          note: "A place of peace and connection with nature.",
        },
        {
          name: "Durban Beachfront",
          note: "She loved the sea breeze and family picnics.",
        },
        {
          name: "Church Retreat in Magaliesburg",
          note: "A place where she reconnected with God and herself.",
        },
      ],
    },
  ],
};


interface CurrentUser extends MockUserData {
  // MockUserData requires relationship: string
  isSignedIn: boolean;
}

interface AboutContentProps {
  fullName: string;
  lifespan: string;
}

const AboutContent: React.FC<AboutContentProps> = ({ fullName, lifespan }) => {
  const [] = lifespan
    .split("–")
    .map((year) => year.trim());

  return (
    <div className="bg-white rounded-xl shadow-candle-light p-6 md:p-8 max-w-xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-semibold text-center text-slate-800 mb-4">
        In Loving Memory of <br className="sm:hidden" /> {fullName}
      </h2>
      <hr className="w-1/4 mx-auto border-slate-300 my-6" />
      <div className="space-y-6 text-slate-700 leading-relaxed text-left sm:text-justify text-sm sm:text-base">
        <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-slate-800 first-letter:mr-3 first-letter:float-left">
          Born in 1976 at Kalafong Hospital and raised in Tembisa, Lerato was a
          devoted wife to Alpheus Mnguni and a proud mother of four — two girls
          and two boys. Her family was the centre of her world. She created a
          home filled with warmth, faith, and care.
        </p>
        <p>
          Lerato was a woman of deep faith. As a born-again Christian, she
          served faithfully in her church, always putting others before herself
          and living out her beliefs through action and kindness.
        </p>
        <p>
          She was also a gifted pre-school teacher. After matriculating from
          Eqinisweni Secondary and earning her degree in Child Education at
          Wits, she went on to shape many young lives. Teaching was her calling
          — one she fulfilled with patience and heart.
        </p>
        <p>
          Lerato was selfless and full of love. She touched lives wherever she
          went — in her family, her church, her classroom, and her community.
        </p>
        <p>
          We will miss her dearly. Rest well, Lerato. Your love and light live
          on.
        </p>
      </div>
    </div>
  );
};

export default function TributePage() {
  const [activeTab, setActiveTab] = useState<TabName>("Tributes");
  const [tributes, setTributes] = useState<TributeCardData[]>([]);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [showPostSuccessToast, setShowPostSuccessToast] = useState(false);
  const router = useRouter();

  const tabs: { name: TabName; label: string; icon: React.ElementType }[] = [
    { name: "Tributes", label: "Tributes", icon: MessageSquareText },
    { name: "About", label: "About", icon: Info },
    { name: "Favorites", label: "Favorites", icon: Heart },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserData = localStorage.getItem(MOCK_USER_STORAGE_KEY);
      if (storedUserData) {
        try {
          const parsedData: MockUserData = JSON.parse(storedUserData);
          // Ensure relationship is present, as it's required by MockUserData
          if (parsedData.fullName && parsedData.relationship) {
            setCurrentUser({ ...parsedData, isSignedIn: true });
            const loadedTributes = loadTributesFromLocalStorage(
              deceasedInfo.fullName
            );
            setTributes(loadedTributes);
          } else {
            // Data is incomplete/corrupted if relationship is missing
            localStorage.removeItem(MOCK_USER_STORAGE_KEY);
            router.replace("/login");
            return;
          }
        } catch (e) {
          console.error(
            "Error parsing user data from localStorage, redirecting to login.",
            e
          );
          localStorage.removeItem(MOCK_USER_STORAGE_KEY);
          router.replace("/login");
          return;
        }
      } else {
        router.replace("/login");
        return;
      }
      setIsInitialLoadComplete(true);
      setIsLoadingPage(false);
    }
  }, [router]);

  useEffect(() => {
    if (isInitialLoadComplete && currentUser?.isSignedIn) {
      saveTributesToLocalStorage(deceasedInfo.fullName, tributes);
    }
  }, [tributes, isInitialLoadComplete, currentUser]);

  const handleTabClick = (tabName: TabName) => {
    setActiveTab(tabName);
  };

  // MODIFIED handleAddTribute to include relationship
  const handleAddTribute = async (
    data: NewTributeDataFromInput
  ): Promise<void> => {
    if (
      !currentUser?.isSignedIn ||
      !currentUser.fullName ||
      !currentUser.relationship
    ) {
      alert(
        "User information is incomplete or you are not signed in. Please sign in again to post a tribute."
      );
      router.push("/login");
      return;
    }

    const newTribute: TributeCardData = {
      id: uuidv4(),
      name: currentUser.fullName,
      relationship: currentUser.relationship, // Now correctly adding the required relationship
      message: data.message,
      timestamp: Date.now(),
      attachmentType: data.attachmentType,
      attachmentValue: data.attachmentValue,
    };

    setTributes((prevTributes) => [newTribute, ...prevTributes]);
    setShowPostSuccessToast(true);
    setTimeout(() => setShowPostSuccessToast(false), 3000);
    // Simulate submission delay if needed, or remove if onAddTribute in props is async
    // await new Promise((resolve) => setTimeout(resolve, 500));
  };

  // const handleSignOut = () => {
  //   if (typeof window !== "undefined") {
  //     if (process.env.NODE_ENV === "development") {
  //       localStorage.removeItem(MOCK_USER_STORAGE_KEY);
  //       setCurrentUser(null);
  //       router.push("/login");
  //     } else {
  //       alert(
  //         "Simulated sign-out. Session would typically expire or be managed server-side."
  //       );
  //       localStorage.removeItem(MOCK_USER_STORAGE_KEY);
  //       router.push("/login");
  //     }
  //   }
  // };

  // const handleClearAllTributes = () => {
  //   if (typeof window !== "undefined") {
  //     if (
  //       window.confirm(
  //         "DEVELOPMENT: Are you sure you want to delete ALL tributes for this page? This cannot be undone."
  //       )
  //     ) {
  //       saveTributesToLocalStorage(deceasedInfo.fullName, []);
  //       setTributes([]);
  //       alert(
  //         "All tributes for this page have been cleared from local storage."
  //       );
  //     }
  //   }
  // };

  if (isLoadingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-600"></div>
        <p className="ml-4 text-slate-600">Loading Tribute Wall...</p>
      </div>
    );
  }

  if (!currentUser?.isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-stone-50 to-slate-100">
      <HeaderComponent
        fullName={deceasedInfo.fullName}
        lifespan={deceasedInfo.lifespan}
        portraitUrl={deceasedInfo.portraitPlaceholderUrl}
      />
      {/* {currentUser?.isSignedIn && process.env.NODE_ENV === "development" && (
        <div className="flex-shrink-0 ml-2">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title={`Sign out ${currentUser.fullName} (Dev Only)`}
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      )} */}

      <nav className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-xl mx-auto flex items-center justify-center px-2 sm:px-0">
          <div
            className="flex justify-start sm:justify-center sm:flex-grow space-x-0 md:space-x-2"
            role="tablist"
            aria-label="Page sections"
          >
            {tabs.map((tab) => (
              <button
                key={tab.name}
                type="button"
                role="tab"
                id={`tab-${tab.name}`}
                aria-selected={activeTab === tab.name}
                aria-controls={`tabpanel-${tab.name}`}
                onClick={() => handleTabClick(tab.name)}
                tabIndex={activeTab === tab.name ? 0 : -1}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-3 sm:px-4 text-xs sm:text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1 rounded-t-md
                  ${
                    activeTab === tab.name
                      ? "border-b-2 border-amber-600 text-amber-700"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                  }
                `}
              >
                <tab.icon size={16} aria-hidden="true" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="text-center px-4">

        {isInitialLoadComplete &&
          activeTab === "Tributes" &&
          tributes.length === 0 && (
            <p className="text-sm text-slate-500 animate-fade-in mt-1">
              Be the first to share a memory.
            </p>
          )}
      </div>

      <main className="flex-grow w-full pt-2 pb-4 relative">
        {tabs.map((tab) => (
          <div
            key={tab.name}
            id={`tabpanel-${tab.name}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.name}`}
            hidden={activeTab !== tab.name}
            className={`${
              activeTab === tab.name ? "tab-content-active" : ""
            } px-2`}
          >
            {activeTab === tab.name && (
              <>
                {tab.name === "Tributes" && (
                  <TributeFeedComponent tributes={tributes} />
                )}
                {tab.name === "About" && (
                  <AboutContent
                    fullName={deceasedInfo.fullName}
                    lifespan={deceasedInfo.lifespan}
                  />
                )}
                {tab.name === "Favorites" && (
                  <FavoritesContentComponent
                    favoritesData={deceasedFavoritesData}
                    deceasedName={deceasedInfo.fullName}
                  />
                )}
              </>
            )}
          </div>
        ))}
      </main>

      {activeTab === "Tributes" && currentUser?.isSignedIn && (
        <TributeInputComponent onAddTribute={handleAddTribute} />
      )}

      {showPostSuccessToast && (
        <div
          className="fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-6 md:left-auto md:right-6 md:translate-x-0 bg-green-600 text-white py-2.5 px-5 rounded-lg shadow-xl animate-fade-in z-50 text-sm flex items-center gap-2"
          role="alert"
          aria-live="assertive"
        >
          <CheckCircle size={18} />
          Tribute posted successfully!
        </div>
      )}

      {/* {process.env.NODE_ENV === "development" && currentUser?.isSignedIn && (
        <div className="text-center py-6">
          <button
            onClick={handleClearAllTributes}
            className="px-4 py-2 bg-red-100 text-red-700 text-xs rounded-md hover:bg-red-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            Clear All Tributes (Dev Only)
          </button>
        </div>
      )} */}
    </div>
  );
}
