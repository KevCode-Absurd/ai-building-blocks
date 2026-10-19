# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

The owner gets an installable section plus snippet that pulls the renewal price from the store's selling plans, puts the first-order guarantee limit and shipping line in editable settings, and keeps all fixed labels in locale files. The notes are honest about what was assumed (theme, subscription app, variant-change event) and that Theme Check didn't run; the only quibbles are the 'NOTES' heading replaced by three bold sub-headings and `//` comments atop the JSON snippets that must not be pasted literally.

## Judge list

- Met: The schema is valid JSON with a name and a preset (or a rule for where it can be added).
  "name": "t:sections.subscription_terms.name" ... "enabled_on": {"templates": ["product"]} ... "presets": [{"name": ...}]; JSON parses cleanly.
- Met: There's no include, img_url, ternary or brackets in conditions.
  Uses {% render 'subscription-terms' %}; conditions like `if has_plans and renewal_text != blank` have no brackets, no ternary, no img_url.
- Met: No price or policy is typed in. They come from the store.
  `assign renewal_price = renewal_cents | money` from selling_plan_allocations; refund/shipping links use shop.refund_policy.url and shop.shipping_policy.url; guarantee/shipping words are editable settings.
- Met: Words the owner should change are settings, not hard-coded text.
  renewal_text, guarantee_text, shipping_text are schema settings with defaults; fixed labels ('Refund policy', 'Shipping policy') go through the t filter.
- Met: Every image has alt text and a set width.
  No images are rendered in this section, so nothing to check; criterion is satisfied by absence.
- Met: The notes say what it assumed about your theme.
  "MISSING: theme name and whether it supports theme blocks. I assumed a recent theme with theme blocks off and used a section plus a snippet only."

## What went in

```text
Build: a small section to sit under the buy button on our product
page. It should show the renewal price of the subscription, our
guarantee line with its first-order limit, and the shipping line,
all editable. Right now the renewal price is tiny and the
first-order limit is only in the last FAQ.

Our wording (from the product page FAQ):
- "a simple 30-day guarantee on your first order ... This policy
  applies only to your initial purchase."
- "Orders typically ship within 24 hours and on average arrive 3-5
  days later."

Theme: don't know if it has theme blocks. We sell by subscription.

[attached: sprout/product-page.md]
```

## What came out

```text
```liquid
<!-- snippets/subscription-terms.liquid -->
{% doc %}
  Shows the subscription renewal price, the guarantee line and the shipping line for a product.
  The renewal price comes from the product's selling plans and updates when the shopper changes plan or variant.

  @param {product} product - The product on the page
  @param {string} [renewal_text] - Renewal line. [price] is replaced with the renewal price, [plan] with the selling plan name
  @param {boolean} [emphasize_renewal] - Show the renewal line in bold
  @param {string} [guarantee_text] - Guarantee line, including its first-order limit
  @param {boolean} [show_refund_link] - Add a link to the store's refund policy after the guarantee line
  @param {string} [shipping_text] - Shipping line
  @param {boolean} [show_shipping_link] - Add a link to the store's shipping policy after the shipping line

  @example
  {% render 'subscription-terms',
    product: product,
    renewal_text: 'Renews at [price] per delivery. Pause or cancel anytime.',
    emphasize_renewal: true,
    guarantee_text: '30-day money-back guarantee on your first order. This applies only to your initial purchase.',
    show_refund_link: true,
    shipping_text: 'Orders typically ship within 24 hours and on average arrive 3-5 days later.',
    show_shipping_link: false
  %}
{% enddoc %}

