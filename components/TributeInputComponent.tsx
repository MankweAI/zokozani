// components/TributeInputComponent.tsx
// This version integrates the PaymentEmulationModal and PostPaymentConfirmationComponent.
"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import PaymentEmulationModal from "./PaymentEmulationModal"; // Assumed in the same directory
import PostPaymentConfirmationComponent from "./PostPaymentConfirmationComponent"; // Import the new component

export interface NewTributeDataFromInput {
  senderName: string;
  senderRelationship: string;
  message: string;
  flowerId: string;
}

const flowerOptions = [
  {
    id: "lily", // Kept id
    label: "White Lilies",
    price: 80, // Updated price as requested
    description: "Symbolizing purity, sympathy, and renewal.", // Slightly refined description
    imageUrl: "/assets/images/flower-lily.jpg",
  },
  {
    id: "carnations", // Kept id
    label: "Pink Carnations",
    price: 140, // Positioned between Lilies and Orchids
    description: "Representing remembrance and heartfelt gratitude.", // Slightly refined description
    imageUrl: "/assets/images/flower-carnation.jpg",
  },
  {
    id: "orchid", // Kept id
    label: "White Orchid",
    price: 400, // Positioned as a premium option below Roses
    description: "Signifying eternal love and delicate beauty.", // Slightly refined description
    imageUrl: "/assets/images/flower-orchid.jpg",
  },
  {
    id: "rose", // Kept id
    label: "Red Roses",
    price: 1000, // Updated price as requested
    description: "Expressing deep love, respect, and courage.", // Slightly refined description
    imageUrl: "/assets/images/flower-rose.jpg",
  },
];

interface TributeInputComponentProps {
  onAddTribute: (data: NewTributeDataFromInput) => Promise<void>;
  deceasedName?: string;
  deceasedId?: string; // Added to pass to PostPaymentConfirmationComponent
  // Add other props PostPaymentConfirmationComponent might need if they come from TributeInputComponent's parent
  // e.g., funeralHomeName, siteBaseUrl, or let PostPaymentConfirmationComponent use its defaults
}

type ComponentView = "form" | "confirmation";

