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
