/**
 * ingest-sessions.ts
 *
 * 国会会期データの投入（第150回〜第220回）
 * 2000年（平成12年）〜2026年（令和8年）の71会期をカバー
 *
 * データソース:
 *   - 衆議院 国会会期一覧 (https://www.shugiin.go.jp/internet/itdb_annai.nsf/html/statics/shiryo/kaiki.htm)
 *   - 各回次のWikipedia記事（裏付け確認用）
 */

import type { SessionType } from "@ojpp/db";
import { prisma } from "@ojpp/db";

interface SessionData {
  number: number;
  type: SessionType;
  startDate: string;
  endDate: string;
}

const SESSIONS: SessionData[] = [
  // --- 第150回〜第153回（2000〜2001年）森内閣・小泉内閣 ---
  { number: 150, type: "EXTRAORDINARY", startDate: "2000-09-21", endDate: "2000-12-01" },
  { number: 151, type: "ORDINARY", startDate: "2001-01-31", endDate: "2001-06-29" },
  { number: 152, type: "EXTRAORDINARY", startDate: "2001-08-07", endDate: "2001-08-10" }, // 参院選後・4日間
  { number: 153, type: "EXTRAORDINARY", startDate: "2001-09-27", endDate: "2001-12-07" }, // 9.11後テロ対策

  // --- 第154回〜第158回（2002〜2003年）小泉内閣 ---
  { number: 154, type: "ORDINARY", startDate: "2002-01-21", endDate: "2002-07-31" },
  { number: 155, type: "EXTRAORDINARY", startDate: "2002-10-18", endDate: "2002-12-13" },
  { number: 156, type: "ORDINARY", startDate: "2003-01-20", endDate: "2003-07-28" },
  { number: 157, type: "EXTRAORDINARY", startDate: "2003-09-26", endDate: "2003-10-10" }, // 衆院解散
  { number: 158, type: "SPECIAL", startDate: "2003-11-19", endDate: "2003-11-27" }, // 第43回衆院選後・小泉再指名

  // --- 第159回〜第163回（2004〜2005年）小泉内閣 ---
  { number: 159, type: "ORDINARY", startDate: "2004-01-19", endDate: "2004-06-16" },
  { number: 160, type: "EXTRAORDINARY", startDate: "2004-07-30", endDate: "2004-08-06" }, // 参院選後・8日間
  { number: 161, type: "EXTRAORDINARY", startDate: "2004-10-12", endDate: "2004-12-03" },
  { number: 162, type: "ORDINARY", startDate: "2005-01-21", endDate: "2005-08-08" }, // 郵政解散
  { number: 163, type: "SPECIAL", startDate: "2005-09-21", endDate: "2005-11-01" }, // 第44回衆院選後・小泉再指名

  // --- 第164回〜第168回（2006〜2007年）小泉→安倍→福田内閣 ---
  { number: 164, type: "ORDINARY", startDate: "2006-01-20", endDate: "2006-06-18" },
  { number: 165, type: "EXTRAORDINARY", startDate: "2006-09-26", endDate: "2006-12-19" }, // 安倍内閣発足
  { number: 166, type: "ORDINARY", startDate: "2007-01-25", endDate: "2007-07-05" },
  { number: 167, type: "EXTRAORDINARY", startDate: "2007-08-07", endDate: "2007-08-10" }, // 参院選後・4日間
  { number: 168, type: "EXTRAORDINARY", startDate: "2007-09-10", endDate: "2008-01-15" }, // 安倍辞任→福田内閣発足

  // --- 第169回〜第172回（2008〜2009年）福田→麻生→鳩山内閣 ---
  { number: 169, type: "ORDINARY", startDate: "2008-01-18", endDate: "2008-06-21" },
  { number: 170, type: "EXTRAORDINARY", startDate: "2008-09-24", endDate: "2008-12-25" }, // 麻生内閣発足
  { number: 171, type: "ORDINARY", startDate: "2009-01-05", endDate: "2009-07-21" }, // 衆院解散
  { number: 172, type: "SPECIAL", startDate: "2009-09-16", endDate: "2009-09-19" }, // 第45回衆院選後・鳩山首相指名

  // --- 第173回〜第177回（2009〜2011年）鳩山→菅内閣 ---
  { number: 173, type: "EXTRAORDINARY", startDate: "2009-10-26", endDate: "2009-12-04" },
  { number: 174, type: "ORDINARY", startDate: "2010-01-18", endDate: "2010-06-16" },
  { number: 175, type: "EXTRAORDINARY", startDate: "2010-07-30", endDate: "2010-08-06" }, // 参院選後・8日間
  { number: 176, type: "EXTRAORDINARY", startDate: "2010-10-01", endDate: "2010-12-03" },
  { number: 177, type: "ORDINARY", startDate: "2011-01-24", endDate: "2011-08-31" }, // 東日本大震災・70日延長

  // --- 第178回〜第182回（2011〜2012年）野田内閣 ---
  { number: 178, type: "EXTRAORDINARY", startDate: "2011-09-13", endDate: "2011-09-30" }, // 野田内閣発足
  { number: 179, type: "EXTRAORDINARY", startDate: "2011-10-20", endDate: "2011-12-09" },
  { number: 180, type: "ORDINARY", startDate: "2012-01-24", endDate: "2012-09-08" }, // 79日延長・社会保障と税の一体改革
  { number: 181, type: "EXTRAORDINARY", startDate: "2012-10-29", endDate: "2012-11-16" }, // 衆院解散
  { number: 182, type: "SPECIAL", startDate: "2012-12-26", endDate: "2012-12-28" }, // 第46回衆院選後・安倍首相指名

  // --- 第183回〜第189回（2013〜2015年）第2次安倍内閣 ---
  { number: 183, type: "ORDINARY", startDate: "2013-01-28", endDate: "2013-06-26" },
  { number: 184, type: "EXTRAORDINARY", startDate: "2013-08-02", endDate: "2013-08-07" }, // 参院選後・6日間
  { number: 185, type: "EXTRAORDINARY", startDate: "2013-10-15", endDate: "2013-12-08" }, // 特定秘密保護法
  { number: 186, type: "ORDINARY", startDate: "2014-01-24", endDate: "2014-06-22" },
  { number: 187, type: "EXTRAORDINARY", startDate: "2014-09-29", endDate: "2014-11-21" }, // 衆院解散
  { number: 188, type: "SPECIAL", startDate: "2014-12-24", endDate: "2014-12-26" }, // 第47回衆院選後・安倍再指名
  { number: 189, type: "ORDINARY", startDate: "2015-01-26", endDate: "2015-09-27" }, // 安保法制・95日延長

  // --- 第190回〜第199回（2016〜2019年）安倍内閣 ---
  { number: 190, type: "ORDINARY", startDate: "2016-01-04", endDate: "2016-06-01" },
  { number: 191, type: "EXTRAORDINARY", startDate: "2016-08-01", endDate: "2016-08-03" }, // 参院選後・3日間
  { number: 192, type: "EXTRAORDINARY", startDate: "2016-09-26", endDate: "2016-12-17" },
  { number: 193, type: "ORDINARY", startDate: "2017-01-20", endDate: "2017-06-18" },
  { number: 194, type: "EXTRAORDINARY", startDate: "2017-09-28", endDate: "2017-09-28" }, // 衆院解散・会期1日
  { number: 195, type: "SPECIAL", startDate: "2017-11-01", endDate: "2017-12-09" }, // 第48回衆院選後・首相指名
  { number: 196, type: "ORDINARY", startDate: "2018-01-22", endDate: "2018-07-22" },
  { number: 197, type: "EXTRAORDINARY", startDate: "2018-10-24", endDate: "2018-12-10" },
  { number: 198, type: "ORDINARY", startDate: "2019-01-28", endDate: "2019-06-26" },
  { number: 199, type: "EXTRAORDINARY", startDate: "2019-08-01", endDate: "2019-08-05" }, // 参院選後・5日間

  // --- 第200回〜第207回（2019〜2021年） ---
  { number: 200, type: "EXTRAORDINARY", startDate: "2019-10-04", endDate: "2019-12-09" },
  { number: 201, type: "ORDINARY", startDate: "2020-01-20", endDate: "2020-06-17" },
  { number: 202, type: "EXTRAORDINARY", startDate: "2020-09-16", endDate: "2020-09-18" }, // 菅内閣発足の特別国会的性質
  { number: 203, type: "EXTRAORDINARY", startDate: "2020-10-26", endDate: "2020-12-05" },
  { number: 204, type: "ORDINARY", startDate: "2021-01-18", endDate: "2021-06-16" },
  { number: 205, type: "EXTRAORDINARY", startDate: "2021-10-04", endDate: "2021-10-14" }, // 岸田内閣発足・衆院解散
  { number: 206, type: "SPECIAL", startDate: "2021-11-10", endDate: "2021-11-12" }, // 第49回衆院選後・首相指名
  { number: 207, type: "EXTRAORDINARY", startDate: "2021-12-06", endDate: "2021-12-21" },

  // --- 第208回〜第210回（2022年）岸田内閣 ---
  { number: 208, type: "ORDINARY", startDate: "2022-01-17", endDate: "2022-06-15" },
  { number: 209, type: "EXTRAORDINARY", startDate: "2022-08-03", endDate: "2022-08-05" }, // 参院選後・3日間
  { number: 210, type: "EXTRAORDINARY", startDate: "2022-10-03", endDate: "2022-12-10" },

  // --- 第211回〜第213回（2023〜2024年）岸田内閣 ---
  { number: 211, type: "ORDINARY", startDate: "2023-01-23", endDate: "2023-06-21" },
  { number: 212, type: "EXTRAORDINARY", startDate: "2023-10-20", endDate: "2023-12-13" },
  { number: 213, type: "ORDINARY", startDate: "2024-01-26", endDate: "2024-06-23" },

  // --- 第214回〜第216回（2024年秋）石破内閣 ---
  { number: 214, type: "EXTRAORDINARY", startDate: "2024-10-01", endDate: "2024-10-09" }, // 石破内閣発足・衆院解散
  { number: 215, type: "SPECIAL", startDate: "2024-11-11", endDate: "2024-11-14" }, // 第50回衆院選後・石破再指名
  { number: 216, type: "EXTRAORDINARY", startDate: "2024-11-28", endDate: "2024-12-24" }, // 政治改革・補正予算

  // --- 第217回〜第220回（2025〜2026年） ---
  { number: 217, type: "ORDINARY", startDate: "2025-01-24", endDate: "2025-06-22" }, // 石破内閣・通常国会（150日間）
  { number: 218, type: "EXTRAORDINARY", startDate: "2025-08-01", endDate: "2025-08-05" }, // 参院選後・5日間
  { number: 219, type: "EXTRAORDINARY", startDate: "2025-10-21", endDate: "2025-12-17" }, // 臨時国会（58日間）
  { number: 220, type: "ORDINARY", startDate: "2026-01-23", endDate: "2026-01-23" }, // 召集日に衆院解散（会期1日）
];

export async function ingestSessions() {
  console.log("Ingesting diet sessions...");

  for (const session of SESSIONS) {
    const existing = await prisma.dietSession.findFirst({
      where: { number: session.number },
    });

    if (existing) {
      await prisma.dietSession.update({
        where: { id: existing.id },
        data: {
          type: session.type,
          startDate: new Date(session.startDate),
          endDate: new Date(session.endDate),
        },
      });
      console.log(`  Updated session #${session.number}`);
    } else {
      await prisma.dietSession.create({
        data: {
          number: session.number,
          type: session.type,
          startDate: new Date(session.startDate),
          endDate: new Date(session.endDate),
        },
      });
      console.log(`  Created session #${session.number}`);
    }
  }

  console.log(`Ingested ${SESSIONS.length} sessions.`);
}

if (require.main === module) {
  ingestSessions()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
