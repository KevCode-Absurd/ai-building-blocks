---
name: graphql-api-design
description: Design GraphQL APIs with well-structured schemas, efficient resolvers, pagination, and performance patterns like DataLoader and federation. Use when the user requests graphql api design or provides relevant inputs for this workflow.
license: MIT
metadata:
  author: awesome-ai-agent-skills
  version: 1.0.0
---

# GraphQL API Design

This skill enables an AI agent to design complete GraphQL APIs from specifications, schemas, or natural language descriptions. The agent produces type definitions, queries, mutations, subscriptions, input types, enums, and resolver implementations. It applies performance patterns including DataLoader for N+1 prevention, cursor-based pagination via the Relay connection spec, query depth limiting, and schema federation for microservice architectures.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Workflow

1. **Model the domain as types:** Analyze the application domain and define GraphQL object types, input types, enums, interfaces, and unions. Each type should represent a real entity with fields that match the data consumers actually need. Use non-nullable (`!`) annotations deliberately—fields that can genuinely be absent should be nullable. Prefer specific scalar types (e.g., `DateTime`, `URL`) over raw `String` for self-documenting schemas.

2. **Design queries and mutations:** Define Query fields for read operations and Mutation fields for write operations. Queries should be noun-based (`user`, `posts`) while mutations should be verb-based (`createPost`, `updateUser`). Each mutation should accept a single input type argument and return a payload type that includes the modified object plus any user-facing errors. This pattern keeps mutations consistent and extensible.

3. **Implement pagination with connections:** For any list field that could return many items, use the Relay connection specification with `edges`, `node`, `cursor`, and `pageInfo`. This provides cursor-based pagination that is stable under insertions and deletions, unlike offset-based pagination. Define reusable connection types per entity rather than returning raw arrays.

4. **Write resolvers with DataLoader:** Implement resolvers that use DataLoader to batch and cache database lookups within a single request. Without DataLoader, a query that fetches 50 posts and their authors would make 50 separate author queries (the N+1 problem). DataLoader collapses these into a single batched query. Create a new DataLoader instance per request to avoid leaking data between users.

5. **Add subscriptions for real-time data:** Define Subscription fields for events clients need to react to in real-time (e.g., new messages, status changes). Use a pub/sub backend (Redis, Kafka, or in-memory for development) to publish events. Keep subscription payloads lean—clients can use the subscription trigger to refetch full data if needed.

6. **Secure and optimize the schema:** Add query depth limiting (max 10-15 levels) and query complexity analysis to prevent abusive queries. Implement field-level authorization in resolvers. Use persisted queries in production to reduce bandwidth and prevent arbitrary query execution. Consider schema federation if the API spans multiple services.

## Supported Technologies

- **Servers:** Apollo Server, GraphQL Yoga, Mercurius (Fastify), Strawberry (Python), graphql-java
- **Schema tools:** SDL-first (typeDefs), code-first (TypeGraphQL, Nexus, Pothos)
- **Performance:** DataLoader, @defer/@stream directives, persisted queries, automatic persisted queries (APQ)
- **Federation:** Apollo Federation, GraphQL Mesh, Schema Stitching
- **Testing:** GraphQL Playground, Apollo Studio, graphql-test (jest), Insomnia

## Usage

Provide the agent with a description of the data entities, their relationships, and the operations needed. The agent will produce a complete SDL schema, resolver implementations, and DataLoader setup. Specify whether you want SDL-first or code-first output, and which server framework to target.

## Examples

### Example 1: Blog Platform Schema with Resolvers