const TributeInputComponent: React.FC<TributeInputComponentProps> = ({
  onAddTribute,
  deceasedName = "the departed", // Default value
  deceasedId = "default-deceased-id", // Default or ensure passed from parent
}) => {
  const [senderName, setSenderName] = useState("Mankwe Mokgabudi"); // Default for testing
  const [senderRelationship, setSenderRelationship] = useState("Colleague"); // Default for testing
  const [message, setMessage] = useState(
    "In loving memory of a wonderful colleague."
  ); // Default for testing
  const [selectedFlowerId, setSelectedFlowerId] = useState<string | null>(null);

  const [isProcessingTribute, setIsProcessingTribute] = useState(false);
  const [error, setError] = useState("");
  // submitSuccess now indicates success of the whole flow including payment, before showing confirmation
  const [formSubmitAttempted, setFormSubmitAttempted] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentTributeDataForPayment, setCurrentTributeDataForPayment] =
    useState<NewTributeDataFromInput | null>(null);

  const [currentView, setCurrentView] = useState<ComponentView>("form");

  const selectedFlowerDetails = flowerOptions.find(
    (f) => f.id === selectedFlowerId
  );

  const canProceedToPayment =
    selectedFlowerId &&
    senderName.trim() &&
    senderRelationship.trim() &&
    message.trim();

  const handleSubmit = () => {
    setError("");
    setFormSubmitAttempted(true); // Mark that a submit attempt was made

    if (!selectedFlowerId) {
      setError("Please select a flower to continue.");
      return;
    }
    if (!senderName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!senderRelationship.trim()) {
      setError("Please enter your relationship to the deceased.");
      return;
    }
    if (!message.trim()) {
      setError("Please write a message for your tribute.");
      return;
    }

    const dataForPayment: NewTributeDataFromInput = {
      senderName: senderName.trim(),
      senderRelationship: senderRelationship.trim(),
      message: message.trim(),
      flowerId: selectedFlowerId,
    };
    setCurrentTributeDataForPayment(dataForPayment);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccessAndFinalizeTribute = async (
    paidTributeData: NewTributeDataFromInput
  ) => {
    setIsProcessingTribute(true);
    setError("");
    try {
      await onAddTribute(paidTributeData);

      // Don't reset form fields here yet, as they are needed for the confirmation screen's props (userName)
      // Form will be effectively "gone" when view changes. Reset on returning to form.

      setShowPaymentModal(false);
      setCurrentTributeDataForPayment(null); // Clear this as payment is done
      setCurrentView("confirmation"); // Switch to confirmation view
    } catch (e) {
      console.error(
        "Submission failed after payment confirmation (in TributeInputComponent):",
        e
      );
      setError(
        "Your payment was processed, but there was an issue posting your tribute. Please try again or contact support."
      );
      setShowPaymentModal(false);
      setCurrentTributeDataForPayment(null);
    } finally {
      setIsProcessingTribute(false);
    }
  };

  const handleModalClose = () => {
    setShowPaymentModal(false);
    setCurrentTributeDataForPayment(null);
    // If modal is closed by "Cancel" or "X", and not after success, reset processing state.
    // The success path auto-closes, handlePaymentSuccessAndFinalizeTribute handles setIsProcessingTribute.
    // This onClose is also called by modal's auto-close on success, so careful with state resets here.
    // Only reset if NOT already processing the final tribute.
    if (!isProcessingTribute && currentView !== "confirmation") {
      setError(""); // Clear any form validation errors
    }
    // No need to set isProcessingTribute(false) here if payment was cancelled, as it wouldn't have started.
  };

  const handleConfirmationDone = () => {
    // Reset all form states when user is done with confirmation and returning to form
    setMessage("");
    setSenderName(""); // Clear default/previous values
    setSenderRelationship(""); // Clear default/previous values
    setSelectedFlowerId(null);
    setError("");
    setFormSubmitAttempted(false);
    setCurrentView("form");
  };

  if (currentView === "confirmation") {
    return (
      <PostPaymentConfirmationComponent
        deceasedName={deceasedName}
        deceasedId={deceasedId} // Ensure deceasedId is passed to TributeInputComponent or use a sensible default/fallback
        userName={senderName} // Use the name submitted with the tribute
        onDone={handleConfirmationDone}
        // Pass other props like funeralHomeName, siteBaseUrl if available and needed
      />
    );
  }

  // Otherwise, render the form (currentView === "form")
  return (
    <>
      <div className="w-full bg-white/80 backdrop-blur-sm shadow-lg rounded-xl py-8 px-4 sm:py-10 sm:px-6 md:px-8">
        <div className="max-w-xl mx-auto animate-fade-in">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-playfair text-slate-800 mb-2">
              Send a Flower & Tribute
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Choose a flower and share your heartfelt message.
            </p>
          </div>

          <div className="mb-8">
            <label className="block text-lg font-semibold text-slate-700 mb-3 tracking-tight">
              Select Your Flower
            </label>
            <div className="overflow-x-auto hide-scrollbar py-2 -mx-1 px-1">
              <div className="flex space-x-3 min-w-max pb-2">
                {flowerOptions.map((flower) => (
                  <button
                    key={flower.id}
                    type="button"
                    onClick={() => {
                      setSelectedFlowerId(flower.id);
                      setError("");
                    }}
                    aria-pressed={selectedFlowerId === flower.id}
                    className={`flex-shrink-0 w-40 sm:w-48 bg-white border-2 rounded-xl overflow-hidden text-left transition-all duration-200 ease-in-out group focus:outline-none
                      shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-400
                      ${
                        selectedFlowerId === flower.id
                          ? "border-amber-500 ring-2 ring-amber-400"
                          : "border-slate-200 hover:border-amber-400"
                      }`}
                  >
                    <div className="relative w-full h-36 sm:h-40 bg-slate-100 group-hover:opacity-90 transition-opacity">
                      <Image
                        src={flower.imageUrl}
                        alt={flower.label}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 640px) 40vw, 192px"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                      {selectedFlowerId === flower.id && (
                        <div className="absolute top-1.5 right-1.5 bg-amber-500 text-white rounded-full p-0.5 shadow-md">
                          <CheckCircleIcon
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4
                        className="font-semibold text-sm text-slate-800 truncate group-hover:text-amber-700"
                        title={flower.label}
                      >
                        {flower.label}
                      </h4>
                      <p
                        className="text-xs text-slate-500 mt-0.5 mb-1.5 truncate"
                        title={flower.description}
                      >
                        {flower.description}
                      </p>
                      <div className="text-sm font-bold text-slate-900">
                        R{flower.price}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out ${
              selectedFlowerId
                ? "opacity-100 max-h-[1000px] visible"
                : "opacity-0 max-h-0 invisible pointer-events-none"
            }`}
          >
            {selectedFlowerId && (
              <div className="mt-6 mb-8 animate-fade-in space-y-5">
                <label className="block text-lg font-semibold text-slate-700 tracking-tight">
                  Your Details & Message
                </label>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="senderName" className="sr-only">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      id="senderName"
                      name="senderName"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full border border-slate-300 rounded-lg px-3.5 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm placeholder-slate-400"
                      aria-label="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="senderRelationship" className="sr-only">
                      Your Relationship to the Deceased
                    </label>
                    <input
                      type="text"
                      id="senderRelationship"
                      name="senderRelationship"
                      value={senderRelationship}
                      onChange={(e) => setSenderRelationship(e.target.value)}
                      placeholder="Your Relationship (e.g., Friend, Family)"
                      className="w-full border border-slate-300 rounded-lg px-3.5 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm placeholder-slate-400"
                      aria-label="Your relationship to the deceased"
                    />
                  </div>
                  <div>
                    <label htmlFor="tributeMessage" className="sr-only">
                      Share your tribute or condolences...
                    </label>
                    <textarea
                      id="tributeMessage"
                      name="tributeMessage"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your tribute or condolences..."
                      className="w-full border border-slate-300 rounded-lg px-3.5 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none shadow-sm placeholder-slate-400"
                      aria-label="Tribute message"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && !showPaymentModal && (
            <p
              className="text-red-600 text-sm text-center mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
              role="alert"
            >
              {error}
            </p>
          )}

          {/* Replaced submitSuccess with formSubmitAttempted for a general pre-modal success/status message if needed */}
          {formSubmitAttempted &&
            !error &&
            !showPaymentModal &&
            selectedFlowerId /* Add more relevant condition if a pre-modal success message is needed */ && (
              <p
                className="text-green-600 text-sm text-center mb-4 p-3 bg-green-50 border border-green-200 rounded-md"
                role="status"
              >
                Details ready. Proceeding to secure payment...
              </p>
            )}

          <button
            onClick={handleSubmit}
            disabled={
              isProcessingTribute || !canProceedToPayment || showPaymentModal
            }
            className={`w-full flex items-center justify-center bg-amber-500 text-white py-3 px-5 rounded-lg font-semibold text-base hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 ease-in-out shadow-md hover:shadow-lg
              focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500`}
          >
            {isProcessingTribute ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Finalizing...
              </>
            ) : selectedFlowerDetails ? (
              `Proceed to Send a R${selectedFlowerDetails.price} Flower`
            ) : (
              "No flower selected"
            )}
          </button>
        </div>
      </div>

      {showPaymentModal &&
        currentTributeDataForPayment &&
        selectedFlowerDetails && (
          <PaymentEmulationModal
            isOpen={showPaymentModal}
            onClose={handleModalClose} // Use the new handler
            flowerLabel={selectedFlowerDetails.label}
            amount={selectedFlowerDetails.price}
            tributeData={currentTributeDataForPayment}
            onPaymentSuccess={handlePaymentSuccessAndFinalizeTribute}
            deceasedName={deceasedName}
          />
        )}
    </>
  );
};

export default TributeInputComponent;
