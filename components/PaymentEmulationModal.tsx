// components/PaymentEmulationModal.tsx (Modified for smoother transition to PostPaymentConfirmation)
"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import {
  XMarkIcon, // Corrected from XIcon if using Heroicons v2
  LockClosedIcon,
  CreditCardIcon,
  CalendarIcon,
  XCircleIcon as XCircleIconOutline, // Using outline for failure consistency
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleIconSolid } from "@heroicons/react/24/solid"; // Solid for success
import type { NewTributeDataFromInput } from "./TributeInputComponent"; // Ensure path is correct

interface PaymentEmulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  flowerLabel: string;
  amount: number;
  tributeData: NewTributeDataFromInput;
  onPaymentSuccess: (data: NewTributeDataFromInput) => Promise<void>;
  deceasedName?: string;
}

type PaymentStep = "form" | "processing" | "success" | "failed";

const PaymentEmulationModal: React.FC<PaymentEmulationModalProps> = ({
  isOpen,
  onClose,
  flowerLabel,
  amount,
  tributeData,
  onPaymentSuccess,
  deceasedName,
}) => {
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("form");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [cardNumber, setCardNumber] = useState("1812 3456 7890 1234"); 
  const [expiryDate, setExpiryDate] = useState("12/25"); // Default to a future date
  const [cvv, setCvv] = useState("871");
  const [cardholderName, setCardholderName] = useState(
    tributeData.senderName || ""
  );

  useEffect(() => {
    if (isOpen) {
      setPaymentStep("form");
      setPaymentError(null);
      setCardholderName(tributeData.senderName || "");
      // Reset dummy card fields for fresh modal appearance
      setCardNumber("1812 3456 7890 1234");
      setExpiryDate("12/25"); // Reset to a future date
      setCvv("158");
      
    }
  }, [isOpen, tributeData.senderName]); // Reset when isOpen changes or senderName prefill changes

  if (!isOpen) {
    return null;
  }

  const handleDummyPayment = async (e: FormEvent) => {
    e.preventDefault();
    if (paymentStep === "processing") return; // Prevent double submission

    setPaymentStep("processing");
    setPaymentError(null);

    await new Promise((resolve) => setTimeout(resolve, 2000)); 

    const isSuccess = Math.random() > 0.05; // Higher success rate (95%) for better UX in mock

    if (isSuccess) {
      try {
        await onPaymentSuccess(tributeData); // Critical step: Parent handles actual tribute posting
        setPaymentStep("success");
        // Auto-close the modal after a brief success indication
        setTimeout(() => {
          onClose(); // This signals the parent to proceed (e.g., show PostPaymentConfirmationComponent)
        }, 1800); // Display success in modal briefly
      } catch (submitError) {
        console.error("Error during onPaymentSuccess callback in modal:", submitError);
        setPaymentError(
          "Payment was successful, but there was an issue finalizing your tribute. Please contact support."
        );
        setPaymentStep("failed");
      }
    } else {
      setPaymentError(
        "Your payment could not be processed (emulated). Please check your details or try again."
      );
      setPaymentStep("failed");
    }
  };

  const renderContent = () => {
    switch (paymentStep) {
      case "processing":
        return (
          <div className="text-center py-12 px-6">
            <svg
              className="animate-spin h-10 w-10 text-amber-500 mx-auto mb-5" // Adjusted color
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg font-semibold text-slate-700">Processing Payment...</p>
            <p className="text-sm text-slate-500 mt-1">Please wait a moment.</p>
          </div>
        );
      case "success": // This step is now very brief due to auto-close
        return (
          <div className="text-center py-12 px-6">
            <CheckCircleIconSolid className="h-16 w-16 text-green-500 mx-auto mb-4" /> {/* Solid icon for success */}
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Payment Successful!
            </h3>
            <p className="text-slate-600 ">Your tribute is being finalized.</p>
                {/* No button here, as it will auto-close */}
                <p className="text-sm text-slate-500 mt-1">Thank you for your tribute.</p>
                <p className="text-sm text-slate-500 mt-1">You will be redirected shortly.</p>
            
                    <CheckCircleIconSolid className="h-8 w-8 text-green-500 mx-auto" />
                    
          </div>
        );
      case "failed":
        return (
          <div className="text-center py-8 px-6">
            <XCircleIconOutline className="h-16 w-16 text-red-500 mx-auto mb-4" /> {/* Outline icon for failure */}
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Payment Failed
            </h3>
            <p className="text-slate-600 mb-6 text-sm">
              {paymentError || "An unexpected error occurred."}
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setPaymentStep("form")} // Allow retry
                className="w-full sm:flex-1 bg-amber-500 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-amber-600 transition-colors text-sm"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="w-full sm:flex-1 bg-slate-200 text-slate-700 py-2.5 px-4 rounded-lg font-medium hover:bg-slate-300 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        );
      case "form":
      default:
        return (
          <form onSubmit={handleDummyPayment} className="space-y-5">
            <div className="text-center border-b border-slate-200 pb-4 mb-6">
              <h3 className="text-2xl font-playfair text-slate-800"> {/* Using font-playfair */}
                Secure Tribute Payment
              </h3>
              <p className="text-sm text-slate-500 mt-1.5">
                Item: {flowerLabel} for {deceasedName || "this tribute"}
              </p>
              <p className="text-lg font-semibold text-slate-700 mt-1">
                Amount: <span className="text-amber-600">R{amount}</span>
              </p>
            </div>

            <div>
              <label htmlFor="cardholderNameModal" className="block text-xs font-medium text-slate-600 mb-1">Cardholder Name</label>
              <input
                type="text"
                id="cardholderNameModal" // Unique ID
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                placeholder="Full Name as on Card"
                required
              />
            </div>
            <div>
              <label htmlFor="cardNumberModal" className="block text-xs font-medium text-slate-600 mb-1">Card Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCardIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="cardNumberModal" // Unique ID
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(
                      e.target.value
                        .replace(/\s/g, "") // Remove all spaces
                        .replace(/\D/g, "") // Remove non-digits
                        .replace(/(\d{4})(?=\d)/g, "$1 ") // Add space every 4 digits
                        .slice(0, 19) // Max 16 digits + 3 spaces
                    )
                  }
                  className="w-full border border-slate-300 rounded-md pl-10 pr-3 py-2.5 text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  required
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="flex-1">
                <label htmlFor="expiryDateModal" className="block text-xs font-medium text-slate-600 mb-1">Expiry Date</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                    type="text"
                    id="expiryDateModal" // Unique ID
                    value={expiryDate}
                    onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "").slice(0,4);
                        if (value.length > 2) {
                            value = value.slice(0,2) + "/" + value.slice(2);
                        }
                        setExpiryDate(value);
                    }}
                    className="w-full border border-slate-300 rounded-md pl-10 pr-3 py-2.5 text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                    />
                </div>
              </div>
              <div className="flex-1">
                <label htmlFor="cvvModal" className="block text-xs font-medium text-slate-600 mb-1">CVV</label>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                    type="text"
                    id="cvvModal" // Unique ID
                    inputMode="numeric"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                    }
                    className="w-full border border-slate-300 rounded-md pl-10 pr-3 py-2.5 text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                    placeholder="123"
                    maxLength={3}
                    required
                    />
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 text-center flex items-center justify-center pt-2">
              <LockClosedIcon className="h-3.5 w-3.5 mr-1.5 inline-block text-slate-400" />
              This is a secure, emulated payment for tribute purposes only.
            </p>
            {paymentError && ( // Show form-specific error if any (though main error is handled in "failed" state)
              <p className="text-red-500 text-xs text-center -mt-2">{paymentError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-amber-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-600 transition-colors text-base shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500"
            >
              Confirm & Pay R{amount}
            </button>
          </form>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-700/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-pop-in"> {/* Added entry animation */}
        <button
          onClick={paymentStep === "processing" ? undefined : onClose} // Disable close during processing
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 transition-colors z-10 p-1 rounded-full hover:bg-slate-100 disabled:opacity-50"
          aria-label="Close payment modal"
          disabled={paymentStep === "processing"}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="p-6 sm:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Add this to your globals.css for the modal pop-in animation:


export default PaymentEmulationModal;