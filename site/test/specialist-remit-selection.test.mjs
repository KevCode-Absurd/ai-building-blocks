import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {rankSpecialists} from '../src/roles/specialist-matching.mjs';
const index=JSON.parse(fs.readFileSync(new URL('../public/data/roles-index.json',import.meta.url)));
test('implementation and visual deliverables take precedence over a business-domain keyword',()=>{
 assert.equal(rankSpecialists(index,'Implement a customer support dashboard in React')[0].id,'react-frontend-specialist');
 for(const task of ['Build an SEO reporting API in TypeScript','Develop a Meta advertising API integration in Python','Create a SQL database for customer support tickets','Implement a checkout conversion tracking event in JavaScript','Convert CSV records to JSON and test the conversion code'])assert.equal(rankSpecialists(index,task)[0].id,'coding-specialist',task);
 for(const task of ['Design a mobile customer support dashboard in Figma','Design the interface for an SEO analytics dashboard'])assert.equal(rankSpecialists(index,task)[0].id,'design-specialist',task);
});
test('focused stack remits stay available without taking unrelated implementation work',()=>{
 assert.equal(rankSpecialists(index,'Build a Shopify Liquid theme section')[0].id,'shopify-theme-specialist');
 assert.notEqual(rankSpecialists(index,'Build a Shopify checkout app API')[0].id,'shopify-theme-specialist');
 assert.equal(rankSpecialists(index,'Audit the CRM pipeline export for missing fields')[0].id,'crm-records-specialist');
 assert.notEqual(rankSpecialists(index,'Build a CRM integration API')[0].id,'crm-records-specialist');
});
test('technical subjects in a writing brief do not turn copy into a software implementation job',()=>{
 for(const task of ['Write ad copy for our software API','Create an email sequence about a Python course','Draft a blog post about a React integration'])assert.notEqual(rankSpecialists(index,task)[0]?.id,'coding-specialist',task);
 assert.equal(rankSpecialists(index,'Audit technical SEO and indexing')[0].id,'seo-specialist');
 assert.equal(rankSpecialists(index,'Draft replies to customer support tickets')[0].id,'customer-support-specialist');
 assert.equal(rankSpecialists(index,'Launch a Meta advertising campaign')[0].id,'media-buyer');
});