{%- liquid
  assign current_variant = product.selected_or_first_available_variant

  assign has_plans = false
  if product.selling_plan_groups.size > 0
    assign has_plans = true
  endif

  assign allocation = current_variant.selected_selling_plan_allocation
  assign show_renewal_now = true
  if allocation == blank
    assign show_renewal_now = false
    assign allocation = current_variant.selling_plan_allocations.first
  endif
  if product.requires_selling_plan
    assign show_renewal_now = true
  endif

  assign renewal_price = ''
  assign plan_name = ''
  if allocation
    assign renewal_cents = allocation.price
    if allocation.price_adjustments.size > 1
      assign renewal_cents = allocation.price_adjustments[1].price
    endif
    assign renewal_price = renewal_cents | money
    assign plan_name = allocation.selling_plan.name | escape
  endif

  assign renewal_line = renewal_text | escape | replace: '[price]', renewal_price | replace: '[plan]', plan_name
-%}

<div
  class="sub-terms"
  data-sub-terms
  data-renewal-template="{{ renewal_text | escape }}"
>
  <h2 class="sub-terms__sr">{{ 'sections.subscription_terms.heading' | t }}</h2>
  <ul class="sub-terms__list" role="list">
    {%- if has_plans and renewal_text != blank -%}
      <li
        class="sub-terms__item sub-terms__item--renewal{% if emphasize_renewal %} sub-terms__item--strong{% endif %}"
        data-sub-terms-renewal
        {% unless show_renewal_now %}
          hidden
        {% endunless %}
      >
        <span data-sub-terms-renewal-text>{{ renewal_line }}</span>
      </li>
    {%- endif -%}

    {%- if guarantee_text != blank -%}
      <li class="sub-terms__item">
        {{ guarantee_text | escape }}
        {%- if show_refund_link and shop.refund_policy -%}
          {{ ' ' }}<a class="sub-terms__link" href="{{ shop.refund_policy.url }}">
            {{- 'sections.subscription_terms.refund_policy_link' | t -}}
          </a>
        {%- endif -%}
      </li>
    {%- endif -%}

    {%- if shipping_text != blank -%}
      <li class="sub-terms__item">
        {{ shipping_text | escape }}
        {%- if show_shipping_link and shop.shipping_policy -%}
          {{ ' ' }}<a class="sub-terms__link" href="{{ shop.shipping_policy.url }}">
            {{- 'sections.subscription_terms.shipping_policy_link' | t -}}
          </a>
        {%- endif -%}
      </li>
    {%- endif -%}
  </ul>

  {%- if has_plans -%}
    <script type="application/json" data-sub-terms-data>
      {
        {%- for variant in product.variants -%}
          "{{ variant.id }}": {
            {%- for alloc in variant.selling_plan_allocations -%}
              {%- liquid
                assign cents = alloc.price
                if alloc.price_adjustments.size > 1
                  assign cents = alloc.price_adjustments[1].price
                endif
              -%}
              "{{ alloc.selling_plan.id }}": {"price": {{ cents | money | json }}, "plan": {{ alloc.selling_plan.name | json }}}
              {%- unless forloop.last -%},{%- endunless -%}
            {%- endfor -%}
          }
          {%- unless forloop.last -%},{%- endunless -%}
        {%- endfor -%}
      }
    </script>
  {%- endif -%}
</div>

{% stylesheet %}
  .sub-terms {
    margin-top: 0.75rem;
    font-size: var(--sub-terms-size, 1rem);
    line-height: 1.45;
  }

  .sub-terms__sr {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .sub-terms__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.5rem;
  }

  .sub-terms__item {
    margin: 0;
  }

  .sub-terms__item[hidden] {
    display: none;
  }

  .sub-terms__item--strong {
    font-weight: 700;
  }

  .sub-terms__link {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 0.15em;
  }

  @media screen and (min-width: 750px) {
    .sub-terms__list {
      gap: 0.375rem;
    }
  }
{% endstylesheet %}

