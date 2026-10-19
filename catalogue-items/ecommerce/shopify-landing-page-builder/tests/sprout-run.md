# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

The files are installable, read price and policies from the store, hold no fake reviews or prices, and the run correctly flagged that the actual page copy was never pasted and that no subscription app was known. The owner still has to paste every word and run a test order, and could have been given the brand's own colours from brand.md instead of neutral placeholders, but nothing here would mislead a buyer.

## Judge list

- Met: Template JSON valid and every block type exists in the section
  Template uses types "reason" and "question"; schema defines "reason", "question" and "@app". JSON parses cleanly.
- Met: No price, policy or review score typed into the code
  "{{ fr_product.price | money }}" and "{{ shop.refund_policy.url }}"; risk_line left empty with info "Must match your refund policy".
- Met: No rating, review count or badge has a default
  No rating/count/badge settings exist; quote setting has no default, info says "Paste a real customer's words exactly as written."
- Met: Every button leads to a real product, cart or page
  Hero link to "#FiveReasonsOffer-{{ section.id }}" anchor that exists; submit button inside {% form 'product', fr_product %} add-to-cart.
- Met: Styles scoped to the section and every image has alt
  "#shopify-section-{{ section.id }} .five-reasons" plus .five-reasons__ prefixes; image_tag uses alt: ...image.alt and MISSING flags alt text.
- Met: Tells you what it couldn't test
  "Theme Check was not run on these files" and "Add to cart and payment need a test order inside the store."

## What went in

```text
Finished page copy: our five-reasons page (headline, 5 reasons with
quotes, offer block, 7 questions, button "Start my first box").

Store details:
- Product: sprout.example/products/sprout, so the handle is "sprout"
- Page handle "five-reasons", template "page.five-reasons"
- Theme: not sure which, or whether it has theme blocks
- Reviews app and subscription app: don't know
```

## What came out

```text
### `sections/five-reasons.liquid`

```liquid
{%- liquid
  assign fr_product = section.settings.product
  assign reason_count = 0
-%}

{% style %}
  #shopify-section-{{ section.id }} .five-reasons {
    --fr-bg: {{ section.settings.background_color }};
    --fr-text: {{ section.settings.text_color }};
    --fr-accent: {{ section.settings.accent_color }};
    --fr-accent-text: {{ section.settings.accent_text_color }};
  }
{% endstyle %}

