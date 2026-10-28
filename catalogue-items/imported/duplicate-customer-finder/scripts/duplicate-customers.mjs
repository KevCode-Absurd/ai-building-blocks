// Added by AI Blocks. Reports likely matches without merging or changing customers.
import { integer, runCli } from './report-common.mjs';

export function duplicateCustomers(input) {
  if (!Array.isArray(input.customers)) throw Error('Provide a customers array.');
  const strategy = input.match_on ?? 'email';
  if (!['email', 'phone', 'name', 'all'].includes(strategy)) throw Error('Choose email, phone, name or all.');
  const minimum = BigInt(integer(input.min_orders, 0)), selected = strategy === 'all' ? ['email', 'phone', 'name'] : [strategy];
  const maps = new Map(selected.map(kind => [kind, new Map()])), seen = new Set();
  const missingFields = Object.fromEntries(selected.map(kind => [kind, 0]));
  for (const customer of input.customers) {
    if (!customer.id || seen.has(customer.id)) throw Error('Customer IDs must be present and unique.');
    seen.add(customer.id);
    const count = customer.numberOfOrders;
    if (!(typeof count === 'string' && /^\d+$/.test(count)) && !(Number.isSafeInteger(count) && count >= 0)) throw Error('numberOfOrders must be an unsigned integer.');
    const email = customer.defaultEmailAddress?.emailAddress?.trim() ?? '';
    const phone = customer.defaultPhoneNumber?.phoneNumber?.trim() ?? '';
    const normalizedPhone = phone.replace(/[\s().-]/g, '');
    const name = [customer.firstName?.trim(), customer.lastName?.trim()].filter(Boolean).join(' ');
    const keys = { email: email.toLowerCase(), phone: /^\+?\d+$/.test(normalizedPhone) ? normalizedPhone : '', name: customer.firstName?.trim() && customer.lastName?.trim() ? name.toLowerCase().replace(/\s+/g, ' ') : '' };
    const record = { customer_id: customer.id, name, email: email || null, phone: phone || null, number_of_orders: String(count), total_spent: customer.amountSpent?.amount ?? null, currency_code: customer.amountSpent?.currencyCode ?? null, created_at: customer.createdAt ?? null };
    for (const kind of selected) {
      const key = keys[kind]; if (!key) { missingFields[kind]++; continue; }
      const map = maps.get(kind); if (!map.has(key)) map.set(key, []); map.get(key).push(record);
    }
  }
  const groups = [], rows = [], affected = new Set(); let belowMinimum = 0;
  for (const [kind, map] of maps) for (const [key, records] of [...map].sort(([a], [b]) => a.localeCompare(b))) {
    if (records.length < 2) continue;
    if (!records.some(record => BigInt(record.number_of_orders) >= minimum)) { belowMinimum++; continue; }
    const id = 'duplicate-' + String(groups.length + 1).padStart(3, '0');
    const customers = records.sort((a, b) => a.customer_id.localeCompare(b.customer_id));
    groups.push({ id, match_type: kind, match_key: key, customers });
    for (const record of customers) { affected.add(record.customer_id); rows.push({ duplicate_group_id: id, match_type: kind, match_key: key, ...record }); }
  }
  return { summary: { customers_scanned: input.customers.length, collection_declared_complete: input.complete === true, match_on: strategy, min_orders: minimum.toString(), duplicate_groups: groups.length, customers_affected: affected.size, groups_below_minimum: belowMinimum, missing_match_fields: missingFields }, groups, rows };
}
runCli(import.meta.url, duplicateCustomers, ['duplicate_group_id', 'match_key', 'match_type', 'customer_id', 'name', 'email', 'phone', 'number_of_orders', 'total_spent', 'currency_code', 'created_at'], 'duplicate_customers');
