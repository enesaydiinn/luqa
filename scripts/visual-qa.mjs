import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const browser=await chromium.launch({headless:true});
const output=resolve('..');
const measurements={};
for(const[name,viewport]of [['desktop',{width:1536,height:1024}],['mobile',{width:390,height:844}],['tablet',{width:834,height:1112}]]){
 const context=await browser.newContext({viewport,deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
 const page=await context.newPage();
 await page.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 await page.locator('.home-product-grid img').last().scrollIntoViewIfNeeded();
 await page.locator('.home-hero').scrollIntoViewIfNeeded();
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:resolve(output,`LUQA-${name}.png`)});
 if(name==='mobile')await page.screenshot({path:resolve(output,'LUQA-mobile-full.png'),fullPage:true});
 measurements[name]=await page.evaluate(()=>({viewport:{width:innerWidth,height:innerHeight},documentWidth:document.documentElement.scrollWidth,sections:Object.fromEntries(['.announcement','.header','.home-hero','.home-benefits','.home-details','.home-featured-heading','.home-product-grid','.home-story'].map(s=>{const e=document.querySelector(s);const r=e.getBoundingClientRect();return[s,{x:r.x,y:r.y,width:r.width,height:r.height}]})),images:[...document.querySelectorAll('.home-page img')].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0}))}));
 await context.close();
}
await writeFile(resolve(output,'LUQA-layout-measurements.json'),JSON.stringify(measurements,null,2));
await browser.close();console.log(JSON.stringify(measurements,null,2));
