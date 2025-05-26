// components/PostPaymentConfirmationComponent.tsx (Modified: Funeral CTA Removed)
"use client";

import React from "react"; // Removed useState, FormEvent if not used
import { Smartphone, MessageSquare, CheckCircle } from "lucide-react";

interface PostPaymentConfirmationComponentProps {
  deceasedName: string;
  deceasedId: string;
  userName: string;
  siteBaseUrl?: string;
  onDone?: () => void;
}

const PostPaymentConfirmationComponent: React.FC<
  PostPaymentConfirmationComponentProps
> = ({
  deceasedName,
  deceasedId,
  userName,
  siteBaseUrl = typeof window !== "undefined"
    ? window.location.origin
    : "https://your-tribute-site.com",
  onDone,
}) => {
  const tributeUrl = `${siteBaseUrl}/tribute/${deceasedId}`;
  const shareMessage = `I just sent a tribute for ${deceasedName}. You can view the memorial and send your own here: ${tributeUrl}`;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12 animate-fade-in text-center">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-5" />
      <h1 className="text-3xl sm:text-4xl font-playfair text-slate-800 mb-3">
        Thank You, {userName}!
      </h1>
      <p className="text-lg text-slate-600 mb-8 leading-relaxed">
        Your tribute for <span className="font-semibold">{deceasedName}</span>{" "}
        has been successfully delivered to the family. They appreciate your
        thoughtful gesture.
      </p>

      {/* Share Section */}
      <div className="mb-10 p-6 bg-slate-50 rounded-xl shadow-md">
        <h2 className="text-2xl font-playfair text-slate-700 mb-4">
          Share this Memorial
        </h2>
        <p className="text-slate-500 mb-5 text-sm">
          Let others know they can also pay their respects and share memories:
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-sm"
            aria-label="Share on WhatsApp"
          >
            <MessageSquare size={18} className="mr-2" /> WhatsApp
          </a>
          <a
            href={`sms:?&body=${encodeURIComponent(shareMessage)}`}
            className="flex items-center justify-center w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-sm"
            aria-label="Share via SMS"
          >
            <Smartphone size={18} className="mr-2" /> SMS
          </a>
        </div>
      </div>

      {/* Funeral Home CTA Removed from here */}

      {onDone && (
        <div className="mt-12">
          <button
            onClick={onDone}
            className="text-sm text-slate-500 hover:text-amber-600 font-medium transition-colors"
          >
            Return to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default PostPaymentConfirmationComponent;