```graphql
# schema.graphql — Complete blog platform schema

scalar DateTime

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

type User {
  id: ID!
  username: String!
  email: String!
  bio: String
  avatarUrl: String
  posts(first: Int, after: String): PostConnection!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  slug: String!
  content: String!
  excerpt: String
  status: PostStatus!
  author: User!
  tags: [Tag!]!
  comments(first: Int, after: String): CommentConnection!
  publishedAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Comment {
  id: ID!
  body: String!
  author: User!
  post: Post!
  createdAt: DateTime!
}

type Tag {
  id: ID!
  name: String!
  slug: String!
  posts(first: Int, after: String): PostConnection!
}

# Relay connection types for cursor-based pagination
type PostConnection {
  edges: [PostEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type PostEdge {
  cursor: String!
  node: Post!
}

type CommentConnection {
  edges: [CommentEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type CommentEdge {
  cursor: String!
  node: Comment!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

# Queries
type Query {
  post(id: ID, slug: String): Post
  posts(
    first: Int = 10
    after: String
    status: PostStatus
    tagSlug: String
  ): PostConnection!
  user(id: ID!): User
  me: User
  tags: [Tag!]!
}

# Mutations with input types and payload types
input CreatePostInput {
  title: String!
  content: String!
  tagIds: [ID!]
  status: PostStatus = DRAFT
}

type CreatePostPayload {
  post: Post
  errors: [MutationError!]!
}

input UpdatePostInput {
  title: String
  content: String
  status: PostStatus
  tagIds: [ID!]
}

type UpdatePostPayload {
  post: Post
  errors: [MutationError!]!
}

type MutationError {
  field: String
  message: String!
}

type Mutation {
  createPost(input: CreatePostInput!): CreatePostPayload!
  updatePost(id: ID!, input: UpdatePostInput!): UpdatePostPayload!
  deletePost(id: ID!): Boolean!
  addComment(postId: ID!, body: String!): Comment!
}

# Subscriptions
type Subscription {
  commentAdded(postId: ID!): Comment!
  postPublished: Post!
}
```

