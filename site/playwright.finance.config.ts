import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'e2e',testMatch:'finance-expansion.spec.ts',timeout:45000,fullyParallel:true,workers:2,
  outputDir:process.env.FINANCE_BROWSER_OUTPUT??'../runs/finance-browser',
  reporter:[['list'],['json',{outputFile:process.env.FINANCE_BROWSER_REPORT??'../reports/finance-browser-qa.json'}]],
  use:{baseURL:process.env.FINANCE_BASE_URL??'http://127.0.0.1:5190',channel:'chrome',colorScheme:'dark',trace:'retain-on-failure'},
  projects:[
    {name:'desktop',grepInvert:/@mobile/,use:{viewport:{width:1440,height:900}}},
    {name:'mobile',grep:/@mobile/,use:{viewport:{width:390,height:844},isMobile:true,hasTouch:true}},
  ],
});
