# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

The files are installable, read price and policies from the store, and leave every unknown copy slot empty with a visible MISSING marker instead of guessing. The owner still has to paste the actual page copy and confirm the subscription app, but nothing false or risky can go live from this.

## Judge list

- Met: The template's JSON is valid and every block type it names exists in the section.
  Template uses only "reason" and "question" blocks; both defined in schema "blocks"; JSON parses, "order": ["main"] present.
- Met: No price, policy or review score is typed into the code.
  Price via `{{ fr_variant.price | money }}`; policies via `shop.refund_policy.url`; no review score anywhere.
- Met: No rating, review count or badge has a default value.
  No rating, count or badge settings exist; "No ratings, counts or badges are on the page."
- Met: Every button leads to a real product, cart or page.
  Hero button `href="#{{ fr_offer_id }}"` jumps to the offer; submit button sits inside `{%- form 'product', fr_product -%}`.
- Met: Styles are scoped to the section, and every image has alt text.
  `#shopify-section-{{ section.id }} .fr` in style tag, `.fr-` prefixed classes; every image_tag sets `alt:` with a fallback.
- Met: It tells you what it couldn't test (cart and payment need a real test order).
  "Theme Check was not run... Cart and payment are untested. Place a test order in the store."

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
## 1. Files

### `sections/five-reasons.liquid`

