import assert from 'node:assert/strict';
/** The existing app requests starter data after mounting; explicit browsing still preloads the complete library. */
export function deferHomeStarterPreload(html){assert(html.includes('<link rel="canonical" href="https://useaiblocks.com/"'));const before=': ["/data/starter-blocks.json"])';assert.equal(html.split(before).length,2);const next=html.replace(before,': [])');assert.equal(next.slice(next.indexOf('</head>')),html.slice(html.indexOf('</head>')));return next;}
