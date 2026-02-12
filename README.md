# Open Japan PoliTech Platform

**AIエージェント時代の政治インフラ — 政党にも企業にもよらない、完全オープンな政治テクノロジー基盤**

## なぜ今、PoliTechなのか

政治は長く、政党と企業の専有物だった。政治資金の流れを追うには専門知識が必要だった。全政党の政策を比較するには膨大な時間がかかった。国会の法案を読み解くには法律の素養が求められた。

**AIエージェントの時代が、この構造を変える。**

あなたのAIエージェントが、24時間365日、全政党の政治資金を監視する。全政党の政策変更を追跡し、差分を届ける。全法案を読み、あなたに影響のある部分を要約する。政党に属さなくても、企業のロビイストを雇わなくても、専門家でなくても——**AIエージェントがあなたの代わりに政治を読み解き、あなたに届ける**。

これがPoliTechだ。GovTech（行政DX）でもCivicTech（市民技術）でもない。**政治の意思決定プロセスそのものを、AIエージェントと共に、すべての人に開くテクノロジー**。

## PoliTech = 第三の概念

| | GovTech（行政DX） | CivicTech（市民技術） | **PoliTech（政治技術）** |
|---|---|---|---|
| **問い** | 決まった政策をいかに届けるか | 市民がいかに参加するか | **AIエージェント時代に、誰もが政治プロセスを実行・享受するには** |
| **主体** | 政府 | 市民社会 | **市民 + AIエージェント** |
| **時代** | 電子政府時代 | Web 2.0時代 | **AIエージェント時代** |
| **例** | マイナンバー、X-Road | Code for Japan、FixMyStreet | **本プラットフォーム、vTaiwan、Decidim** |

## 7つの原則

1. **エージェントファースト** — AIエージェントの参加を前提に設計。人間が見ていなくてもエージェントが動く
2. **非党派性** — 特定の政党・政治団体に依存しない。全政党を等しく扱う
3. **非企業性** — 企業が運営しない。企業の代弁者にもならない。完全にコミュニティ主導
4. **完全オープン** — コード、データ、意思決定プロセスの全てがオープン。AGPL-3.0
5. **誰でも参加** — 技術者でなくても、どの政治的立場からでも、人間でもAIでも参加できる
6. **議席不要** — 政治のデジタル化のために議席を取る必要はない。インフラは市民とエージェントが作る
7. **持続性** — 政権交代・組織変更に左右されない。フォーク可能で分散的

## プロダクト

### 1. MoneyGlass — 政治資金を、ガラスのように透明に

全政党・全政治団体の資金の流れを可視化。収支報告書を構造化し、収入9カテゴリ・支出8カテゴリで分類。Rechartsによるインタラクティブなグラフとダッシュボード統計で、誰もが政治資金の実態にアクセスできる。

- **公開フロントエンド** (`moneyglass-web` / port 3000) — ダッシュボード、団体検索、報告書閲覧
- **管理画面** (`moneyglass-admin` / port 3001) — データ管理・メンテナンス

### 2. PolicyDiff — 全政党の政策を、差分で比較する

全政党のマニフェスト・政策を10カテゴリに分類し、政党間の比較を可能にする。Markdown形式の政策テキストをremark + remark-htmlでレンダリング。カテゴリ別・政党別のフィルタリングと、市民からの政策提案機能を実装。

- **フロントエンド** (`policydiff-web` / port 3002) — 政策比較、カテゴリ別閲覧、提案投稿

### 3. ParliScope — 議会を、すべての人とエージェントに開く

国会の会期・法案・議員・投票・討論データをAPI化。14会期分のデータを構造化し、法案のステータス追跡、議員の投票履歴分析が可能。

- **公開フロントエンド** (`parliscope-web` / port 3003) — 法案検索、議員情報、投票記録
- **管理画面** (`parliscope-admin` / port 3004) — データ管理・メンテナンス

## エージェントファースト設計

