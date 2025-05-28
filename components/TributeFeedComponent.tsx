// components/TributeFeedComponent.tsx
import TributeCardComponent, {
  type TributeCardData,
} from "./TributeCardComponent"; // Ensure TributeCardComponent.tsx also exists

interface TributeFeedComponentProps {
  tributes: TributeCardData[];
}

// Static mock data for Phase 2 layout (if you want the component to self-contain this for initial layout)
// Or, you can remove this if you always pass tributes from app/page.tsx

const TributeFeedComponent: React.FC<TributeFeedComponentProps> = ({
  tributes, // Tributes will be passed from app/page.tsx
}) => {
  // If tributes prop is empty, show the "empty" message.
  // For Phase 2, app/page.tsx passes staticTributesForPage, so this condition will be based on that.
  const isEmpty = !tributes || tributes.length === 0;

  return (
    <div className="w-full max-w-xl mx-auto px-4 pb-32 md:pb-10 flex-grow">
      {" "}
      {/* pb-32 for sticky input overlap on mobile */}
      {isEmpty && (
        <div className="text-center py-10 mt-6">
          <p className="text-slate-500 text-lg">
            Be the first to leave a tribute.
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Share a memory or light a candle in Lethukuthula.
          </p>
        </div>
      )}
      {!isEmpty && (
        <div className="space-y-4 mt-4 md:mt-6">
          {tributes.map((tribute) => (
            <TributeCardComponent key={tribute.id} tribute={tribute} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TributeFeedComponent;