<div class="five-reasons" id="FiveReasons-{{ section.id }}">
  <div class="five-reasons__inner">

    <header class="five-reasons__hero">
      {%- if section.settings.hero_image != blank -%}
        {{
          section.settings.hero_image
          | image_url: width: 1600
          | image_tag:
            widths: '400, 600, 800, 1200, 1600',
            sizes: '(min-width: 990px) 960px, 100vw',
            loading: 'eager',
            fetchpriority: 'high',
            alt: section.settings.hero_image.alt,
            class: 'five-reasons__hero-img'
        }}
      {%- endif -%}

      {%- if section.settings.heading != blank -%}
        <h1 class="five-reasons__heading">{{ section.settings.heading | escape }}</h1>
      {%- endif -%}

      {%- if section.settings.subheading != blank -%}
        <div class="five-reasons__subheading">{{ section.settings.subheading }}</div>
      {%- endif -%}

      {%- if fr_product != blank -%}
        <a class="five-reasons__button" href="#FiveReasonsOffer-{{ section.id }}">
          {{- section.settings.button_label | escape -}}
        </a>
      {%- endif -%}
    </header>

    <div class="five-reasons__reasons">
      {%- for block in section.blocks -%}
        {%- if block.type == 'reason' -%}
          {%- assign reason_count = reason_count | plus: 1 -%}
          <article class="five-reasons__reason" {{ block.shopify_attributes }}>
            {%- if block.settings.image != blank -%}
              {{
                block.settings.image
                | image_url: width: 1200
                | image_tag:
                  widths: '400, 600, 800, 1200',
                  sizes: '(min-width: 990px) 960px, 100vw',
                  loading: 'lazy',
                  alt: block.settings.image.alt,
                  class: 'five-reasons__reason-img'
              }}
            {%- endif -%}

            <div class="five-reasons__reason-text">
              <span class="five-reasons__number" aria-hidden="true">{{ reason_count }}</span>
              {%- if block.settings.heading != blank -%}
                <h2 class="five-reasons__reason-heading">{{ block.settings.heading | escape }}</h2>
              {%- endif -%}
              {%- if block.settings.body != blank -%}
                <div class="five-reasons__reason-body">{{ block.settings.body }}</div>
              {%- endif -%}
              {%- if block.settings.quote != blank -%}
                <blockquote class="five-reasons__quote">
                  <p>{{ block.settings.quote | escape | newline_to_br }}</p>
                  {%- if block.settings.quote_author != blank -%}
                    <cite>{{ block.settings.quote_author | escape }}</cite>
                  {%- endif -%}
                </blockquote>
              {%- endif -%}
            </div>
          </article>
        {%- elsif block.type == '@app' -%}
          <div class="five-reasons__app" {{ block.shopify_attributes }}>
            {% render block %}
          </div>
        {%- endif -%}
      {%- endfor -%}
    </div>

    <section class="five-reasons__offer" id="FiveReasonsOffer-{{ section.id }}">
      {%- if section.settings.offer_heading != blank -%}
        <h2 class="five-reasons__offer-heading">{{ section.settings.offer_heading | escape }}</h2>
      {%- endif -%}
      {%- if section.settings.offer_text != blank -%}
        <div class="five-reasons__offer-text">{{ section.settings.offer_text }}</div>
      {%- endif -%}

      {%- if fr_product != blank -%}
        <p class="five-reasons__price">
          {%- if fr_product.compare_at_price > fr_product.price -%}
            <s class="five-reasons__compare">{{ fr_product.compare_at_price | money }}</s>
          {%- endif -%}
          <span class="five-reasons__current">{{ fr_product.price | money }}</span>
        </p>

        {%- form 'product', fr_product, class: 'five-reasons__form' -%}
          {%- if fr_product.has_only_default_variant -%}
            <input type="hidden" name="id" value="{{ fr_product.selected_or_first_available_variant.id }}">
          {%- else -%}
            <label class="five-reasons__label" for="FiveReasonsVariant-{{ section.id }}">
              {{- fr_product.options | join: ' / ' | escape -}}
            </label>
            <select class="five-reasons__select" name="id" id="FiveReasonsVariant-{{ section.id }}">
              {%- for variant in fr_product.variants -%}
                <option
                  value="{{ variant.id }}"
                  {% if variant.id == fr_product.selected_or_first_available_variant.id %}selected{% endif %}
                  {% unless variant.available %}disabled{% endunless %}
                >
                  {{- variant.title | escape }} – {{ variant.price | money -}}
                </option>
              {%- endfor -%}
            </select>
            {%- if section.settings.size_guide_page != blank -%}
              <a class="five-reasons__size-guide" href="{{ section.settings.size_guide_page.url }}">
                {{- section.settings.size_guide_page.title | escape -}}
              </a>
            {%- endif -%}
          {%- endif -%}

          <button
            type="submit"
            name="add"
            class="five-reasons__button five-reasons__button--submit"
            {% unless fr_product.available %}disabled{% endunless %}
          >
            {%- if fr_product.available -%}
              {{- section.settings.button_label | escape -}}
            {%- else -%}
              {{- section.settings.sold_out_label | escape -}}
            {%- endif -%}
          </button>
        {%- endform -%}
      {%- endif -%}

      {%- if section.settings.risk_line != blank -%}
        <p class="five-reasons__risk">{{ section.settings.risk_line | escape }}</p>
      {%- endif -%}

      {%- if shop.refund_policy != blank or shop.shipping_policy != blank -%}
        <ul class="five-reasons__policies">
          {%- if shop.refund_policy != blank -%}
            <li><a href="{{ shop.refund_policy.url }}">{{ shop.refund_policy.title | escape }}</a></li>
          {%- endif -%}
          {%- if shop.shipping_policy != blank -%}
            <li><a href="{{ shop.shipping_policy.url }}">{{ shop.shipping_policy.title | escape }}</a></li>
          {%- endif -%}
        </ul>
      {%- endif -%}
    </section>

    <section class="five-reasons__faq">
      {%- if section.settings.faq_heading != blank -%}
        <h2 class="five-reasons__faq-heading">{{ section.settings.faq_heading | escape }}</h2>
      {%- endif -%}
      {%- for block in section.blocks -%}
        {%- if block.type == 'question' and block.settings.question != blank -%}
          <details class="five-reasons__question" {{ block.shopify_attributes }}>
            <summary>{{ block.settings.question | escape }}</summary>
            {%- if block.settings.answer != blank -%}
              <div class="five-reasons__answer">{{ block.settings.answer }}</div>
            {%- endif -%}
          </details>
        {%- endif -%}
      {%- endfor -%}
    </section>

  </div>
