import {PRODUCTS as products,CATEGORIES} from "../src/data/products.js";
import {money,escapeHTML,localDateString} from "../src/utils/format.js";
import {filterProducts,sanitizeCart,addToCart,setQuantity,cartSummary,validateCheckout,validateAppointment,createOrder,APPOINTMENT_TIMES,APPOINTMENT_TYPES} from "../src/models/shop.js";
import {readState,writeState} from "../src/services/storage.js";

const $=id=>document.getElementById(id);
const state=readState();
state.cart=sanitizeCart(state.cart,products);
state.favorites=[...new Set(state.favorites.map(Number).filter(id=>products.some(p=>p.id===id)))];
state.orders=state.orders.filter(o=>o&&Array.isArray(o.items)&&typeof o.id==="string").slice(-30);
state.appointments=state.appointments.filter(a=>a&&typeof a.date==="string").slice(-30);
let category="Todos",searchTerm="",sort="featured",favoritesOnly=false,selectedProduct=null,lastFocus=null,toastTimeout;
const persist=()=>{if(!writeState(state))notify("El almacenamiento está bloqueado; los cambios solo durarán esta sesión.");};
const safe=value=>escapeHTML(value);
const notify=msg=>{const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>t.classList.remove("show"),3500);};
const product=id=>products.find(p=>p.id===Number(id));

