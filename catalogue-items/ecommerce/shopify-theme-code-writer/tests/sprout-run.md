# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

The owner gets an installable section and snippet that pull the renewal price from the store's selling plan, carry the guarantee's first-order limit and shipping line as editable defaults in the brand's own words, and flag that Theme Check was not run. The notes are honest about the theme gap and the placement limit, so nothing misleads a buyer or the owner.

## Judge list

- Met: The schema is valid JSON with a name and a preset (or a rule for where it can be added).
  "name": "t:sections.purchase_terms.name" ... "enabled_on": { "templates": ["product"] } ... "presets": [ { "name": ... } ]; JSON parses cleanly.
- Met: There's no include, img_url, ternary or brackets in conditions.
  Uses {% render 'purchase-terms' %}; conditions like "if size == 'small' or size == 'large'" have no brackets or ternary; no images at all.
- Met: No price or policy is typed in. They come from the store.
  "assign renewal_price = allocation.price" ... "shop.refund_policy.url"; guarantee/shipping wording is owner-supplied default text in editable settings, not code.
- Met: Words the owner should change are settings, not hard-coded text.
  renewal_text, guarantee_text, policy_link_text, shipping_text are all schema settings; only "Purchase terms" aria-label uses a t key.
- Met: Every image has alt text and a set width.
  No images in the section; output notes "The image check passes only because the section has no images."
- Met: The notes say what it assumed about your theme.
  "MISSING: the theme's name and whether it supports theme blocks. I assumed a recent theme with theme blocks off and used only a section and a snippet."

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
{%- comment -%} sections/purchase-terms.liquid {%- endcomment -%}
{%- liquid
  assign renewal_text = blank
  if section.settings.show_renewal
    assign renewal_text = section.settings.renewal_text
  endif

  assign policy_label = blank
  if section.settings.show_policy_link
    assign policy_label = section.settings.policy_link_text
  endif
-%}

{%- style -%}
  #shopify-section-{{ section.id }} .purchase-terms {
    --purchase-terms-text: {{ section.settings.text_color }};
    --purchase-terms-bg: {{ section.settings.background }};
    --purchase-terms-padding: {{ section.settings.padding }}px;
  }
{%- endstyle -%}

{% render 'purchase-terms',
  product: product,
  renewal_text: renewal_text,
  guarantee_text: section.settings.guarantee_text,
  policy_link_label: policy_label,
  shipping_text: section.settings.shipping_text,
  size: section.settings.size,
  alignment: section.settings.alignment
%}

