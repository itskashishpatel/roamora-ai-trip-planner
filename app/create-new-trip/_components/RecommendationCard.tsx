
import {
  MapPin,
  Star,
  Clock3,
  Ticket,
  ExternalLink,
  Hotel,
  Utensils,
  Camera,
} from "lucide-react";

export type RecommendationType =
  | "hotel"
  | "restaurant"
  | "attraction";

type RecommendationCardProps = {
  type: RecommendationType;
  title: string;
  description?: string;
  imageUrl?: string;
  location?: string;
  rating?: string;
  price?: string;
  bestTime?: string;
  href?: string;
  placeholder?: boolean;
};

const categoryConfig = {
  hotel: {
    icon: Hotel,
    label: "Stay",
  },
  restaurant: {
    icon: Utensils,
    label: "Food & dining",
  },
  attraction: {
    icon: Camera,
    label: "Experience",
  },
};

export default function RecommendationCard({
  type,
  title,
  description,
  imageUrl,
  location,
  rating,
  price,
  bestTime,
  href,
  placeholder = false,
}: RecommendationCardProps) {
  const config = categoryConfig[type];
  const CategoryIcon = config.icon;

  return (
    <article className="group min-w-0 overflow-hidden rounded-2xl border border-[#e1e8dd] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#b8cdb8] hover:shadow-lg">
      <div
        className="relative h-36 overflow-hidden bg-linear-to-br from-[#dce9d7] via-[#edf1e5] to-[#c4d9c6]"
        role={imageUrl ? "img" : undefined}
        aria-label={imageUrl ? title : undefined}
        style={
          imageUrl
            ? {
                backgroundImage: `url("${imageUrl}")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }
            : undefined
        }
      >
        {!imageUrl && (
          <div className="flex h-full items-center justify-center text-[#64846b]">
            <CategoryIcon className="h-10 w-10 opacity-60" />
          </div>
        )}

        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#315640] shadow-sm">
          <CategoryIcon className="h-3 w-3" />
          {config.label}
        </div>

        {placeholder && (
          <span className="absolute bottom-3 right-3 rounded-full bg-[#173e2e]/90 px-2.5 py-1 text-[9px] font-semibold text-white">
            Preview card
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-bold text-[#203d2d]">
            {title}
          </h3>

          {rating && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#fff5df] px-2 py-1 text-[10px] font-bold text-[#94651c]">
              <Star className="h-3 w-3 fill-current" />
              {rating}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#778579]">
            {description}
          </p>
        )}

        {location && (
          <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-4 text-[#64796a]">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-2">{location}</span>
          </p>
        )}

        {bestTime && (
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[#64796a]">
            <Clock3 className="h-3.5 w-3.5" />
            Best time: {bestTime}
          </p>
        )}

        {price && (
          <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#356b4c]">
            <Ticket className="h-3.5 w-3.5" />
            {price}
          </p>
        )}

        {placeholder && (
          <p className="mt-3 rounded-lg bg-[#f5f7f1] px-2.5 py-2 text-[10px] leading-4 text-[#718174]">
            Example layout only. Verified recommendations and live details
            will appear after the data provider is connected.
          </p>
        )}

        {href && (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#dce5d9] px-3 py-2.5 text-xs font-semibold text-[#28563c] transition hover:border-[#28563c] hover:bg-[#f3f7f0]"
          >
            View details
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}
