const products = [
 {id:1,name:"Anillo Aurora",category:"Anillos",price:320000,stock:5,label:"MÁS VENDIDO",image:"https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=85"},
 {id:2,name:"Collar Lumière",category:"Collares",price:285000,stock:4,label:"NUEVO",image:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=85"},
 {id:3,name:"Pulsera Éclat",category:"Pulseras",price:195000,stock:7,label:"",image:"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=700&q=85"},
 {id:4,name:"Aretes Celeste",category:"Aretes",price:175000,stock:8,label:"DESTACADO",image:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=85"},
 {id:5,name:"Anillo Solitario",category:"Anillos",price:450000,stock:3,label:"",image:"https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?auto=format&fit=crop&w=700&q=85"},
 {id:6,name:"Collar Esencia",category:"Collares",price:240000,stock:6,label:"",image:"https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=85"},
 {id:7,name:"Pulsera Serena",category:"Pulseras",price:210000,stock:5,label:"",image:"https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=700&q=85"},
 {id:8,name:"Aretes Aura",category:"Aretes",price:160000,stock:9,label:"",image:"https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=700&q=85"}
];
const money = n => new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n);
let category = "Todos";
let cart = [];
const grid = document.getElementById("productGrid");
const empty = document.getElementById("emptyState");
function renderProducts(){
 const term = document.getElementById("searchInput").value.toLowerCase().trim();
 const shown = products.filter(p => (category==="Todos" || p.category===category) && (p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)));
 grid.innerHTML = shown.map(p=>`<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy">${p.label?`<span class="product-label">${p.label}</span>`:""}<button class="add-button" data-add="${p.id}" aria-label="Agregar ${p.name} al carrito">+</button></div><div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3><div class="product-bottom"><strong>${money(p.price)}</strong><span>${p.stock} disponibles</span></div></div></article>`).join("");
 empty.classList.toggle("hidden",shown.length>0);
}
document.getElementById("filters").addEventListener("click",e=>{const btn=e.target.closest("button[data-category]");if(!btn)return;category=btn.dataset.category;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===btn));renderProducts()});
document.getElementById("searchInput").addEventListener("input",renderProducts);
grid.addEventListener("click",e=>{const btn=e.target.closest("[data-add]");if(!btn)return;const p=products.find(x=>x.id===Number(btn.dataset.add));const found=cart.find(x=>x.id===p.id);if(found)found.qty++;else cart.push({...p,qty:1});renderCart();showToast(`${p.name} se agregó a tu bolsa`)});
function renderCart(){
 const items=document.getElementById("cartItems");
 document.getElementById("cartCount").textContent=cart.reduce((s,p)=>s+p.qty,0);
 document.getElementById("cartTotal").textContent=money(cart.reduce((s,p)=>s+p.price*p.qty,0));
 items.innerHTML=cart.length?cart.map(p=>`<div class="cart-row"><img src="${p.image}" alt=""><div><h4>${p.name}</h4><small>${p.qty} × ${money(p.price)}</small></div><button class="remove-item" data-remove="${p.id}" aria-label="Quitar ${p.name}">×</button></div>`).join(""):`<p class="cart-empty">Tu bolsa está esperando una pieza especial.</p>`;
}
document.getElementById("cartItems").addEventListener("click",e=>{const b=e.target.closest("[data-remove]");if(!b)return;cart=cart.filter(p=>p.id!==Number(b.dataset.remove));renderCart()});
const drawer=document.getElementById("cartDrawer"),overlay=document.getElementById("cartOverlay");
function openCart(){drawer.classList.add("open");overlay.classList.remove("hidden");drawer.setAttribute("aria-hidden","false")}
function closeCart(){drawer.classList.remove("open");overlay.classList.add("hidden");drawer.setAttribute("aria-hidden","true")}
document.getElementById("openCart").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.getElementById("checkoutButton").addEventListener("click",()=>{if(!cart.length){showToast("Agrega una joya antes de confirmar.");return}showToast("¡Pedido de demostración registrado! No se realizó ningún pago.");cart=[];renderCart();closeCart()});
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2600)}
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("show"));
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("show")));
document.getElementById("stockTotal").textContent=products.reduce((s,p)=>s+p.stock,0);
renderProducts();renderCart();
let chart;
function drawChart(period){
 const labels=period==="semana"?["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"]:["Jun","Jul","Ago","Sep","Oct","Nov"];
 const data=period==="semana"?[5,8,6,11,9,15,12]:[38,45,42,57,63,72];
 const ctx=document.getElementById("salesChart");
 if(chart)chart.destroy();
 chart=new Chart(ctx,{type:"line",data:{labels,datasets:[{label:"Pedidos",data,borderColor:"#b8955a",backgroundColor:"rgba(184,149,90,.12)",fill:true,tension:.38,pointRadius:4,pointBackgroundColor:"#b8955a"}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,grid:{color:"#eee9e1"},ticks:{font:{size:10}}},x:{grid:{display:false},ticks:{font:{size:10}}}}}});
}
document.getElementById("chartPeriod").addEventListener("change",e=>drawChart(e.target.value));
drawChart("semana");
