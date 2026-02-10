# テツナビ フロントエンド

Next.js 15 / React 19 / TypeScript で構築された、引越し手続きAIエージェントのフロントエンドアプリケーションです。

## 技術スタック

- **Next.js 15.x** - App Router による React Server Components
- **React 19.x** - 最新の React 機能を活用
- **TypeScript 5.x** - 型安全な開発
- **Tailwind CSS 3.x** - ユーティリティファーストのスタイリング
- **TanStack Query 5.x** - サーバー状態管理
- **Zod 3.x** - ランタイムバリデーション
- **React Hook Form** - フォーム管理

## プロジェクト構造

```
frontend/
├── src/
│   ├── app/                   # App Router ページ
│   ├── components/            # React コンポーネント
│   ├── hooks/                 # カスタムフック
│   ├── lib/                   # ライブラリ・ユーティリティ
│   ├── types/                 # TypeScript 型定義
│   └── styles/                # グローバルスタイル
├── public/                    # 静的ファイル
└── package.json
```

## セットアップ

### 依存パッケージのインストール

```bash
npm install
```

### 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定します。

```bash
NEXT_PUBLIC_API_URL=/api
BACKEND_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=テツナビ
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## ビルド

本番用ビルドを作成します。

```bash
npm run build
```

ビルド結果を確認します。

```bash
npm run start
```

## 型チェック

```bash
npm run type-check
```

## Linter

```bash
npm run lint
```

## Docker を使用したデプロイ

### イメージのビルド

```bash
docker build -t tetsunavi-frontend .
```

### コンテナの起動

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=/api \
  -e BACKEND_API_URL=http://backend:8000 \
  tetsunavi-frontend
```

## 主要な画面

1. **ホーム画面** (`/`) - 引越し基本情報の入力
2. **インタビュー画面** (`/sessions/[id]/interview`) - 詳細な質問への回答
3. **手続きリスト画面** (`/sessions/[id]/procedures`) - パーソナライズされた手続き一覧
4. **手続き詳細画面** (`/sessions/[id]/procedures/[procedureId]`) - 個別の手続き詳細
5. **タイムライン画面** (`/sessions/[id]/timeline`) - 時系列での手続き表示

## アーキテクチャ

### Server Components / Client Components の分離

- **Server Components**: ページレベル、データフェッチ、静的コンテンツ
- **Client Components**: フォーム、インタラクティブUI、状態管理

### API Routes (BFF)

`src/app/api/` 配下の API Routes は、Python バックエンドへのプロキシとして機能します。

- 入力バリデーション (Zod)
- エラーハンドリング
- レスポンス変換

### 状態管理

- **サーバー状態**: TanStack Query による管理
- **クライアント状態**: React の useState / useReducer
- **URL 状態**: Next.js App Router のパラメータ

## コーディング規約

- Server Components をデフォルトとし、必要な場合のみ 'use client' を使用
- 1コンポーネントは150行以内を目安に
- `any` 型の使用を避ける
- アクセシビリティを常に意識する (ARIA属性、キーボード操作)
- レスポンシブファーストで設計

## ライセンス

© 2026 テツナビ. All rights reserved.
