import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const read = name => JSON.parse(fs.readFileSync(path.join(here, 'examples', name), 'utf8'));
const exactKey = row => JSON.stringify([row.id, row.thread, row.text]);
const dedup = rows => [...new Map(rows.map(row => [exactKey(row), row])).values()];

const customer = read('customer-threads.json');
const unique = dedup(customer);
assert.equal(customer.length, 8);
assert.equal(unique.length, 6);
assert.equal(customer.length - unique.length, 2);
assert.equal(new Set(unique.map(row => row.thread)).size, 3);
const save = unique.filter(row => row.theme === 'save-state uncertainty');
assert.equal(save.length, 2);
assert.equal((save.length / unique.length * 100).toFixed(1), '33.3');
assert.equal(unique.filter(row => row.text === customer[0].text).map(row => row.id).join(','), 'C-01,C-04');
assert(customer.some(row => row.id === 'C-01' && row.text === "I couldn't tell whether save had worked."));

const company = read('company-discussion.json');
assert.equal(company.length, 5);
assert.equal(new Set(company.map(row => row.thread)).size, 2);
assert.equal(company.filter(row => row.theme === 'migration compatibility').length, 2);
assert.equal(company.filter(row => row.theme === 'performance benefit').length, 1);
assert.equal(company.filter(row => row.theme === 'compatibility concern').length, 1);
const p04 = company.find(row => row.id === 'P-04');
assert.equal(p04.kind, "commenter's unverified statement about a release note");
assert(company.some(row => row.text === 'The release note says the old endpoint retires in September.'));

console.log(JSON.stringify({status:'pass',customerRawRows:customer.length,customerExactDuplicates:customer.length-unique.length,customerUniqueRows:unique.length,customerThreads:3,saveStateShare:`${save.length}/${unique.length} = ${(save.length / unique.length * 100).toFixed(1)}%`,companyExcerpts:company.length,companyThreads:2,scope:'Fictional fixture checks; no repository or external dependencies.'}));
