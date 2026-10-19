# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A clean, installable build that reads price and policies from the store, guards reviews with empty fields, and honestly lists everything it couldn't fill or test. The owner still has to paste all the actual copy and confirm the subscription app, because only an outline of the page was supplied, so the page isn't 'complete the moment it's installed'.

## Judge list

- Met: Template JSON is valid and every block type it names exists in the section
  Template uses only "reason" and "question" blocks; both are defined in the schema's "blocks" array. JSON parses cleanly.
- Met: No price, policy or review score typed into the code
  "{{ fr_product.price | money }}", "{{ shop.refund_policy.url }}"; risk line is an empty setting with info "Must match your refund policy."
- Met: No rating, review count or badge has a default value
  No rating/count/badge settings exist; "No review blocks or ratings are included."
- Met: Every button leads to a real product, cart or page
  Hero/final buttons go to button_link or "#fr-offer-{{ section.id }}"; offer button is the add-to-cart form submit for the picked product.
- Met: Styles scoped to the section and every image has alt text
  "#shopify-section-{{ section.id }} .fr {" and ".fr"-prefixed rules; every image_tag passes "alt: hero_alt" etc. with alt settings.
- Met: Tells you what it couldn't test
  "Untested: Theme Check was not run on these files... Cart and payment need a test order inside the store."

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
  assign fr_variant = fr_product.selected_or_first_available_variant
  assign review_blocks = section.blocks | where: 'type', 'review'
  assign reason_blocks = section.blocks | where: 'type', 'reason'
  assign row_blocks = section.blocks | where: 'type', 'offer_row'
  assign question_blocks = section.blocks | where: 'type', 'question'
  assign app_blocks = section.blocks | where: 'type', '@app'
  assign offer_anchor = 'fr-offer-' | append: section.id
  if section.settings.button_link != blank
    assign cta_href = section.settings.button_link
  else
    assign cta_href = '#' | append: offer_anchor
  endif
-%}

{% style %}
  #shopify-section-{{ section.id }} .fr {
    --fr-bg: {{ section.settings.color_bg }};
    --fr-text: {{ section.settings.color_text }};
    --fr-accent: {{ section.settings.color_accent }};
    --fr-btn-text: {{ section.settings.color_button_text }};
  }
{% endstyle %}

