# FlowBuild Process Search

Application to execute FlowBuild process searches.

## How it works

The application allows users to search for FlowBuild processes based on `final bag` or `history` data. The application uses PostgreSQL `tsvector` feature for efficient searching and indexing.

## Getting Started

### Prerequisites

- Docker and Docker Compose
- FlowBuild Database available and accessible through the connection variables in `.env.development`

### Installation

```bash
npm install
```

### Configuration

Update the `.env.development` file in the root directory if needed.

### Running the Application

To start the database and application in development mode, run:

```bash
npm run dev
```

To start only the application (assuming the database is already running), run:

```bash
npm run server:dev
```

## Usage

### ETL Process

A simple cron schedule **(once every minute)** runs an ETL process that extracts finished processes from the FlowBuild core database, transforms them (including computing diffs between steps), and loads them into a new `process_search` database using PostgreSQL's `tsvector` feature for efficient searching and indexing.

### Search API

The service exposes a REST API endpoint to perform searches on indexed FlowBuild processes.

- **URL:** `/search`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "query": "Captain aka Cappy", // Required: search query string
    "limit": 10 // Optional: number of results to return (default: 10)
  }
  ```
- **Response:**
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