```liquid
{%- liquid
  assign fr_product = section.settings.product
  if fr_product != blank
    assign fr_variant = fr_product.selected_or_first_available_variant
  endif
  assign fr_offer_id = 'fr-offer-' | append: section.id
  assign reason_n = 0
-%}

{% style %}
  #shopify-section-{{ section.id }} .fr {
    --fr-bg: {{ section.settings.color_background }};
    --fr-text: {{ section.settings.color_text }};
    --fr-accent: {{ section.settings.color_accent }};
    --fr-button-text: {{ section.settings.color_button_text }};
  }
{% endstyle %}

<div class="fr">
  <div class="fr-inner">

    {%- comment -%} HERO {%- endcomment -%}
    <section class="fr-hero">
      {%- if section.settings.hero_image != blank -%}
        {%- assign hero_alt = section.settings.hero_image.alt | default: section.settings.headline -%}
        {{
          section.settings.hero_image
          | image_url: width: 1500
          | image_tag:
            widths: '375, 550, 750, 1100, 1500',
            sizes: '100vw',
            loading: 'eager',
            fetchpriority: 'high',
            alt: hero_alt,
            class: 'fr-hero__img'
        }}
      {%- elsif request.design_mode -%}
        <p class="fr-missing">MISSING: hero image</p>
      {%- endif -%}

      {%- if section.settings.headline != blank -%}
        <h1>{{ section.settings.headline | escape }}</h1>
      {%- elsif request.design_mode -%}
        <p class="fr-missing">MISSING: headline</p>
      {%- endif -%}

      {%- if section.settings.subheadline != blank -%}
        <p class="fr-sub">{{ section.settings.subheadline | escape }}</p>
      {%- elsif request.design_mode -%}
        <p class="fr-missing">MISSING: line under the headline</p>
      {%- endif -%}

      {%- if fr_product != blank and section.settings.button_label != blank -%}
        <a class="fr-button" href="#{{ fr_offer_id }}">{{ section.settings.button_label | escape }}</a>
      {%- endif -%}
    </section>

    {%- comment -%} REASONS {%- endcomment -%}
    <section class="fr-reasons">
      {%- if section.settings.reasons_heading != blank -%}
        <h2>{{ section.settings.reasons_heading | escape }}</h2>
      {%- endif -%}

      {%- for block in section.blocks -%}
        {%- if block.type == 'reason' -%}
          {%- assign reason_n = reason_n | plus: 1 -%}
          <article class="fr-reason" {{ block.shopify_attributes }}>
            {%- if block.settings.image != blank -%}
              {%- assign reason_alt = block.settings.image.alt | default: block.settings.heading -%}
              {{
                block.settings.image
                | image_url: width: 1100
                | image_tag:
                  widths: '375, 550, 750, 1100',
                  sizes: '(min-width: 750px) 50vw, 100vw',
                  loading: 'lazy',
                  alt: reason_alt,
                  class: 'fr-reason__img'
              }}
            {%- endif -%}
            <div class="fr-reason__text">
              <p class="fr-reason__num">{{ reason_n }}</p>
              {%- if block.settings.heading != blank -%}
                <h3>{{ block.settings.heading | escape }}</h3>
              {%- elsif request.design_mode -%}
                <p class="fr-missing">MISSING: reason {{ reason_n }} heading</p>
              {%- endif -%}

              {%- if block.settings.body != blank -%}
                <div class="fr-rte">{{ block.settings.body }}</div>
              {%- elsif request.design_mode -%}
                <p class="fr-missing">MISSING: reason {{ reason_n }} text</p>
              {%- endif -%}

              {%- if block.settings.quote != blank -%}
                <blockquote class="fr-quote">
                  <p>{{ block.settings.quote | escape }}</p>
                  {%- if block.settings.quote_name != blank -%}
                    <cite>{{ block.settings.quote_name | escape }}</cite>
                  {%- endif -%}
                </blockquote>
              {%- elsif request.design_mode -%}
                <p class="fr-missing">MISSING: reason {{ reason_n }} customer quote (word for word) and name</p>
              {%- endif -%}
            </div>
          </article>
        {%- endif -%}
      {%- endfor -%}
    </section>

    {%- comment -%} OFFER {%- endcomment -%}
    <section class="fr-offer" id="{{ fr_offer_id }}">
      <div class="fr-offer__media">
        {%- liquid
          if section.settings.offer_image != blank
            assign offer_img = section.settings.offer_image
          elsif fr_product != blank and fr_product.featured_image != blank
            assign offer_img = fr_product.featured_image
          endif
        -%}
        {%- if offer_img != blank -%}
          {%- assign offer_alt = offer_img.alt | default: fr_product.title -%}
          {{
            offer_img
            | image_url: width: 1100
            | image_tag:
              widths: '375, 550, 750, 1100',
              sizes: '(min-width: 750px) 50vw, 100vw',
              loading: 'lazy',
              alt: offer_alt,
              class: 'fr-offer__img'
          }}
        {%- endif -%}
      </div>

      <div class="fr-offer__body">
        {%- if section.settings.offer_heading != blank -%}
          <h2>{{ section.settings.offer_heading | escape }}</h2>
        {%- elsif request.design_mode -%}
          <p class="fr-missing">MISSING: offer heading</p>
        {%- endif -%}

        {%- if section.settings.offer_body != blank -%}
          <div class="fr-rte">{{ section.settings.offer_body }}</div>
        {%- elsif request.design_mode -%}
          <p class="fr-missing">MISSING: offer rows</p>
        {%- endif -%}

        {%- if fr_product != blank -%}
          <p class="fr-price">
            {%- if fr_variant.compare_at_price > fr_variant.price -%}
              <s>{{ fr_variant.compare_at_price | money }}</s>
            {%- endif -%}
            <span>{{ fr_variant.price | money }}</span>
          </p>

          {%- form 'product', fr_product, class: 'fr-form' -%}
            {%- if fr_product.has_only_default_variant -%}
              <input type="hidden" name="id" value="{{ fr_variant.id }}">
            {%- else -%}
              <label for="fr-variant-{{ section.id }}">{{ fr_product.options | join: ' / ' | escape }}</label>
              <select id="fr-variant-{{ section.id }}" name="id">
                {%- for v in fr_product.variants -%}
                  <option
                    value="{{ v.id }}"
                    {% if v.id == fr_variant.id %}selected{% endif %}
                    {% unless v.available %}disabled{% endunless %}
                  >
                    {{- v.title | escape }} – {{ v.price | money -}}
                  </option>
                {%- endfor -%}
              </select>
              {%- if section.settings.size_guide_url != blank -%}
                <a class="fr-sizeguide" href="{{ section.settings.size_guide_url }}">{{ section.settings.size_guide_label | escape }}</a>
              {%- endif -%}
            {%- endif -%}

            <input type="hidden" name="quantity" value="1">
            <button type="submit" class="fr-button" {% unless fr_product.available %}disabled{% endunless %}>
              {%- if fr_product.available -%}
                {{ section.settings.button_label | escape }}
              {%- else -%}
                {{ section.settings.sold_out_label | escape }}
              {%- endif -%}
            </button>
          {%- endform -%}
        {%- elsif request.design_mode -%}
          <p class="fr-missing">MISSING: pick the product in this section's settings</p>
        {%- endif -%}

        {%- for block in section.blocks -%}
          {%- if block.type == '@app' -%}
            {% render block %}
          {%- endif -%}
        {%- endfor -%}

        {%- if section.settings.risk_line != blank -%}
          <p class="fr-risk">{{ section.settings.risk_line | escape }}</p>
        {%- elsif request.design_mode -%}
          <p class="fr-missing">MISSING: risk line</p>
        {%- endif -%}

        {%- if shop.refund_policy != blank or shop.shipping_policy != blank -%}
          <ul class="fr-policies">
            {%- if shop.refund_policy != blank -%}
              <li><a href="{{ shop.refund_policy.url }}">{{ shop.refund_policy.title | escape }}</a></li>
            {%- endif -%}
            {%- if shop.shipping_policy != blank -%}
              <li><a href="{{ shop.shipping_policy.url }}">{{ shop.shipping_policy.title | escape }}</a></li>
            {%- endif -%}
          </ul>
        {%- endif -%}
      </div>
    </section>

    {%- comment -%} QUESTIONS {%- endcomment -%}
    <section class="fr-faq">
      {%- if section.settings.faq_heading != blank -%}
        <h2>{{ section.settings.faq_heading | escape }}</h2>
      {%- elsif request.design_mode -%}
        <p class="fr-missing">MISSING: questions heading</p>
      {%- endif -%}

      {%- for block in section.blocks -%}
        {%- if block.type == 'question' -%}
          {%- if block.settings.question != blank -%}
            <details {{ block.shopify_attributes }}>
              <summary>{{ block.settings.question | escape }}</summary>
              <div class="fr-rte">{{ block.settings.answer }}</div>
            </details>
          {%- elsif request.design_mode -%}
            <p class="fr-missing" {{ block.shopify_attributes }}>MISSING: question and answer</p>
          {%- endif -%}
        {%- endif -%}
      {%- endfor -%}
    </section>

  </div>
</div>

{% stylesheet %}
  .fr { background: var(--fr-bg); color: var(--fr-text); padding: 0 1rem; }
  .fr-inner { max-width: 1100px; margin: 0 auto; }
  .fr-hero { padding: 2rem 0; text-align: center; }
  .fr-hero__img, .fr-reason__img, .fr-offer__img { display: block; width: 100%; height: auto; border-radius: 6px; }
  .fr h1 { font-size: 2rem; line-height: 1.15; margin: 1rem 0 .5rem; }
  .fr-sub { font-size: 1.1rem; margin: 0 0 1.25rem; }
  .fr-button { display: inline-block; width: 100%; background: var(--fr-accent); color: var(--fr-button-text); padding: .9rem 1.6rem; border: 0; border-radius: 4px; font-size: 1.05rem; text-align: center; text-decoration: none; cursor: pointer; }
  .fr-button[disabled] { opacity: .5; cursor: not-allowed; }
  .fr-reasons { padding: 2rem 0; }
  .fr-reason { display: grid; gap: 1rem; padding: 1.5rem 0; border-top: 1px solid rgba(0,0,0,.1); }
  .fr-reason__num { font-weight: 700; color: var(--fr-accent); margin: 0; }
  .fr-quote { margin: 1rem 0 0; padding-left: 1rem; border-left: 3px solid var(--fr-accent); font-style: italic; }
  .fr-quote cite { display: block; margin-top: .25rem; font-size: .9rem; font-style: normal; }
  .fr-offer { display: grid; gap: 1.5rem; padding: 2rem 0; }
  .fr-price { font-size: 1.5rem; font-weight: 700; }
  .fr-price s { margin-right: .5rem; font-weight: 400; opacity: .6; }
  .fr-form { display: grid; gap: .75rem; }
  .fr-form select { padding: .7rem; font-size: 1rem; }
  .fr-risk { font-size: .95rem; }
  .fr-policies { display: flex; flex-wrap: wrap; gap: 1rem; padding: 0; list-style: none; font-size: .9rem; }
  .fr-policies a, .fr-sizeguide { color: inherit; }
  .fr-faq { padding: 2rem 0 3rem; }
  .fr-faq details { padding: 1rem 0; border-top: 1px solid rgba(0,0,0,.1); }
  .fr-faq summary { font-weight: 600; cursor: pointer; }
  .fr-missing { background: #fff3cd; color: #5c4400; padding: .5rem; font-size: .85rem; }
  @media (min-width: 750px) {
    .fr h1 { font-size: 3rem; }
    .fr-button { width: auto; }
    .fr-reason { grid-template-columns: 1fr 1fr; align-items: center; }
    .fr-offer { grid-template-columns: 1fr 1fr; align-items: start; }
  }
{% endstylesheet %}

{% schema %}
{
  "name": "Five reasons page",
  "tag": "div",
  "class": "fr-section",
  "max_blocks": 50,
  "settings": [
    { "type": "header", "content": "Product" },
    { "type": "product", "id": "product", "label": "Product sold on this page" },
    { "type": "header", "content": "Top of page" },
    { "type": "image_picker", "id": "hero_image", "label": "Top image" },
    { "type": "text", "id": "headline", "label": "Headline" },
    { "type": "textarea", "id": "subheadline", "label": "Line under the headline" },
    { "type": "text", "id": "button_label", "label": "Button label", "default": "Start my first box" },
    { "type": "header", "content": "Reasons" },
    { "type": "text", "id": "reasons_heading", "label": "Reasons heading (optional)" },
    { "type": "header", "content": "Offer" },
    { "type": "image_picker", "id": "offer_image", "label": "Offer image (uses product image if empty)" },
    { "type": "text", "id": "offer_heading", "label": "Offer heading" },
    { "type": "richtext", "id": "offer_body", "label": "Offer rows" },
    { "type": "text", "id": "risk_line", "label": "Risk line" },
    { "type": "url", "id": "size_guide_url", "label": "Size guide link (only shown if the product has options)" },
    { "type": "text", "id": "size_guide_label", "label": "Size guide link text", "default": "Size guide" },
    { "type": "text", "id": "sold_out_label", "label": "Sold out button text", "default": "Sold out" },
    { "type": "header", "content": "Questions" },
    { "type": "text", "id": "faq_heading", "label": "Questions heading" },
    { "type": "header", "content": "Colours" },
    { "type": "color", "id": "color_background", "label": "Background", "default": "#ffffff" },
    { "type": "color", "id": "color_text", "label": "Text", "default": "#1f1f1f" },
    { "type": "color", "id": "color_accent", "label": "Button and accent", "default": "#1f1f1f" },
    { "type": "color", "id": "color_button_text", "label": "Button text", "default": "#ffffff" }
  ],
  "blocks": [
    {
      "type": "reason",
      "name": "Reason",
      "settings": [
        { "type": "image_picker", "id": "image", "label": "Image" },
        { "type": "text", "id": "heading", "label": "Heading" },
        { "type": "richtext", "id": "body", "label": "Text" },
        { "type": "textarea", "id": "quote", "label": "Customer quote (word for word)" },
        { "type": "text", "id": "quote_name", "label": "Who said it" }
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
        "reason_1", "reason_2", "reason_3", "reason_4", "reason_5",
        "question_1", "question_2", "question_3", "question_4", "question_5", "question_6", "question_7"
      ]
    }
  },
  "order": ["main"]
}
```

