import {normalizeText,localDateString} from "../utils/format.js";

export function filterProducts(products,{category="Todos",term="",sort="featured",favoritesOnly=false,favorites=[]}={}){
 const query=normalizeText(term);
 const fav=new Set(favorites.map(Number));
 const result=products.filter(p=>(category==="Todos"||p.category===category)
  && (!favoritesOnly||fav.has(p.id))
  && (!query||normalizeText(p.name+" "+p.category+" "+p.material).includes(query)));
 const sorts={
  "price-asc":(a,b)=>a.price-b.price,
  "price-desc":(a,b)=>b.price-a.price,
  "name":(a,b)=>a.name.localeCompare(b.name,"es")
 };
 return [...result].sort(sorts[sort]||((a,b)=>a.id-b.id));
}
export function sanitizeCart(value,products){
 if(!Array.isArray(value))return [];
 const valid=new Map(products.map(p=>[p.id,p]));
 const found=new Map();
 for(const entry of value){
  const id=Number(entry?.id),p=valid.get(id);
  if(!p||!Number.isInteger(entry?.qty)||entry.qty<=0)continue;
  found.set(id,Math.min(p.stock,(found.get(id)||0)+entry.qty));
 }
 return [...found].map(([id,qty])=>({id,qty}));
}
export function addToCart(cart,product){
 if(!product||product.stock<1)return {items:cart,added:false,reason:"Agotado"};
 const existing=cart.find(item=>item.id===product.id);
 if(existing&&existing.qty>=product.stock)return {items:cart,added:false,reason:"Límite de unidades disponibles"};
 const items=existing?cart.map(item=>item.id===product.id?{...item,qty:item.qty+1}:item):[...cart,{id:product.id,qty:1}];
 return {items,added:true,reason:""};
}
export function setQuantity(cart,id,qty,products){
 const product=products.find(p=>p.id===Number(id));
 if(!product)return cart;
 if(!Number.isInteger(qty))return cart;
 if(qty<=0)return cart.filter(item=>item.id!==product.id);
 return cart.map(item=>item.id===product.id?{id:product.id,qty:Math.min(qty,product.stock)}:item);
}
export function cartSummary(cart,products){
 const items=cart.map(item=>({product:products.find(p=>p.id===item.id),qty:item.qty})).filter(item=>item.product);
 return {items,count:items.reduce((n,x)=>n+x.qty,0),subtotal:items.reduce((n,x)=>n+x.qty*x.product.price,0)};
}
export function validateCheckout({name="",email="",accept=false}={}){
 const errors={};
 if(name.trim().length<3||name.trim().length>80)errors.name="Escribe un nombre de 3 a 80 caracteres.";
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())||email.length>120)errors.email="Ingresa un correo válido.";
 if(!accept)errors.accept="Confirma que este es un pedido de demostración.";
 return errors;
}
export const APPOINTMENT_TIMES=Object.freeze(["09:00","10:00","11:00","14:00","15:00","16:00"]);
export const APPOINTMENT_TYPES=Object.freeze(["Selección de regalo","Anillos y compromiso","Asesoría de estilo","Cuidado de joyas"]);
export function validateAppointment({name="",email="",date="",time="",type=""}={},bookings=[],today=localDateString()){
 const errors={};
 if(name.trim().length<3||name.trim().length>80)errors.name="Escribe un nombre válido.";
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())||email.length>120)errors.email="Ingresa un correo válido.";
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(new Date(date+"T00:00:00").valueOf())||new Date(date+"T00:00:00").toISOString().slice(0,10)!==date||date<today)errors.date="Selecciona una fecha válida desde hoy.";
 if(!APPOINTMENT_TIMES.includes(time))errors.time="Selecciona una hora disponible.";
 if(!APPOINTMENT_TYPES.includes(type))errors.type="Selecciona un tipo de asesoría.";
 if(bookings.some(b=>b.date===date&&b.time===time))errors.time="Ese horario ya está reservado en este navegador.";
 return errors;
}
export function createOrder(cart,products,now=new Date(),suffix="0000"){
 const summary=cartSummary(cart,products);
 if(!summary.count)throw new Error("La bolsa está vacía.");
 return {id:"JC-"+now.getTime()+"-"+suffix,createdAt:now.toISOString(),status:"Registrado (demo)",subtotal:summary.subtotal,items:summary.items.map(({product,qty})=>({id:product.id,name:product.name,unitPrice:product.price,qty}))};
}