```javascript
// resolvers.js — Resolvers with DataLoader for N+1 prevention
const DataLoader = require("dataloader");

// Create loaders per request (called from context factory)
function createLoaders(db) {
  return {
    userLoader: new DataLoader(async (userIds) => {
      const users = await db.users.findByIds(userIds);
      const userMap = new Map(users.map((u) => [u.id, u]));
      return userIds.map((id) => userMap.get(id) || null);
    }),
    postLoader: new DataLoader(async (postIds) => {
      const posts = await db.posts.findByIds(postIds);
      const postMap = new Map(posts.map((p) => [p.id, p]));
      return postIds.map((id) => postMap.get(id) || null);
    }),
    // Batches tag lookups: one query for all posts on the page, grouped by post id
    tagsLoader: new DataLoader(async (postIds) => {
      const tags = await db.tags.findByPostIds(postIds);
      return postIds.map((id) => tags.filter((t) => t.postId === id));
    }),
  };
}

const resolvers = {
  Query: {
    post: (_, { id, slug }, { db }) => {
      if (id) return db.posts.findById(id);
      if (slug) return db.posts.findBySlug(slug);
      return null;
    },
    posts: async (_, { first = 10, after, status, tagSlug }, { db }) => {
      const cursor = after ? decodeCursor(after) : null;
      // totalCount must count every row that matches the filters, ignoring the cursor (see Example 2)
      const { rows, totalCount } = await db.posts.findPaginated({
        limit: first + 1,
        cursor,
        status,
        tagSlug,
      });
      const hasNextPage = rows.length > first;
      const edges = rows.slice(0, first).map((post) => ({
        cursor: encodeCursor(post.id),
        node: post,
      }));
      return {
        edges,
        totalCount,
        pageInfo: {
          hasNextPage,
          hasPreviousPage: !!after,
          startCursor: edges[0]?.cursor || null,
          endCursor: edges[edges.length - 1]?.cursor || null,
        },
      };
    },
    me: (_, __, { currentUser }) => currentUser,
  },
  Post: {
    author: (post, _, { loaders }) => loaders.userLoader.load(post.authorId),
    tags: (post, _, { loaders }) => loaders.tagsLoader.load(post.id),
  },
  Comment: {
    author: (comment, _, { loaders }) => loaders.userLoader.load(comment.authorId),
  },
  Mutation: {
    createPost: async (_, { input }, { currentUser, db }) => {
      if (!currentUser) return { post: null, errors: [{ message: "Not authenticated" }] };
      if (!input.title.trim()) {
        return { post: null, errors: [{ field: "title", message: "Title cannot be empty" }] };
      }
      const post = await db.posts.create({ ...input, authorId: currentUser.id });
      return { post, errors: [] };
    },
    // The schema lists updatePost and deletePost, so they need guarded resolvers like these.
    // Each one checks that the caller is signed in and owns the post (or is an admin).
    updatePost: async (_, { id, input }, { currentUser, db }) => {
      if (!currentUser) return { post: null, errors: [{ message: "Not authenticated" }] };
      const existing = await db.posts.findById(id);
      if (!existing) return { post: null, errors: [{ message: "Post not found" }] };
      if (existing.authorId !== currentUser.id && !currentUser.isAdmin) {
        return { post: null, errors: [{ message: "Not allowed" }] };
      }
      const post = await db.posts.update(id, input);
      return { post, errors: [] };
    },
    deletePost: async (_, { id }, { currentUser, db }) => {
      if (!currentUser) return false;
      const existing = await db.posts.findById(id);
      if (!existing || (existing.authorId !== currentUser.id && !currentUser.isAdmin)) return false;
      await db.posts.delete(id);
      return true;
    },
    // Guarded like createPost: the caller must be signed in, and the post must exist.
    addComment: async (_, { postId, body }, { currentUser, db, pubsub }) => {
      if (!currentUser) throw new Error("Not authenticated");
      if (!body.trim()) throw new Error("Comment cannot be empty");
      const post = await db.posts.findById(postId);
      if (!post) throw new Error("Post not found");
      const comment = await db.comments.create({ postId, body, authorId: currentUser.id });
      await pubsub.publish(`COMMENT_ADDED_${postId}`, { commentAdded: comment });
      return comment;
    },
  },
  // Subscription resolvers need a pub/sub object in the context (in-memory for development,
  // Redis or Kafka for production). The addComment resolver above publishes to the same
  // COMMENT_ADDED_<postId> channel that commentAdded listens on, after it saves a comment.
  Subscription: {
    // Guarded: a caller may only follow comments on a post they can see (published,
    // or their own draft, or any post for an admin).
    commentAdded: {
      subscribe: async (_, { postId }, { currentUser, db, pubsub }) => {
        const post = await db.posts.findById(postId);
        const canSee = post && (post.status === "PUBLISHED" ||
          (currentUser && (post.authorId === currentUser.id || currentUser.isAdmin)));
        if (!canSee) throw new Error("Not allowed");
        return pubsub.asyncIterator(`COMMENT_ADDED_${postId}`);
      },
    },
    postPublished: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("POST_PUBLISHED"),
    },
  },
};

function encodeCursor(id) { return Buffer.from(`cursor:${id}`).toString("base64"); }
function decodeCursor(cursor) { return Buffer.from(cursor, "base64").toString().replace("cursor:", ""); }
```

### Example 2: Cursor-Based Pagination Implementation

