---
name: shopify-functions
description: Build backend logic with Shopify Functions. Use this skill for creating custom discounts, delivery customization, payment customization, cart and checkout validation, and order routing. Functions run on Shopify's infrastructure using WebAssembly. Supports Rust and JavaScript.
license: MIT
compatibility: Requires Shopify CLI, Rust or JavaScript knowledge, and a Partner account
metadata:
  author: shopify-agent-skills
  version: "1.0"
  shopify-api-version: "2025-01"
---

# Shopify Functions

> The code samples below are starting points. Several parts are placeholders you must write or replace before the code runs (`cart_weight_exceeds_limit`, `is_restricted_product`, `YOUR_FUNCTION_ID`, `YOUR_SHIPPING_LABEL`, the free gift ID and the example limits). Each Function has its own input query: the `run.graphql` shown below is for the discount example. The delivery and payment examples read `cart.deliveryGroups` and `paymentMethods`, so their own `run.graphql` must request those fields. Test on a development store only until a developer has reviewed the code. Rules that block checkout, hide payment methods or limit regions affect every order, so check them against your legal and shipping terms before going live.
>
> The result shape differs by target. `FunctionRunResult` is generated from your target's schema: `discounts` and `discount_application_strategy` for discount targets, `operations` for delivery, payment and cart transform targets, and `errors` for validation. The examples below each use the shape for their own target, so use the generated types for yours.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to use this skill

Use this skill when:

- Creating custom discount logic
- Customizing delivery options
- Implementing payment method rules
- Validating cart or checkout
- Building order routing logic
- Extending Shopify's backend behavior

## What are Shopify Functions?

Functions are serverless WebAssembly modules that extend Shopify's backend logic. They:

- Run on Shopify's infrastructure
- Execute in milliseconds
- Scale automatically
- Are upgrade-safe

### Function Types

| API                            | Purpose                                |
| ------------------------------ | -------------------------------------- |
| **Discounts**                  | Product, order, and shipping discounts |
| **Delivery Customization**     | Rename, reorder, hide shipping options |
| **Payment Customization**      | Filter, reorder payment methods        |
| **Cart & Checkout Validation** | Block checkout with errors             |
| **Order Routing**              | Control fulfillment locations          |
| **Cart Transform**             | Modify cart contents                   |

## Getting Started

### 1. Create a Function

```bash
# In an existing app
shopify app generate extension

# Select from function types:
# - Delivery customization
# - Product discount
# - Order discount
# - Cart & Checkout Validation
# - etc.
```

### 2. Choose a Language

**Rust (Recommended)** - Best performance, handles large carts

**JavaScript** - Easier to learn, good for simpler logic

### 3. Function Structure

```
extensions/
└── my-discount/
    ├── src/
    │   ├── run.rs (or run.js)
    │   └── run.graphql
    ├── shopify.extension.toml
    └── Cargo.toml (for Rust)
```

## Function Anatomy

### Configuration (shopify.extension.toml)

```toml
# Use the current API version from Shopify's developer docs. 2025-01 is the version this example was written for.
api_version = "2025-01"

[[extensions]]
name = "Volume Discount"
handle = "volume-discount"
type = "function"

[[extensions.targeting]]
target = "purchase.product-discount.run"
input_query = "src/run.graphql"
export = "run"

[extensions.build]
command = "cargo wasi build --release"
path = "target/wasm32-wasi/release/volume-discount.wasm"
```

### Input Query (src/run.graphql)

```graphql
query RunInput {
  cart {
    lines {
      id
      quantity
      merchandise {
        ... on ProductVariant {
          id
          product {
            id
            title
            hasAnyTag(tags: ["discount-eligible"])
          }
        }
      }
      cost {
        amountPerQuantity {
          amount
          currencyCode
        }
      }
    }
  }
  discountNode {
    metafield(namespace: "volume-discount", key: "config") {
      value
    }
  }
}
```

## Product Discount Function (Rust)