{% javascript %}
  (function () {
    function decode(html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.documentElement.textContent || '';
    }

    function init(root) {
      if (!root || root.hasAttribute('data-sub-terms-ready')) return;
      root.setAttribute('data-sub-terms-ready', '');

      var dataEl = root.querySelector('[data-sub-terms-data]');
      var line = root.querySelector('[data-sub-terms-renewal]');
      var textEl = root.querySelector('[data-sub-terms-renewal-text]');
      if (!dataEl || !line || !textEl) return;

      var data;
      try {
        data = JSON.parse(dataEl.textContent);
      } catch (e) {
        return;
      }

      var template = root.getAttribute('data-renewal-template') || '';

      function update() {
        var form = document.querySelector('form[action*="/cart/add"]');
        if (!form) return;
        var fd = new FormData(form);
        var variantId = fd.get('id');
        var planId = fd.get('selling_plan');

        if (!planId) {
          line.hidden = true;
          return;
        }

        var entry = data[variantId] && data[variantId][planId];
        if (!entry) {
          line.hidden = true;
          return;
        }

        textEl.textContent = template
          .split('[price]').join(decode(entry.price))
          .split('[plan]').join(entry.plan);
        line.hidden = false;
      }

      document.addEventListener('change', function () {
        window.setTimeout(update, 0);
      });
      update();
    }

    document.querySelectorAll('[data-sub-terms]').forEach(init);

    document.addEventListener('shopify:section:load', function (event) {
      event.target.querySelectorAll('[data-sub-terms]').forEach(init);
    });
  })();
{% endjavascript %}
```

```liquid
<!-- sections/subscription-terms.liquid -->
{%- style -%}
  #shopify-section-{{ section.id }} .sub-terms {
    --sub-terms-size: {{ section.settings.text_size }}px;
  }
{%- endstyle -%}

{%- if product -%}
  <div class="page-width">
    {% render 'subscription-terms',
      product: product,
      renewal_text: section.settings.renewal_text,
      emphasize_renewal: section.settings.emphasize_renewal,
      guarantee_text: section.settings.guarantee_text,
      show_refund_link: section.settings.show_refund_link,
      shipping_text: section.settings.shipping_text,
      show_shipping_link: section.settings.show_shipping_link
    %}
  </div>
{%- endif -%}