function renderProducts(){
 const list=filterProducts(products,{category,term:searchTerm,sort,favoritesOnly,favorites:state.favorites});
 $("productGrid").innerHTML=list.map(p=>{
  const fav=state.favorites.includes(p.id);
  return '<article class="product-card"><div class="product-image"><button type="button" class="image-link" data-detail="'+p.id+'" aria-label="Ver '+safe(p.name)+'"><img src="'+safe(p.image)+'" loading="lazy" alt="'+safe(p.name)+'"></button>'
   +(p.tag?'<span class="product-label">'+safe(p.tag)+'</span>':"")
   +'<button type="button" class="favorite-button '+(fav?"is-favorite":"")+'" data-favorite="'+p.id+'" aria-pressed="'+fav+'" aria-label="'+(fav?"Quitar de favoritos: ":"Guardar en favoritos: ")+safe(p.name)+'">'+(fav?"♥":"♡")+'</button>'
   +'<button type="button" class="add-button" data-add="'+p.id+'" aria-label="Agregar '+safe(p.name)+' a la bolsa">+</button></div>'
   +'<div class="product-info"><span class="product-category">'+safe(p.category)+'</span><h3>'+safe(p.name)+'</h3><div class="product-bottom"><strong>'+money(p.price)+'</strong><span>'+p.stock+' disponibles (demo)</span></div>'
   +'<button type="button" class="detail-button" data-detail="'+p.id+'">Explorar pieza <span aria-hidden="true">↗</span></button></div></article>';
 }).join("");
 $("emptyState").classList.toggle("hidden",list.length!==0);
 $("resultsCount").textContent=list.length+" "+(list.length===1?"pieza":"piezas");
 $("favoritesCount").textContent=state.favorites.length;
}
function renderCart(){
 const {items,count,subtotal}=cartSummary(state.cart,products);
 $("cartCount").textContent=count;
 $("cartTotal").textContent=money(subtotal);
 $("checkoutButton").disabled=count===0;
 $("cartItems").innerHTML=items.length?items.map(({product:p,qty})=>'<div class="cart-row"><img src="'+safe(p.image)+'" alt=""><div><h4>'+safe(p.name)+'</h4><small>'+money(p.price)+' c/u</small><div class="quantity-controls"><button data-qty="'+p.id+'" data-change="-1" aria-label="Disminuir '+safe(p.name)+'">−</button><span>'+qty+'</span><button data-qty="'+p.id+'" data-change="1" aria-label="Aumentar '+safe(p.name)+'" '+(qty>=p.stock?"disabled":"")+'>+</button></div></div><button class="remove-item" data-remove="'+p.id+'" aria-label="Quitar '+safe(p.name)+'">×</button></div>').join(""):'<p class="cart-empty">Tu bolsa está esperando una pieza especial.</p>';
 renderActivity();
}
function renderActivity(){
 const orders=state.orders.slice().reverse();
 $("ordersList").innerHTML=orders.length?orders.map(o=>'<article class="activity-entry"><div><strong>'+safe(o.id)+'</strong><span>'+new Date(o.createdAt).toLocaleDateString("es-CO")+' · '+o.items.length+' referencias</span></div><strong>'+money(o.subtotal)+'</strong><small>'+safe(o.status)+'</small></article>').join(""):'<p class="activity-placeholder">Aún no registras pedidos de demostración en este navegador.</p>';
 const appointments=state.appointments.slice().reverse();
 $("appointmentsList").innerHTML=appointments.length?appointments.map(a=>'<article class="activity-entry"><div><strong>'+safe(a.type)+'</strong><span>'+safe(a.date)+' · '+safe(a.time)+'</span></div><button type="button" data-cancel="'+safe(a.id)+'" class="text-action">Cancelar</button></article>').join(""):'<p class="activity-placeholder">No hay solicitudes de asesoría registradas en este navegador.</p>';
 $("stockTotal").textContent=products.reduce((sum,p)=>sum+p.stock,0);
 $("ordersTotal").textContent=orders.length;
 $("orderValue").textContent=money(orders.length?Math.round(orders.reduce((sum,o)=>sum+o.subtotal,0)/orders.length):0);
 drawChart($("chartPeriod")?.value||"semana");
}
function doAdd(id){
 const p=product(id),result=addToCart(state.cart,p);
 if(!result.added){notify(result.reason);return;}
 state.cart=result.items;persist();renderCart();notify(p.name+" se agregó a tu bolsa.");
}
$("productGrid").addEventListener("click",event=>{
 const add=event.target.closest("[data-add]"),detail=event.target.closest("[data-detail]"),favorite=event.target.closest("[data-favorite]");
 if(add){doAdd(add.dataset.add);return;}
 if(favorite){const id=Number(favorite.dataset.favorite);state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];persist();renderProducts();notify("Favoritos actualizados.");return;}
 if(detail)openDetail(detail.dataset.detail);
});
$("filters").addEventListener("click",event=>{
 const button=event.target.closest("[data-category]");if(!button)return;
 category=button.dataset.category;
 $("filters").querySelectorAll("button").forEach(b=>{const selected=b===button;b.classList.toggle("active",selected);b.setAttribute("aria-pressed",String(selected));});
 renderProducts();
});
$("searchInput").addEventListener("input",event=>{searchTerm=event.target.value;renderProducts();});
$("sortSelect").addEventListener("change",event=>{sort=event.target.value;renderProducts();});
$("favoritesToggle").addEventListener("click",()=>{favoritesOnly=!favoritesOnly;$("favoritesToggle").setAttribute("aria-pressed",String(favoritesOnly));$("favoritesToggle").classList.toggle("selected",favoritesOnly);renderProducts();});
function openDialog(element,backdrop){
 lastFocus=document.activeElement;element.classList.remove("hidden");backdrop.classList.remove("hidden");element.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");
 element.querySelector("button:not([disabled]),input:not([disabled])")?.focus();
}
function closeDialog(element,backdrop){
 element.classList.add("hidden");backdrop.classList.add("hidden");element.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");lastFocus?.focus();
}
function openDetail(id){
 selectedProduct=product(id);if(!selectedProduct)return;
 $("detailImage").src=selectedProduct.image;$("detailImage").alt=selectedProduct.name;
 $("detailCategory").textContent=selectedProduct.category.toUpperCase()+" · JOYERÍA J-C";
 $("detailName").textContent=selectedProduct.name;
 $("detailPrice").textContent=money(selectedProduct.price);
 $("detailDescription").textContent="Pieza de la colección J-C. "+selectedProduct.material+". Diseñada para regalar o acompañarte en momentos memorables.";
 $("detailStock").textContent=selectedProduct.stock+" unidades (demostración)";
 openDialog($("productModal"),$("productModalBackdrop"));
}
function closeDetail(){closeDialog($("productModal"),$("productModalBackdrop"));selectedProduct=null;}
$("closeProductModal").addEventListener("click",closeDetail);
$("productModalBackdrop").addEventListener("click",closeDetail);
$("detailAddToCart").addEventListener("click",()=>{if(!selectedProduct)return;doAdd(selectedProduct.id);closeDetail();});
const drawer=$("cartDrawer"),overlay=$("cartOverlay");
function openCart(){lastFocus=document.activeElement;drawer.classList.add("open");overlay.classList.remove("hidden");drawer.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");$("closeCart").focus();}
function closeCart(){drawer.classList.remove("open");overlay.classList.add("hidden");drawer.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");lastFocus?.focus();}
$("openCart").addEventListener("click",openCart);$("closeCart").addEventListener("click",closeCart);overlay.addEventListener("click",closeCart);
$("cartItems").addEventListener("click",event=>{
 const remove=event.target.closest("[data-remove]"),change=event.target.closest("[data-qty]");
 if(remove){state.cart=state.cart.filter(x=>x.id!==Number(remove.dataset.remove));}
 else if(change){const id=Number(change.dataset.qty),item=state.cart.find(x=>x.id===id);state.cart=setQuantity(state.cart,id,(item?.qty||0)+Number(change.dataset.change),products);}
 else return;
 persist();renderCart();
});
$("checkoutButton").addEventListener("click",()=>{
 if(!state.cart.length){notify("Primero agrega una joya.");return;}
 closeCart();openDialog($("checkoutDialog"),$("checkoutBackdrop"));
});
function showErrors(form,errors){form.querySelectorAll("[data-error]").forEach(el=>{el.textContent=errors[el.dataset.error]||"";});return Object.keys(errors).length>0;}
$("checkoutForm").addEventListener("submit",event=>{
 event.preventDefault();
 const form=event.currentTarget,values={name:form.elements.namedItem("name").value,email:form.elements.namedItem("email").value,accept:form.elements.namedItem("accept").checked};
 if(showErrors(form,validateCheckout(values)))return;
 if(!state.cart.length){notify("La bolsa está vacía.");return;}
 const order=createOrder(state.cart,products,new Date(),Math.random().toString(36).slice(2,6).toUpperCase());
 state.orders=[...state.orders,order].slice(-30);state.cart=[];persist();renderCart();form.reset();
 closeDialog($("checkoutDialog"),$("checkoutBackdrop"));
 $("receiptText").textContent="Referencia "+order.id+" · "+money(order.subtotal)+". Registro local de demostración; no se envió ningún pedido comercial ni se realizó pago.";
 openDialog($("receiptDialog"),$("receiptBackdrop"));notify("Pedido de demostración registrado en este dispositivo.");
});
$("closeCheckout").addEventListener("click",()=>closeDialog($("checkoutDialog"),$("checkoutBackdrop")));
$("checkoutBackdrop").addEventListener("click",()=>closeDialog($("checkoutDialog"),$("checkoutBackdrop")));
$("closeReceipt").addEventListener("click",()=>closeDialog($("receiptDialog"),$("receiptBackdrop")));
$("receiptBackdrop").addEventListener("click",()=>closeDialog($("receiptDialog"),$("receiptBackdrop")));
$("appointmentForm").elements.namedItem("date").min=localDateString();
const timeSelect=$("appointmentForm").elements.namedItem("time");
timeSelect.innerHTML='<option value="">Selecciona una hora</option>'+APPOINTMENT_TIMES.map(t=>'<option value="'+t+'">'+t+'</option>').join("");
const typeSelect=$("appointmentForm").elements.namedItem("type");
typeSelect.innerHTML='<option value="">Tipo de asesoría</option>'+APPOINTMENT_TYPES.map(t=>'<option value="'+safe(t)+'">'+safe(t)+'</option>').join("");
$("appointmentForm").addEventListener("submit",event=>{
 event.preventDefault();const form=event.currentTarget;
 const data=Object.fromEntries(new FormData(form).entries());
 const errors=validateAppointment(data,state.appointments);
 if(showErrors(form,errors))return;
 state.appointments.push({id:String(Date.now())+"-"+Math.random().toString(36).slice(2,6),date:data.date,time:data.time,type:data.type});
 state.appointments=state.appointments.slice(-30);persist();form.reset();renderActivity();
 notify("Solicitud de asesoría registrada solo en este navegador. No se envió a la joyería.");
});
$("appointmentsList").addEventListener("click",event=>{
 const btn=event.target.closest("[data-cancel]");if(!btn)return;
 state.appointments=state.appointments.filter(a=>a.id!==btn.dataset.cancel);persist();renderActivity();notify("Solicitud local cancelada.");
});
$("orderLookupForm").addEventListener("submit",event=>{
 event.preventDefault();const query=$("orderLookup").value.trim().toUpperCase();const order=state.orders.find(o=>o.id.toUpperCase()===query);
 $("lookupResult").textContent=order?"Pedido "+order.id+" · "+money(order.subtotal)+" · "+order.status+". Registro disponible solo en este dispositivo.":"No existe una referencia local con ese código. No se consultó un servidor.";
});
$("menuToggle").addEventListener("click",()=>{
 const nav=$("mainNav"),open=nav.classList.toggle("show");$("menuToggle").setAttribute("aria-expanded",String(open));
});
$("mainNav").querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{$("mainNav").classList.remove("show");$("menuToggle").setAttribute("aria-expanded","false");}));
document.addEventListener("keydown",event=>{
 if(event.key==="Escape"){
  if(!$("receiptDialog").classList.contains("hidden"))closeDialog($("receiptDialog"),$("receiptBackdrop"));
  else if(!$("checkoutDialog").classList.contains("hidden"))closeDialog($("checkoutDialog"),$("checkoutBackdrop"));
  else if(!$("productModal").classList.contains("hidden"))closeDetail();
  else if(drawer.classList.contains("open"))closeCart();
 }
 if(event.key==="Tab"){
  const active=[...document.querySelectorAll(".product-modal:not(.hidden),.dialog-card:not(.hidden),.cart-drawer.open")].at(-1);
  if(!active)return;
  const focusable=[...active.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled])')].filter(x=>x.getClientRects().length);
  if(!focusable.length)return;
  const first=focusable[0],last=focusable.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 }
});
function drawChart(period){
 const canvas=$("salesChart");if(!canvas)return;
 const now=new Date(),days=period==="mes"?180:7;
 const orders=state.orders.filter(o=>now-new Date(o.createdAt)<days*86400000);
 const buckets=new Map();
 for(let i=days-1;i>=0;i--){const d=new Date(now);d.setDate(now.getDate()-i);buckets.set(localDateString(d),0);}
 orders.forEach(o=>{const key=localDateString(new Date(o.createdAt));if(buckets.has(key))buckets.set(key,buckets.get(key)+1);});
 const rows=[...buckets.entries()];
 const grouped=period==="mes"?Array.from({length:6},(_,i)=>{const part=rows.slice(i*30,(i+1)*30);return {label:"Periodo "+(i+1),value:part.reduce((n,x)=>n+x[1],0)};}):rows.map(([date,value])=>({label:date.slice(5),value}));
 if(window.Chart){
  if(window.jcChart)window.jcChart.destroy();
  window.jcChart=new window.Chart(canvas,{type:"line",data:{labels:grouped.map(x=>x.label),datasets:[{data:grouped.map(x=>x.value),borderColor:"#b69255",backgroundColor:"rgba(182,146,85,.15)",fill:true,tension:.35}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,ticks:{precision:0}},x:{grid:{display:false}}}}});
  $("chartFallback").classList.add("hidden");
 }else{
  canvas.classList.add("hidden");$("chartFallback").classList.remove("hidden");
  $("chartFallback").textContent=grouped.map(x=>x.label+": "+x.value).join(" · ")+" pedidos locales";
 }
}
$("chartPeriod").addEventListener("change",event=>drawChart(event.target.value));
renderProducts();renderCart();persist();
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(!reduced&&"IntersectionObserver" in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}}),{threshold:.08});
 document.querySelectorAll(".section-heading,.editorial-copy,.editorial-image,.stat-card,.chart-card,.care-section>div,.experience-panel").forEach(el=>{el.classList.add("reveal");observer.observe(el);});
}

