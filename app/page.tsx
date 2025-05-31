// app/page.tsx (Redesigned with Tabs: Tributes & Program)
"use client";

import { useState, useEffect } from "react";
import HeaderComponent from "@/components/HeaderComponent";
import TributeInputComponent from "@/components/TributeInputComponent"; // No longer importing NewTributeDataFromInput
import FuneralHomeCTAComponent from "@/components/FuneralHomeCTAComponent";
import { PhoneCall, Edit3, CalendarDays } from "lucide-react"; // Icons for footer CTA and tabs

const deceasedInfo = {
  id: "lerato-nomvula-mnguni-memorial",
  fullName: "Koko Maria Ledwaba",
  lifespan: "1950 – 2025",
  portraitPlaceholderUrl: "/assets/images/portrait.png",
  coverImageUrl: "/assets/images/default-cover-placeholder.jpg", // Ensure this image exists
  funeralHomeName: "Lethukuthula Funeral Home",
};

type PageView = "form" | "confirmation"; // Keeping for potential future use or if other form/confirmation logic remains elsewhere
type MainTabName = "Tributes" | "Program"; // For the new main tabs

export default function TributePage() {
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [currentView] = useState<PageView>("form"); // Manages view within "Tributes" tab
  const [activeMainTab, setActiveMainTab] = useState<MainTabName>("Program"); // Manages main tabs
  // Removed confirmationData state
  const [isFuneralModalOpen, setIsFuneralModalOpen] = useState(false);

  // Define tabs for navigation
  const mainTabs: {
    name: MainTabName;
    label: string;
    icon: React.ElementType;
  }[] = [
    { name: "Program", label: "Funeral Program", icon: CalendarDays },
    { name: "Tributes", label: "Send Tribute", icon: Edit3 }, // Icon for tribute creation
  ];

  const programPart1 = [
    { event: "Opening Prayer", by: "Church Representative" },
    { event: "Opening Remarks", by: "Programme Director" },
    { event: "Tribute by Family", by: "Ledwaba Family & Letshedi Family" },
    { event: "Tribute by Children of the Deceased", by: "" },
    { event: "Tribute by Church", by: "Church Representative" },
    {
      event: "Word of God / Scripture Reading",
      by: "Officiating Minister / Church Elder",
    },
    { event: "Procession to the Grave", by: "" },
  ];

  const programPart2 = [
    { event: "Committal Service Opening Prayer", by: "Pastor" },
    { event: "Burial Rites & Committal", by: "Pastor" },
    { event: "Vote of Thanks", by: "Family Representative / Friend" },
    { event: "Message from Tribal Leadership", by: "Tribal Representative" },
    {
      event: "Family Benediction & Closing Prayer",
      by: "Family Member / Pastor",
    },
  ];

  useEffect(() => {
    setIsLoadingPage(false); // Simplified loading, no auth check
  }, []);

  // Removed handleAddTribute function
  // Removed handleConfirmationDone function

  const handleTabClick = (tabName: MainTabName) => {
    setActiveMainTab(tabName);
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
        currentUser={null}
      />

      {/* New Tab Navigation */}
      <nav className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-center px-2 sm:px-0">
          <div
            className="flex justify-center flex-grow space-x-1 sm:space-x-2"
            role="tablist"
            aria-label="Page sections"
          >
            {mainTabs.map((tab) => (
              <button
                key={tab.name}
                type="button"
                role="tab"
                id={`main-tab-${tab.name}`}
                aria-selected={activeMainTab === tab.name}
                aria-controls={`main-tabpanel-${tab.name}`}
                onClick={() => handleTabClick(tab.name)}
                tabIndex={activeMainTab === tab.name ? 0 : -1}
                className={`flex items-center gap-2 px-3 py-3.5 sm:px-5 text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded-t-md group
                  ${
                    activeMainTab === tab.name
                      ? "border-b-2 border-amber-500 text-amber-600 font-semibold"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/70 border-b-2 border-transparent"
                  }
                `}
              >
                <tab.icon
                  size={18}
                  className={`transition-colors group-hover:text-slate-700 ${
                    activeMainTab === tab.name
                      ? "text-amber-500"
                      : "text-slate-400"
                  }`}
                  aria-hidden="true"
                />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-grow w-full relative">
        {/* Tributes Tab Content (handles form and confirmation internally) */}
        <div
          id="main-tabpanel-Tributes"
          role="tabpanel"
          aria-labelledby="main-tab-Tributes"
          hidden={activeMainTab !== "Tributes"}
        >
          {currentView === "form" && (
            <div className="animate-fade-in pt-0 md:pt-2 pb-8">
              <TributeInputComponent
                deceasedName={deceasedInfo.fullName}
                // Removed onAddTribute and deceasedId props as tribute submission logic is gone
              />
            </div>
          )}
          {currentView === "confirmation" && (
            // PostPaymentConfirmationComponent is no longer needed here without tribute submission
            // but keeping the structure in case currentView 'confirmation' is used elsewhere.
            // However, since handleConfirmationDone is removed, this block would effectively be dead code.
            // For now, I'll remove the component itself to truly remove tribute logic.
            // If you still need 'confirmation' view for other purposes, let me know!
            <div className="animate-fade-in py-8">
              {/* Removed PostPaymentConfirmationComponent */}
              <p className="text-center text-slate-600">
                Tribute confirmation functionality has been removed.
              </p>
            </div>
          )}
        </div>

        {/* Program Tab Content */}
        <div
          id="main-tabpanel-Program"
          role="tabpanel"
          aria-labelledby="main-tab-Program"
          hidden={activeMainTab !== "Program"}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in">
            <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
              <div className="px-6 py-10 sm:p-12 bg-gradient-to-br from-slate-50 to-stone-100">
                <h2 className="text-3xl sm:text-4xl font-playfair text-center text-slate-800 mb-3">
                  Order of Service
                </h2>
                <p className="text-center text-slate-600 mb-10 sm:mb-12 text-base font-medium">
                  In Loving Memory of {deceasedInfo.fullName}
                </p>
                <hr className="border-t-2 border-amber-300 w-20 mx-auto" />
              </div>

              <div className="px-6 py-8 sm:p-10 space-y-12">
                {/* Part 1: Home */}
                <section>
                  <div className="flex items-center mb-6 pb-2 border-b-2 border-slate-100">
                    <span className="text-2xl bg-amber-500 text-white rounded-full h-10 w-10 flex items-center justify-center font-playfair mr-4 shadow-sm">
                      1
                    </span>
                    <h3 className="text-2xl font-playfair text-slate-700">
                      Service at Home
                    </h3>
                  </div>
                  <ul className="space-y-6 ml-4 sm:ml-6">
                    {programPart1.map((item, index) => (
                      <li
                        key={`part1-${index}`}
                        className="relative pl-8 group"
                      >
                        <span className="absolute left-[-13px] top-[calc(0.75rem_-_0.5rem)] w-5 h-5 bg-white border-2 border-amber-400 rounded-full group-hover:bg-amber-400 group-hover:scale-110 transition-all duration-200 shadow"></span>{" "}
                        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between">
                          <span className="font-semibold text-slate-700 text-base md:text-lg block leading-tight">
                            {item.event}
                          </span>
                          {item.by && (
                            <span className="text-sm text-slate-500 md:text-right block mt-1 md:mt-0 md:ml-4 italic">
                              {item.by}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Part 2: Cemetery */}
                <section>
                  <div className="flex items-center mb-6 pb-2 border-b-2 border-slate-100 pt-4">
                    <span className="text-2xl bg-amber-500 text-white rounded-full h-10 w-10 flex items-center justify-center font-playfair mr-4 shadow-sm">
                      2
                    </span>
                    <h3 className="text-2xl font-playfair text-slate-700">
                      Service at the Cemetery
                    </h3>
                  </div>
                  <ul className="space-y-6 ml-4 sm:ml-6">
                    {programPart2.map((item, index) => (
                      <li
                        key={`part2-${index}`}
                        className="relative pl-8 group"
                      >
                        <span className="absolute left-[-13px] top-[calc(0.75rem_-_0.5rem)] w-5 h-5 bg-white border-2 border-amber-400 rounded-full group-hover:bg-amber-400 group-hover:scale-110 transition-all duration-200 shadow"></span>
                        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between">
                          <span className="font-semibold text-slate-700 text-base md:text-lg block leading-tight">
                            {item.event}
                          </span>
                          {item.by && (
                            <span className="text-sm text-slate-500 md:text-right block mt-1 md:mt-0 md:ml-4 italic">
                              {item.by}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="bg-slate-50 px-6 py-6 text-center text-sm text-slate-500 border-t border-slate-200/80">
                <p className="italic">
                  &quot;The eternal God is your refuge, and underneath are the
                  everlasting arms.&quot;
                </p>
                <p className="mt-1">- Deuteronomy 33:27</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Subtle Funeral Home CTA - remains in the footer */}
      {currentView === "form" && (
        <footer className="py-8 border-t border-slate-200/80 bg-white text-center">
          <div className="max-w-lg mx-auto px-4">
            <h4 className="text-xl font-playfair text-slate-700 mb-2">
              {deceasedInfo.funeralHomeName}
            </h4>
            <p className="text-sm text-slate-500 mb-4 max-w-sm mx-auto">
              Secure complete peace of mind by planning ahead. Let us call you
              during the week.
            </p>
            <button
              onClick={() => setIsFuneralModalOpen(true)}
              className="text-sm text-amber-700 hover:text-amber-800 font-semibold transition-colors group flex items-center justify-center mx-auto
                               px-6 py-2.5 border-2 border-amber-500/40 hover:border-amber-500 rounded-lg hover:bg-amber-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <PhoneCall
                size={16}
                className="mr-2 text-amber-600 group-hover:text-amber-700 transition-colors"
              />
              Request a Callback
            </button>
          </div>
        </footer>
      )}

      <FuneralHomeCTAComponent
        isOpen={isFuneralModalOpen}
        onClose={() => setIsFuneralModalOpen(false)}
        funeralHomeName={deceasedInfo.funeralHomeName}
        defaultUserName={""} // No logged-in user to prefill
      />
    </div>
  );
}
