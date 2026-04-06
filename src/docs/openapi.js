const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Finance Data Processing and Access Control API",
    version: "1.0.0",
    description:
      "Backend API for user/role management, financial records, dashboard summaries, and JWT-based role access control.",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Users" },
    { name: "Records" },
    { name: "Dashboard" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      ValidationErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Validation failed" },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: { type: "string" },
                message: { type: "string" },
                value: {},
              },
            },
          },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: ["viewer", "analyst", "admin"] },
          status: { type: "string", enum: ["active", "inactive"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Record: {
        type: "object",
        properties: {
          _id: { type: "string" },
          amount: { type: "number" },
          type: { type: "string", enum: ["income", "expense"] },
          category: { type: "string" },
          date: { type: "string", format: "date-time" },
          notes: { type: "string" },
          createdBy: {
            oneOf: [
              { type: "string" },
              {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  role: { type: "string" },
                },
              },
            ],
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
        },
      },
      CreateUserRequest: {
        type: "object",
        required: ["name", "email", "password", "role"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
          role: { type: "string", enum: ["viewer", "analyst", "admin"] },
          status: {
            type: "string",
            enum: ["active", "inactive"],
            default: "active",
          },
        },
      },
      UpdateUserRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          role: { type: "string", enum: ["viewer", "analyst", "admin"] },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      CreateRecordRequest: {
        type: "object",
        required: ["amount", "type", "category", "date"],
        properties: {
          amount: { type: "number", minimum: 0.01 },
          type: { type: "string", enum: ["income", "expense"] },
          category: { type: "string" },
          date: { type: "string", format: "date-time" },
          notes: { type: "string" },
        },
      },
      UpdateRecordRequest: {
        type: "object",
        properties: {
          amount: { type: "number", minimum: 0.01 },
          type: { type: "string", enum: ["income", "expense"] },
          category: { type: "string" },
          date: { type: "string", format: "date-time" },
          notes: { type: "string" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      UserListResponse: {
        type: "object",
        properties: {
          page: { type: "number" },
          limit: { type: "number" },
          total: { type: "number" },
          users: {
            type: "array",
            items: { $ref: "#/components/schemas/User" },
          },
        },
      },
      RecordListResponse: {
        type: "object",
        properties: {
          page: { type: "number" },
          limit: { type: "number" },
          total: { type: "number" },
          records: {
            type: "array",
            items: { $ref: "#/components/schemas/Record" },
          },
        },
      },
      DashboardSummaryResponse: {
        type: "object",
        properties: {
          totalIncome: { type: "number" },
          totalExpenses: { type: "number" },
          netBalance: { type: "number" },
          categoryWiseTotals: {
            type: "array",
            items: {
              type: "object",
              properties: {
                category: { type: "string" },
                income: { type: "number" },
                expense: { type: "number" },
                total: { type: "number" },
              },
            },
          },
          monthlyTrend: {
            type: "array",
            items: {
              type: "object",
              properties: {
                _id: {
                  type: "object",
                  properties: {
                    year: { type: "number" },
                    month: { type: "number" },
                    type: { type: "string" },
                  },
                },
                amount: { type: "number" },
              },
            },
          },
          recentActivity: {
            type: "array",
            items: { $ref: "#/components/schemas/Record" },
          },
        },
      },
    },
  },
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "API is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    timestamp: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          "400": {
            description: "Validation failed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationErrorResponse" },
              },
            },
          },
          "401": {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      get: {
        tags: ["Auth"],
        summary: "Method guidance",
        responses: {
          "405": {
            description: "Use POST for login",
          },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Profile data",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
          },
        },
      },
    },
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "List users (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "role",
            in: "query",
            schema: { type: "string", enum: ["viewer", "analyst", "admin"] },
          },
          {
            name: "status",
            in: "query",
            schema: { type: "string", enum: ["active", "inactive"] },
          },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          "200": {
            description: "Users list",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserListResponse" },
              },
            },
          },
          "403": { description: "Forbidden" },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Create user (admin)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateUserRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "User created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          "409": { description: "Email already in use" },
        },
      },
    },
    "/api/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by id (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "User details" },
          "404": { description: "User not found" },
        },
      },
      patch: {
        tags: ["Users"],
        summary: "Update user (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateUserRequest" },
            },
          },
        },
        responses: {
          "200": { description: "User updated" },
          "404": { description: "User not found" },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Delete user (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "User deleted" },
          "404": { description: "User not found" },
        },
      },
    },
    "/api/records": {
      get: {
        tags: ["Records"],
        summary: "List records",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "type",
            in: "query",
            schema: { type: "string", enum: ["income", "expense"] },
          },
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "startDate", in: "query", schema: { type: "string", format: "date" } },
          { name: "endDate", in: "query", schema: { type: "string", format: "date" } },
          { name: "minAmount", in: "query", schema: { type: "number" } },
          { name: "maxAmount", in: "query", schema: { type: "number" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          "200": {
            description: "Records list",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RecordListResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Records"],
        summary: "Create record (admin)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateRecordRequest" },
            },
          },
        },
        responses: {
          "201": { description: "Record created" },
        },
      },
    },
    "/api/records/{id}": {
      get: {
        tags: ["Records"],
        summary: "Get record by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Record details" },
          "404": { description: "Record not found" },
        },
      },
      patch: {
        tags: ["Records"],
        summary: "Update record (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateRecordRequest" },
            },
          },
        },
        responses: {
          "200": { description: "Record updated" },
          "404": { description: "Record not found" },
        },
      },
      delete: {
        tags: ["Records"],
        summary: "Delete record (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Record deleted" },
          "404": { description: "Record not found" },
        },
      },
    },
    "/api/dashboard/summary": {
      get: {
        tags: ["Dashboard"],
        summary: "Dashboard summary",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Summary data",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DashboardSummaryResponse" },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = openApiSpec;