<div class="fr">
  <div class="fr-inner">

    <header class="fr-hero">
      {%- if section.settings.hero_image != blank -%}
        {%- assign hero_alt = section.settings.hero_alt | default: section.settings.hero_image.alt -%}
        {{
          section.settings.hero_image
          | image_url: width: 1600
          | image_tag:
            widths: '400, 600, 800, 1000, 1200, 1600',
            sizes: '(min-width: 800px) 736px, calc(100vw - 2rem)',
            loading: 'eager',
            fetchpriority: 'high',
            alt: hero_alt,
            class: 'fr-img'
        }}
      {%- endif -%}
      {%- if section.settings.heading != blank -%}
        <h1>{{ section.settings.heading }}</h1>
      {%- endif -%}
      {%- if section.settings.subheading != blank -%}
        <p class="fr-sub">{{ section.settings.subheading }}</p>
      {%- endif -%}
      {%- if section.settings.button_label != blank -%}
        <a class="fr-btn" href="{{ cta_href }}">{{ section.settings.button_label }}</a>
      {%- endif -%}
    </header>

    {%- if reason_blocks.size > 0 -%}
      <ol class="fr-reasons">
        {%- for block in reason_blocks -%}
          <li class="fr-reason" {{ block.shopify_attributes }}>
            {%- if block.settings.image != blank -%}
              {%- assign reason_alt = block.settings.image_alt | default: block.settings.image.alt -%}
              {{
                block.settings.image
                | image_url: width: 1200
                | image_tag:
                  widths: '400, 600, 800, 1000, 1200',
                  sizes: '(min-width: 800px) 736px, calc(100vw - 2rem)',
                  loading: 'lazy',
                  alt: reason_alt,
                  class: 'fr-img'
              }}
            {%- endif -%}
            {%- if block.settings.heading != blank -%}
              <h2>{{ block.settings.heading }}</h2>
            {%- endif -%}
            {%- if block.settings.body != blank -%}
              <div class="fr-body">{{ block.settings.body }}</div>
            {%- endif -%}
            {%- if block.settings.quote != blank -%}
              <blockquote>
                <p>{{ block.settings.quote }}</p>
                {%- if block.settings.quote_name != blank -%}
                  <cite>{{ block.settings.quote_name }}</cite>
                {%- endif -%}
              </blockquote>
            {%- endif -%}
          </li>
        {%- endfor -%}
      </ol>
    {%- endif -%}

    {%- if review_blocks.size > 0 -%}
      <section class="fr-reviews">
        {%- if section.settings.reviews_heading != blank -%}
          <h2>{{ section.settings.reviews_heading }}</h2>
        {%- endif -%}
        {%- for block in review_blocks -%}
          <blockquote {{ block.shopify_attributes }}>
            <p>{{ block.settings.quote }}</p>
            {%- if block.settings.name != blank -%}
              <cite>{{ block.settings.name }}</cite>
            {%- endif -%}
          </blockquote>
        {%- endfor -%}
      </section>
    {%- endif -%}

    <section id="{{ offer_anchor }}" class="fr-offer">
      {%- if section.settings.offer_heading != blank -%}
        <h2>{{ section.settings.offer_heading }}</h2>
      {%- endif -%}
      {%- if section.settings.offer_image != blank -%}
        {%- assign offer_alt = section.settings.offer_image_alt | default: section.settings.offer_image.alt -%}
        {{
          section.settings.offer_image
          | image_url: width: 1200
          | image_tag:
            widths: '400, 600, 800, 1000, 1200',
            sizes: '(min-width: 800px) 700px, calc(100vw - 4rem)',
            loading: 'lazy',
            alt: offer_alt,
            class: 'fr-img'
        }}
      {%- endif -%}

      {%- if fr_product != blank -%}
        <p class="fr-price">
          {%- if fr_product.compare_at_price > fr_product.price -%}
            <s>{{ fr_product.compare_at_price | money }}</s>
          {%- endif -%}
          {%- if fr_product.price_varies and section.settings.price_from_label != blank -%}
            {{ section.settings.price_from_label }}
          {% endif -%}
          <span>{{ fr_product.price | money }}</span>
        </p>
      {%- endif -%}

      {%- if row_blocks.size > 0 -%}
        <ul class="fr-rows">
          {%- for block in row_blocks -%}
            <li {{ block.shopify_attributes }}>{{ block.settings.text }}</li>
          {%- endfor -%}
        </ul>
      {%- endif -%}

      {%- if section.settings.button_link != blank -%}
        <a class="fr-btn" href="{{ section.settings.button_link }}">{{ section.settings.button_label }}</a>
      {%- elsif fr_product != blank -%}
        {%- form 'product', fr_product, class: 'fr-form' -%}
          {%- if fr_product.has_only_default_variant -%}
            <input type="hidden" name="id" value="{{ fr_variant.id }}">
          {%- else -%}
            <label for="fr-variant-{{ section.id }}">{{ fr_product.options | join: ' / ' }}</label>
            <select id="fr-variant-{{ section.id }}" name="id">
              {%- for variant in fr_product.variants -%}
                <option
                  value="{{ variant.id }}"
                  {% if variant.id == fr_variant.id %}selected{% endif %}
                  {% unless variant.available %}disabled{% endunless %}
                >
                  {{ variant.title }} – {{ variant.price | money }}
                  {%- unless variant.available %} ({{ section.settings.sold_out_label }}){% endunless %}
                </option>
              {%- endfor -%}
            </select>
          {%- endif -%}
          <input type="hidden" name="quantity" value="1">
          <button type="submit" name="add" class="fr-btn" {% unless fr_variant.available %}disabled{% endunless %}>
            {%- if fr_variant.available -%}
              {{ section.settings.button_label }}
            {%- else -%}
              {{ section.settings.sold_out_label }}
            {%- endif -%}
          </button>
        {%- endform -%}
      {%- elsif request.design_mode -%}
        <p>Choose a product in this section's settings to show the price and button.</p>
      {%- endif -%}

      {%- for block in app_blocks -%}
        {% render block %}
      {%- endfor -%}

      {%- if section.settings.risk_line != blank -%}
        <p class="fr-risk">{{ section.settings.risk_line }}</p>
      {%- endif -%}

      {%- if section.settings.show_policy_links -%}
        <p class="fr-policies">
          {%- if shop.refund_policy != blank -%}
            <a href="{{ shop.refund_policy.url }}">{{ shop.refund_policy.title }}</a>
          {%- endif -%}
          {%- if shop.shipping_policy != blank -%}
            <a href="{{ shop.shipping_policy.url }}">{{ shop.shipping_policy.title }}</a>
          {%- endif -%}
        </p>
      {%- endif -%}
    </section>

    {%- if question_blocks.size > 0 -%}
      <section class="fr-faq">
        {%- if section.settings.faq_heading != blank -%}
          <h2>{{ section.settings.faq_heading }}</h2>
        {%- endif -%}
        {%- for block in question_blocks -%}
          <details {{ block.shopify_attributes }}>
            <summary>{{ block.settings.question }}</summary>
            <div class="fr-body">{{ block.settings.answer }}</div>
          </details>
        {%- endfor -%}
      </section>
    {%- endif -%}

    {%- if section.settings.button_label != blank -%}
      <div class="fr-final">
        {%- if section.settings.final_heading != blank -%}
          <h2>{{ section.settings.final_heading }}</h2>
        {%- endif -%}
        <a class="fr-btn" href="{{ cta_href }}">{{ section.settings.button_label }}</a>
      </div>
    {%- endif -%}

  </div>
