// components/TributeInputComponent.tsx
"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react"; // For copy functionality icons

interface BankDetails {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  branchCode: string;
  referenceInstruction: string;
}

// Hardcoded bank details - these should be actual details
const familyBankDetails: BankDetails = {
  accountHolder: "The Ledwaba Family Trust", // Example
  bankName: "First National Bank", // Example
  accountNumber: "60012345678", // Example
  accountType: "Cheque Account", // Example
  branchCode: "250655", // Example
  referenceInstruction: "Please use your Full Name as the payment reference.",
};

interface TributeInputComponentProps {
  deceasedName?: string; // Optional: to personalize the heading
}

const TributeInputComponent: React.FC<TributeInputComponentProps> = ({
  // deceasedName,
}) => {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleCopyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedStates((prev) => ({ ...prev, [fieldId]: true }));
        setTimeout(
          () => setCopiedStates((prev) => ({ ...prev, [fieldId]: false })),
          2000
        ); // Reset after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        // You could set an error state here if desired
      });
  };

  const detailItems: {
    label: string;
    value: string;
    id: keyof BankDetails | "reference";
  }[] = [
    {
      label: "Account Holder",
      value: familyBankDetails.accountHolder,
      id: "accountHolder",
    },
    { label: "Bank Name", value: familyBankDetails.bankName, id: "bankName" },
    {
      label: "Account Number",
      value: familyBankDetails.accountNumber,
      id: "accountNumber",
    },
    {
      label: "Account Type",
      value: familyBankDetails.accountType,
      id: "accountType",
    },
    {
      label: "Branch Code",
      value: familyBankDetails.branchCode,
      id: "branchCode",
    },
  ];

  return (
    <div className="w-full bg-white/80 backdrop-blur-sm shadow-lg rounded-xl py-8 px-4 sm:py-10 sm:px-6 md:px-8">
      <div className="max-w-xl mx-auto animate-fade-in">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-playfair text-slate-800 mb-2">
            Send your condolences and support
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            If you wish to make a financial contribution to the family, please
            use the bank details below.
          </p>
        </div>

        <div className="space-y-4 bg-slate-50 p-4 sm:p-6 rounded-lg shadow-sm border border-slate-200">
          {detailItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-slate-200 last:border-b-0"
            >
              <div>
                <span className="text-xs font-medium text-slate-500 block sm:inline">
                  {item.label}:
                </span>
                <span className="text-base text-slate-800 font-semibold ml-0 sm:ml-2 block sm:inline">
                  {item.value}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyToClipboard(item.value, item.id)}
                className={`mt-2 sm:mt-0 flex items-center justify-center text-xs px-3 py-1.5 rounded-md transition-all duration-150 ease-in-out w-full sm:w-auto
                                  ${
                                    copiedStates[item.id]
                                      ? "bg-green-500 text-white focus:ring-green-400"
                                      : "bg-slate-200 hover:bg-slate-300 text-slate-700 focus:ring-slate-400"
                                  }
                                  focus:outline-none focus:ring-2 focus:ring-offset-1`}
                aria-label={`Copy ${item.label}`}
              >
                {copiedStates[item.id] ? (
                  <>
                    <Check size={14} className="mr-1.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} className="mr-1.5" /> Copy
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Important:</span>{" "}
            {familyBankDetails.referenceInstruction}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TributeInputComponent;