{% schema %}
{
  "name": "t:sections.subscription_terms.name",
  "tag": "section",
  "class": "section-subscription-terms",
  "enabled_on": {
    "templates": ["product"]
  },
  "settings": [
    {
      "type": "header",
      "content": "t:sections.subscription_terms.settings.renewal_header.content"
    },
    {
      "type": "text",
      "id": "renewal_text",
      "label": "t:sections.subscription_terms.settings.renewal_text.label",
      "info": "t:sections.subscription_terms.settings.renewal_text.info",
      "default": "Renews at [price] per delivery. Pause or cancel anytime."
    },
    {
      "type": "checkbox",
      "id": "emphasize_renewal",
      "label": "t:sections.subscription_terms.settings.emphasize_renewal.label",
      "default": true
    },
    {
      "type": "header",
      "content": "t:sections.subscription_terms.settings.guarantee_header.content"
    },
    {
      "type": "textarea",
      "id": "guarantee_text",
      "label": "t:sections.subscription_terms.settings.guarantee_text.label",
      "default": "30-day money-back guarantee on your first order. This applies only to your initial purchase."
    },
    {
      "type": "checkbox",
      "id": "show_refund_link",
      "label": "t:sections.subscription_terms.settings.show_refund_link.label",
      "default": false
    },
    {
      "type": "header",
      "content": "t:sections.subscription_terms.settings.shipping_header.content"
    },
    {
      "type": "textarea",
      "id": "shipping_text",
      "label": "t:sections.subscription_terms.settings.shipping_text.label",
      "default": "Orders typically ship within 24 hours and on average arrive 3-5 days later."
    },
    {
      "type": "checkbox",
      "id": "show_shipping_link",
      "label": "t:sections.subscription_terms.settings.show_shipping_link.label",
      "default": false
    },
    {
      "type": "header",
      "content": "t:sections.subscription_terms.settings.style_header.content"
    },
    {
      "type": "range",
      "id": "text_size",
      "label": "t:sections.subscription_terms.settings.text_size.label",
      "min": 14,
      "max": 20,
      "step": 1,
      "unit": "px",
      "default": 16
    }
  ],
  "presets": [
    {
      "name": "t:sections.subscription_terms.presets.name"
    }
  ]
}
{% endschema %}
```

```json
// locales/en.default.json (merge these keys into the existing file; don't replace it)
{
  "sections": {
    "subscription_terms": {
      "heading": "Subscription terms",
      "refund_policy_link": "Refund policy",
      "shipping_policy_link": "Shipping policy"
    }
  }
}
```

```json
// locales/en.default.schema.json (merge these keys into the existing file; don't replace it)
{
  "sections": {
    "subscription_terms": {
      "name": "Subscription terms",
      "settings": {
        "renewal_header": {
          "content": "Renewal price"
        },
        "renewal_text": {
          "label": "Renewal line",
          "info": "[price] shows the renewal price from your subscription plan. [plan] shows the plan name. The line is hidden when a one-time purchase is selected."
        },
        "emphasize_renewal": {
          "label": "Show renewal line in bold"
        },
        "guarantee_header": {
          "content": "Guarantee"
        },
        "guarantee_text": {
          "label": "Guarantee line"
        },
        "show_refund_link": {
          "label": "Link to refund policy"
        },
        "shipping_header": {
          "content": "Shipping"
        },
        "shipping_text": {
          "label": "Shipping line"
        },
        "show_shipping_link": {
          "label": "Link to shipping policy"
        },
        "style_header": {
          "content": "Style"
        },
        "text_size": {
          "label": "Text size"
        }
      },
      "presets": {
        "name": "Subscription terms"
      }
    }
  }
}
```

**What to upload**
- `snippets/subscription-terms.liquid` and `sections/subscription-terms.liquid` as new files.
- Merge the keys into `locales/en.default.json` and `locales/en.default.schema.json`. Don't overwrite those files.
- In the theme editor, open the product template, add the "Subscription terms" section, and drag it directly under the main product section.

**What the owner can edit**
- The renewal line. Use `[price]` for the renewal price and `[plan]` for the plan name. You can also make the line bold.
- The guarantee line, and whether to link the store's refund policy.
- The shipping line, and whether to link the store's shipping policy.
- The text size, from 14 to 20 px. The default is 16 px, larger than the current small print.

**What was assumed**
- MISSING: theme name and whether it supports theme blocks. I assumed a recent theme with theme blocks off and used a section plus a snippet only.
  - A separate section sits below the whole product area, not literally under the button.
  - To place it directly under the button, a developer can add `{% render 'subscription-terms', product: product, ... %}` inside the main product section, after the buy buttons.
- MISSING: whether your subscription app uses Shopify selling plans. The renewal price is read from `selling_plan_allocations`:
  - If the plan has two price adjustments, it uses the second one (the price from the second order on).
  - Otherwise it uses the plan price.
  - If the $29.99 first-box price comes from the SMS discount code rather than the selling plan, the plan price should already be the renewal price.
  - Check a test product against shopify.dev's `selling_plan_allocation` and `selling_plan_allocation_price_adjustment` pages before going live.
- No price, interval or plan name is typed into the code. They come from the store. The guarantee and shipping wording are your FAQ text, set as editable starting values.
- The script assumes the buy form is a `form[action*="/cart/add"]` with standard `id` and `selling_plan` inputs.
  - When one-time purchase is selected, it hides the renewal line.
  - It adds no tracking and no other side effects.
  - If your theme changes variants without firing a `change` event, the renewal price may not update on variant switch. MISSING: your theme's variant-change event.
- This section doesn't fix the related page issues:
  - "DISCOUNT AUTO-APPLIED" vs. the SMS sign-up requirement.
  - The guarantee wording in the plan box itself.
- Theme Check was not run, so these files are unchecked. Run `shopify theme check` before publishing.
```
