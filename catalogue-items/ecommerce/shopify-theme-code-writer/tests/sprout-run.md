# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A solid, installable section that pulls the renewal price from the selling plan, puts the guarantee's first-order limit and the shipping line in editable settings, and is honest about the theme gaps and what it couldn't check. One real bug to fix in preview: in the renewal line, `| money` is chained after `replace`, so it formats the whole sentence rather than the price, meaning `[price]` may show as raw cents or garbage until the price is formatted into a variable first.

## Judge list

- Met: The schema is valid JSON with a name and a preset (or a rule for where it can be added).
  "name": "t:sections.plan_terms.name" ... "enabled_on": {"templates": ["product"]} ... "presets": [{ "name": "t:sections.plan_terms.presets.name" }]
- Met: There's no include, img_url, ternary or brackets in conditions.
  Conditions are plain: `if allocation.price_adjustments.size > 1`, `if days > 0`; no include, img_url or ternary anywhere.
- Met: No price or policy is typed in. They come from the store.
  Renewal price read from `allocation.price_adjustments[1].price` / `allocation.price` with `money`; guarantee wording is an owner setting default from the owner's own FAQ text, flagged honestly in CHECKS MISSED.
- Met: Words the owner should change are settings, not hard-coded text.
  `renewal_text`, `guarantee_text`, `shipping_text` are inline_richtext settings; fixed words use `'sections.plan_terms.heading' | t`.
- Met: Every image has alt text and a set width.
  No images in the section; notes say "not applicable, because the section has no images."
- Met: The notes say what it assumed about your theme.
  "MISSING: theme name and theme block support. The code assumes a recent theme with theme blocks off and uses one section only."

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
### sections/plan-terms.liquid

