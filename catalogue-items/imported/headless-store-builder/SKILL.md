---
name: headless-hydrogen
description: Build headless Shopify storefronts with Hydrogen and Oxygen. Use this skill for creating custom React-based storefronts, using Hydrogen components, deploying to Oxygen hosting, working with the Storefront API, and building high-performance e-commerce experiences. Also covers bringing your own stack with custom frameworks.
license: MIT
compatibility: Requires Node.js 18+, React knowledge, and a Shopify store
metadata:
  author: shopify-agent-skills
  version: "1.0"
  shopify-api-version: "2025-01"
---

# Headless Commerce with Hydrogen

## When to use this skill

Use this skill when:

- Building a custom headless storefront
- Using Hydrogen framework for e-commerce
- Deploying to Oxygen (Shopify's edge hosting)
- Working with the Storefront API
- Creating high-performance, custom storefronts
- Integrating Shopify with custom tech stacks

## What is Hydrogen?

Hydrogen is Shopify's official headless commerce framework built on:

- **React Router** - For routing and data loading
- **React** - Component-based UI
- **GraphQL** - Data fetching from Storefront API
- **Oxygen** - Global edge deployment (free hosting)

### Key Benefits

- **Build-ready components** - Pre-built commerce components
- **Free hosting** - Deploy to Oxygen at no extra cost
- **Fast by default** - SSR, progressive enhancement, nested routes
- **Shopify-native** - Deep integration with Shopify APIs

## Getting Started

### 1. Create a Hydrogen App

```bash
# Create new Hydrogen project
npm create @shopify/hydrogen@latest

# Follow the prompts:
# - Choose a template (Demo store, Hello World, Skeleton)
# - Enter your store URL
# - Select JavaScript or TypeScript
```

### 2. Project Structure

```
hydrogen-app/
├── app/
│   ├── components/        # React components
│   ├── routes/            # Page routes
│   │   ├── _index.tsx     # Home page
│   │   ├── products.$handle.tsx  # Product page
│   │   └── collections.$handle.tsx
│   ├── styles/            # CSS files
│   ├── entry.client.tsx   # Client entry
│   └── entry.server.tsx   # Server entry
├── public/                # Static assets
├── .env                   # Environment variables
├── hydrogen.config.ts     # Hydrogen config
└── package.json
```

### 3. Environment Setup

```env
# .env
SESSION_SECRET=your-session-secret
PUBLIC_STOREFRONT_API_TOKEN=your-storefront-api-token
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
```

### 4. Start Development

```bash
npm run dev
```

## Core Concepts

### Routes and Data Loading

> Note: these samples are written for the `@remix-run/react` and `@remix-run/cloudflare` packages. Newer Hydrogen projects import the same names from `react-router`. Check your project's package.json and switch every import in the samples to the package it uses. The samples are short fragments to adapt, not a finished storefront.

```tsx
// app/routes/products.$handle.tsx
import { useLoaderData } from "@remix-run/react";
import { type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { CartForm, Money } from "@shopify/hydrogen";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { storefront } = context;
  const { handle } = params;

  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: { handle },
  });

  if (!product) {
    throw new Response("Not Found", { status: 404 });
  }

  return { product };
}

export default function ProductPage() {
  const { product } = useLoaderData<typeof loader>();

  return (
    <div className="product-page">
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <ProductPrice data={product} />
      <AddToCartButton variantId={product.variants.nodes[0].id} />
    </div>
  );
}

// Small helper components used above (defined here so the sample is complete)
function ProductPrice({ data }: { data: any }) {
  return <Money data={data.variants.nodes[0].price} />;
}

function AddToCartButton({ variantId }: { variantId: string }) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesAdd}
      inputs={{ lines: [{ merchandiseId: variantId, quantity: 1 }] }}
    >
      <button type="submit">Add to Cart</button>
    </CartForm>
  );
}

const PRODUCT_QUERY = `#graphql
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      variants(first: 1) {
        nodes {
          id
          price {
            amount
            currencyCode
          }
        }
      }
      featuredImage {
        url
        altText
      }
    }
  }
`;
```

### Hydrogen Components

```tsx
import {
  Image,
  Money,
  CartForm,
  CartLineQuantity,
  useCart,
} from '@shopify/hydrogen';

// Image Component
<Image
  data={product.featuredImage}
  aspectRatio="1/1"
  sizes="(min-width: 45em) 50vw, 100vw"
/>

// Money Component
<Money data={product.price} />

// Add to Cart
<CartForm
  route="/cart"
  action={CartForm.ACTIONS.LinesAdd}
  inputs={{
    lines: [{ merchandiseId: variantId, quantity: 1 }],
  }}
>
  <button type="submit">Add to Cart</button>
</CartForm>
```

### Cart Management