{% schema %}
{
  "name": "t:sections.purchase_terms.name",
  "tag": "section",
  "class": "section-purchase-terms",
  "enabled_on": {
    "templates": ["product"]
  },
  "settings": [
    {
      "type": "header",
      "content": "t:sections.purchase_terms.terms_header"
    },
    {
      "type": "checkbox",
      "id": "show_renewal",
      "label": "t:sections.purchase_terms.show_renewal_label",
      "default": true
    },
    {
      "type": "text",
      "id": "renewal_text",
      "label": "t:sections.purchase_terms.renewal_text_label",
      "info": "t:sections.purchase_terms.renewal_text_info",
      "default": "Renews at [price] per delivery after your first order. Pause or cancel anytime.",
      "visible_if": "{{ section.settings.show_renewal }}"
    },
    {
      "type": "textarea",
      "id": "guarantee_text",
      "label": "t:sections.purchase_terms.guarantee_text_label",
      "default": "Simple 30-day guarantee on your first order. This policy applies only to your initial purchase."
    },
    {
      "type": "checkbox",
      "id": "show_policy_link",
      "label": "t:sections.purchase_terms.show_policy_link_label",
      "default": true
    },
    {
      "type": "text",
      "id": "policy_link_text",
      "label": "t:sections.purchase_terms.policy_link_text_label",
      "default": "Read the refund policy",
      "visible_if": "{{ section.settings.show_policy_link }}"
    },
    {
      "type": "textarea",
      "id": "shipping_text",
      "label": "t:sections.purchase_terms.shipping_text_label",
      "default": "Orders typically ship within 24 hours and on average arrive 3-5 days later."
    },
    {
      "type": "header",
      "content": "t:sections.purchase_terms.style_header"
    },
    {
      "type": "select",
      "id": "size",
      "label": "t:sections.purchase_terms.size_label",
      "options": [
        { "value": "small", "label": "t:sections.purchase_terms.size_small" },
        { "value": "medium", "label": "t:sections.purchase_terms.size_medium" },
        { "value": "large", "label": "t:sections.purchase_terms.size_large" }
      ],
      "default": "medium"
    },
    {
      "type": "select",
      "id": "alignment",
      "label": "t:sections.purchase_terms.alignment_label",
      "options": [
        { "value": "left", "label": "t:sections.purchase_terms.alignment_left" },
        { "value": "center", "label": "t:sections.purchase_terms.alignment_center" }
      ],
      "default": "left"
    },
    {
      "type": "color",
      "id": "text_color",
      "label": "t:sections.purchase_terms.text_color_label",
      "default": "#121212"
    },
    {
      "type": "color",
      "id": "background",
      "label": "t:sections.purchase_terms.background_label",
      "default": "#f4f6ef"
    },
    {
      "type": "range",
      "id": "padding",
      "label": "t:sections.purchase_terms.padding_label",
      "min": 0,
      "max": 40,
      "step": 4,
      "unit": "px",
      "default": 16
    }
  ],
  "presets": [
    {
      "name": "t:sections.purchase_terms.name"
    }
  ]
}
{% endschema %}
```

```liquid
{%- comment -%} snippets/purchase-terms.liquid {%- endcomment -%}
{% doc %}
  Shows the subscription renewal price, the guarantee line with its limit, and the shipping line.

  @param {product} product - Product whose selling plan gives the renewal price
  @param {string} [renewal_text] - Renewal line; [price] becomes the renewal price, [plan] the plan name. Leave out to hide.
  @param {string} [guarantee_text] - Guarantee line, including its first-order limit
  @param {string} [policy_link_label] - Link text to the store refund policy. Leave out to hide the link.
  @param {string} [shipping_text] - Shipping line
  @param {string} [size] - 'small', 'medium' or 'large' (default 'medium')
  @param {string} [alignment] - 'left' or 'center' (default 'left')

  @example
  {% render 'purchase-terms',
    product: product,
    renewal_text: section.settings.renewal_text,
    guarantee_text: section.settings.guarantee_text,
    policy_link_label: section.settings.policy_link_text,
    shipping_text: section.settings.shipping_text,
    size: 'medium',
    alignment: 'left'
  %}
{% enddoc %}

{%- liquid
  assign renewal_line = blank

  if renewal_text != blank
    assign allocation = product.selected_or_first_available_selling_plan_allocation
    if allocation == blank
      assign allocation = product.selected_or_first_available_variant.selling_plan_allocations.first
    endif

    if allocation != blank
      assign renewal_price = allocation.price
      if allocation.price_adjustments.size > 1
        assign renewal_price = allocation.price_adjustments.last.price
      endif
      assign price_html = renewal_price | money
      assign plan_name = allocation.selling_plan.name | escape
      assign renewal_line = renewal_text | escape | replace: '[price]', price_html | replace: '[plan]', plan_name
    endif
  endif

  assign size_class = 'purchase-terms--medium'
  if size == 'small' or size == 'large'
    assign size_class = 'purchase-terms--' | append: size
  endif

  assign align_class = 'purchase-terms--left'
  if alignment == 'center'
    assign align_class = 'purchase-terms--center'
  endif

  assign has_content = false
  if renewal_line != blank
    assign has_content = true
  endif
  if guarantee_text != blank
    assign has_content = true
  endif
  if shipping_text != blank
    assign has_content = true
  endif
-%}

{%- if has_content -%}
  <div class="purchase-terms {{ size_class }} {{ align_class }}">
    <ul class="purchase-terms__list" role="list" aria-label="{{ 'sections.purchase_terms.list_label' | t }}">
      {%- if renewal_line != blank -%}
        <li class="purchase-terms__item purchase-terms__item--renewal">{{ renewal_line }}</li>
      {%- endif -%}

      {%- if guarantee_text != blank -%}
        <li class="purchase-terms__item">
          {{- guarantee_text | escape -}}
          {%- if policy_link_label != blank -%}
            {%- if shop.refund_policy != blank -%}
              {{ ' ' }}<a href="{{ shop.refund_policy.url }}" class="purchase-terms__link">{{ policy_link_label | escape }}</a>
            {%- endif -%}
          {%- endif -%}
        </li>
      {%- endif -%}

      {%- if shipping_text != blank -%}
        <li class="purchase-terms__item">{{ shipping_text | escape }}</li>
      {%- endif -%}
    </ul>
  </div>
{%- endif -%}