AIエージェント時代に、政党や企業が独占してきた政治プロセスを誰もが実行できるようにする。あなたのエージェントが政治を読み解く。

- **API-First**: 全データをRESTful API / GraphQLで提供。エージェントが直接データにアクセス
- **機械可読データ**: JSON-LD、構造化データを標準。人間用UIとエージェント用APIの両方
- **エージェント認証**: AIエージェント用の認証・権限管理。エージェントは一級市民
- **MCP対応**: Model Context Protocol による外部AIとのシームレスな連携
- **監査ログ**: 全操作のトレーサビリティを保証。エージェントの行動も完全に透明

## セットアップ

### 前提条件

- Node.js 22+
- pnpm 10+
- PostgreSQL

### インストール手順

```bash
# 1. クローン
git clone https://github.com/ochyai/open-japan-politech-platform.git
cd open-japan-politech-platform

# 2. 環境変数
cp .env.example .env
# .env に DATABASE_URL を設定

# 3. 依存関係インストール
pnpm install

# 4. DB準備
pnpm db:generate    # Prisma Client 生成
pnpm db:migrate     # マイグレーション実行
pnpm db:seed        # 初期データ投入

# 5. データ取り込み
pnpm ingest:all       # 全データソース一括
# または個別:
pnpm ingest:finance    # 政治資金データ
pnpm ingest:parliament # 議会データ
pnpm ingest:manifesto  # マニフェストデータ

# 6. 開発サーバー起動
pnpm dev               # 全アプリ一斉起動
pnpm dev:moneyglass    # MoneyGlass のみ (port 3000 + 3001)
pnpm dev:policydiff    # PolicyDiff のみ (port 3002)
pnpm dev:parliscope    # ParliScope のみ (port 3003 + 3004)
```

### テスト・品質管理

```bash
pnpm test       # Vitest テスト実行
pnpm lint       # Biome lint チェック
pnpm lint:fix   # Biome lint 自動修正
pnpm typecheck  # TypeScript 型チェック
pnpm build      # プロダクションビルド
```

### その他のコマンド

```bash
pnpm db:studio  # Prisma Studio（DB GUI）
pnpm db:reset   # DB リセット
pnpm format     # Biome フォーマット
pnpm clean      # node_modules 全削除
```

## API仕様

### MoneyGlass API (port 3000)

| メソッド | エンドポイント | 説明 | パラメータ |
|---|---|---|---|
| GET | `/api/organizations` | 政治団体一覧 | `party`, `type` |
| GET | `/api/organizations/:id` | 団体詳細 | — |
| GET | `/api/reports` | 報告書一覧 | `year`, `org` |
| GET | `/api/reports/:id` | 報告書詳細（収支明細含む） | — |
| GET | `/api/parties` | 政党一覧（資金集計付き） | — |
| GET | `/api/stats` | ダッシュボード統計 | — |

### PolicyDiff API (port 3002)

| メソッド | エンドポイント | 説明 | パラメータ |
|---|---|---|---|
| GET | `/api/policies` | 政策一覧 | `party`, `category` |
| GET | `/api/policies/:id` | 政策詳細 | — |
| GET | `/api/parties` | 政党一覧（カテゴリ別件数付き） | — |
| GET | `/api/compare` | 政策比較 | `category`, `parties` |
| GET | `/api/proposals` | 提案一覧 | — |
| GET | `/api/categories` | カテゴリ一覧（件数付き） | — |

### ParliScope API (port 3003)

| メソッド | エンドポイント | 説明 | パラメータ |
|---|---|---|---|
| GET | `/api/sessions` | 会期一覧 | — |
| GET | `/api/sessions/:id` | 会期詳細 + 法案 | — |
| GET | `/api/bills` | 法案一覧 | `status`, `session` |
| GET | `/api/bills/:id` | 法案詳細（投票・議論含む） | — |
| GET | `/api/politicians` | 議員一覧 | `party`, `chamber` |
| GET | `/api/politicians/:id` | 議員詳細 + 投票履歴 | — |
| GET | `/api/stats` | ダッシュボード統計 | — |