</div>

{% stylesheet %}
  .five-reasons {
    background: var(--fr-bg);
    color: var(--fr-text);
    padding: 24px 16px 48px;
  }
  .five-reasons__inner {
    max-width: 960px;
    margin: 0 auto;
    display: grid;
    gap: 40px;
  }
  .five-reasons__hero {
    display: grid;
    gap: 16px;
    text-align: center;
  }
  .five-reasons__hero-img,
  .five-reasons__reason-img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
  }
  .five-reasons__heading {
    margin: 0;
    font-size: 2rem;
    line-height: 1.15;
  }
  .five-reasons__subheading p {
    margin: 0;
  }
  .five-reasons__reasons {
    display: grid;
    gap: 40px;
  }
  .five-reasons__reason {
    display: grid;
    gap: 16px;
  }
  .five-reasons__number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--fr-accent);
    color: var(--fr-accent-text);
    font-weight: 700;
  }
  .five-reasons__reason-heading {
    margin: 8px 0;
    font-size: 1.4rem;
  }
  .five-reasons__quote {
    margin: 16px 0 0;
    padding: 12px 16px;
    border-left: 4px solid var(--fr-accent);
    font-style: italic;
  }
  .five-reasons__quote p {
    margin: 0;
  }
  .five-reasons__quote cite {
    display: block;
    margin-top: 8px;
    font-style: normal;
    font-weight: 600;
  }
  .five-reasons__offer {
    display: grid;
    gap: 12px;
    padding: 24px 16px;
    border: 2px solid var(--fr-accent);
    border-radius: 8px;
    text-align: center;
  }
  .five-reasons__offer-heading {
    margin: 0;
  }
  .five-reasons__price {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  .five-reasons__compare {
    margin-right: 8px;
    font-weight: 400;
    opacity: 0.7;
  }
  .five-reasons__form {
    display: grid;
    gap: 12px;
  }
  .five-reasons__select {
    min-height: 48px;
    padding: 0 12px;
    font-size: 1rem;
  }
  .five-reasons__button {
    display: inline-block;
    min-height: 48px;
    padding: 14px 24px;
    border: 0;
    border-radius: 6px;
    background: var(--fr-accent);
    color: var(--fr-accent-text);
    font-size: 1.1rem;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
  }
  .five-reasons__button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .five-reasons__risk {
    margin: 0;
    font-size: 0.95rem;
  }
  .five-reasons__policies {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
    font-size: 0.9rem;
  }
  .five-reasons__policies a,
  .five-reasons__size-guide {
    color: inherit;
  }
  .five-reasons__faq {
    display: grid;
    gap: 8px;
  }
  .five-reasons__question {
    border-bottom: 1px solid currentColor;
    padding: 12px 0;
  }
  .five-reasons__question summary {
    cursor: pointer;
    font-weight: 600;
    min-height: 32px;
  }
  @media screen and (min-width: 750px) {
    .five-reasons {
      padding: 48px 32px 80px;
    }
    .five-reasons__heading {
      font-size: 2.75rem;
    }
    .five-reasons__reason {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: 32px;
    }
    .five-reasons__reason:nth-child(even) .five-reasons__reason-img {
      order: 2;
    }
    .five-reasons__form {
      max-width: 420px;
      margin: 0 auto;
      width: 100%;
    }
  }
{% endstylesheet %}

{% schema %}
{
  "name": "Five reasons",
  "tag": "section",
  "class": "five-reasons-section",
  "settings": [
    {
      "type": "product",
      "id": "product",
      "label": "Product sold on this page"
    },
    {
      "type": "header",
      "content": "Top of page"
    },
    {
      "type": "image_picker",
      "id": "hero_image",
      "label": "Top image"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Headline"
    },
    {
      "type": "richtext",
      "id": "subheading",
      "label": "Line under the headline"
    },
    {
      "type": "text",
      "id": "button_label",
      "label": "Button label",
      "default": "Start my first box"
    },
    {
      "type": "text",
      "id": "sold_out_label",
      "label": "Button label when sold out",
      "default": "Sold out"
    },
    {
      "type": "header",
      "content": "Offer"
    },
    {
      "type": "text",
      "id": "offer_heading",
      "label": "Offer heading"
    },
    {
      "type": "richtext",
      "id": "offer_text",
      "label": "Offer text"
    },
    {
      "type": "page",
      "id": "size_guide_page",
      "label": "Size guide page",
      "info": "Only shown when the product has more than one variant."
    },
    {
      "type": "text",
      "id": "risk_line",
      "label": "Risk line",
      "info": "Must match your refund policy in Settings > Policies."
    },
    {
      "type": "header",
      "content": "Questions"
    },
    {
      "type": "text",
      "id": "faq_heading",
      "label": "Questions heading"
    },
    {
      "type": "header",
      "content": "Colours"
    },
    {
      "type": "color",
      "id": "background_color",
      "label": "Background",
      "default": "#ffffff"
    },
    {
      "type": "color",
      "id": "text_color",
      "label": "Text",
      "default": "#1a1a1a"
    },
    {
      "type": "color",
      "id": "accent_color",
      "label": "Accent (buttons, numbers)",
      "default": "#2f6f3e"
    },
    {
      "type": "color",
      "id": "accent_text_color",
      "label": "Text on accent",
      "default": "#ffffff"
    }
  ],
  "blocks": [
    {
      "type": "reason",
      "name": "Reason",
      "settings": [
        {
          "type": "image_picker",
          "id": "image",
          "label": "Image"
        },
        {
          "type": "text",
          "id": "heading",
          "label": "Reason heading"
        },
        {
          "type": "richtext",
          "id": "body",
          "label": "Reason text"
        },
        {
          "type": "textarea",
          "id": "quote",
          "label": "Customer quote",
          "info": "Paste a real customer's words exactly as written."
        },
        {
          "type": "text",
          "id": "quote_author",
          "label": "Quote by"
        }
      ]
    },
    {
      "type": "question",
      "name": "Question",
      "settings": [
        {
          "type": "text",
          "id": "question",
          "label": "Question"
        },
        {
          "type": "richtext",
          "id": "answer",
          "label": "Answer"
        }
      ]
    },
    {
      "type": "@app"
    }
  ],
  "presets": [
    {
      "name": "Five reasons"
    }
  ]
}
{% endschema %}
```

### `templates/page.five-reasons.json`

```json
{
  "sections": {
    "main": {
      "type": "five-reasons",
      "settings": {
        "product": "sprout",
        "button_label": "Start my first box",
        "sold_out_label": "Sold out"
      },
      "blocks": {
        "reason_1": { "type": "reason", "settings": {} },
        "reason_2": { "type": "reason", "settings": {} },
        "reason_3": { "type": "reason", "settings": {} },
        "reason_4": { "type": "reason", "settings": {} },
        "reason_5": { "type": "reason", "settings": {} },
        "question_1": { "type": "question", "settings": {} },
        "question_2": { "type": "question", "settings": {} },
        "question_3": { "type": "question", "settings": {} },
        "question_4": { "type": "question", "settings": {} },
        "question_5": { "type": "question", "settings": {} },
        "question_6": { "type": "question", "settings": {} },
        "question_7": { "type": "question", "settings": {} }
      },
      "block_order": [
        "reason_1",
        "reason_2",
        "reason_3",
        "reason_4",
        "reason_5",
        "question_1",
        "question_2",
        "question_3",
        "question_4",
        "question_5",
        "question_6",
        "question_7"
      ]
    }
  },
  "order": ["main"]
}
```

No snippets or locale entries are needed.

**Image list**

| Slot | What it must show | Suggested size |
|---|---|---|
| Top image (`hero_image`) | The Sprout box, ideally opened or in use. This is the first thing seen on a phone. | 1600 × 1000 px, 16:10 |
| Reason 1 image | The point Reason 1 makes | 1200 × 900 px, 4:3 |
| Reason 2 image | The point Reason 2 makes | 1200 × 900 px, 4:3 |
| Reason 3 image | The point Reason 3 makes | 1200 × 900 px, 4:3 |
| Reason 4 image | The point Reason 4 makes | 1200 × 900 px, 4:3 |
| Reason 5 image | The point Reason 5 makes | 1200 × 900 px, 4:3 |

Give each image alt text in Content > Files before you pick it. The section prints that alt text.

**Install steps**
1. In Online Store > Themes > ⋯ > Edit code, add `sections/five-reasons.liquid` and `templates/page.five-reasons.json` with the contents above. This needs an Online Store 2.0 (JSON template) theme.
2. Go to Online Store > Pages > Add page, name it so the handle is `five-reasons`, and save.
3. In that page's "Theme template" box, choose `five-reasons` and save.
4. Open the page in Customize and check that "Product sold on this page" shows Sprout. Pick it if it's blank. Then paste the copy into the headline, reasons, offer, risk line and questions.
5. Upload the six images from the list above, with alt text, and pick them in their slots.
6. Preview on a phone, tap "Start my first box", and place a test order to confirm the cart and payment work.

**MISSING list**
- MISSING: page copy. Only the button label ("Start my first box") was supplied. These are still empty:
  - headline
  - line under the headline
  - 5 reason headings and texts
  - offer heading and text
  - risk line
  - questions heading, plus the 7 questions and answers
- MISSING: the 5 customer quotes and their authors. Paste them word for word from real customers. They have no defaults.
- MISSING: subscription app. Only a one-time purchase was built. Once you know the app, add its app block through the section's "Apps" slot rather than rebuilding it here. "Start my first box" suggests a subscription, so confirm this before launch.
- MISSING: reviews app. The quotes are held in Reason blocks. An app's reviews block can be added through the same "Apps" slot.
- MISSING: theme name and theme-block support. The section uses its own blocks, so it doesn't need theme blocks. It does need an Online Store 2.0 theme.
- MISSING: brand colours and fonts. Neutral placeholder colours are set and can be changed under "Colours".
- MISSING: a size guide page. It's optional and only shows if Sprout has more than one variant.
- MISSING: refund and shipping policies, if they aren't filled in under Settings > Policies. Their links only appear once they exist.
- MISSING: alt text for every image.

**Score**

Checks passed: 1 + 1 + 1 + 1 + 1 + 1 + 1 = 7 of 7, so 7 / 7 × 100 = **100**.

- Checks missed: none.
- The "Advertisement" check was counted as passed because it doesn't apply. This is a reasons-to-buy page, not an article-style page, so no label is printed.
- Not tested:
  - Theme Check was not run on these files. Run `shopify theme check` before going live.
  - Add to cart and payment need a test order inside the store.
- The score measures the files against their own checks only. It does not replace that test order.
```
