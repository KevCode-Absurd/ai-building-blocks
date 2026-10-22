import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'e2e',testMatch:'next-100.spec.ts',timeout:45000,fullyParallel:true,workers:2,
  outputDir:'../runs/next-100-browser',
  reporter:[['list'],['json',{outputFile:'../reports/2026-10-22-next-100-browser-qa.json'}]],
  use:{baseURL:process.env.NEXT100_BASE_URL??'http://127.0.0.1:5184',channel:'chrome',colorScheme:'dark',trace:'retain-on-failure'},
  projects:[{name:'desktop',grepInvert:/@mobile/,use:{viewport:{width:1440,height:900}}},{name:'mobile',grep:/@mobile/,use:{viewport:{width:390,height:844},isMobile:true,hasTouch:true}}],
});
