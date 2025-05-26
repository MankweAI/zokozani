// components/FuneralHomeCTAComponent.tsx
"use client";

import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Phone, XIcon } from "lucide-react"; // Corrected XIcon import to match user's code

interface FuneralHomeCTAComponentProps {
  isOpen: boolean;
  onClose: () => void;
  funeralHomeName?: string;
  defaultUserName?: string;
}

const FuneralHomeCTAComponent: React.FC<FuneralHomeCTAComponentProps> = ({
  isOpen,
  onClose,
  funeralHomeName = "Our Partner Funeral Services",
  defaultUserName = "",
}) => {
  const [callerPhone, setCallerPhone] = useState("");
  const [userNameForCallback, setUserNameForCallback] =
    useState(defaultUserName);
  const [callbackFormMessage, setCallbackFormMessage] = useState<string | null>(
    null
  );
  const [isSubmittingCallback, setIsSubmittingCallback] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUserNameForCallback(defaultUserName);
      setCallerPhone("");
      setCallbackFormMessage(null);
      setIsSubmittingCallback(false);
    }
  }, [isOpen, defaultUserName]);

  const handleRequestCallback = async (e: FormEvent) => {
    e.preventDefault();
    setCallbackFormMessage(null); // Clear previous error messages before new validation

    if (!userNameForCallback.trim()) {
      setCallbackFormMessage("Please enter your name.");
      return;
    }
    if (!callerPhone.trim()) {
      setCallbackFormMessage(
        "Please enter your phone number to request a callback."
      );
      return;
    }

    setIsSubmittingCallback(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(
      `Funeral Home Callback Requested: For ${userNameForCallback}, Phone: ${callerPhone}, Regarding services from: ${funeralHomeName}`
    );
    setCallbackFormMessage(
      `Thank you, ${
        userNameForCallback // Use the state value which user might have edited
      }! ${funeralHomeName} will contact you on ${callerPhone} within 48 hours (on working days, Mon-Fri) to discuss our services.`
    );
    setIsSubmittingCallback(false);
  };

  if (!isOpen) {
    return null;
  }

  const showForm =
    !callbackFormMessage || !callbackFormMessage.includes("Thank you");

  return (
    <div className="fixed inset-0 bg-slate-800/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-pop-in">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 transition-colors z-10 p-1 rounded-full hover:bg-slate-100"
          aria-label="Close contact modal"
        >
          <XIcon className="h-6 w-6" /> {/* User's original icon import */}
        </button>

        <div className="p-6 sm:p-8">
          {/* Header Section: Show if form is visible (i.e., not on final success message) */}
          {showForm && (
            <div className="text-center sm:text-left mb-5">
              {" "}
              {/* Ensure margin even if only header shows before form animates in */}
              <h2 className="text-xl sm:text-2xl font-playfair text-slate-800 mb-2">
                {funeralHomeName}
              </h2>
              <p className="text-slate-600 text-sm">
                To find out about our services, please provide your details
                below, and we&apos;ll call you back during the week.
              </p>
            </div>
          )}

          {/* Form Section: Show if not on final success message */}
          {showForm ? (
            <form
              onSubmit={handleRequestCallback}
              className="space-y-4 text-left animate-fade-in" // Removed mt-5, spacing handled by header's mb-5
            >
              <div>

                <input
                  type="text"
                  id="funeralCallbackFormNameModal"
                  value={userNameForCallback}
                  onChange={(e) => setUserNameForCallback(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg bg-white shadow-sm text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  required // HTML5 validation for name
                />
              </div>
              <div>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="tel"
                    id="funeralCallbackFormPhoneModal"
                    value={callerPhone}
                    onChange={(e) => setCallerPhone(e.target.value)}
                    placeholder=" 082 123 4567"
                    className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm text-sm"
                    required // HTML5 validation for phone
                  />
                </div>
              </div>
              {/* Display validation error message if it exists and is NOT a success message */}
              {callbackFormMessage &&
                !callbackFormMessage.includes("Thank you") && (
                  <p className="text-sm text-red-600 text-center sm:text-left">
                    {callbackFormMessage}
                  </p>
                )}
              <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingCallback}
                  className={`w-full sm:flex-1 flex items-center justify-center bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition-all duration-150 ${
                    isSubmittingCallback ? "opacity-70 cursor-wait" : ""
                  }`}
                >
                  {isSubmittingCallback ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
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
                  ) : (
                    <Phone size={16} className="mr-2" />
                  )}
                  {isSubmittingCallback ? "Submitting..." : "Request Callback"}
                </button>
                <button
                  type="button"
                  onClick={onClose} // Allows user to cancel/close form
                  disabled={isSubmittingCallback}
                  className="w-full sm:flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-colors duration-150"
                >
                  Close
                </button>
              </div>
            </form>
          ) : null}

          {/* Success Message Section: Show only if callbackFormMessage is a success message */}
          {callbackFormMessage && callbackFormMessage.includes("Thank you") && (
            <div className="mt-6 p-4 rounded-md text-sm bg-green-50 text-green-700 border border-green-200 text-center animate-fade-in">
              <p>{callbackFormMessage}</p>
              <button
                onClick={onClose}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg text-xs"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FuneralHomeCTAComponent;
