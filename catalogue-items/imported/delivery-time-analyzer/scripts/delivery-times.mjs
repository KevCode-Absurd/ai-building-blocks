// Added by AI Blocks. The location filter is applied to shipments before aggregation.
import { nodes, timestamp, windowOf, integer, round, runCli } from './report-common.mjs';

export function deliveryTimes(input) {
  if (!Array.isArray(input.orders)) throw Error('Provide an orders array.');
  const window = windowOf(input), minimum = integer(input.min_orders, 5), rows = [], groups = new Map(), seenOrders = new Set(), seenFulfillments = new Set();
  const diagnostics = { other_location: 0, missing_location: 0, missing_delivery_date: 0, invalid_dates: 0, unsuccessful: 0, unknown_carrier: 0, missing_fulfillments: 0 };
  for (const order of input.orders) {
    if (!order.id || seenOrders.has(order.id)) throw Error('Order IDs must be present and unique.');
    seenOrders.add(order.id);
    const created = timestamp(order.createdAt);
    if (created < window.start || created >= window.end) continue;
    if (!Array.isArray(order.fulfillments)) diagnostics.missing_fulfillments++;
    for (const fulfillment of nodes(order.fulfillments)) {
      if (!fulfillment.id || seenFulfillments.has(fulfillment.id)) throw Error('Fulfillment IDs must be present and unique.');
      seenFulfillments.add(fulfillment.id);
      const location = fulfillment.location?.id ?? null;
      if (input.location_id && !location) { diagnostics.missing_location++; continue; }
      if (input.location_id && location !== input.location_id) { diagnostics.other_location++; continue; }
      if (fulfillment.status !== 'SUCCESS') { diagnostics.unsuccessful++; continue; }
      const companies = [...new Set((fulfillment.trackingInfo ?? []).map(info => info.company?.trim()).filter(Boolean))];
      const carrier = companies.length === 1 ? companies[0] : null;
      let transit = null, status = 'measured';
      if (!fulfillment.deliveredAt) { diagnostics.missing_delivery_date++; status = 'no_delivery_date'; }
      else {
        try {
          const start = timestamp(fulfillment.createdAt), end = timestamp(fulfillment.deliveredAt);
          if (end < start || start < created || end >= window.end) throw Error('Invalid chronology.');
          transit = (end - start) / 86400000;
        } catch { diagnostics.invalid_dates++; status = 'invalid_dates'; }
      }
      if (!carrier) diagnostics.unknown_carrier++;
      const row = { order_id: order.id, order_name: order.name ?? '', fulfillment_id: fulfillment.id, location_id: location, carrier, fulfilled_at: fulfillment.createdAt ?? null, delivered_at: fulfillment.deliveredAt ?? null, transit_days: transit === null ? null : round(transit), status };
      rows.push(row);
      if (transit === null || !carrier) continue;
      const key = carrier.toLowerCase();
      if (!groups.has(key)) groups.set(key, { carrier, orderIds: new Set(), count: 0, sum: 0, min: Infinity, max: -Infinity });
      const group = groups.get(key); group.orderIds.add(order.id); group.count++; group.sum += transit; group.min = Math.min(group.min, transit); group.max = Math.max(group.max, transit);
    }
  }
  const carriers = [...groups.values()].filter(group => group.orderIds.size >= minimum).map(group => ({ name: group.carrier, orders: group.orderIds.size, fulfillments: group.count, avg_days: round(group.sum / group.count), min_days: round(group.min), max_days: round(group.max) })).sort((a, b) => b.avg_days - a.avg_days || a.name.localeCompare(b.name));
  return { summary: { window: input.window, window_basis: 'order createdAt; delivered before window end', location_id: input.location_id ?? null, collection_declared_complete: input.complete === true && diagnostics.missing_fulfillments === 0, fulfillments: rows.length, carriers, carriers_below_minimum: [...groups.values()].filter(group => group.orderIds.size < minimum).length }, diagnostics, rows };
}
runCli(import.meta.url, deliveryTimes, ['order_id', 'order_name', 'fulfillment_id', 'location_id', 'carrier', 'fulfilled_at', 'delivered_at', 'transit_days', 'status'], 'delivery_analysis');