```rust
// src/run.rs
use shopify_function::prelude::*;
use shopify_function::Result;

#[shopify_function_target(query_path = "src/run.graphql", schema_path = "schema.graphql")]
fn run(input: input::ResponseData) -> Result<output::FunctionRunResult> {
    let mut discounts = vec![];

    // Parse configuration from metafield
    let config: Config = input.discount_node.metafield
        .as_ref()
        .and_then(|m| serde_json::from_str(&m.value).ok())
        .unwrap_or_default();

    for line in input.cart.lines {
        let quantity = line.quantity;

        // Check if eligible for volume discount
        if quantity >= config.minimum_quantity {
            let merchandise = match &line.merchandise {
                input::InputCartLinesMerchandise::ProductVariant(variant) => variant,
                _ => continue,
            };

            // Check for eligible tag
            if merchandise.product.has_any_tag {
                // A bad percentage setting skips this discount instead of crashing the Function.
                let Ok(percentage) = Decimal::from_str(&config.discount_percentage) else {
                    continue;
                };
                discounts.push(output::Discount {
                    targets: vec![output::Target::ProductVariant(
                        output::ProductVariantTarget {
                            id: merchandise.id.clone(),
                            quantity: None,
                        },
                    )],
                    value: output::Value::Percentage(output::Percentage {
                        value: percentage,
                    }),
                    message: Some(format!("{}% volume discount", config.discount_percentage)),
                });
            }
        }
    }

    Ok(output::FunctionRunResult {
        discounts,
        discount_application_strategy: output::DiscountApplicationStrategy::FIRST,
    })
}

// The metafield JSON uses camelCase keys: minimumQuantity and discountPercentage.
#[derive(Default, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct Config {
    minimum_quantity: i64,
    discount_percentage: String,
}
```

## Product Discount Function (JavaScript)

```javascript
// src/run.js
// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const config = JSON.parse(
    input.discountNode.metafield?.value ??
      '{"minimumQuantity": 5, "discountPercentage": "10"}',
  );

  const discounts = [];

  for (const line of input.cart.lines) {
    const variant = line.merchandise;

    // Check quantity threshold
    if (line.quantity >= config.minimumQuantity) {
      // Check for eligible products
      if (
        variant.__typename === "ProductVariant" &&
        variant.product.hasAnyTag
      ) {
        discounts.push({
          targets: [
            {
              productVariant: {
                id: variant.id,
              },
            },
          ],
          value: {
            percentage: {
              value: config.discountPercentage,
            },
          },
          message: `${config.discountPercentage}% volume discount`,
        });
      }
    }
  }

  return {
    discounts,
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
}
```

## Delivery Customization

```rust
// Rename, hide, or reorder delivery options
use shopify_function::prelude::*;
use shopify_function::Result;

#[shopify_function_target(query_path = "src/run.graphql", schema_path = "schema.graphql")]
fn run(input: input::ResponseData) -> Result<output::FunctionRunResult> {
    let mut operations = vec![];

    // Do nothing if there are no delivery groups, so an empty cart cannot cause a panic.
    let Some(group) = input.cart.delivery_groups.first() else {
        return Ok(output::FunctionRunResult { operations });
    };

    for method in group.delivery_options.iter() {
        // Hide express shipping for heavy orders
        // cart_weight_exceeds_limit is a helper you write: sum the line weights and compare with your limit
        if method.title.contains("Express") && cart_weight_exceeds_limit(&input) {
            operations.push(output::Operation::Hide(output::HideOperation {
                delivery_option_handle: method.handle.clone(),
            }));
        }

        // Rename delivery option
        if method.title.contains("Standard") {
            operations.push(output::Operation::Rename(output::RenameOperation {
                delivery_option_handle: method.handle.clone(),
                // Placeholder: put your own wording here, and only a delivery time you can keep.
                title: Some("YOUR_SHIPPING_LABEL".to_string()),
            }));
        }
    }

    Ok(output::FunctionRunResult { operations })
}
```

## Payment Customization

```javascript
// src/run.js
export function run(input) {
  const cart = input.cart;
  const operations = [];

  // Calculate cart total
  const total = cart.cost.totalAmount.amount;

  // Hide COD for orders over [YOUR LIMIT]. Use your own limit in your shop's currency.
  if (parseFloat(total) > 500) {
    const codMethod = input.paymentMethods.find((method) =>
      method.name.includes("Cash on Delivery"),
    );

    if (codMethod) {
      operations.push({
        hide: {
          paymentMethodId: codMethod.id,
        },
      });
    }
  }

  // Reorder payment methods. Only run this when the list is not empty,
  // so a cart with no payment methods cannot crash the Function.
  if (input.paymentMethods.length > 0) {
    operations.push({
      move: {
        paymentMethodId: input.paymentMethods[0].id,
        index: 2,
      },
    });
  }

  return { operations };
}
```

## Cart & Checkout Validation

```rust
use shopify_function::prelude::*;
use shopify_function::Result;

#[shopify_function_target(query_path = "src/run.graphql", schema_path = "schema.graphql")]
fn run(input: input::ResponseData) -> Result<output::FunctionRunResult> {
    let mut errors = vec![];

    // Check minimum order value
    // If the amount cannot be read, do not block the cart.
    let total: f64 = input.cart.cost.total_amount.amount.parse().unwrap_or(f64::INFINITY);
    if total < 25.0 {
        errors.push(output::FunctionError {
            localized_message: "Minimum order value is $25.00".to_string(),
            target: output::Target::Cart,
        });
    }

    // Check product availability by region
    for line in &input.cart.lines {
        if let input::InputCartLinesMerchandise::ProductVariant(variant) = &line.merchandise {
            // is_restricted_product is a helper you write: check the variant and buyer country against your own restricted list
            if is_restricted_product(&variant, &input.cart.buyer_identity) {
                errors.push(output::FunctionError {
                    localized_message: format!(
                        "{} is not available in your region",
                        variant.product.title
                    ),
                    target: output::Target::CartLine(output::CartLineTarget {
                        id: line.id.clone(),
                    }),
                });
            }
        }
    }

    Ok(output::FunctionRunResult { errors })
}
```