</div>

{% stylesheet %}
  .fr { background: var(--fr-bg); color: var(--fr-text); padding: 2rem 1rem; }
  .fr-inner { max-width: 46rem; margin: 0 auto; }
  .fr-img { display: block; width: 100%; height: auto; border-radius: 0.5rem; }
  .fr h1 { font-size: 1.9rem; line-height: 1.2; margin: 1rem 0 0.5rem; }
  .fr h2 { font-size: 1.4rem; line-height: 1.25; margin: 1rem 0 0.5rem; }
  .fr-sub { font-size: 1.1rem; margin: 0 0 1.25rem; }
  .fr-btn { display: block; width: 100%; box-sizing: border-box; text-align: center; padding: 1rem 1.25rem; background: var(--fr-accent); color: var(--fr-btn-text); border: 0; border-radius: 0.5rem; font-size: 1.1rem; font-weight: 700; text-decoration: none; cursor: pointer; }
  .fr-btn[disabled] { opacity: 0.5; cursor: not-allowed; }
  .fr-reasons { list-style: none; padding: 0; margin: 2.5rem 0; counter-reset: fr-reason; }
  .fr-reason { counter-increment: fr-reason; margin: 0 0 2.5rem; }
  .fr-reason h2::before { content: counter(fr-reason) ". "; color: var(--fr-accent); }
  .fr blockquote { margin: 1rem 0; padding: 0.75rem 1rem; border-left: 4px solid var(--fr-accent); }
  .fr blockquote p { margin: 0 0 0.5rem; font-style: italic; }
  .fr cite { font-style: normal; font-weight: 700; }
  .fr-offer { border: 2px solid var(--fr-accent); border-radius: 0.75rem; padding: 1.25rem; margin: 2.5rem 0; }
  .fr-price { font-size: 1.5rem; font-weight: 700; margin: 1rem 0; }
  .fr-price s { opacity: 0.6; font-weight: 400; margin-right: 0.5rem; }
  .fr-rows { padding-left: 1.25rem; margin: 0 0 1.25rem; }
  .fr-form label { display: block; font-weight: 700; }
  .fr-form select { width: 100%; padding: 0.75rem; margin: 0.25rem 0 1rem; font-size: 1rem; }
  .fr-risk { margin: 1rem 0 0.5rem; font-weight: 700; }
  .fr-policies a { margin-right: 1rem; color: inherit; }
  .fr-faq details { border-bottom: 1px solid currentColor; padding: 1rem 0; }
  .fr-faq summary { font-weight: 700; cursor: pointer; }
  .fr-final { text-align: center; margin: 2.5rem 0 0; }
  @media (min-width: 750px) {
    .fr { padding: 3rem 2rem; }
    .fr h1 { font-size: 2.6rem; }
    .fr-btn { display: inline-block; width: auto; min-width: 18rem; }
  }
{% endstylesheet %}

