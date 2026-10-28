// Synthetic records only. These checks do not validate live Shopify access or award catalogue Tested badges.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { stockVelocity } from '../../catalogue-items/imported/days-of-stock-calculator/scripts/stock-velocity.mjs';
import { deliveryTimes } from '../../catalogue-items/imported/delivery-time-analyzer/scripts/delivery-times.mjs';
import { duplicateCustomers } from '../../catalogue-items/imported/duplicate-customer-finder/scripts/duplicate-customers.mjs';
import { csv, timestamp } from '../../catalogue-items/imported/duplicate-customer-finder/scripts/report-common.mjs';

const window = { start: '2026-10-01T00:00:00Z', end: '2026-10-11T00:00:00Z' };
const shipment = (id, location, quantity, delivered = '2026-10-05T00:00:00Z') => ({ id, status: 'SUCCESS', createdAt: '2026-10-03T00:00:00Z', deliveredAt: delivered, location: location ? { id: location, name: location } : null, trackingInfo: [{ company: 'Synthetic carrier' }], fulfillmentLineItems: { nodes: [{ id: id + '-line', quantity, lineItem: { variant: { id: 'variant-a' } } }], pageInfo: { hasNextPage: false } } });
const order = (id, fulfillments) => ({ id, name: id, createdAt: '2026-10-02T00:00:00Z', fulfillments });
const stock = () => ({ complete: true, window, variants: [{ id: 'variant-a', sku: 'fixture-sku', product: { title: 'Synthetic item', vendor: 'Synthetic vendor' }, inventoryItem: { tracked: true, inventoryLevels: { nodes: [{ location: { id: 'location-a' }, quantities: [{ name: 'available', quantity: 20 }] }, { location: { id: 'location-b' }, quantities: [{ name: 'available', quantity: 60 }] }], pageInfo: { hasNextPage: false } } } }], orders: [order('order-a', [shipment('shipment-a', 'location-a', 10), shipment('shipment-b', 'location-b', 30)])] });