```javascript
// pagination.js — Reusable cursor-based pagination for any entity
// SAFETY: `table` and the keys of `where` are written into the SQL text. Only pass names
// you set in your own code (check them against a fixed list), never text from a request.
// Values always go in `params`.

/**
 * Generic paginated query builder for SQL databases.
 * Works with any table that has an auto-incrementing or sortable ID.
 */
const ALLOWED_TABLES = new Set(["posts", "comments"]); // tables this helper may query
const ALLOWED_COLUMNS = { posts: new Set(["status", "authorId"]), comments: new Set(["postId"]) };

async function paginatedQuery(db, { table, first = 10, after, where = {} }) {
  // Enforce the fixed lists in code, not only in a comment
  if (!ALLOWED_TABLES.has(table)) throw new Error("Table not allowed");
  for (const key of Object.keys(where)) {
    if (!ALLOWED_COLUMNS[table].has(key)) throw new Error("Column not allowed: " + key);
  }
  const limit = Math.min(first, 100); // Cap at 100 per page
  const filterConditions = [];
  const filterParams = [];

  // Apply additional filters (only fixed, known column names, never user input)
  for (const [key, value] of Object.entries(where)) {
    if (value !== undefined) {
      filterConditions.push(`${key} = $${filterParams.length + 1}`);
      filterParams.push(value);
    }
  }

  // The count uses the filters only, so totalCount covers every matching row
  const countWhere = filterConditions.length > 0 ? `WHERE ${filterConditions.join(" AND ")}` : "";

  // The page query adds the cursor on top of the filters
  const conditions = [...filterConditions];
  const params = [...filterParams];
  if (after) {
    const cursorId = Buffer.from(after, "base64").toString().split(":")[1];
    conditions.push(`id < $${params.length + 1}`);
    params.push(cursorId);
  }
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Fetch one extra row to determine hasNextPage
  const query = `SELECT * FROM ${table} ${whereClause} ORDER BY id DESC LIMIT ${limit + 1}`;
  const rows = await db.query(query, params);

  // Count total matching rows
  const countQuery = `SELECT COUNT(*) as total FROM ${table} ${countWhere}`;
  const [{ total: totalCount }] = await db.query(countQuery, filterParams);

  const hasNextPage = rows.length > limit;
  const nodes = rows.slice(0, limit);

  const edges = nodes.map((node) => ({
    cursor: Buffer.from(`cursor:${node.id}`).toString("base64"),
    node,
  }));

  return {
    edges,
    totalCount,
    pageInfo: {
      hasNextPage,
      hasPreviousPage: !!after,
      startCursor: edges[0]?.cursor || null,
      endCursor: edges[edges.length - 1]?.cursor || null,
    },
  };
}

// Usage in resolver
const resolvers = {
  Query: {
    posts: (_, args, { db }) =>
      paginatedQuery(db, {
        table: "posts",
        first: args.first,
        after: args.after,
        where: { status: args.status },
      }),
  },
};
```

## Depth and cost limits

The sample code above does not include depth or cost limits. Step 6 describes them. Add them in your server, for example with a depth-limit validation rule and a query-cost plugin for your server, and set a maximum depth of 10 to 15 levels. Test with a deliberately deep query before you go live.

## Best Practices

- **Keep mutations consistent** by always using a single `input` argument and returning a payload type with both the result and a list of user-facing errors. This makes client code predictable.
- **Solve N+1 with DataLoader** on every relationship resolver. Create DataLoader instances per-request (in the context factory) to avoid leaking cached data between users or requests.
- **Limit query depth and complexity** to prevent denial-of-service attacks. Set max depth to 10-15 and assign complexity costs to fields (especially connections and nested relationships).
- **Use nullable return types for single-entity queries** (`post(id: ID!): Post` returns `null` if not found) and non-nullable arrays for list queries (`tags: [Tag!]!` always returns an array, possibly empty).
- **Version via schema evolution, not URL versioning.** Add new fields freely (non-breaking), deprecate old fields with `@deprecated(reason: "Use newField instead")`, and remove them after clients have migrated.
- **Use input types for all mutation arguments** rather than passing individual scalar arguments. This makes it easy to add optional fields later without breaking existing clients.

## Edge Cases

- **Circular references:** Types like `User -> Posts -> Author -> Posts` create circular schemas. This is valid in GraphQL but requires depth limiting to prevent infinite queries. DataLoader prevents infinite resolution loops.
- **Null propagation:** If a non-nullable field resolver throws an error, the null propagates upward to the nearest nullable parent. Design nullable boundaries carefully to prevent one field error from nullifying an entire response.
- **Empty connections:** Return `{ edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false }, totalCount: 0 }` for empty result sets, not `null`.
- **Cursor stability:** Cursors should be opaque and stable across insertions. Using row IDs as cursor values (base64 encoded) is stable; using offsets is not and breaks when items are inserted or deleted.
- **File uploads:** GraphQL doesn't natively support file uploads. Use the multipart request spec (`graphql-upload`) or handle uploads via a separate REST endpoint and pass the resulting URL to a mutation.
- **Subscription connection drops:** Clients can lose WebSocket connections. Design subscriptions so clients can recover state by re-querying on reconnect rather than relying solely on the subscription stream.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [API security checker](https://useaiblocks.com/skills/api-security-checker).
- The [API test suite builder](https://useaiblocks.com/skills/api-test-suite-builder). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