{% schema %}
{
  "name": "Five reasons page",
  "tag": "section",
  "class": "fr-section",
  "max_blocks": 50,
  "enabled_on": { "templates": ["page"] },
  "settings": [
    { "type": "product", "id": "product", "label": "Product sold on this page" },
    { "type": "header", "content": "Top of page" },
    { "type": "image_picker", "id": "hero_image", "label": "Top image" },
    { "type": "text", "id": "hero_alt", "label": "Top image alt text" },
    { "type": "text", "id": "heading", "label": "Headline" },
    { "type": "textarea", "id": "subheading", "label": "Line under the headline" },
    { "type": "header", "content": "Reviews" },
    { "type": "text", "id": "reviews_heading", "label": "Reviews heading" },
    { "type": "header", "content": "Offer" },
    { "type": "text", "id": "offer_heading", "label": "Offer heading" },
    { "type": "image_picker", "id": "offer_image", "label": "Offer image" },
    { "type": "text", "id": "offer_image_alt", "label": "Offer image alt text" },
    { "type": "text", "id": "button_label", "label": "Button text", "default": "Start my first box" },
    { "type": "url", "id": "button_link", "label": "Button link (optional)", "info": "Leave empty to add to cart from this page. Fill in (e.g. the product page) to send every button there instead." },
    { "type": "text", "id": "price_from_label", "label": "Word before price when variants differ", "default": "From" },
    { "type": "text", "id": "sold_out_label", "label": "Sold out text", "default": "Sold out" },
    { "type": "text", "id": "risk_line", "label": "Risk line", "info": "Must match your refund policy." },
    { "type": "checkbox", "id": "show_policy_links", "label": "Show refund and shipping policy links", "default": true },
    { "type": "header", "content": "Questions and closing" },
    { "type": "text", "id": "faq_heading", "label": "Questions heading" },
    { "type": "text", "id": "final_heading", "label": "Closing heading" },
    { "type": "header", "content": "Colours" },
    { "type": "color", "id": "color_bg", "label": "Background", "default": "#ffffff" },
    { "type": "color", "id": "color_text", "label": "Text", "default": "#1a1a1a" },
    { "type": "color", "id": "color_accent", "label": "Button and accent", "default": "#2e7d32" },
    { "type": "color", "id": "color_button_text", "label": "Button text", "default": "#ffffff" }
  ],
  "blocks": [
    {
      "type": "reason",
      "name": "Reason",
      "settings": [
        { "type": "image_picker", "id": "image", "label": "Image" },
        { "type": "text", "id": "image_alt", "label": "Image alt text" },
        { "type": "text", "id": "heading", "label": "Reason heading" },
        { "type": "richtext", "id": "body", "label": "Reason text" },
        { "type": "textarea", "id": "quote", "label": "Quote", "info": "Real words only, copied exactly." },
        { "type": "text", "id": "quote_name", "label": "Who said it" }
      ]
    },
    {
      "type": "review",
      "name": "Review",
      "settings": [
        { "type": "textarea", "id": "quote", "label": "Review text", "info": "Paste a real review word for word." },
        { "type": "text", "id": "name", "label": "Reviewer name" }
      ]
    },
    {
      "type": "offer_row",
      "name": "Offer row",
      "settings": [
        { "type": "text", "id": "text", "label": "Row text" }
      ]
    },
    {
      "type": "question",
      "name": "Question",
      "settings": [
        { "type": "text", "id": "question", "label": "Question" },
        { "type": "richtext", "id": "answer", "label": "Answer" }
      ]
    },
    { "type": "@app" }
  ],
  "presets": [
    { "name": "Five reasons page" }
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
        "button_label": "Start my first box"
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

### Image list

| Slot | What it must show | Suggested size |
|---|---|---|
| Top image (section setting) | The Sprout box, in use or opened. This is the first thing seen on a phone. It loads eagerly. | 1600 × 1000 px |
| Reason 1–5 image (one per reason block) | A photo that proves that reason, such as the contents or the product in use | 1200 × 900 px each |
| Offer image (section setting) | Exactly what arrives in the first box | 1200 × 1200 px |

Every slot needs alt text that describes the photo. Type it into the alt text setting next to each image, or set it on the file in Shopify.

### Install steps

1. In Online Store → Themes → … → Edit code, add `sections/five-reasons.liquid` and `templates/page.five-reasons.json` with the contents above.
2. In Online Store → Pages, create a page and set its URL handle to `five-reasons`.
3. Under Theme template on that page, choose `five-reasons` and save.
4. Open the page in Customize and check that the "Product sold on this page" setting shows Sprout. If it doesn't, pick Sprout.
5. Upload the top, reason and offer images in the section and its blocks, then paste the copy into each field.
6. Preview on a phone and tap every button, then place a test order.

### MISSING list

- MISSING: the copy text itself. Only an outline was supplied, so these fields are empty: headline, line under it, 5 reason headings, texts, quotes and quote names, offer heading, offer rows (none added; add "Offer row" blocks), risk line, 7 questions and answers, and the closing heading. Only the button text "Start my first box" is loaded.
- MISSING: theme name. The template needs an Online Store 2.0 theme (one that supports JSON templates). Theme blocks are not used, so theme-block support doesn't matter.
- MISSING: subscription app. This build is one-time purchase only. "Start my first box" suggests a subscription, so once you know the app, add its app block in the offer area. The section accepts `@app` blocks, but many subscription apps only offer their block on product templates. If yours does, fill in "Button link" with the Sprout product page so every button goes there.
- MISSING: reviews app and real reviews. No review blocks or ratings are included. Add "Review" blocks with real reviews copied word for word, or the reviews app's block.
- MISSING: alt text for every image.
- MISSING: size guide and "what's in the box" facts. The store holds none, so no slot was built. Use offer rows for box contents.
- Not article-style: this is a reasons-to-buy page, so no "Advertisement" label was added. If it will run as an advertorial, the label must be added in the markup.
- Untested: Theme Check was not run on these files. The handle `sprout` was taken from the URL, so confirm it in the admin. Cart and payment need a test order inside the store.
```
