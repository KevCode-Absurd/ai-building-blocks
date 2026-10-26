import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'e2e',testMatch:['persistence.spec.ts','account-settings.spec.ts','live-sync.spec.ts','save-retry.spec.ts'],
 timeout:45000,workers:1,reporter:[['list']],
 use:{baseURL:'http://127.0.0.1:5195',channel:'chrome',viewport:{width:1440,height:1000},trace:'retain-on-failure'},
});