```liquid
{%- comment -%}
  Plan terms: renewal price, guarantee line and shipping line.
  Meant to sit directly under the product section on product templates.
  The renewal price comes from the variant's selling plan. It is never typed in.
{%- endcomment -%}

{%- liquid
  assign has_renewal = false
  assign renewal_price = 0
  assign plan_name = ''

  if product != blank
    assign current_variant = product.selected_or_first_available_variant
    assign allocation = current_variant.selected_selling_plan_allocation
    if allocation == blank
      assign allocation = current_variant.selling_plan_allocations | first
    endif

    if allocation != blank
      assign has_renewal = true
      assign plan_name = allocation.selling_plan.name | escape
      if allocation.price_adjustments.size > 1
        assign renewal_price = allocation.price_adjustments[1].price
      else
        assign renewal_price = allocation.price
      endif
    endif
  endif

  assign price_per_day = ''
  if has_renewal
    assign days = section.settings.days_per_delivery | default: 0
    if days > 0
      assign price_per_day = renewal_price | divided_by: days | money
    endif
  endif
-%}

{%- style -%}
  #shopify-section-{{ section.id }} .plan-terms {
    --plan-terms-size: {{ section.settings.text_size }}px;
    text-align: {{ section.settings.alignment }};
    padding-top: {{ section.settings.padding_top }}px;
    padding-bottom: {{ section.settings.padding_bottom }}px;
    {%- if section.settings.text_color != blank %}
      --plan-terms-color: {{ section.settings.text_color }};
    {%- endif %}
    {%- if section.settings.background_color != blank %}
      --plan-terms-bg: {{ section.settings.background_color }};
    {%- endif %}
  }
{%- endstyle -%}

<div
  class="plan-terms"
  data-plan-terms
  data-section-id="{{ section.id }}"
  data-product-url="{{ product.url }}"
>
  <h2 class="plan-terms__sr">{{ 'sections.plan_terms.heading' | t }}</h2>
  <ul class="plan-terms__list" role="list">
    {%- if section.settings.show_renewal and has_renewal -%}
      {%- if section.settings.renewal_text != blank -%}
        <li class="plan-terms__item plan-terms__item--renewal">
          {{-
            section.settings.renewal_text
            | replace: '[price]', renewal_price | money
            | replace: '[price_per_day]', price_per_day
            | replace: '[plan_name]', plan_name
          -}}
        </li>
      {%- endif -%}
    {%- endif -%}

    {%- if section.settings.show_guarantee and section.settings.guarantee_text != blank -%}
      <li class="plan-terms__item plan-terms__item--guarantee">
        {{ section.settings.guarantee_text }}
        {%- if section.settings.show_policy_link and shop.refund_policy != blank %}
          <a class="plan-terms__link" href="{{ shop.refund_policy.url }}">
            {{- 'sections.plan_terms.policy_link' | t -}}
          </a>
        {%- endif -%}
      </li>
    {%- endif -%}

    {%- if section.settings.show_shipping and section.settings.shipping_text != blank -%}
      <li class="plan-terms__item plan-terms__item--shipping">
        {{ section.settings.shipping_text }}
      </li>
    {%- endif -%}
  </ul>
</div>

{% stylesheet %}
  .plan-terms {
    box-sizing: border-box;
    max-width: var(--page-width, 120rem);
    margin: 0 auto;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    font-size: var(--plan-terms-size, 15px);
    line-height: 1.45;
    color: var(--plan-terms-color, inherit);
    background: var(--plan-terms-bg, transparent);
  }

  .plan-terms__list {
    display: grid;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .plan-terms__item {
    margin: 0;
  }

  .plan-terms__item--renewal {
    font-weight: 600;
  }

  .plan-terms__link {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 0.15em;
  }

  .plan-terms__sr {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }

  @media screen and (min-width: 750px) {
    .plan-terms {
      padding-left: 5rem;
      padding-right: 5rem;
    }
  }
{% endstylesheet %}

{% javascript %}
  (function () {
    var timer;

    function update(root) {
      var form = document.querySelector('form[action*="/cart/add"]');
      if (!form) return;

      var data = new FormData(form);
      var variantId = data.get('id');
      if (!variantId) return;

      var params = new URLSearchParams();
      params.set('variant', variantId);
      var plan = data.get('selling_plan');
      if (plan) params.set('selling_plan', plan);
      params.set('section_id', root.dataset.sectionId);

      var key = params.toString();
      if (root.dataset.lastKey === key) return;
      root.dataset.lastKey = key;

      fetch(root.dataset.productUrl + '?' + key)
        .then(function (response) {
          return response.ok ? response.text() : null;
        })
        .then(function (html) {
          if (!html) return;
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var fresh = doc.querySelector('[data-plan-terms]');
          if (fresh) root.innerHTML = fresh.innerHTML;
        })
        .catch(function () {});
    }

    document.addEventListener('change', function (event) {
      var target = event.target;
      if (!target || !target.closest) return;
      if (!target.closest('form, variant-selects, variant-radios, [data-variant-picker]')) return;

      var roots = document.querySelectorAll('[data-plan-terms]');
      if (!roots.length) return;

      clearTimeout(timer);
      timer = setTimeout(function () {
        roots.forEach(update);
      }, 200);
    });
  })();
{% endjavascript %}

{% schema %}
{
  "name": "t:sections.plan_terms.name",
  "tag": "section",
  "class": "section plan-terms-section",
  "enabled_on": {
    "templates": ["product"]
  },
  "settings": [
    {
      "type": "header",
      "content": "t:sections.plan_terms.settings.header_renewal.content"
    },
    {
      "type": "checkbox",
      "id": "show_renewal",
      "label": "t:sections.plan_terms.settings.show_renewal.label",
      "default": true
    },
    {
      "type": "inline_richtext",
      "id": "renewal_text",
      "label": "t:sections.plan_terms.settings.renewal_text.label",
      "info": "t:sections.plan_terms.settings.renewal_text.info",
      "default": "After your first box, each delivery renews at [price] ([price_per_day] a day). Pause or cancel anytime.",
      "visible_if": "{{ section.settings.show_renewal }}"
    },
    {
      "type": "number",
      "id": "days_per_delivery",
      "label": "t:sections.plan_terms.settings.days_per_delivery.label",
      "info": "t:sections.plan_terms.settings.days_per_delivery.info",
      "default": 28,
      "visible_if": "{{ section.settings.show_renewal }}"
    },
    {
      "type": "header",
      "content": "t:sections.plan_terms.settings.header_guarantee.content"
    },
    {
      "type": "checkbox",
      "id": "show_guarantee",
      "label": "t:sections.plan_terms.settings.show_guarantee.label",
      "default": true
    },
    {
      "type": "inline_richtext",
      "id": "guarantee_text",
      "label": "t:sections.plan_terms.settings.guarantee_text.label",
      "default": "A simple 30-day guarantee on your first order. This policy applies only to your initial purchase.",
      "visible_if": "{{ section.settings.show_guarantee }}"
    },
    {
      "type": "checkbox",
      "id": "show_policy_link",
      "label": "t:sections.plan_terms.settings.show_policy_link.label",
      "info": "t:sections.plan_terms.settings.show_policy_link.info",
      "default": true,
      "visible_if": "{{ section.settings.show_guarantee }}"
    },
    {
      "type": "header",
      "content": "t:sections.plan_terms.settings.header_shipping.content"
    },
    {
      "type": "checkbox",
      "id": "show_shipping",
      "label": "t:sections.plan_terms.settings.show_shipping.label",
      "default": true
    },
    {
      "type": "inline_richtext",
      "id": "shipping_text",
      "label": "t:sections.plan_terms.settings.shipping_text.label",
      "default": "Orders typically ship within 24 hours and on average arrive 3-5 days later.",
      "visible_if": "{{ section.settings.show_shipping }}"
    },
    {
      "type": "header",
      "content": "t:sections.plan_terms.settings.header_style.content"
    },
    {
      "type": "range",
      "id": "text_size",
      "label": "t:sections.plan_terms.settings.text_size.label",
      "min": 12,
      "max": 20,
      "step": 1,
      "unit": "px",
      "default": 15
    },
    {
      "type": "text_alignment",
      "id": "alignment",
      "label": "t:sections.plan_terms.settings.alignment.label",
      "default": "left"
    },
    {
      "type": "color",
      "id": "text_color",
      "label": "t:sections.plan_terms.settings.text_color.label"
    },
    {
      "type": "color",
      "id": "background_color",
      "label": "t:sections.plan_terms.settings.background_color.label"
    },
    {
      "type": "range",
      "id": "padding_top",
      "label": "t:sections.plan_terms.settings.padding_top.label",
      "min": 0,
      "max": 40,
      "step": 4,
      "unit": "px",
      "default": 8
    },
    {
      "type": "range",
      "id": "padding_bottom",
      "label": "t:sections.plan_terms.settings.padding_bottom.label",
      "min": 0,
      "max": 40,
      "step": 4,
      "unit": "px",
      "default": 16
    }
  ],
  "presets": [
    {
      "name": "t:sections.plan_terms.presets.name"
    }
  ]
}
{% endschema %}
```

