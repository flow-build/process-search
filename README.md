# FlowBuild Process Search

Lightweight service to index and search FlowBuild processes (`final bag + history`) using PostgreSQL full-text search (`tsvector`).

## Overview

This service extracts finished FlowBuild processes from your FlowBuild core database, transforms and flattens relevant fields (computes diffs between steps, extracts final bag/history text), and loads them into a dedicated search database (`process_search`). The search database uses PostgreSQL `tsvector` columns and indexes to provide efficient full‑text queries over `final_bag` and `history` content.

The service exposes a small REST API to run searches against the indexed processes.

## How It Works

1. **Extract:** ETL connects to your FlowBuild core DB and selects processes that have the following statuses: `finished, interrupted, error, expired`.

2. **Transform:** Flattens JSON fields (final_bag, history) into searchable plain text and compute readable diffs between steps.

3. **Load / Index:**

- Upserts the transformed data into the `process_search` database

- Maintains `tsvector` columns and `GIN` indexes so queries are fast.

4. **Query:** The REST API performs full-text queries using `to_tsquery`/`plainto_tsquery` or the `@@` operator against the vector columns and returns matching processes.

This design keeps the search index separate from the core FlowBuild DB so search traffic and full-text indexing do not affect the production workload.

## Prerequisites

- Docker & Docker Compose (for development / local infra)

- Node.js and npm

- Access to a FlowBuild core PostgreSQL database (credentials configured via environment variables)

## Installation

Install dependencies:

```bash
npm install
```

## Configuration

Create or update the `.env.development` file in the project root with your database connection details.
Default values are provided for local development:

```env
PROCESS_SEARCH_DB_USER=postgres
PROCESS_SEARCH_DB_PASSWORD=postgres
PROCESS_SEARCH_DB_DB=workflow
PROCESS_SEARCH_DB_HOST=localhost
PROCESS_SEARCH_DB_PORT=5432
```

## Running

To start both the database and the application in development mode:

```bash
npm run dev
```

To start only the application (when DB is already running):

```bash
npm run server:dev
```

To start only the PostgreSQL database:

```bash
docker compose up -d
```

The API defaults to `http://localhost:4000` unless `PORT` is configured.

## Usage

### Search API

- **URL:** `/search`
- **Method:** `POST`

**Request Body:**

```json
{
  "query": "Captain aka Cappy", // Required: search text
  "limit": 10 // Optional: number of results to return (default: 10)
}
```

**Response (example):**

```json
  {
    "count": 1,
    "results": [
      {
        "id": "4942e870-7d51-11f0-93cd-b9b70b316b81",
        "workflow_id": "16a79a00-7c61-11f0-b36f-6b88301009f1",
        "final_status": "finished",
        "started_at": "2025-08-19T23:07:32.346Z",
        "finished_at": "2025-08-19T23:07:37.343Z",
        "final_bag": {
          "pet": {
            "id": "4a14870e-7d51-11f0-98b5-0e3363540d2f",
            "catId": 8870,
            "catName": "Captain aka Cappy"
          },
          ...
        },
        "history": [
          {
            "bag": {
              "medic": [],
              "getCat": [
                {
                  "id": "4a14870e-7d51-11f0-98b5-0e3363540d2f",
                  "catId": 8870,
                  "catName": "Captain aka Cappy",
                  ...
                }
              ]
            },
            "error": null,
            "result": {},
            "node_id": "START-IMPORT-RESERVATION",
            "actor_data": {
                "trace": {
                    "traceparent": "00-0972d696ec5909b90e4e18f51632e4ea-57d7da461f465f6b-01"
                },
                "claims": [
                    "anonymous"
                ],
                "extData": {
                    "exp": 1755647790,
                    "iat": 1755644190
                },
                "actor_id": "bf0687d0-7d4f-11f0-93cd-b9b70b316b81",
                "requestIp": "45.70.227.199",
                "userAgent": {
                    "os": "iOS",
                    "browser": "axios",
                    "version": "1.11.0",
                    "isMobile": true,
                    "platform": "unknown"
                },
                "session_id": "_cvM_Mr4Jm_tBVakOclWC"
            },
            "step_number": 1,
            "next_node_id": "START-IMPORT-RESERVATION",
            "external_input": {}
          },
          {
            "error": null,
            "status": "running",
            "changes": {
              "time_elapsed": "2",
              "result.step_number": 2
            },
            "node_id": "START-IMPORT-RESERVATION",
            "step_number": 2,
            "next_node_id": "BAG-CONFIG"
          },
          {
            "error": null,
            "status": "running",
            "changes": {
              "bag.error": [],
              "bag.success": [],
              "time_elapsed": null,
              "bag.process_id": "4942e870-7d51-11f0-93cd-b9b70b316b81",
              "external_input": null,
              "bag.BACKEND_URL": "https://7sp735e7vt.us-east-1.awsapprunner.com",
              "result.step_number": 3,
            },
              "node_id": "BAG-CONFIG",
            "step_number": 3,
            "next_node_id": "BAG-PROCESSING-CONTROL"
          },
          ...
        ]
        ...
      }
    ]
  }
```

## ETL behavior & schedule

- The default ETL runs every minute (cron expression `* * * * *`), extracts finished processes, and upserts them into the `process_search` DB.

- The ETL computes diffs between steps and creates flattened text fields used for full-text indexing (for example `final_bag_vector` and `history_vector`).

- Upsert ensures that if a process is re-processed, the indexed row is updated rather than duplicated.

- If you need lower latency or real-time indexing, consider converting the ETL to an event-driven pipeline (webhooks, logical replication, or streaming) as a future improvement.

## Data model (summary)

The indexed row typically contains:

- `id` (process id)

- `workflow_id` (workflow id)

- `final_status` (`finished`, `expired`, etc.)

- `started_at` (process start timestamp)

- `finished_at` (process finish timestamp)

- `final_bag` (process final bag as JSONB)

- `history` (process history as JSONB array with diffs between steps)

- `final_bag_vector` (tsvector - only for PostgreSQL full-text search)

- `history_vector` (tsvector - only for PostgreSQL full-text search)

The `final_bag_vector` and `history_vector` columns are generated from the JSON fields (`final_bag` and `history`) and indexed with a GIN index for fast text search.

## Development

- To lint code:
  ```bash
  npm run lint
  ```
- To format code:
  ```bash
  npm run format
  ```

## Limitations & future improvements

- Currently only _"finished"_ processes are indexed. If you need partial / running processes searchable, the ETL should include them.

- ETL runs on a schedule (default every minute) — there is a small window between a process finishing and it becoming searchable.

- Pagination and advanced faceting/filtering are minimal; consider adding offset/cursor pagination and filters (date ranges, workflow_id, status).