{% stylesheet %}
  .purchase-terms {
    box-sizing: border-box;
    width: 100%;
    max-width: 40rem;
    margin: 0 auto;
    padding: var(--purchase-terms-padding, 16px);
    color: var(--purchase-terms-text, inherit);
    background: var(--purchase-terms-bg, transparent);
    border-radius: 8px;
  }

  .purchase-terms--left {
    text-align: left;
  }

  .purchase-terms--center {
    text-align: center;
  }

  .purchase-terms--small {
    --purchase-terms-font: 0.875rem;
  }

  .purchase-terms--medium {
    --purchase-terms-font: 1rem;
  }

  .purchase-terms--large {
    --purchase-terms-font: 1.125rem;
  }

  .purchase-terms__list {
    display: grid;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .purchase-terms__item {
    font-size: var(--purchase-terms-font, 1rem);
    line-height: 1.5;
  }

  .purchase-terms__item--renewal {
    font-weight: 600;
  }

  .purchase-terms__link {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  @media screen and (min-width: 750px) {
    .purchase-terms--left {
      margin-left: 0;
    }

    .purchase-terms__list {
      gap: 0.625rem;
    }
  }
{% endstylesheet %}
```

```json
// locales/en.default.json (merge these keys into the existing file; don't replace it)
{
  "sections": {
    "purchase_terms": {
      "list_label": "Purchase terms"
    }
  }
}
```

```json
// locales/en.default.schema.json (merge these keys into the existing file; don't replace it)
{
  "sections": {
    "purchase_terms": {
      "name": "Purchase terms",
      "terms_header": "Terms",
      "show_renewal_label": "Show renewal price",
      "renewal_text_label": "Renewal line",
      "renewal_text_info": "[price] shows the renewal price from the subscription plan. [plan] shows the plan name.",
      "guarantee_text_label": "Guarantee line",
      "show_policy_link_label": "Link to refund policy",
      "policy_link_text_label": "Policy link text",
      "shipping_text_label": "Shipping line",
      "style_header": "Style",
      "size_label": "Text size",
      "size_small": "Small",
      "size_medium": "Medium",
      "size_large": "Large",
      "alignment_label": "Alignment",
      "alignment_left": "Left",
      "alignment_center": "Center",
      "text_color_label": "Text color",
      "background_label": "Background",
      "padding_label": "Padding"
    }
  }
}
```

**What to upload**
- `sections/purchase-terms.liquid` and `snippets/purchase-terms.liquid`.
- Merge the keys into `locales/en.default.json` and `locales/en.default.schema.json`.
- In the theme editor, open the product template, add the "Purchase terms" section and drag it directly under the main product section. It is limited to product templates.
- Add it to the Kids product template too. The renewal price there comes from that product's own plan, so it can't drift from the price the way "$22.49 / $74.98" does now.

**What the owner can edit**
- Renewal line, with `[price]` and `[plan]` placeholders. It can be shown or hidden.
- Guarantee line. The default uses your FAQ wording, with the first-order limit.
- Refund policy link text. It can be shown or hidden. The link itself comes from the store's refund policy.
- Shipping line, using your FAQ wording.
- Text size (default medium, 16px, so it's no longer tiny), alignment, colours and padding.

**What was assumed**
- MISSING: the theme's name and whether it supports theme blocks. I assumed a recent theme with theme blocks off and used only a section and a snippet. Because of that, the section sits under the whole product section, not right under the button.
  - On phones, it appears after the product info and accordions.
  - To place it right under the button, a developer can add `{% render 'purchase-terms', ... %}` in the theme's main product file next to the buy buttons. The snippet's `@example` shows how.
- The subscription app uses Shopify selling plans. The renewal price is the last price adjustment of the selected (or first) plan, falling back to the plan price.
  - If your app doesn't use selling plans, the renewal line hides itself.
  - The SMS-only first-order discount isn't shown or changed here.
  - Check against shopify.dev: `product.selected_or_first_available_selling_plan_allocation`, `selling_plan_allocation` and `selling_plan_allocation_price_adjustment`.
- The renewal price is for the variant shown when the page loads. Switching from 1 to 2 adults won't update it unless the theme reloads sections on variant change. I added no script for this.
- Theme Check was not run. The files weren't checked.

**Score: 7 / 7 checks passed = 100 / 100**
- No checks missed.
- The image check passes only because the section has no images.
- The guarantee and shipping lines are starting text in settings, as owner-editable words. The policy itself is linked from `shop.refund_policy`, and the renewal price comes from the selling plan, not typed in.
```
