# テツナビ - 引越し手続きAIナビゲーター

引越しに必要な行政手続き・民間手続きをAIが自動で洗い出し、期限管理・進捗管理までサポートするWebアプリです。

第4回 Agentic AI ハッカソン with Google Cloud 出展作品です。

## 主な機能

- **AIインタビュー**: 家族構成・車の所有・ペットなどの状況をヒアリングし、必要な手続きを自動特定
- **手続きリスト生成**: 20〜30件の行政・民間手続きを優先度・期限付きでリスト化
- **手続き詳細**: 必要書類・手順・窓口情報をワンクリックで確認
- **進捗管理**: チェックリスト形式で完了状況を管理
- **タイムライン表示**: 引越し日を基準にした時系列ビュー

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | Next.js 16, React 19, TailwindCSS, TanStack Query |
| BFF | Next.js Route Handlers (Server Actions) |
| バックエンド | Python 3.12, FastAPI, Pydantic v2 |
| AI | Gemini 2.0 Flash (Vertex AI), マルチエージェント構成 |
| データベース | Cloud Firestore (サブコレクション構造) |
| インフラ | Google Cloud (Cloud Run 想定) |

## アーキテクチャ

```
Browser → Next.js (BFF) → FastAPI Backend → Vertex AI (Gemini)
                                          → Cloud Firestore
```

### マルチエージェント構成

```
Root Agent (オーケストレーター)
  ├── Interview Agent   - 質問生成
  ├── Procedure Agent   - 手続き特定 (20-30件)
  ├── Document Agent    - 必要書類・手順
  ├── Location Agent    - 窓口情報
  └── Schedule Agent    - タイムライン生成
```

## セットアップ

### 前提条件

- Node.js 18+
- Python 3.12+
- [uv](https://docs.astral.sh/uv/) (Python パッケージマネージャー、推奨)

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd tetsunavi
```

### 2. バックエンド

```bash
cd backend

# 仮想環境の作成と依存関係のインストール
uv venv --python 3.12
source .venv/bin/activate
uv pip install -r requirements.txt

# 環境変数の設定
cp .env.example .env
# .env を編集（モックモードではデフォルトのままでOK）

# 起動
cd src
uvicorn main:app --reload --port 8000
```

### 3. フロントエンド

```bash
cd frontend

# 依存関係のインストール
npm install

# 環境変数の設定（デフォルトで設定済み）
# .env.local を確認

# 起動
npm run dev
```

### 4. アクセス

- フロントエンド: http://localhost:3000
- バックエンド API: http://localhost:8000
- API ドキュメント (Swagger): http://localhost:8000/docs

### Docker Compose（代替）

```bash
docker compose up --build
```

## モックモード

GCPの認証情報なしで動作するモックモードを搭載しています。デフォルトで有効です。

```env
# backend/.env
MOCK_MODE=true   # GCP不要で動作（デフォルト）
MOCK_MODE=false  # 本番モード（GCP認証が必要）
```

モックモードでは以下が動作します:
- インメモリストレージ（Firestoreの代替）
- 21件のリアルな手続きモックデータ
- 手続き詳細（必要書類・手順・窓口情報）のモックデータ

## プロジェクト構造

```
tetsunavi/
├── frontend/                 # Next.js フロントエンド
│   ├── src/
│   │   ├── app/             # App Router ページ
│   │   ├── components/      # UIコンポーネント
│   │   ├── lib/             # ユーティリティ・APIクライアント
│   │   └── types/           # TypeScript型定義
│   └── package.json
├── backend/                  # Python バックエンド
│   ├── src/
│   │   ├── agents/          # マルチエージェント
│   │   ├── api/v1/          # APIエンドポイント
│   │   ├── core/            # 設定・ミドルウェア
│   │   ├── models/          # ドメインモデル
│   │   ├── services/        # ビジネスロジック
│   │   └── main.py          # エントリーポイント
│   └── requirements.txt
├── docker-compose.yml
└── README.md
```

## API エンドポイント

| メソッド | パス | 説明 |
|---|---|---|
| POST | `/api/v1/sessions` | セッション作成 |
| GET | `/api/v1/sessions/{id}` | セッション取得 |
| GET | `/api/v1/sessions/{id}/interview` | インタビュー質問取得 |
| POST | `/api/v1/sessions/{id}/interview` | インタビュー回答送信 |
| POST | `/api/v1/sessions/{id}/procedures` | 手続きリスト生成 |
| GET | `/api/v1/sessions/{id}/procedures` | 手続きリスト取得 |
| GET | `/api/v1/sessions/{id}/procedures/{pid}` | 手続き詳細取得 |
| PATCH | `/api/v1/sessions/{id}/procedures/{pid}` | 手続き完了更新 |
| GET | `/api/v1/sessions/{id}/timeline` | タイムライン取得 |

## ライセンス

MIT
