// components/TributeInputComponent.tsx
"use client";

import { useState, useRef, type FormEvent, useEffect } from "react";
import Image from "next/image";
import {
  Send,
  XCircle,
  Flower,
  CheckCircle,
  ChevronDown, // For a close/done button
  X, // Alternative for close
} from "lucide-react";

// ... (PREDEFINED_GIF_IMAGES, MAX_CHAR_LIMIT, types remain the same) ...
const PREDEFINED_GIF_IMAGES = Array.from({ length: 10 }, (_, i) => ({
  id: `mock_gif_${i + 1}`,
  src: `/assets/images/gifs/preset-${String(i + 1).padStart(2, "0")}.gif`,
  alt: `Symbolic GIF ${i + 1}`,
}));
const MAX_CHAR_LIMIT = 150;
export type AttachmentType = "picture" | null;
export interface NewTributeDataFromInput {
  message: string;
  attachmentType: AttachmentType;
  attachmentValue: string | null;
}
interface TributeInputComponentProps {
  onAddTribute: (data: NewTributeDataFromInput) => Promise<void>;
}

const TributeInputComponent: React.FC<TributeInputComponentProps> = ({
  onAddTribute,
}) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "posting" | "posted"
  >("idle");
  const [attachmentType, setAttachmentType] = useState<AttachmentType>(null);
  const [attachmentValue, setAttachmentValue] = useState<string | null>(null);
  const [attachmentAlt, setAttachmentAlt] = useState<string | null>(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const gifPickerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null); // Ref for the form

  // New state for focused/expanded input
  const [isInputFocused, setIsInputFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSelectGif = (imageUrl: string, imageAlt: string) => {
    setAttachmentType("picture");
    setAttachmentValue(imageUrl);
    setAttachmentAlt(imageAlt);
    setShowGifPicker(false);
    // Keep input focused if it was
    textareaRef.current?.focus();
  };

  const handleRemoveAttachment = () => {
    setAttachmentType(null);
    setAttachmentValue(null);
    setAttachmentAlt(null);
    setShowGifPicker(false);
    // Keep input focused if it was
    textareaRef.current?.focus();
  };

  // Click outside GIF picker
  useEffect(() => {
    const handleClickOutsideGifPicker = (event: MouseEvent) => {
      if (
        showGifPicker &&
        gifPickerRef.current &&
        !gifPickerRef.current.contains(event.target as Node)
      ) {
        setShowGifPicker(false);
      }
    };
    if (showGifPicker) {
      document.addEventListener("mousedown", handleClickOutsideGifPicker);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideGifPicker);
    };
  }, [showGifPicker]);

  // Click outside main input area when focused (for mobile overlay)
  // This is simplified; a robust outside click for a modal-like element can be complex
  // For now, we'll rely on a "Done" or "Close" button for the expanded mobile view.

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || submitStatus === "posted") return;
    if (!message.trim() && !attachmentValue) {
      alert("Please leave a tribute message or add a symbolic GIF.");
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus("posting");
    try {
      await onAddTribute({
        message: message.trim(),
        attachmentType,
        attachmentValue,
      });
      setSubmitStatus("posted");
      setTimeout(() => {
        setMessage("");
        handleRemoveAttachment(); // This also closes GIF picker
        setSubmitStatus("idle");
        setIsInputFocused(false); // Collapse input after successful submission
      }, 2000);
    } catch (error) {
      console.error("Submission error in component:", error);
      setSubmitStatus("idle");
      // setIsInputFocused(false); // Optionally collapse on error too
      alert("There was an error posting your tribute. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonTextOrIcon = () => {
    // ... (same as before)
    switch (submitStatus) {
      case "posting":
        return (
          <div
            className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"
            role="status"
            aria-live="polite"
          >
            <span className="sr-only">Sending...</span>
          </div>
        );
      case "posted":
        return <CheckCircle size={20} aria-hidden="true" />;
      default:
        return <Send size={20} aria-hidden="true" />;
    }
  };

  const handleTextareaFocus = () => {
    setIsInputFocused(true);
  };

  // This handler is for the overlay or a potential "Done" button to close the expanded view
  const handleCloseExpandedInput = () => {
    setIsInputFocused(false);
    setShowGifPicker(false); // Also close GIF picker if open
  };

  return (
    <>
      {/* Overlay for mobile when input is focused */}
      {isInputFocused && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden animate-fade-in"
          onClick={handleCloseExpandedInput} // Click overlay to close
          aria-hidden="true"
        ></div>
      )}

      <div
        className={`
          fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-top-soft z-30
          md:relative md:max-w-xl md:mx-auto md:shadow-none md:bg-transparent md:mt-8 md:p-0
          transition-all duration-300 ease-in-out
          ${isInputFocused ? "md:pb-0" : "md:pb-0"} 
          ${isInputFocused ? "h-[55vh] sm:h-[50vh] md:h-auto" : "h-auto"} 
          ${isInputFocused ? "flex flex-col" : ""}
        `}
      >
        <div
          className={`max-w-4xl mx-auto px-2 py-2 sm:px-4 sm:py-3 relative w-full ${
            isInputFocused ? "flex-grow flex flex-col" : ""
          }`}
        >
          {/* Attachment Preview (positioned carefully for expanded state) */}
          {attachmentValue && attachmentType === "picture" && (
            <div
              className={`
                absolute p-1.5 border border-slate-200 rounded-lg bg-white shadow-md animate-fade-in w-20 h-20 flex items-center justify-center
                ${
                  isInputFocused
                    ? "bottom-full left-4 mb-3 md:left-auto md:-top-20 md:left-4"
                    : "-top-20 left-4"
                }
              `}
            >
              <div className="relative w-16 h-16">
                <Image
                  src={attachmentValue}
                  alt={attachmentAlt || "Selected GIF"}
                  fill
                  className="rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveAttachment}
                  className="absolute -top-2.5 -right-2.5 bg-slate-700 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors shadow-sm flex items-center justify-center w-6 h-6 z-10"
                  aria-label="Remove attachment"
                >
                  <XCircle size={18} />
                </button>
              </div>
            </div>
          )}

          {/* GIF Picker (positioned carefully for expanded state) */}
          {showGifPicker && (
            <div
              ref={gifPickerRef}
              className={`
                absolute p-3 bg-white shadow-xl rounded-lg border border-slate-300 z-40 animate-fade-in
                w-auto max-w-[calc(100%-1rem)]
                ${
                  isInputFocused
                    ? "bottom-[calc(100%+0.5rem)] left-2 mb-2 md:bottom-full"
                    : "bottom-full left-2 mb-2"
                } 
              `}
            >
              <p className="text-xs font-medium text-slate-700 mb-2">
                Select a symbolic GIF:
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[20vh] md:max-h-[30vh] overflow-y-auto">
                {PREDEFINED_GIF_IMAGES.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => handleSelectGif(img.src, img.alt)}
                    className="p-1 rounded border-2 border-transparent hover:border-amber-400 focus:border-amber-500 focus:outline-none transition-all group text-left"
                    aria-label={`Select GIF: ${img.alt}`}
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded overflow-hidden relative group-hover:opacity-80 transition-opacity bg-slate-100">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </div>
                    <span className="block text-xxs sm:text-xs text-slate-600 mt-1 truncate group-hover:text-amber-700">
                      {img.alt}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowGifPicker(false)}
                className="block text-xs text-slate-500 hover:text-amber-600 mt-3 w-full text-center font-medium"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Close button for expanded mobile view */}
          {isInputFocused && (
            <div className="flex justify-end md:hidden mb-2 px-1">
              <button
                type="button"
                onClick={handleCloseExpandedInput}
                className="p-1.5 text-slate-500 hover:text-slate-700"
                aria-label="Close message input"
              >
                <ChevronDown size={24} />
                {/* Or <X size={20} /> if preferred */}
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            ref={formRef}
            className={`flex items-end gap-2 ${
              isInputFocused
                ? "flex-grow flex-col md:flex-row md:items-end"
                : "items-center"
            }`}
          >
            <div
              className={`flex items-center gap-1 sm:gap-2 flex-shrink-0 ${
                isInputFocused
                  ? "mb-2 md:mb-0 w-full md:w-auto justify-center"
                  : ""
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setShowGifPicker(!showGifPicker);
                  if (!isInputFocused) setIsInputFocused(true); // Focus input if picker is opened from collapsed state
                  textareaRef.current?.focus(); // Keep textarea focused
                }}
                className="p-2.5 sm:p-3 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all duration-200 ease-in-out"
                aria-label="Add symbolic GIF"
                aria-expanded={showGifPicker}
                title="Add symbolic GIF"
              >
                <Flower size={20} className="text-rose-500" />
              </button>
            </div>

            <div
              className={`flex-grow relative w-full ${
                isInputFocused ? "flex flex-col h-full" : ""
              }`}
            >
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CHAR_LIMIT) {
                    setMessage(e.target.value);
                  }
                }}
                onFocus={handleTextareaFocus}
                // onBlur is tricky with other interactive elements, using explicit close/overlay click instead
                placeholder={
                  isInputFocused
                    ? "Share your memories, anecdotes, or a heartfelt message..."
                    : "Share your memories..."
                }
                maxLength={MAX_CHAR_LIMIT}
                rows={isInputFocused ? 6 : 1} // Dynamically change rows
                className={`
                  w-full p-3 pr-16 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                  transition-all duration-300 ease-in-out text-sm resize-none overflow-y-auto
                  ${isInputFocused ? "h-full md:h-28" : "h-[46px]"}
                `}
                disabled={isSubmitting || submitStatus === "posted"}
                aria-label="Tribute message"
              />
              <span
                className={`
                absolute right-3 text-xs text-slate-400 pointer-events-none
                ${isInputFocused ? "bottom-2" : "top-1/2 -translate-y-1/2"}
              `}
              >
                {message.length}/{MAX_CHAR_LIMIT}
              </span>
            </div>

            <button
              type="submit"
              disabled={
                (!message.trim() && !attachmentValue) ||
                isSubmitting ||
                submitStatus === "posted"
              }
              className={`
                flex-shrink-0 flex items-center justify-center p-3 rounded-lg shadow-md transition-all duration-200 ease-in-out h-[46px]
                ${
                  isInputFocused
                    ? "w-full md:w-auto md:px-4 mt-2 md:mt-0"
                    : "w-[46px] md:px-4 md:w-auto"
                }
                ${
                  submitStatus === "posted"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-amber-600 hover:bg-amber-700"
                }
                text-white disabled:opacity-60 disabled:cursor-not-allowed
              `}
              aria-label={
                submitStatus === "posting"
                  ? "Sending tribute..."
                  : submitStatus === "posted"
                  ? "Tribute sent successfully"
                  : "Send tribute"
              }
              title={
                submitStatus === "posting"
                  ? "Sending..."
                  : submitStatus === "posted"
                  ? "Sent!"
                  : "Send your tribute"
              }
            >
              {getButtonTextOrIcon()}
              <span
                className={`
                ${isInputFocused ? "ml-2 inline" : "hidden md:ml-2 md:inline"}
              `}
              >
                {submitStatus === "idle" ? "Send" : ""}
                {isInputFocused && submitStatus === "idle" && (
                  <span className="md:hidden"> Tribute</span>
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default TributeInputComponent;
