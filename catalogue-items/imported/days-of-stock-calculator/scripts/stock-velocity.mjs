// Added by AI Blocks to calculate location-level cover from collected Shopify records.
import { nodes, timestamp, windowOf, integer, round, runCli } from './report-common.mjs';

export function stockVelocity(input) {
  if (!Array.isArray(input.variants) || !Array.isArray(input.orders)) throw Error('Provide variants and orders arrays.');
  const window = windowOf(input), threshold = integer(input.dos_alert_threshold, 14);
  const variants = new Map(), rows = new Map(), unlocated = new Set(), seenOrders = new Set(), seenFulfillments = new Set();
  const diagnostics = { missing_location_units: 0, missing_variant_units: 0, incomplete_connections: 0, excluded_fulfillments: 0, untracked_variants: 0 };
  let complete = input.complete === true;
  const connection = value => {
    if ((!Array.isArray(value) && !Array.isArray(value?.nodes) && !Array.isArray(value?.edges)) || value?.pageInfo?.hasNextPage) {
      complete = false; diagnostics.incomplete_connections++;
    }
    return nodes(value);
  };
  const rowFor = (variant, location) => {
    const key = JSON.stringify([variant.id, location.id]);
    if (!rows.has(key)) rows.set(key, { variant_id: variant.id, sku: variant.sku ?? '', product_title: variant.product?.title ?? '', vendor: variant.product?.vendor ?? '', location_id: location.id, location_name: location.name ?? '', available_stock: null, fulfilled_units: 0 });
    return rows.get(key);
  };
  for (const variant of input.variants) {
    if (!variant.id || variants.has(variant.id)) throw Error('Variant IDs must be present and unique.');
    if (input.vendor_filter && (variant.product?.vendor ?? '').toLowerCase() !== input.vendor_filter.toLowerCase()) continue;
    if (variant.inventoryItem?.tracked === false) { diagnostics.untracked_variants++; continue; }
    if (variant.inventoryItem?.tracked !== true) complete = false;
    variants.set(variant.id, variant);
    const seenLocations = new Set();
    for (const level of connection(variant.inventoryItem?.inventoryLevels)) {
      if (!level.location?.id || seenLocations.has(level.location.id)) throw Error('Inventory levels need unique location IDs per variant.');
      seenLocations.add(level.location.id);
      const quantity = level.quantities?.find(item => item.name === 'available')?.quantity;
      if (quantity !== undefined && !Number.isSafeInteger(quantity)) throw Error('An available-stock quantity is invalid.');
      rowFor(variant, level.location).available_stock = quantity ?? null;
    }
  }
  for (const order of input.orders) {
    if (!order.id || seenOrders.has(order.id)) throw Error('Order IDs must be present and unique.');
    seenOrders.add(order.id);
    const created = timestamp(order.createdAt);
    if (created < window.start || created >= window.end) continue;
    for (const fulfillment of connection(order.fulfillments)) {
      if (!fulfillment.id || seenFulfillments.has(fulfillment.id)) throw Error('Fulfillment IDs must be present and unique.');
      seenFulfillments.add(fulfillment.id);
      const fulfilled = timestamp(fulfillment.createdAt);
      if (fulfillment.status !== 'SUCCESS' || fulfilled < created || fulfilled >= window.end) { diagnostics.excluded_fulfillments++; continue; }
      const seenLines = new Set();
      for (const line of connection(fulfillment.fulfillmentLineItems)) {
        if (!line.id || seenLines.has(line.id)) throw Error('Fulfillment line IDs must be present and unique.');
        seenLines.add(line.id);
        const quantity = integer(line.quantity, undefined), variantId = line.lineItem?.variant?.id;
        if (!variantId) { diagnostics.missing_variant_units += quantity; complete = false; continue; }
        const variant = variants.get(variantId);
        if (!variant) continue;
        if (!fulfillment.location?.id) { diagnostics.missing_location_units += quantity; unlocated.add(variantId); continue; }
        rowFor(variant, fulfillment.location).fulfilled_units += quantity;
      }
    }
  }
  const result = [...rows.values()].sort((a, b) => a.variant_id.localeCompare(b.variant_id) || a.location_id.localeCompare(b.location_id)).map(row => {
    const known = complete && !unlocated.has(row.variant_id), velocity = known ? row.fulfilled_units / window.days : null;
    const stock = row.available_stock;
    const cover = velocity > 0 && stock !== null && stock >= 0 ? stock / velocity : null;
    const status = !known || stock === null ? 'incomplete' : stock < 0 ? 'negative_stock' : velocity === 0 ? 'no_fulfilled_units' : cover < threshold ? 'low_stock' : 'healthy';
    return { ...row, daily_fulfilled_units: velocity === null ? null : round(velocity), days_of_supply: cover === null ? null : round(cover, 3), sell_through_proxy_pct: known && stock !== null && stock >= 0 && stock + row.fulfilled_units > 0 ? round(100 * row.fulfilled_units / (stock + row.fulfilled_units), 3) : null, status, alert: status === 'low_stock' || stock < 0 };
  });
  return { summary: { metric: 'fulfilled-unit velocity for orders created in the window', window: input.window, collection_declared_complete: complete, rows: result.length, low_stock_rows: result.filter(row => row.alert).length, incomplete_rows: result.filter(row => row.status === 'incomplete').length }, diagnostics, rows: result };
}
runCli(import.meta.url, stockVelocity, ['variant_id', 'sku', 'product_title', 'vendor', 'location_id', 'location_name', 'available_stock', 'fulfilled_units', 'daily_fulfilled_units', 'days_of_supply', 'sell_through_proxy_pct', 'status', 'alert'], 'velocity');