```tsx
// app/routes/cart.tsx
import { CartForm, Money } from "@shopify/hydrogen";
import { useLoaderData } from "@remix-run/react";
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/cloudflare";

export async function loader({ context }: LoaderFunctionArgs) {
  // Reads the current cart for this visitor (may be null if the cart is empty)
  return { cart: await context.cart.get() };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { cart } = context;
  const formData = await request.formData();
  const { action, inputs } = CartForm.getFormInput(formData);

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      return await cart.addLines(inputs.lines);
    case CartForm.ACTIONS.LinesUpdate:
      return await cart.updateLines(inputs.lines);
    case CartForm.ACTIONS.LinesRemove:
      return await cart.removeLines(inputs.lineIds);
    default:
      throw new Error("Unknown cart action");
  }
}

// Minimal line item so the sample is complete. Replace it with your own design.
function CartLineItem({ line }: { line: any }) {
  return (
    <div>
      {line.merchandise.product.title} x {line.quantity}
    </div>
  );
}

export default function CartPage() {
  const { cart } = useLoaderData<typeof loader>();
  if (!cart || cart.lines.nodes.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div className="cart">
      {cart.lines.nodes.map((line: any) => (
        <CartLineItem key={line.id} line={line} />
      ))}
      <Money data={cart.cost.totalAmount} />
    </div>
  );
}
```

### Collections

```tsx
// app/routes/collections.$handle.tsx
import { type LoaderFunctionArgs } from "@remix-run/cloudflare";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { handle } = params;
  const { storefront } = context;

  const { collection } = await storefront.query(COLLECTION_QUERY, {
    variables: { handle, first: 24 },
  });

  return { collection };
}

const COLLECTION_QUERY = `#graphql
  query Collection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      description
      products(first: $first) {
        nodes {
          id
          title
          handle
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;
```

## Advanced Patterns

### Search Implementation

```tsx
// app/routes/search.tsx
import { type LoaderFunctionArgs } from "@remix-run/cloudflare";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("q");

  if (!searchTerm) {
    return { results: null };
  }

  const { storefront } = context;
  const { products } = await storefront.query(SEARCH_QUERY, {
    variables: { query: searchTerm, first: 20 },
  });

  return { results: products };
}

const SEARCH_QUERY = `#graphql
  query Search($query: String!, $first: Int!) {
    products(query: $query, first: $first) {
      nodes {
        id
        title
        handle
        featuredImage {
          url
          altText
        }
      }
    }
  }
`;
```

### Customer Authentication (not covered here)

This skill does not include a working sign-in. Do not write a custom form that collects a customer's email and password. For customer accounts, use Shopify's hosted Customer Account login and follow Shopify's current docs for your Hydrogen version. Tell the user this, and do not present any login code as ready to deploy.

### Localization (not covered here)

This skill does not include working code for multiple currencies or languages. Point the user to Shopify's current Hydrogen localization docs and write the code from those. Tell the user it is not covered here, and do not present any localization code as ready to deploy.

## Oxygen Deployment

### Deploy from CLI

```bash
# Link to Shopify store
npx shopify hydrogen link

# Deploy to Oxygen
npx shopify hydrogen deploy
```

### Environment Variables

Set environment variables in Shopify admin:

1. Go to Sales channels > Hydrogen
2. Select your storefront
3. Add environment variables

### Preview Deployments

Every git push creates a preview URL for testing.

```bash
# Push to create preview
git push origin feature-branch
```

## Bring Your Own Stack

If not using Hydrogen, you can use the Storefront API with any framework:

### Install Headless Channel

```bash
# In your Shopify admin, install the Headless channel
# Create a storefront and get API credentials
```

### Use with Next.js

```typescript
// lib/shopify.ts
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function shopifyFetch({ query, variables }) {
  const endpoint = `https://${domain}/api/2025-01/graphql.json`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  return response.json();
}
```

### Storefront Web Components

```html
<!-- Embed products anywhere with Web Components -->
<script
  type="module"
  src="https://cdn.shopify.com/storefront-web-components/v1/storefront.js"
></script>

<shopify-product-provider store-domain="your-store.myshopify.com">
  <shopify-product handle="product-handle">
    <shopify-product-title></shopify-product-title>
    <shopify-product-price></shopify-product-price>
    <shopify-add-to-cart></shopify-add-to-cart>
  </shopify-product>
</shopify-product-provider>
```

## Performance Best Practices

1. **Server-side rendering** - SSR for initial page load
2. **Streaming** - Use React Suspense for progressive loading
3. **Image optimization** - Use Hydrogen's Image component
4. **Code splitting** - Lazy load non-critical components
5. **Cache headers** - Configure appropriate cache policies
6. **Prefetching** - Prefetch links on hover

```tsx
// Streaming example
import { Suspense } from "react";

function ProductPage() {
  return (
    <div>
      <ProductInfo />
      <Suspense fallback={<LoadingSkeleton />}>
        <ProductRecommendations />
      </Suspense>
    </div>
  );
}
```

## CLI Commands Reference

| Command                        | Description              |
| ------------------------------ | ------------------------ |
| `npm create @shopify/hydrogen` | Create new project       |
| `npm run dev`                  | Start dev server         |
| `npm run build`                | Build for production     |
| `npx shopify hydrogen link`    | Link to store            |
| `npx shopify hydrogen deploy`  | Deploy to Oxygen         |
| `npx shopify hydrogen preview` | Preview production build |

## Resources

- [Hydrogen Documentation](https://shopify.dev/docs/storefronts/headless/hydrogen)
- [Storefront API Reference](https://shopify.dev/docs/api/storefront)
- [Hydrogen Components](https://shopify.dev/docs/api/hydrogen)
- [Oxygen Hosting](https://shopify.dev/docs/storefronts/headless/hydrogen/deployments)
- [Demo Store Template](https://github.com/Shopify/hydrogen/tree/main/templates/demo-store)

For API details, see the [api-graphql](../api-graphql/SKILL.md) skill.