test('stock uses the variant and actual location for both quantities and velocity', () => {
  const report = stockVelocity(stock());
  assert.deepEqual(report.rows.map(row => [row.location_id, row.available_stock, row.fulfilled_units, row.daily_fulfilled_units, row.days_of_supply]), [['location-a', 20, 10, 1, 20], ['location-b', 60, 30, 3, 20]]);
});
test('missing locations and partial nested pages cannot become zero-sales or confident cover claims', () => {
  const input = stock(); input.orders[0].fulfillments.push(shipment('shipment-missing', null, 3));
  const report = stockVelocity(input);
  assert.equal(report.diagnostics.missing_location_units, 3);
  assert.ok(report.rows.every(row => row.status === 'incomplete' && row.days_of_supply === null));
  const partial = stock(); partial.variants[0].inventoryItem.inventoryLevels.pageInfo.hasNextPage = true;
  assert.ok(stockVelocity(partial).rows.every(row => row.days_of_supply === null));
});
test('all collected fulfillment lines count, including orders above the former 50-line cap', () => {
  const input = stock(); input.orders[0].fulfillments = [shipment('many-lines', 'location-a', 1)];
  input.orders[0].fulfillments[0].fulfillmentLineItems.nodes = Array.from({ length: 60 }, (_, index) => ({ id: 'line-' + index, quantity: 1, lineItem: { variant: { id: 'variant-a' } } }));
  assert.equal(stockVelocity(input).rows[0].fulfilled_units, 60);
});
test('absent fulfillment data is incomplete rather than proof of zero sales', () => {
  const input = stock(); delete input.orders[0].fulfillments;
  assert.ok(stockVelocity(input).rows.every(row => row.days_of_supply === null && row.status === 'incomplete'));
  assert.equal(deliveryTimes(input).summary.collection_declared_complete, false);
});
test('negative available stock stays visible without a fabricated zero-day estimate', () => {
  const input = stock(); input.variants[0].inventoryItem.inventoryLevels.nodes[0].quantities[0].quantity = -3;
  const row = stockVelocity(input).rows[0];
  assert.equal(row.status, 'negative_stock'); assert.equal(row.alert, true); assert.equal(row.days_of_supply, null);
});
test('delivery location filtering changes both shipment rows and carrier averages', () => {
  const input = { complete: true, window, min_orders: 1, orders: [order('order-a', [shipment('shipment-a', 'location-a', 1, '2026-10-04T00:00:00Z'), shipment('shipment-b', 'location-b', 1, '2026-10-10T00:00:00Z')])] };
  assert.equal(deliveryTimes(input).summary.carriers[0].avg_days, 4);
  const filtered = deliveryTimes({ ...input, location_id: 'location-a' });
  assert.equal(filtered.rows.length, 1); assert.equal(filtered.summary.carriers[0].avg_days, 1);
  assert.equal(filtered.diagnostics.other_location, 1);
});
test('delivery minimum counts distinct delivered orders and does not infer transit from a missing date', () => {
  const input = { window, min_orders: 2, orders: [order('order-a', [shipment('shipment-a', 'location-a', 1), shipment('shipment-b', 'location-a', 1), shipment('shipment-c', 'location-a', 1, null)])] };
  const report = deliveryTimes(input);
  assert.equal(report.summary.carriers.length, 0);
  assert.equal(report.rows[2].status, 'no_delivery_date');
  assert.equal(report.rows[2].transit_days, null);
});
const customer = (id, email, count, phone = null) => ({ id, firstName: 'Synthetic', lastName: id, defaultEmailAddress: email ? { emailAddress: email } : null, defaultPhoneNumber: phone ? { phoneNumber: phone } : null, numberOfOrders: count, amountSpent: { amount: '0.00', currencyCode: 'USD' }, createdAt: '2026-10-01T00:00:00Z' });
test('duplicate minimum applies to the whole group and retains its low-order members', () => {
  const input = { min_orders: 10, customers: [customer('a', 'same@example.invalid', '0'), customer('b', 'SAME@example.invalid', '12'), customer('c', 'low@example.invalid', '1'), customer('d', 'low@example.invalid', '2')] };
  const report = duplicateCustomers(input);
  assert.equal(report.summary.duplicate_groups, 1);
  assert.deepEqual(report.rows.map(row => row.customer_id), ['a', 'b']);
  assert.equal(report.summary.groups_below_minimum, 1);
});
test('customer field mapping honors the selected strategy, ignores blanks and preserves large counts', () => {
  const customers = [customer('a', 'same@example.invalid', '9007199254740993', '+10000000001'), customer('b', 'same@example.invalid', '0', '+10000000002'), customer('c', null, '0'), customer('d', null, '0')];
  assert.equal(duplicateCustomers({ match_on: 'phone', customers }).summary.duplicate_groups, 0);
  const report = duplicateCustomers({ customers });
  assert.equal(report.summary.duplicate_groups, 1);
  assert.equal(report.summary.missing_match_fields.email, 2);
  assert.equal(report.rows[0].number_of_orders, '9007199254740993');
  assert.equal(report.rows[0].currency_code, 'USD');
});
test('CSV protects contact strings from spreadsheet formulas without changing numeric quantities', () => {
  const value = csv([{ name: '=1+1', phone: '+10000000001', quantity: -3 }], ['name', 'phone', 'quantity']);
  assert.ok(value.includes("\"'=1+1\"")); assert.ok(value.includes("\"'+10000000001\"")); assert.ok(value.includes('"-3"'));
  assert.ok(csv([{ value: '\n=1+1' }], ['value']).includes("'\n=1+1"));
});
test('invalid calendar dates and timezone-free times are rejected rather than normalized', () => {
  assert.throws(() => timestamp('2026-02-30T00:00:00Z'));
  assert.throws(() => timestamp('2026-10-01T24:00:00Z'));
  assert.throws(() => timestamp('2026-10-01T00:00:00'));
  assert.equal(timestamp('2024-02-29T00:00:00Z'), Date.parse('2024-02-29T00:00:00Z'));
});
test('local CLI writes actual reports, refuses overwriting and makes no store changes', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aiblocks-synthetic-report-')); t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const input = path.join(dir, 'synthetic-input.json'), base = path.join(dir, 'report');
  fs.writeFileSync(input, JSON.stringify({ customers: [customer('a', 'same@example.invalid', '0'), customer('b', 'same@example.invalid', '2')] }));
  const script = fileURLToPath(new URL('../../catalogue-items/imported/duplicate-customer-finder/scripts/duplicate-customers.mjs', import.meta.url));
  const args = [script, '--input', input, '--out', base];
  assert.equal(spawnSync(process.execPath, args).status, 0);
  assert.equal(JSON.parse(fs.readFileSync(base + '.json')).summary.duplicate_groups, 1);
  assert.equal(spawnSync(process.execPath, args).status, 1);
});