## データモデル

Prismaスキーマに21モデル・10 enumを定義。

### 政治主体

- **Party** — 政党（11政党）
- **Politician** — 議員
- **Prefecture** — 都道府県（47）
- **PoliticalOrganization** — 政治団体

### 政治資金

- **FundReport** — 政治資金収支報告書
- **FundIncome** — 収入明細（9カテゴリ: 個人献金、法人献金、政党交付金、事業収入 等）
- **FundExpenditure** — 支出明細（8カテゴリ: 人件費、光熱費、事務所費、政治活動費 等）

### 政策

- **Policy** — 政策（10カテゴリ x 10政党）
- **PolicyProposal** — 市民からの政策提案

### 議会

- **DietSession** — 国会会期（14会期）
- **Bill** — 法案
- **Vote** — 投票記録
- **Discussion** — 討論記録

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript 5.9 |
| Database | PostgreSQL (via Supabase / local) |
| ORM | Prisma 6 |
| Styling | Tailwind CSS v4 |
| Charts | Recharts (MoneyGlass) |
| Markdown | remark + remark-html (PolicyDiff) |
| Package Manager | pnpm 10 (monorepo) |
| Linter/Formatter | Biome 2.3 |
| Testing | Vitest 3 |
| CI/CD | GitHub Actions |

## ディレクトリ構造

```
open-japan-politech-platform/
├── apps/
│   ├── moneyglass-web/      # MoneyGlass 公開フロントエンド (port 3000)
│   ├── moneyglass-admin/    # MoneyGlass 管理画面 (port 3001)
│   ├── policydiff-web/      # PolicyDiff フロントエンド (port 3002)
│   ├── parliscope-web/      # ParliScope 公開フロントエンド (port 3003)
│   └── parliscope-admin/    # ParliScope 管理画面 (port 3004)
├── packages/
│   ├── ui/                  # 共通UIコンポーネント (@ojpp/ui)
│   ├── db/                  # Prismaスキーマ・DB共通 (@ojpp/db)
│   ├── api/                 # API共通ユーティリティ (@ojpp/api)
│   └── ingestion/           # データ取り込みパイプライン (@ojpp/ingestion)
├── paper/                   # 学術論文
└── .github/                 # CI/CD
```

## 共有パッケージ

| パッケージ | 説明 |
|---|---|
| `@ojpp/db` | Prisma Client シングルトン、21モデル / 10 enum のスキーマ定義 |
| `@ojpp/ui` | Button, Card, Badge, Stat, Skeleton 等の共通UIコンポーネント |
| `@ojpp/api` | ページネーション、エラーハンドリング、CORS設定、BigInt JSON変換 |
| `@ojpp/ingestion` | 政治資金・議会・マニフェストのデータ取り込みスクリプト |

## 既存プロジェクトとの関係

| プロジェクト | 関係 |
|---|---|
| チームみらい（まる見え政治資金等） | 技術的参考。ただし政党紐づきのため、本プラットフォームは全政党対応の汎用版 |
| DD2030（Polimoney等） | 方向性は近い。本プラットフォームはエージェントファースト設計を追加 |
| g0v / vTaiwan | 台湾モデルの日本版。市民社会主導の非党派アプローチを踏襲 |
| Decidim / Consul | 欧州の参加型民主主義基盤。モジュラー設計を参考 |
| mySociety | 英国のNGOモデル。20年+の持続性を参考 |

## ライセンス

AGPL-3.0 — 改変版も含めてオープンソースであり続けることを保証する。ネットワーク経由のサービス提供時にもソースコード公開を義務づける。政治インフラは誰のものでもなく、全員のものである。

## Contributing

このプロジェクトは人間もAIエージェントもオープンに参加できます。詳細は [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。