/* Rediseño visual: tolerancia a fallos de imagen y gestión eficiente de videos. */
document.addEventListener("error",event=>{
 const img=event.target;
 if(!(img instanceof HTMLImageElement)||img.dataset.fallbackApplied)return;
 img.dataset.fallbackApplied="true";
 const isRing=img.alt?.toLowerCase().includes("solitario")||img.src?.includes("anillo-solitario");
 img.src=isRing?"assets/solitario-fallback.svg":"assets/jc-fallback.svg";
},true);
const backgroundVideos=[...document.querySelectorAll("video[data-ambient]")];
const canAnimate=!window.matchMedia("(prefers-reduced-motion: reduce)").matches;
for(const video of backgroundVideos){
 video.muted=true;
 video.setAttribute("aria-hidden","true");
 video.addEventListener("error",()=>{video.style.display="none";},true);
}
if(!canAnimate){backgroundVideos.forEach(video=>{video.pause();video.removeAttribute("autoplay");});}
else if("IntersectionObserver" in window){
 const mediaObserver=new IntersectionObserver(entries=>{
  entries.forEach(({target,isIntersecting})=>{
   const video=target;
   if(isIntersecting){
    const source=video.querySelector("source[data-src]");
    if(source&&!source.src){source.src=source.dataset.src;video.load();}
    video.play().catch(()=>{/* Poster/background visible if autoplay is blocked. */});
   }else video.pause();
  });
 },{rootMargin:"150px 0px",threshold:.05});
 backgroundVideos.forEach(video=>mediaObserver.observe(video));
}else{
 backgroundVideos.forEach(video=>{
  const source=video.querySelector("source[data-src]");
  if(source){source.src=source.dataset.src;video.load();}
  video.play().catch(()=>{});
 });
}
document.addEventListener("visibilitychange",()=>{
 if(document.hidden){backgroundVideos.forEach(video=>video.pause());}
 else if(canAnimate){backgroundVideos.filter(video=>video.getBoundingClientRect().top<innerHeight&&video.getBoundingClientRect().bottom>0).forEach(video=>video.play().catch(()=>{}));}
});
