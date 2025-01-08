import { Hono } from "hono";
import { swaggerUI } from "@hono/swagger-ui";

const docs = new Hono();

// Swagger UI
docs.get("/", swaggerUI({ url: "/docs/swagger" }));

// Endpoint untuk Swagger JSON
docs.get("/swagger", (c) => {
    return c.json({
      openapi: "3.0.0",
      info: {
        title: "My API",
        version: "1.0.0",
        description: "API documentation for My API",
      },
      servers: [
        {
          url: "/api", // Base URL untuk semua endpoint API
          description: "Main API server",
        },
      ],
      paths: {
      "/npmSearch": {
          get: {
            summary: "search npm package!",
            "parameters": [
          {
            "name": "q",
            "in": "query",
            "type": "string",
            required: true
          }
        ],
            "responses": {
          "200": {
            "description": "OK"
          }
        }
          },
        },
      "/copilot": {
          get: {
            summary: "ask copilot!",
            "parameters": [
          {
            "name": "q",
            "in": "query",
            "type": "string",
            required: true
          }
        ],
            "responses": {
          "200": {
            "description": "OK"
          }
        }
          },
        },
      "/bf-getDetails": {
      "get": {
        summary: "Get fruit details",
        "parameters": [
          {
            "name": "q",
            "in": "query",
            "type": "string",
            required: true
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
      "/bf-stock": {
          get: {
            summary: "Lihat stock Fruit!",
            "responses": {
          "200": {
            "description": "OK"
          }
        }
          },
        },
      "/bf-fruitValue": {
          get: {
            summary: "Lihat nilai Fruit!",
            "responses": {
          "200": {
            "description": "OK"
          }
        }
          },
        },
        "/tempmail/create": {
          get: {
            summary: "Buat email sementara",
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    example: { status: 200, email: "random123@1secmail.com" },
                  },
                },
              },
              "500": {
                description: "Internal Server Error",
                content: {
                  "application/json": {
                    example: { status: 500, error: "Gagal membuat email sementara" },
                  },
                },
              },
            },
          },
        },
        "/tempmail/inbox": {
          get: {
            summary: "Periksa inbox email sementara",
            parameters: [
              {
                name: "email",
                in: "query",
                required: true,
                description: "Alamat email sementara",
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    example: { status: 200, inbox: [{ id: 1, subject: "Hello" }] },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    example: { status: 400, error: "Parameter email diperlukan" },
                  },
                },
              },
              "500": {
                description: "Internal Server Error",
                content: {
                  "application/json": {
                    example: { status: 500, error: "Gagal memeriksa inbox" },
                  },
                },
              },
            },
          },
        },
        "/tempmail/read": {
          get: {
            summary: "Baca pesan dari inbox",
            parameters: [
              {
                name: "email",
                in: "query",
                required: true,
                description: "Alamat email sementara",
                schema: {
                  type: "string",
                },
              },
              {
                name: "id",
                in: "query",
                required: true,
                description: "ID pesan",
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    example: { status: 200, message: { subject: "Hello", body: "Hi there!" } },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    example: { status: 400, error: "Parameter email dan id diperlukan" },
                  },
                },
              },
              "500": {
                description: "Internal Server Error",
                content: {
                  "application/json": {
                    example: { status: 500, error: "Gagal membaca pesan" },
                  },
                },
              },
            },
          },
        },
        "/nsfw-blowjob": {
          get: {
            summary: "Get NSFW Blowjob Image",
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    example: { result: { url: "https://example.com/image.jpg" } },
                  },
                },
              },
            },
          },
        },
        "/nsfw-trap": {
          get: {
            summary: "Get NSFW Trap Image",
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    example: { result: { url: "https://example.com/image.jpg" } },
                  },
                },
              },
            },
          },
        },
        "/nsfw-neko": {
          get: {
            summary: "Get NSFW Neko Image",
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    example: { result: { url: "https://example.com/image.jpg" } },
                  },
                },
              },
            },
          },
        },
        "/nsfw-waifu": {
          get: {
            summary: "Get NSFW Waifu Image",
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    example: { result: { url: "https://example.com/image.jpg" } },
                  },
                },
              },
            },
          },
        },
        "/dark-jokes": {
          get: {
            summary: "Get Dark Jokes",
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    example: { result: { joke: "Why did the chicken cross the road? To get to the other side." } },
                  },
                },
              },
            },
          },
        },
        "/tiktok": {
          get: {
            summary: "Get TikTok Video Info",
            parameters: [
              {
                name: "url",
                in: "query",
                required: true,
                description: "TikTok video URL",
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    example: { status: 200, result: { videoUrl: "https://example.com/video.mp4" } },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    example: { error: "url mana" },
                  },
                },
              },
            },
          },
        },
        "/random-user": {
          get: {
            summary: "Get Random User",
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    example: { status: 200, result: { name: "John Doe", email: "john@example.com" } },
                  },
                },
              },
            },
          },
        },
        "/mistral": {
          get: {
            summary: "Get Mistral AI Response",
            parameters: [
              {
                name: "query",
                in: "query",
                required: true,
                description: "Query for Mistral AI",
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    example: { status: 200, result: "This is the Mistral AI response." },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    example: { error: "query?" },
                  },
                },
              },
            },
          },
        },
        "/mistral-large": {
          get: {
            summary: "Get Mistral Large AI Response",
            parameters: [
              {
                name: "query",
                in: "query",
                required: true,
                description: "Query for Mistral Large AI",
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    example: { status: 200, result: "This is the Mistral Large AI response." },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    example: { error: "query?" },
                  },
                },
              },
            },
          },
        },
        "/llama": {
          get: {
            summary: "Get Llama AI Response",
            parameters: [
              {
                name: "query",
                in: "query",
                required: true,
                description: "Query for Llama AI",
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    example: { status: 200, result: "This is the Llama AI response." },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    example: { error: "query?" },
                  },
                },
              },
            },
          },
        },
        "/openai": {
          get: {
            summary: "Get OpenAI Response",
            parameters: [
              {
                name: "query",
                in: "query",
                required: true,
                description: "Query for OpenAI",
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    example: { status: 200, result: "This is the OpenAI response." },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    example: { error: "query?" },
                  },
                },
              },
            },
          },
        },
      },
    });
  });

export default docs; // Pastikan menggunakan export default