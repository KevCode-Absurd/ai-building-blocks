import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'e2e',testMatch:'space-workflow-execution.spec.ts',outputDir:'../runs/space-workflow-browser',timeout:45000,workers:1,reporter:'list',use:{baseURL:process.env.SPACE_EXECUTION_TEST_URL||'http://127.0.0.1:5207',channel:'chrome',viewport:{width:1440,height:1000},trace:'retain-on-failure'}});
