import {test,expect} from "@playwright/test";
test("NOVA asks before tracking anonymous interactions",async({page})=>{
 await page.goto("/");
 const notice=page.getByRole("complementary",{name:"Anonymous analytics choice"});
 await expect(notice).toBeVisible();
 await expect(notice).toContainText("No names, amounts, or form values");
 await page.getByRole("button",{name:"NO THANKS"}).click();
 await expect(notice).toHaveCount(0);
 await expect(page.getByRole("button",{name:/EXPLORE NOVA/i})).toBeVisible();
 const data=await page.evaluate(()=>({consent:localStorage.getItem("nova-analytics-consent-v1"),events:localStorage.getItem("nova-anonymous-events-v1")}));
 expect(data.consent).toBe("no");expect(data.events).toBeNull();
});
test("NOVA records only whitelisted anonymous events after opt-in",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"ALLOW ANALYTICS"}).click();
 await expect(page.getByRole("complementary",{name:"Anonymous analytics choice"})).toHaveCount(0);
 const start=await page.evaluate(()=>JSON.parse(localStorage.getItem("nova-anonymous-events-v1")||"[]"));
 expect(start.some((e:{event_name:string})=>e.event_name==="visit_started")).toBe(true);
 expect(JSON.stringify(start)).not.toContain("email");
 await page.getByRole("button",{name:/EXPLORE NOVA/i}).click();
 const after=await page.evaluate(()=>JSON.parse(localStorage.getItem("nova-anonymous-events-v1")||"[]"));
 expect(after.some((e:{event_name:string})=>e.event_name==="modal_opened")).toBe(true);
});
