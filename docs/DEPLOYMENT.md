# OJPP デプロイ手順書（Vercel + Supabase）

本ドキュメントでは、Open Japan PoliTech Platform の3つの公開Webアプリを Vercel にデプロイする手順を説明する。

## 目次

1. [アーキテクチャ概要](#アーキテクチャ概要)
2. [前提条件](#前提条件)
3. [Supabase Cloud プロジェクトの作成](#supabase-cloud-プロジェクトの作成)
4. [Vercel プロジェクトの作成](#vercel-プロジェクトの作成)
5. [環境変数の設定](#環境変数の設定)
6. [デプロイの実行と確認](#デプロイの実行と確認)
7. [カスタムドメインの設定](#カスタムドメインの設定)
8. [トラブルシューティング](#トラブルシューティング)

---

## アーキテクチャ概要

```
GitHub リポジトリ (モノレポ)
├── apps/
│   ├── moneyglass-web   → Vercel プロジェクト A（政治資金可視化）
│   ├── policydiff-web   → Vercel プロジェクト B（政策比較）
│   └── parliscope-web   → Vercel プロジェクト C（国会監視）
├── packages/
│   ├── db               → Prisma + Supabase (PostgreSQL)
│   ├── ui               → 共有UIコンポーネント
│   ├── api              → 共有APIユーティリティ
│   └── ingestion        → データ取り込み
└── supabase/            → Supabase マイグレーション
```

- **パッケージマネージャ**: pnpm 10.4.0
- **フレームワーク**: Next.js 15.x + React 19
- **DB**: PostgreSQL (Supabase Cloud)
- **ORM**: Prisma (`packages/db`)

---

## 前提条件

- [Vercel アカウント](https://vercel.com/signup)
- [Supabase アカウント](https://supabase.com/dashboard)
- GitHub リポジトリへのアクセス権
- ローカル環境に Node.js 20+ / pnpm 10.4.0 がインストール済み

---

## Supabase Cloud プロジェクトの作成

### 1. プロジェクト作成

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. **New Project** をクリック
3. 以下を設定:
   - **Name**: `ojpp-production`（任意）
   - **Database Password**: 強力なパスワードを生成して控えておく
   - **Region**: `Northeast Asia (Tokyo)` — `ap-northeast-1`
   - **Pricing Plan**: 用途に応じて選択（Free / Pro）
4. **Create new project** をクリック

### 2. 接続情報の取得

プロジェクト作成後、**Project Settings > Database** から以下を取得:

| 項目 | 用途 |
|------|------|
| **Connection string (Transaction)** | `DATABASE_URL` — Prisma が使用（PgBouncer 経由、port 6543） |
| **Connection string (Session)** | `DIRECT_URL` — マイグレーション用（直接接続、port 5432） |

> Transaction mode の接続文字列末尾に `?pgbouncer=true` が付いていることを確認。

### 3. Supabase API キーの取得

**Project Settings > API** から以下を取得:

| 項目 | 環境変数 |
|------|----------|
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon (public) key** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **service_role key** | `SUPABASE_SERVICE_ROLE_KEY` |

### 4. マイグレーションの実行

ローカルから本番DBに対してマイグレーションを実行する:

```bash
# .env に本番の DATABASE_URL / DIRECT_URL を設定した上で
pnpm db:generate
pnpm --filter @ojpp/db migrate:deploy
```

---

## Vercel プロジェクトの作成

同一のGitHubリポジトリから **3つのVercelプロジェクト** を作成する。

### 共通手順（3アプリ分繰り返す）

1. [Vercel Dashboard](https://vercel.com/dashboard) で **Add New > Project**
2. GitHubリポジトリ `open-japan-politech-platform` をインポート
3. 以下の設定を行う:

| 設定項目 | moneyglass-web | policydiff-web | parliscope-web |
|----------|----------------|----------------|----------------|
| **Project Name** | `ojpp-moneyglass` | `ojpp-policydiff` | `ojpp-parliscope` |
| **Framework Preset** | Next.js | Next.js | Next.js |
| **Root Directory** | `apps/moneyglass-web` | `apps/policydiff-web` | `apps/parliscope-web` |

4. **Root Directory** の設定が最重要。 `Edit` をクリックしてパスを入力する
5. **Build & Development Settings** は `vercel.json` から自動検出されるため、基本的にデフォルトのまま

> **重要**: Root Directory を設定すると、Vercel はそのディレクトリの `vercel.json` を自動的に読み取る。
> `installCommand` と `buildCommand` は `vercel.json` に定義済みのため、手動設定は不要。

### pnpm の自動検出

Vercel はルートの `package.json` の `"packageManager": "pnpm@10.4.0"` を検出し、自動的に pnpm を使用する。追加設定は不要。

---

## 環境変数の設定

各Vercelプロジェクトの **Settings > Environment Variables** で以下を設定する。

### 全プロジェクト共通

| 変数名 | 値 | Environment |
|--------|-----|-------------|
| `DATABASE_URL` | Supabase Transaction 接続文字列 | Production, Preview |
| `DIRECT_URL` | Supabase Session 接続文字列 | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Production, Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key | Production, Preview |

### アプリ固有

| 変数名 | 値の例 | 説明 |
|--------|--------|------|
| `NEXT_PUBLIC_BASE_URL` | `https://moneyglass.example.com` | 各アプリの本番URL |

### AI機能（オプション）

| 変数名 | 説明 |
|--------|------|
| `OPENAI_API_KEY` | OpenAI APIキー |
| `ANTHROPIC_API_KEY` | Anthropic APIキー |

> **Tip**: Vercel の Environment Variables は Production / Preview / Development ごとに分けられる。
> Preview 環境ではステージング用の Supabase プロジェクトを使用することを推奨。

---

## デプロイの実行と確認

### 初回デプロイ

Vercel プロジェクト作成時に環境変数を設定していれば、GitHub の `main` ブランチへの push で自動デプロイされる。

手動でデプロイする場合:

```bash
# Vercel CLI を使用
npx vercel --cwd apps/moneyglass-web
npx vercel --cwd apps/policydiff-web
npx vercel --cwd apps/parliscope-web
```

### デプロイ確認チェックリスト

各アプリについて以下を確認:

- [ ] Vercel Dashboard でビルドが成功している（Build Logs にエラーがない）
- [ ] Prisma Client が正常に生成されている（`postinstall` が実行されている）
- [ ] トップページが正常に表示される
- [ ] API ルート（`/api/...`）が正常に応答する
- [ ] データベースからデータが取得できている
- [ ] セキュリティヘッダーが付与されている（DevTools > Network で確認）

### ビルドログの確認ポイント

```
# 正常なログの例:
Installing dependencies...
> @ojpp/db@0.1.0 postinstall
> prisma generate
✓ Generated Prisma Client

Building moneyglass-web...
✓ Compiled successfully
```

---

## カスタムドメインの設定

各Vercelプロジェクトの **Settings > Domains** でカスタムドメインを追加:

| アプリ | ドメイン例 |
|--------|-----------|
| moneyglass-web | `moneyglass.ojpp.example.com` |
| policydiff-web | `policydiff.ojpp.example.com` |
| parliscope-web | `parliscope.ojpp.example.com` |

DNS レコード設定後、SSL証明書は Vercel が自動発行する。

---

## トラブルシューティング

### Prisma Client が生成されない

**症状**: `@prisma/client did not initialize yet` エラー

**対処**:
1. `packages/db/package.json` の `postinstall` スクリプトが存在するか確認
2. Vercel の Build Logs で `prisma generate` が実行されているか確認
3. `pnpm-workspace.yaml` の `onlyBuiltDependencies` に `@prisma/client`, `prisma` が含まれているか確認

### pnpm install が失敗する

**症状**: `ERR_PNPM_LOCKFILE_MISSING_DEPENDENCY` エラー

**対処**:
```bash
# ローカルで lockfile を再生成
pnpm install --no-frozen-lockfile
git add pnpm-lock.yaml
git commit -m "fix: update lockfile"
git push
```

### モノレポのパッケージが見つからない

**症状**: `Cannot find module '@ojpp/db'` エラー

**対処**:
1. Root Directory が正しく設定されているか確認（`apps/moneyglass-web` など）
2. `installCommand` が `pnpm install`（ルートで実行）になっているか確認
3. `vercel.json` の `installCommand` が正しいか確認

### 環境変数が読み込まれない

**症状**: `DATABASE_URL is not defined` エラー

**対処**:
1. Vercel Dashboard で環境変数が正しい Environment（Production/Preview）に設定されているか確認
2. `NEXT_PUBLIC_` プレフィックスが必要な変数にはプレフィックスが付いているか確認
3. 環境変数を変更した場合はリデプロイが必要

### ビルドがタイムアウトする

**対処**:
1. `next.config.ts` の `transpilePackages` に必要なパッケージが含まれているか確認
2. Vercel の Pro プランでは最大45分のビルド時間が利用可能
