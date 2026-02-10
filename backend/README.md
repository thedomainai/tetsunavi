# Tetsunavi Backend

テツナビ - 「引越しします」の一言から、AIが自律的にパーソナライズされた手続きロードマップを作成するサービスのバックエンド API です。

## 技術スタック

- Python 3.12
- FastAPI 0.115.x
- Pydantic 2.x + pydantic-settings
- Google ADK (Agent Development Kit)
- google-cloud-aiplatform (Vertex AI / Gemini 2.0 Flash)
- google-cloud-firestore
- Firebase Admin SDK
- httpx
- slowapi (レート制限)
- uvicorn

## セットアップ

### 前提条件

- Python 3.12 以上
- Google Cloud プロジェクト
- Firestore データベース
- Vertex AI API の有効化

### インストール

```bash
# 仮想環境の作成
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 依存パッケージのインストール
pip install -r requirements.txt
```

### 環境変数の設定

`.env` ファイルを作成し、以下の環境変数を設定します。

```bash
GOOGLE_CLOUD_PROJECT=your-project-id
FIRESTORE_COLLECTION=sessions
VERTEX_AI_LOCATION=asia-northeast1
VERTEX_AI_MODEL=gemini-2.0-flash-001
GOOGLE_MAPS_API_KEY=your-api-key
CORS_ORIGINS=["http://localhost:3000"]
LOG_LEVEL=INFO
DEBUG=true
```

### Google Cloud 認証

```bash
# Application Default Credentials の設定
gcloud auth application-default login
```

## 開発サーバーの起動

```bash
# 開発モード（ホットリロード有効）
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

# または
python -m src.main
```

サーバーは `http://localhost:8000` で起動します。

## API ドキュメント

FastAPI の自動生成ドキュメントが利用できます。

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API エンドポイント

### セッション

- `POST /api/v1/sessions` - セッション作成
- `GET /api/v1/sessions/{session_id}` - セッション取得

### インタビュー

- `GET /api/v1/sessions/{session_id}/interview` - 質問取得
- `POST /api/v1/sessions/{session_id}/interview` - 回答保存

### 手続き

- `POST /api/v1/sessions/{session_id}/procedures` - 手続きリスト生成
- `GET /api/v1/sessions/{session_id}/procedures` - 手続きリスト取得
- `GET /api/v1/sessions/{session_id}/procedures/{procedure_id}` - 手続き詳細取得
- `PATCH /api/v1/sessions/{session_id}/procedures/{procedure_id}` - 完了状態更新

### タイムライン

- `GET /api/v1/sessions/{session_id}/timeline` - タイムライン取得

## プロジェクト構造

```
backend/
├── src/
│   ├── main.py                    # FastAPI アプリケーション
│   ├── api/                       # API エンドポイント
│   │   ├── v1/
│   │   │   ├── sessions.py
│   │   │   ├── interview.py
│   │   │   ├── procedures.py
│   │   │   └── timeline.py
│   │   └── dependencies.py
│   ├── agents/                    # ADK エージェント
│   │   ├── root_agent.py
│   │   ├── interview_agent.py
│   │   ├── procedure_agent.py
│   │   ├── document_agent.py
│   │   ├── location_agent.py
│   │   └── schedule_agent.py
│   ├── models/                    # Pydantic モデル
│   │   ├── domain.py
│   │   ├── requests.py
│   │   └── responses.py
│   ├── services/                  # ビジネスロジック
│   │   ├── session_service.py
│   │   ├── firestore_service.py
│   │   └── vertex_ai_service.py
│   ├── core/                      # コア機能
│   │   ├── config.py
│   │   ├── logging.py
│   │   ├── exceptions.py
│   │   └── middleware.py
│   └── utils/                     # ユーティリティ
│       └── date_utils.py
├── tests/                         # テスト
├── requirements.txt
├── pyproject.toml
├── Dockerfile
└── README.md
```

## エージェント構成

### Root Agent

マルチエージェントシステムのオーケストレーター。他のエージェントを調整し、タスクを振り分けます。

### Interview Agent

セッション情報から5-6問の質問を動的に生成します。

### Procedure Agent

インタビュー結果から20-30の必要な手続きを特定します。MVP では Gemini で直接生成（RAG は将来拡張）。

### Document Agent

手続きの必要書類、手順、注意事項を特定します。

### Location Agent

管轄窓口の情報を提供します。MVP では Gemini で生成（Google Maps API 連携は将来拡張）。

### Schedule Agent

依存関係を考慮したタイムラインを生成します。トポロジカルソートで依存解決を行います。

## テスト

```bash
# 全テスト実行
pytest

# カバレッジ付き
pytest --cov=src

# 特定のテストファイル
pytest tests/test_agents/test_root_agent.py
```

## デプロイ

### Docker ビルド

```bash
docker build -t tetsunavi-backend .
```

### Cloud Run へのデプロイ

```bash
gcloud run deploy tetsunavi-backend \
  --source . \
  --region asia-northeast1 \
  --platform managed \
  --allow-unauthenticated
```

## ライセンス

Copyright (c) 2026 Tetsunavi Project
