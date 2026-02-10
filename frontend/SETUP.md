# テツナビ フロントエンド セットアップガイド

このガイドでは、テツナビフロントエンドの開発環境をセットアップする手順を説明します。

## 前提条件

- Node.js 20.x 以上
- npm 10.x 以上

## セットアップ手順

### 1. 依存パッケージのインストール

プロジェクトルートで以下のコマンドを実行します。

```bash
cd /Users/yuta/workspace/projects/hackathon/tetsunavi/frontend
npm install
```

### 2. 環境変数の確認

`.env.local` ファイルが作成されていることを確認します。

```bash
cat .env.local
```

以下の内容が設定されているはずです。

```bash
NEXT_PUBLIC_API_URL=/api
BACKEND_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=テツナビ
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いて、アプリケーションが起動していることを確認します。

### 4. 型チェック

TypeScript の型エラーがないことを確認します。

```bash
npm run type-check
```

### 5. Linter の実行

コードスタイルをチェックします。

```bash
npm run lint
```

## トラブルシューティング

### ポートが既に使用されている

デフォルトでは3000番ポートを使用します。別のポートを使用する場合は、以下のコマンドで起動します。

```bash
PORT=3001 npm run dev
```

### モジュールが見つからないエラー

`node_modules` を削除して再インストールします。

```bash
rm -rf node_modules package-lock.json
npm install
```

### ビルドエラー

キャッシュをクリアしてから再度ビルドします。

```bash
rm -rf .next
npm run build
```

## 次のステップ

1. バックエンドAPI (`http://localhost:8000`) が起動していることを確認します
2. ホーム画面で引越し情報を入力してセッションを作成します
3. インタビュー画面で質問に回答します
4. 手続きリストが自動生成されることを確認します

## 開発時の注意事項

- Server Components をデフォルトとし、必要な場合のみ `'use client'` を使用します
- 型安全性を保つため、`any` 型の使用を避けます
- コンポーネントは小さく保ち、1コンポーネント150行以内を目安にします
- レスポンシブデザインを常に意識します (モバイルファースト)

## 関連ドキュメント

- [README.md](./README.md) - プロジェクト概要
- [設計書](../.agent-work/design/) - アーキテクチャ設計書
