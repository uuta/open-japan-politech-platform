"use client";

interface PartyResult {
  seatsWon: number;
  party: {
    name: string;
    shortName: string | null;
    color: string | null;
  };
}

export function SeatBar({
  results,
  totalSeats,
  majorityLine,
  height = "h-12",
}: {
  results: PartyResult[];
  totalSeats: number;
  majorityLine?: { seats: number; label: string };
  height?: string;
}) {
  return (
    <div>
      {/* Stacked bar with optional majority line */}
      <div className="relative">
        <div className={`flex ${height} w-full overflow-hidden rounded-lg`}>
          {results.map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-center text-xs font-bold text-white transition-all hover:opacity-80"
              style={{
                width: `${(r.seatsWon / totalSeats) * 100}%`,
                backgroundColor: r.party.color || "#6B7280",
                minWidth: r.seatsWon > 0 ? "2px" : "0",
              }}
              title={`${r.party.name}: ${r.seatsWon}議席`}
            >
              {r.seatsWon >= totalSeats * 0.05 ? (
                <span className="truncate px-1">
                  {r.party.shortName || r.party.name} {r.seatsWon}
                </span>
              ) : null}
            </div>
          ))}
        </div>
        {/* Majority line indicator */}
        {majorityLine && (
          <div
            className="absolute top-0 bottom-0 z-10 flex flex-col items-center"
            style={{ left: `${(majorityLine.seats / totalSeats) * 100}%` }}
          >
            <div className="h-full border-l-2 border-dashed border-gray-800/70" />
            <span className="absolute -top-6 whitespace-nowrap rounded bg-gray-800 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow">
              {majorityLine.label}
            </span>
          </div>
        )}
      </div>
      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-2">
        {results
          .filter((r) => r.seatsWon > 0)
          .map((r, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-xs">
              <span
                className="inline-block h-3 w-3 rounded-sm"
                style={{ backgroundColor: r.party.color || "#6B7280" }}
              />
              {r.party.shortName || r.party.name} {r.seatsWon}
            </span>
          ))}
      </div>
    </div>
  );
}
