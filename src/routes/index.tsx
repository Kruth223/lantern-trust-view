import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Lantern Ledger Test" },
      {
        name: "description",
        content:
          "The Lantern Ledger — a porch, not a cathedral. Lanterns earned, layered, and kept honest.",
      },
      { property: "og:title", content: "The Lantern Ledger" },
      {
        property: "og:description",
        content:
          "The Lantern Ledger — a porch, not a cathedral. Lanterns earned, layered, and kept honest.",
      },
    ],
  }),
  component: LanternLedger,
});

type Layer =
  | "Orientation"
  | "Canon"
  | "Living"
  | "Holding Shelf"
  | "Basket"
  | "Archaeology";

const LAYERS: Layer[] = [
  "Orientation",
  "Canon",
  "Living",
  "Holding Shelf",
  "Basket",
  "Archaeology",
];

type Lantern = {
  name: string;
  why: string;
  livesIn: string;
  layer: Layer;
  receiptPath: string;
};

const LANTERNS: Lantern[] = [
  {
    name: "Recoverability, not curiosity",
    why: "A system that can find its way home is safer than one that never drifts.",
    layer: "Canon",
    livesIn: "Operating Manual",
    receiptPath: "/docs/method/v2-calibration.md",
  },
  {
    name: "Reality gets a vote",
    why: "Frameworks, stories, and symbols are useful, but none outrank lived reality.",
    layer: "Orientation",
    livesIn: "Corpus Map v2",
    receiptPath: "/docs/orientation/corpus-map.md",
  },
  {
    name: "Connected difference",
    why: "Preserving distinct individual voices is healthier than forcing everyone to sound the same.",
    layer: "Living",
    livesIn: "Ecosystem Index",
    receiptPath: "/docs/living/ecosystem.md",
  },
  {
    name: "Same terrain, different costume",
    why: "The same underlying truth will look different depending on the voice speaking it.",
    layer: "Canon",
    livesIn: "Archive Architecture",
    receiptPath: "/docs/canon/architecture.md",
  },
  {
    name: "Correction is assisted adaptation",
    why: "Moving to fit reality better using new information, with help you could not reach alone.",
    layer: "Canon",
    livesIn: "Emotional Calibration Notes v2.4",
    receiptPath: "/docs/canon/calibration-v24.md",
  },
];

function LanternLedger() {
  const [query, setQuery] = useState("");
  const [activeLayer, setActiveLayer] = useState<Layer | "All">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LANTERNS.filter((l) => {
      if (activeLayer !== "All" && l.layer !== activeLayer) return false;
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.why.toLowerCase().includes(q) ||
        l.livesIn.toLowerCase().includes(q) ||
        l.receiptPath.toLowerCase().includes(q) ||
        l.layer.toLowerCase().includes(q)
      );
    });
  }, [query, activeLayer]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Header — visual only, not interactive. Lives at the top. */}
      <header className="border-b-2 border-ink px-5 pt-8 pb-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-ink/60">
          The Organisatiom
        </p>
        <h1 className="mt-2 text-4xl font-black leading-[0.95] tracking-tight">
          The Lantern
          <br />
          Ledger.
        </h1>
        <p className="mt-3 max-w-prose text-sm leading-snug text-ink/75">
          This is the porch, not the cathedral. The website may summarize. The
          archive must preserve.
        </p>
      </header>

      {/* List — scrollable, padded at bottom so thumb-zone controls never cover content */}
      <main className="px-4 pt-5 pb-[19rem]">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em]">
            Lanterns
          </h2>
          <span className="text-xs tabular-nums text-ink/60">
            {filtered.length}/{LANTERNS.length}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="border-2 border-dashed border-ink/40 p-6 text-center text-sm text-ink/60">
            No lanterns match. The shelf is honest about its silence.
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {filtered.map((l) => (
              <LanternCard key={l.receiptPath} lantern={l} />
            ))}
          </ul>
        )}
      </main>

      {/* Thumb-zone dock: filters + search live at the bottom for one-handed use */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-ink bg-paper">
        {/* Layer chips — horizontally scrollable, reachable */}
        <nav
          aria-label="Trust Layer filter"
          className="border-b-2 border-ink/15"
        >
          <div className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <LayerChip
              label="All"
              active={activeLayer === "All"}
              onClick={() => setActiveLayer("All")}
            />
            {LAYERS.map((layer) => (
              <LayerChip
                key={layer}
                label={layer}
                active={activeLayer === layer}
                onClick={() => setActiveLayer(layer)}
              />
            ))}
          </div>
        </nav>

        {/* Search — large, thumb-height */}
        <div className="px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <label htmlFor="lantern-search" className="sr-only">
            Search lanterns
          </label>
          <div className="flex items-stretch border-2 border-ink">
            <input
              id="lantern-search"
              type="search"
              inputMode="search"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search lanterns…"
              className="min-w-0 flex-1 bg-paper px-3 py-3 text-base font-medium text-ink placeholder:text-ink/40 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="border-l-2 border-ink bg-ink px-3 text-sm font-bold uppercase tracking-wider text-paper"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LayerChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        "shrink-0 border-2 border-ink px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors " +
        (active ? "bg-ink text-paper" : "bg-paper text-ink")
      }
    >
      {label}
    </button>
  );
}

function LanternCard({ lantern }: { lantern: Lantern }) {
  return (
    <li className="border-2 border-ink bg-card-paper shadow-block">
      <div className="flex items-start justify-between gap-3 border-b-2 border-ink bg-ink px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-paper">
          {lantern.layer}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-paper/70">
          Lantern
        </span>
      </div>
      <div className="px-4 py-4">
        <h3 className="text-xl font-black leading-tight">{lantern.name}</h3>
        <p className="mt-2 text-[15px] leading-snug text-ink/85">
          {lantern.why}
        </p>

        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[13px]">
          <dt className="font-bold uppercase tracking-wider text-ink/55">
            Lives in
          </dt>
          <dd className="min-w-0 break-words font-medium">{lantern.livesIn}</dd>

          <dt className="font-bold uppercase tracking-wider text-ink/55">
            Receipt
          </dt>
          <dd className="min-w-0 break-all font-mono text-[12px] text-ink/80">
            {lantern.receiptPath}
          </dd>
        </dl>
      </div>
    </li>
  );
}
