// components/TributeCardComponent.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

type CardAttachmentType = "picture" | null;

export interface TributeCardData {
  id: string;
  name: string;
  message: string;
  timestamp: number;
  relationship: string; // Relationship is required
  attachmentType?: CardAttachmentType;
  attachmentValue?: string | null;
}

interface TributeCardComponentProps {
  tribute: TributeCardData;
}

const TributeCardComponent: React.FC<TributeCardComponentProps> = ({
  tribute,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedTimestamp = new Date(tribute.timestamp).toLocaleString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  );

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const potentiallyLongMessage = tribute.message.length > 120;

  return (
    <div className="bg-white rounded-xl shadow-subtle p-4 sm:p-5 my-3 transition-all duration-300 ease-in-out hover:shadow-card-hover w-full animate-fade-in">
      <div className="flex items-start justify-between mb-2">
        <div>
          {/* Container for name and relationship tag for better alignment and wrapping */}
          <div className="flex items-baseline flex-wrap gap-x-2 mb-0.5">
            {" "}
            {/* Use items-baseline for better text alignment, mb-0.5 for tiny space before timestamp */}
            <h3 className="font-semibold text-slate-700 leading-tight">
              {" "}
              {/* leading-tight for closer alignment if tag wraps */}
              {tribute.name}
            </h3>
            {/* Improved relationship tag styling */}
            {tribute.relationship && ( // Though relationship is required, check is harmless
              <span
                className="text-xs leading-tight font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md"
                title={`Relationship: ${tribute.relationship}`} // Added title for clarity on hover
              >
                {tribute.relationship}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{formattedTimestamp}</p>{" "}
          {/* mt-0.5 to align with mb-0.5 from above */}
        </div>
      </div>

      <div
        onClick={toggleExpansion}
        className={`
          text-slate-600 text-sm mb-3 whitespace-pre-wrap
          ${!isExpanded ? "line-clamp-3 cursor-pointer" : ""}
        `}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggleExpansion();
        }}
        aria-expanded={isExpanded}
        title={
          !isExpanded && potentiallyLongMessage
            ? "Tap to read full message"
            : tribute.message
        }
      >
        {tribute.message}
      </div>
      {!isExpanded && potentiallyLongMessage && (
        <button
          onClick={toggleExpansion}
          className="text-xs text-amber-600 hover:text-amber-700 font-medium focus:outline-none focus-visible:underline mb-1"
          aria-label="Read more about this tribute"
        >
          Read more
        </button>
      )}

      {tribute.attachmentType === "picture" &&
        typeof tribute.attachmentValue === "string" && (
          <div className="mt-3 rounded-lg overflow-hidden h-40 sm:h-48 w-full flex items-center justify-center bg-slate-50 border border-slate-100">
            <div className="relative w-full h-full">
              <Image
                src={tribute.attachmentValue}
                alt={`Tribute image from ${tribute.name}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain"
              />
            </div>
          </div>
        )}
    </div>
  );
};

export default TributeCardComponent;
