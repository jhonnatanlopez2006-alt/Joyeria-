import {chromium} from "playwright";
import {mkdir} from "node:fs/promises";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const results=[];
try{
 await mkdir("evidencias",{recursive:true});
 const desktop=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
 const errors=[];
 desktop.on("pageerror",error=>errors.push(error.message));
 await desktop.goto("http://127.0.0.1:5500",{waitUntil:"domcontentloaded",timeout:30000});
 await desktop.locator(".product-card").first().waitFor({timeout:10000});
 const cards=await desktop.locator(".product-card").count();
 if(cards!==8)throw Error("Catálogo esperaba 8 productos, recibió "+cards);
 await desktop.locator('button[data-category="Anillos"]').click();
 if(await desktop.locator(".product-card").count()!==2)throw Error("Filtro Anillos no devuelve 2");
 await desktop.locator('button[data-category="Todos"]').click();
 const ring=desktop.locator(".product-card").filter({hasText:"Anillo Solitario"}).first();
 await ring.locator("img").evaluate(img=>new Promise(resolve=>{if(img.complete)resolve();else{img.addEventListener("load",resolve,{once:true});img.addEventListener("error",resolve,{once:true});setTimeout(resolve,10000)}}));
 const ringLoaded=await ring.locator("img").evaluate(img=>({src:img.currentSrc,width:img.naturalWidth,height:img.naturalHeight}));
 if(ringLoaded.width<=0)throw Error("Anillo Solitario no dispone de imagen visible");
 await ring.locator("[data-add]").click();
 if((await desktop.locator("#cartCount").textContent()).trim()!=="1")throw Error("El carrito no agrega el anillo");
 await desktop.evaluate(()=>window.scrollTo(0,0));
 await desktop.waitForTimeout(300);
 await desktop.screenshot({path:"evidencias/desktop-inicio.png",animations:"disabled"});
 for(let y=0;y<8200;y+=500){await desktop.evaluate(scrollY=>window.scrollTo(0,scrollY),y);await desktop.waitForTimeout(60);}
 await desktop.evaluate(()=>window.scrollTo(0,0));
 await desktop.waitForTimeout(350);
 await desktop.screenshot({path:"evidencias/desktop.png",fullPage:true,animations:"disabled"});
 const editorialOpacity=await desktop.locator(".editorial-copy").evaluate(el=>getComputedStyle(el).opacity);
 if(Number(editorialOpacity)<0.9)throw Error("Sección editorial permanece invisible tras scroll");
 if(errors.length)throw Error("Errores JS: "+errors.join(" | "));
 results.push({viewport:"desktop",cards,ringLoaded,cart:1,jsErrors:0});
 const mobile=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 await mobile.goto("http://127.0.0.1:5500",{waitUntil:"domcontentloaded",timeout:30000});
 await mobile.locator(".product-card").first().waitFor({timeout:10000});
 const navDisplay=await mobile.locator("#mainNav").evaluate(el=>getComputedStyle(el).display);
 if(navDisplay!=="none")throw Error("El menú móvil aparece abierto por defecto: "+navDisplay);
 await mobile.screenshot({path:"evidencias/mobile-inicio.png",animations:"disabled"});
 for(let y=0;y<10000;y+=400){await mobile.evaluate(scrollY=>window.scrollTo(0,scrollY),y);await mobile.waitForTimeout(45);}
 await mobile.evaluate(()=>window.scrollTo(0,0));
 await mobile.waitForTimeout(350);
 await mobile.screenshot({path:"evidencias/mobile.png",fullPage:true,animations:"disabled"});
 const overflow=await mobile.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 if(overflow>4)throw Error("Desbordamiento horizontal móvil: "+overflow+"px");
 results.push({viewport:"mobile",overflow});
 console.log("UI_SMOKE_OK",JSON.stringify(results));
}finally{await browser.close();}
