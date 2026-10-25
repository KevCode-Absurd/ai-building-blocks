# Two design modes

Editorial: narrow readable story column, high-contrast headline, numbered reasons, alternating image positions on wide screens, proof next to the related claim, restrained offer block and FAQ. Mobile follows text/image in the intended reading order.

Direct-response: product/benefit hero, quick-scanning reason cards, clear bundle/value comparison, repeatable single CTA, delivery/returns conditions near the offer and a quiet close. More furniture is not more proof.

Palette: primary, deep, tint and lighter tint are deliberate tokens with contrast checked. Do not force one fixed saturated colour into every brand. Headline alternatives: switch, occasion/gift, discovery, better alternative; each must follow actual facts and promise the page can keep.

Shopify: one namespaced section plus template JSON using target theme conventions. Scope CSS under #shopify-section-{{ section.id }}. Use schema settings for copy/images, actual product/variant fields for cart actions, image dimensions and responsive srcsets, and high fetch priority only for the real hero. Sticky action can use IntersectionObserver with a usable non-JS fallback. Validate schema/JSON/Liquid and test preview/theme editor before claiming working cart integration.
