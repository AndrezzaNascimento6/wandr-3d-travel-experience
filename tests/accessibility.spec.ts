import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const sizes=[
 {name:"desktop",width:1440,height:900},
 {name:"tablet",width:768,height:1024},
 {name:"mobile",width:375,height:812}
];
for(const size of sizes){
 test(`${size.name} meets automatic WCAG accessibility checks`,async({page})=>{
  await page.setViewportSize({width:size.width,height:size.height});
  await page.goto("/");
  const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
  expect(result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 });
}
test("experience dialog keeps focus, closes on Escape and restores launcher",async({page})=>{
 await page.goto("/");
 const launcher=page.getByRole("button",{name:/EXPLORE NOVA/i});
 await launcher.click();
 const dialog=page.getByRole("dialog",{name:/YOUR WORLD/i});
 await expect(dialog).toBeVisible();
 await expect(dialog.getByRole("button",{name:/Close experience dialog/i})).toBeFocused();
 await page.keyboard.press("Shift+Tab");
 await expect(dialog.getByRole("button",{name:/TAKE ME THERE/i})).toBeFocused();
 await page.keyboard.press("Escape");
 await expect(dialog).toHaveCount(0);
 await expect(launcher).toBeFocused();
});
test("tablet and mobile retain accessible navigation",async({page})=>{
 await page.setViewportSize({width:375,height:812});
 await page.goto("/");
 const menu=page.getByRole("button",{name:"MENU"});
 await expect(menu).toBeVisible();
 await menu.click();
 await expect(page.getByRole("navigation",{name:"Mobile navigation"})).toBeVisible();
 await page.getByRole("navigation",{name:"Mobile navigation"}).getByRole("link",{name:"THE APP"}).click();
 await expect(menu).toHaveAttribute("aria-expanded","false");
});
test("manual motion switch persists and disabled scroll animation remains readable",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"REDUCE MOTION"}).first().click();
 await expect(page.locator("html")).toHaveAttribute("data-reduced-motion","true");
 await page.reload();
 await expect(page.locator("html")).toHaveAttribute("data-reduced-motion","true");
 await expect(page.getByRole("heading",{name:/NOT MADE/i})).toBeVisible();
});

test("onboarding dialog passes automated accessibility checks",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:/EXPLORE NOVA/i}).click();
 await expect(page.getByRole("dialog")).toBeVisible();
 await expect(page.locator(".modal-glass")).toHaveCSS("opacity","1");
 const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
 expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
});
test("demo transfer form passes automated accessibility checks",async({page})=>{
 await page.goto("/");
 const phone=page.getByRole("region",{name:/interactive fictional banking/i});
 await phone.getByRole("button",{name:"SEND",exact:true}).click();
 await expect(phone.getByRole("heading",{name:/One quick move/i})).toBeVisible();
 const result=await new AxeBuilder({page}).include(".phone-frame").withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
 expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
});


/**
 * Reflow equivalence checks: WCAG 1.4.10 specifies a 320-CSS-pixel
 * viewport (typical effective width at 400% browser zoom starting
 * from 1280 CSS pixels). These tests emulate the effective viewport,
 * not a physical assistive-technology or browser toolbar zoom session.
 */
for (const zoom of [
 {scale:"200%",width:640,height:800},
 {scale:"400%",width:320,height:800}
]) {
 test("reflow at "+zoom.scale+" equivalent effective width ("+zoom.width+"px)",async({page})=>{
  await page.setViewportSize({width:zoom.width,height:zoom.height});
  await page.goto("/");
  await expect(page.getByRole("heading",{level:1})).toBeVisible();
  const horizontalOverflow=await page.evaluate(()=>({
   total:document.documentElement.scrollWidth,
   visible:document.documentElement.clientWidth
  }));
  expect(horizontalOverflow.total,"Page should not require horizontal scrolling").toBeLessThanOrEqual(horizontalOverflow.visible+1);
  const headings=await page.locator(".nova-hero h1,.benefits h2,.end-scene h2").evaluateAll(elements=>elements.map(el=>{
   const rect=el.getBoundingClientRect();
   const parent=el.parentElement!.getBoundingClientRect();
   return {text:el.textContent?.trim(),left:rect.left,right:rect.right,parentLeft:parent.left,parentRight:parent.right};
  }));
  for(const item of headings){
   expect(item.left,item.text+" should not start outside its container").toBeGreaterThanOrEqual(item.parentLeft-2);
   expect(item.right,item.text+" should not end outside its container").toBeLessThanOrEqual(item.parentRight+2);
  }
  const menu=page.getByRole("button",{name:"MENU"});
  await expect(menu).toBeVisible();
  await menu.click();
  await expect(page.getByRole("navigation",{name:"Mobile navigation"})).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation",{name:"Mobile navigation"})).toBeHidden();
 });
}

test("keyboard skip link enters the main content",async({page})=>{
 await page.goto("/");
 await page.keyboard.press("Tab");
 await expect(page.getByRole("link",{name:"Skip to main content"})).toBeFocused();
 await page.keyboard.press("Enter");
 await expect(page.locator("#main-content")).toBeFocused();
});

test("reduced motion works at narrow 400%-equivalent viewport",async({page})=>{
 await page.setViewportSize({width:320,height:800});
 await page.emulateMedia({reducedMotion:"reduce"});
 await page.goto("/");
 await expect(page.getByRole("heading",{level:1})).toBeVisible();
 const sizing=await page.locator(".chapter-card").evaluate(el=>({height:el.getBoundingClientRect().height,viewport:window.innerHeight}));
 expect(sizing.height).toBeLessThan(1500);
 await expect(page.locator(".reveal-text h2")).toHaveCSS("opacity","1");
});

test("text resize to 200% does not hide major interactions",async({page})=>{
 await page.setViewportSize({width:1280,height:900});
 await page.goto("/");
 await page.evaluate(()=>{document.documentElement.style.fontSize="200%"});
 const launcher=page.getByRole("button",{name:/EXPLORE NOVA/i});
 await expect(launcher).toBeVisible();
 await launcher.click();
 await expect(page.getByRole("dialog")).toBeVisible();
 await page.keyboard.press("Escape");
 await expect(page.getByRole("dialog")).toHaveCount(0);
});
