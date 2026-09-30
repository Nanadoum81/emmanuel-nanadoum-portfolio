import Image from "next/image";

export function ExhibitPlate({
  letter,
  label,
  src,
  alt,
  source,
  priority,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className = "",
  aspect = "16/10",
  tabColor = "bg-paper text-ink",
}: {
  letter?: string;
  label?: string;
  src: string;
  alt: string;
  source?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  aspect?: string;
  tabColor?: string;
}) {
  return (
    <figure className={`relative ${className}`}>
      {(letter || label) && (
        <div data-exhibit-tab className={`absolute -top-7 left-3 z-10 flex h-7 items-center gap-2 rounded-t-[3px] px-2.5 text-[12.5px] font-semibold ${tabColor}`}>
          {letter && <span className="num">Exhibit {letter}</span>}
          {label && <span className="font-normal opacity-80">{label}</span>}
        </div>
      )}
      <div className="exhibit-body bg-plate p-1.5 shadow-[0_18px_40px_-18px_rgba(17,18,20,0.45)] sm:p-2">
        <div className="relative overflow-hidden bg-plate-2" style={{ aspectRatio: aspect }}>
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />
        </div>
        {source && (
          <div className="flex items-center gap-2 px-1 pt-1.5 text-[12px] text-white/60">
            <span aria-hidden className="size-1.5 rounded-full bg-paper/70" />
            <span className="truncate">{source}</span>
          </div>
        )}
      </div>
    </figure>
  );
}