## Cart Transform

Modify cart contents dynamically:

```javascript
// src/run.js
export function run(input) {
  const operations = [];

  for (const line of input.cart.lines) {
    const variant = line.merchandise;

    // Add free gift for orders with specific products
    if (variant.product.hasAnyTag && line.quantity >= 3) {
      operations.push({
        expand: {
          cartLineId: line.id,
          expandedCartItems: [
            {
              merchandiseId: variant.id,
              quantity: line.quantity,
            },
            {
              merchandiseId: "gid://shopify/ProductVariant/FREE_GIFT_ID",
              quantity: 1,
            },
          ],
        },
      });
    }
  }

  return { operations };
}
```

## Testing Functions

### Local Testing

```bash
# Test with sample input
shopify app function run --path extensions/my-function

# Provide input via stdin
cat input.json | shopify app function run --path extensions/my-function
```

### Sample Input JSON

```json
{
  "cart": {
    "lines": [
      {
        "id": "gid://shopify/CartLine/1",
        "quantity": 5,
        "merchandise": {
          "__typename": "ProductVariant",
          "id": "gid://shopify/ProductVariant/123",
          "product": {
            "id": "gid://shopify/Product/456",
            "title": "Test Product",
            "hasAnyTag": true
          }
        },
        "cost": {
          "amountPerQuantity": {
            "amount": "10.00",
            "currencyCode": "USD"
          }
        }
      }
    ]
  },
  "discountNode": {
    "metafield": {
      "value": "{\"minimumQuantity\": 3, \"discountPercentage\": \"15\"}"
    }
  }
}
```

## Deployment

```bash
# Deploy function with app
shopify app deploy

# Function will be available to configure in admin
```

## Configuration UI

Create an admin UI to configure function settings:

```jsx
// app/routes/app.discount.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { Form, TextField, Button, Card } from "@shopify/polaris";

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  // Create discount with function
  await admin.graphql(
    `
    mutation CreateDiscount($discount: DiscountAutomaticAppInput!) {
      discountAutomaticAppCreate(automaticAppDiscount: $discount) {
        automaticAppDiscount {
          discountId
        }
        userErrors {
          field
          message
        }
      }
    }
  `,
    {
      variables: {
        discount: {
          title: formData.get("title"),
          // Replace with your Function ID: shown after `shopify app deploy`, or in your app in the Partner dashboard
          functionId: "YOUR_FUNCTION_ID",
          startsAt: new Date().toISOString(),
          metafields: [
            {
              namespace: "volume-discount",
              key: "config",
              value: JSON.stringify({
                minimumQuantity: parseInt(formData.get("minimumQuantity")),
                discountPercentage: formData.get("discountPercentage"),
              }),
              type: "json",
            },
          ],
        },
      },
    },
  );

  return redirect("/app/discounts");
}
```

## Performance Best Practices

1. **Use Rust for large carts** - JavaScript can timeout
2. **Minimize input query** - Only request needed data
3. **Avoid complex loops** - Keep logic simple
4. **Cache configuration** - Parse metafields once
5. **Test with real data** - Test large cart scenarios

## CLI Commands Reference

| Command                          | Description     |
| -------------------------------- | --------------- |
| `shopify app generate extension` | Create function |
| `shopify app function run`       | Test locally    |
| `shopify app function typegen`   | Generate types  |
| `shopify app deploy`             | Deploy function |

## Resources

- [Functions Overview](https://shopify.dev/docs/apps/build/functions)
- [Functions API Reference](https://shopify.dev/docs/api/functions)
- [Discount Functions](https://shopify.dev/docs/apps/build/discounts)
- [Delivery Customization](https://shopify.dev/docs/apps/build/checkout/delivery-shipping)
- [Payment Customization](https://shopify.dev/docs/apps/build/payments)
- [JavaScript for Functions](https://shopify.dev/docs/apps/build/functions/programming-languages/javascript-for-functions)
- [Rust for Functions](https://shopify.dev/docs/apps/build/functions/programming-languages/rust-for-functions)

For checkout UI, see the [checkout-customization](../checkout-customization/SKILL.md) skill.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Shopify checkout customizer](https://useaiblocks.com/skills/shopify-checkout-customizer).
- The [Shopify app builder](https://useaiblocks.com/skills/shopify-app-builder).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
