// app/page.tsx (Auth/Login Logic Removed)
"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
// useRouter is not strictly needed anymore unless for other navigation
// import { useRouter } from "next/navigation";
import HeaderComponent from "@/components/HeaderComponent";
import TributeInputComponent, {
  type NewTributeDataFromInput,
} from "@/components/TributeInputComponent";
import PostPaymentConfirmationComponent from "@/components/PostPaymentConfirmationComponent";
import FuneralHomeCTAComponent from "@/components/FuneralHomeCTAComponent";
import {
  loadTributesFromLocalStorage,
  saveTributesToLocalStorage,
} from "@/lib/localStorageUtils";
import { HelpCircle } from "lucide-react";
// MOCK_USER_STORAGE_KEY and MockUserData are no longer needed here
// import { MOCK_USER_STORAGE_KEY, type MockUserData } from "@/lib/constants";

const deceasedInfo = {
  id: "lerato-nomvula-mnguni-memorial",
  fullName: "Lerato Nomvula Mnguni",
  lifespan: "1976 – 2025",
  portraitPlaceholderUrl: "/assets/images/portrait.png",
  coverImageUrl: "/assets/images/default-cover-placeholder.jpg",
  funeralHomeName: "Remembrance Funerals",
};


type PageView = "form" | "confirmation";

export default function TributePage() {
  // Removed currentUser state
  const [isLoadingPage, setIsLoadingPage] = useState(true); // Basic loading state
  // const router = useRouter(); // Not used for login redirects anymore

  const [currentView, setCurrentView] = useState<PageView>("form");
  const [confirmationData, setConfirmationData] = useState<{
    deceasedName: string;
    deceasedId: string;
    userName: string; // This comes from the form now
  } | null>(null);

  const [isFuneralModalOpen, setIsFuneralModalOpen] = useState(false);

  useEffect(() => {
    // Simulate initial page setup if needed, or just set loading to false
    // No auth check needed here anymore
    setIsLoadingPage(false);
  }, []);

  const handleAddTribute = async (
    data: NewTributeDataFromInput // Expects { senderName, senderRelationship, message, flowerId }
  ): Promise<void> => {
    // No currentUser check needed here anymore
    // The TributeInputComponent now collects senderName and senderRelationship

    const newTributeToStore = {
      id: uuidv4(),
      name: data.senderName, // Directly from form data
      relationship: data.senderRelationship, // Directly from form data
      message: data.message,
      flowerId: data.flowerId,
      timestamp: Date.now(),
    };

    // Simulate saving: Load existing, add new, save back
    // This part remains to store tributes locally if desired,
    // accessible by anyone visiting the page.
    const existingTributes = loadTributesFromLocalStorage(
      deceasedInfo.fullName
    );
    const updatedTributes = [newTributeToStore, ...existingTributes];
    updatedTributes.sort((a, b) => b.timestamp - a.timestamp);
    saveTributesToLocalStorage(deceasedInfo.fullName, updatedTributes);
    console.log("Tribute saved:", newTributeToStore);

    setConfirmationData({
      deceasedName: deceasedInfo.fullName,
      deceasedId: deceasedInfo.id,
      userName: data.senderName, // Use senderName from the form data
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 to-stone-100 text-slate-800 font-sans">
      <HeaderComponent
        fullName={deceasedInfo.fullName}
        lifespan={deceasedInfo.lifespan}
        portraitUrl={deceasedInfo.portraitPlaceholderUrl}
        currentUser={null} // No current user to pass for sign out
        // onSignOut prop is removed as there's no sign-out functionality
      />

      <main className="flex-grow w-full relative">
        {currentView === "form" && (
          <div className="animate-fade-in pt-0 md:pt-2 pb-8">
            <TributeInputComponent
              onAddTribute={handleAddTribute}
              deceasedName={deceasedInfo.fullName}
              deceasedId={deceasedInfo.id}
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
        defaultUserName={""} // No logged-in user to prefill name
      />
    </div>
  );
}
