import { prisma } from "@ojpp/db";
import { Card } from "@ojpp/ui";
import { unstable_noStore as noStore } from "next/cache";

function chamberLabel(chamber: string): string {
  return chamber === "HOUSE_OF_REPRESENTATIVES" ? "衆議院" : "参議院";
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export default async function ElectionsPage() {
  noStore();
  let elections: {
    id: string;
    name: string;
    chamber: string;
    date: Date;
    totalSeats: number;
    turnout: number | null;
    _count: { results: number };
  }[] = [];

  try {
    elections = await prisma.election.findMany({
      orderBy: { date: "desc" },
      include: {
        _count: { select: { results: true } },
      },
    });
  } catch {
    // DB not available
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">選挙一覧</h1>

      {elections.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500">
            選挙データがまだありません。
            <br />
            <code className="text-xs">pnpm ingest:elections</code>{" "}
            を実行してデータを投入してください。
          </p>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">選挙名</th>
                <th className="px-4 py-3 font-medium text-gray-600">院</th>
                <th className="px-4 py-3 font-medium text-gray-600">投票日</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">総定数</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">投票率</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">政党数</th>
              </tr>
            </thead>
            <tbody>
              {elections.map((election) => (
                <tr
                  key={election.id}
                  className="border-b transition-colors last:border-0 hover:bg-orange-50/50"
                >
                  <td className="px-4 py-3">
                    <a
                      href={`/elections/${election.id}`}
                      className="font-medium text-orange-600 hover:underline"
                    >
                      {election.name}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                      {chamberLabel(election.chamber)}
                    </span>
                  </td>
                  <td className="px-4 py-3">{formatDate(election.date)}</td>
                  <td className="px-4 py-3 text-right">{election.totalSeats}議席</td>
                  <td className="px-4 py-3 text-right">
                    {election.turnout != null ? `${election.turnout.toFixed(2)}%` : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">{election._count.results}党</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
