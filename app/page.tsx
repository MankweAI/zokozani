// app/page.tsx (Modified to include subtle FuneralHomeCTA and manage PostPaymentConfirmation)
"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import HeaderComponent from "@/components/HeaderComponent";
import TributeInputComponent, {
  type NewTributeDataFromInput,
} from "@/components/TributeInputComponent"; // This is TributeInputComponent_V3_Ecommerce
import PostPaymentConfirmationComponent from "@/components/PostPaymentConfirmationComponent";
import FuneralHomeCTAComponent from "@/components/FuneralHomeCTAComponent"; // Import new component
import {
  loadTributesFromLocalStorage, // Assuming not used directly for display on this simplified page
  saveTributesToLocalStorage, // For saving the submitted tribute
} from "@/lib/localStorageUtils";
import { HelpCircle } from "lucide-react"; // HelpCircle for subtle CTA
import { MOCK_USER_STORAGE_KEY, type MockUserData } from "@/lib/constants";

const deceasedInfo = {
  id: "lerato-nomvula-mnguni-memorial",
  fullName: "Lerato Nomvula Mnguni",
  lifespan: "1976 – 2025",
  portraitPlaceholderUrl: "/assets/images/portrait.png",
  coverImageUrl: "/assets/images/default-cover-placeholder.jpg", // Ensure this image exists
  funeralHomeName: "Remembrance Funerals", // Example
};

interface CurrentUser extends MockUserData {
  isSignedIn: boolean;
}

type PageView = "form" | "confirmation";

export default function TributePage() {
  // Removed 'tributes' state for simplicity on this input-focused page.
  // If a feed is needed, re-add 'tributes' state and related logic.
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const router = useRouter();

  const [currentView, setCurrentView] = useState<PageView>("form");
  const [confirmationData, setConfirmationData] = useState<{
    deceasedName: string;
    deceasedId: string;
    userName: string;
  } | null>(null);

  const [isFuneralModalOpen, setIsFuneralModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserData = localStorage.getItem(MOCK_USER_STORAGE_KEY);
      if (storedUserData) {
        try {
          const parsedData: MockUserData = JSON.parse(storedUserData);
          // For this page, we primarily need to know if a user is "logged in"
          // to authorize tribute submission. TributeInputComponent handles sender name/relationship.
          setCurrentUser({ ...parsedData, isSignedIn: true });
        } catch {
          localStorage.removeItem(MOCK_USER_STORAGE_KEY);
          router.replace("/login");
          return;
        }
      } else {
        router.replace("/login");
        return;
      }
      setIsLoadingPage(false);
    }
  }, [router]);

  const handleAddTribute = async (
    data: NewTributeDataFromInput // Expects { senderName, senderRelationship, message, flowerId }
  ): Promise<void> => {
    if (!currentUser?.isSignedIn) {
      alert("User information incomplete. Please sign in again.");
      router.push("/login");
      return;
    }

    const newTributeToStore = {
      // Simplified structure for local storage if needed
      id: uuidv4(),
      name: data.senderName,
      relationship: data.senderRelationship,
      message: data.message,
      flowerId: data.flowerId, // Store flowerId
      timestamp: Date.now(),
    };

    // Simulate saving: Load existing, add new, save back
    const existingTributes = loadTributesFromLocalStorage(
      deceasedInfo.fullName
    );
    const updatedTributes = [newTributeToStore, ...existingTributes];
    updatedTributes.sort((a, b) => b.timestamp - a.timestamp); // Keep sorted if used elsewhere
    saveTributesToLocalStorage(deceasedInfo.fullName, updatedTributes);
    console.log("Tribute saved:", newTributeToStore);

    setConfirmationData({
      deceasedName: deceasedInfo.fullName,
      deceasedId: deceasedInfo.id,
      userName: data.senderName,
    });
    setCurrentView("confirmation");
  };


  const handleConfirmationDone = () => {
    setCurrentView("form");
    setConfirmationData(null);
  };

  if (isLoadingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-600"></div>
        <p className="ml-4 text-slate-600">Loading...</p>
      </div>
    );
  }

  if (!currentUser?.isSignedIn && typeof window !== "undefined") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 to-stone-100 text-slate-800 font-sans">
      <HeaderComponent
        fullName={deceasedInfo.fullName}
        lifespan={deceasedInfo.lifespan}
        portraitUrl={deceasedInfo.portraitPlaceholderUrl}
        currentUser={{
          fullName: currentUser?.fullName,
          isSignedIn: currentUser?.isSignedIn || false,
        }}
      />

      <main className="flex-grow w-full relative">
        {" "}
        {/* Added relative for potential fixed CTA parent */}
        {currentView === "form" && (
          <div className="animate-fade-in pt-0 md:pt-2 pb-8">
            {" "}
            {/* Adjusted padding */}
            <TributeInputComponent
              onAddTribute={handleAddTribute}
              deceasedName={deceasedInfo.fullName}
              deceasedId={deceasedInfo.id} // Pass deceasedId
            />
          </div>
        )}
        {currentView === "confirmation" && confirmationData && (
          <div className="animate-fade-in py-8">
            <PostPaymentConfirmationComponent
              deceasedName={confirmationData.deceasedName}
              deceasedId={confirmationData.deceasedId}
              userName={confirmationData.userName}
              onDone={handleConfirmationDone}
            />
          </div>
        )}
      </main>

      {/* Subtle Funeral Home CTA - always available on this page if view is 'form' */}
      {currentView === "form" && (
        <footer className="py-6 border-t border-slate-200 bg-slate-50 text-center">
          <button
            onClick={() => setIsFuneralModalOpen(true)}
            className="text-sm text-slate-600 hover:text-amber-700 font-medium transition-colors group flex items-center justify-center mx-auto"
          >
            <HelpCircle
              size={16}
              className="mr-1.5 text-slate-500 group-hover:text-amber-600 transition-colors"
            />
            Want to know more about our services?
          </button>
        </footer>
      )}

      <FuneralHomeCTAComponent
        isOpen={isFuneralModalOpen}
        onClose={() => setIsFuneralModalOpen(false)}
        funeralHomeName={deceasedInfo.funeralHomeName}
        defaultUserName={currentUser?.fullName || ""} // Prefill with logged-in user's name if available
      />
    </div>
  );
}