There are no snippets and no locale entries. The schema labels are plain text.

## 2. Image list

| Slot | What it must show | Suggested size |
|---|---|---|
| Top image (`hero_image`) | The Sprout box, or the main result the headline promises | 1500 × 1000 px |
| Reason 1–5 image (each reason block, optional) | A picture that backs that reason (product in use, contents, the result) | 1100 × 825 px |
| Offer image (`offer_image`, optional) | What arrives in the first box. If left empty, the product's main image is used | 1100 × 1100 px |

Give every image alt text in Content › Files. If an image has no alt text, the page uses the headline, the reason heading or the product title instead.

## 3. Install steps

1. Online Store › Themes › duplicate your live theme › Edit code. Add `sections/five-reasons.liquid` and `templates/page.five-reasons.json` with the contents above.
2. Online Store › Pages › Add page, title it so the handle is `five-reasons`, and save.
3. On that page, set Theme template to `five-reasons` and save.
4. Customize › open the page › in the "Five reasons page" section, check that the product shows "Sprout" (pick it again if it's empty).
5. Upload the images to their slots and fill in every yellow MISSING box with your copy.
6. Preview on a phone, place a test order, then publish the theme.

## 4. MISSING list

- MISSING: all page copy except the button label. That covers the headline, the line under it, the five reason headings and texts, the five customer quotes (word for word) with names, the offer heading and rows, the risk line, the questions heading and all seven questions with their answers. None of it was pasted, so every one of these settings is empty. Paste the copy and I'll load it into the template JSON.
- MISSING: theme name. The files use section blocks, not theme blocks, so they work on any Online Store 2.0 theme. They won't work on an older theme without JSON templates.
- MISSING: subscription app. "Start my first box" suggests a subscription, but this page is built for one-time purchase only. Once you know the app, add its app block to the section (the section accepts `@app` blocks) instead of rebuilding the subscription widget.
- MISSING: reviews app. No ratings, counts or badges are on the page. A reviews app block can be added to the section.
- MISSING: brand colours and fonts. The colour settings use neutral defaults.
- MISSING: size guide link. It only appears if Sprout has options, and it stays hidden until you add it.
- MISSING: whether refund and shipping policies are set in Settings › Policies. Their links only appear if they exist.
- MISSING: alt text on uploaded images.

## 5. CHECKS MISSED

- Theme Check was not run because there was no Shopify CLI or AI Toolkit access here. Run `shopify theme check` before you publish.
- Cart and payment are untested. Place a test order in the store.
- Subscription purchase is not built because the app is unknown. The page sells Sprout as a one-time purchase only.
- The crossed-out price shows for the first available variant only. The dropdown lists each variant's own price, but it doesn't show compare-at prices.
- "Real alt" depends on the alt text you enter in Files, so I couldn't verify it.

Want to check the page before it goes live with the [Meta ads compliance checker](https://useaiblocks.com/skills/meta-ads-compliance-checker), run the [Landing page 30-point checker](https://useaiblocks.com/prompts/landing-page-30-point-checker), or write ads from it with the [Article-style image ad writer](https://useaiblocks.com/skills/article-style-image-ad-writer) or the [Article headline image ad maker](https://useaiblocks.com/skills/article-headline-image-ad-maker)? Or type your own next step.
```