### locales/en.default.json (merge these keys into your existing file; don't replace it)

```json
{
  "sections": {
    "plan_terms": {
      "heading": "Subscription terms",
      "policy_link": "Read our refund policy"
    }
  }
}
```

### locales/en.default.schema.json (merge these keys into your existing file; don't replace it)

```json
{
  "sections": {
    "plan_terms": {
      "name": "Plan terms",
      "settings": {
        "header_renewal": {
          "content": "Renewal price"
        },
        "show_renewal": {
          "label": "Show renewal line"
        },
        "renewal_text": {
          "label": "Renewal text",
          "info": "[price] shows the renewal price from your subscription plan. [price_per_day] divides it by the days below. [plan_name] shows the plan's name. Hidden if the product has no subscription plan."
        },
        "days_per_delivery": {
          "label": "Days per delivery",
          "info": "Used for [price_per_day]. Set to 0 to leave it blank."
        },
        "header_guarantee": {
          "content": "Guarantee"
        },
        "show_guarantee": {
          "label": "Show guarantee line"
        },
        "guarantee_text": {
          "label": "Guarantee text"
        },
        "show_policy_link": {
          "label": "Link to refund policy",
          "info": "Shows only if a refund policy is set in Settings > Policies."
        },
        "header_shipping": {
          "content": "Shipping"
        },
        "show_shipping": {
          "label": "Show shipping line"
        },
        "shipping_text": {
          "label": "Shipping text"
        },
        "header_style": {
          "content": "Style"
        },
        "text_size": {
          "label": "Text size"
        },
        "alignment": {
          "label": "Alignment"
        },
        "text_color": {
          "label": "Text colour"
        },
        "background_color": {
          "label": "Background colour"
        },
        "padding_top": {
          "label": "Top padding"
        },
        "padding_bottom": {
          "label": "Bottom padding"
        }
      },
      "presets": {
        "name": "Plan terms"
      }
    }
  }
}
```

**Upload**
- Upload `sections/plan-terms.liquid`, then merge the two locale fragments into your existing files. Do this on a duplicate theme first.
- In the theme editor, open the product template, choose Add section, pick "Plan terms" and drag it directly under the product information section.

**What the owner can edit**
- The three lines, each with its own show/hide switch. Use `[price]`, `[price_per_day]` and `[plan_name]` in the renewal text.
- Days per delivery (28 by default, which gives $1.78/day on $49.99), text size (15px by default so the renewal line is no longer tiny), alignment, colours and padding.
- The guarantee line can link to the store's refund policy.

**What was assumed**
- MISSING: theme name and theme block support. The code assumes a recent theme with theme blocks off and uses one section only. Because it is a separate section, it sits under the whole product section, not inside it. On phones that may put it below the accordions rather than right under the "Start Now" button. To place it exactly under the button, the main product section's buy-button area needs a code edit, which needs that file.
- MISSING: which subscription app you use. The renewal price is read from the Shopify selling plan:
  - If the plan has two price stages, it uses the second.
  - Otherwise it uses the plan price.
  - If your $29.99 comes from the SMS discount code, which the footer suggests, the plan price should already be $49.99.
  - Check this in preview.
- The small script refreshes the lines when the buyer changes flavour, sugar level, number of adults or plan. It reads the theme's add-to-cart form. If your theme or app builds that form differently, the price will still be right on page load but may not refresh. It sends no tracking.
- When One Time Purchase is picked, the renewal line still shows the subscription's renewal price.
- The guarantee and shipping lines start with your FAQ wording. The plan box above still says "30-Day Money-Back Guarantee" with no limit, so consider adding "on your first order" there too.
- Theme Check was not run. These files were not checked in Shopify CLI.

CHECKS MISSED:
- No typed policies: the guarantee and shipping wording is your own text stored in section settings, not read from a store object. Shopify has no object for shipping times. The guarantee line links to `shop.refund_policy` as the source of record, but the 30-day wording must be kept in step with that policy by hand.
- Images have `alt`, `image_url` and loading: not applicable, because the section has no images.

Would you like to check the page before it goes live with the [Meta ads compliance checker](https://useaiblocks.com/skills/meta-ads-compliance-checker)? You could also check it with the [Landing page 30-point checker](https://useaiblocks.com/prompts/landing-page-30-point-checker), or tell me what you'd like next.
```
