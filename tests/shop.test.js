import test from "node:test";
import assert from "node:assert/strict";
import {PRODUCTS} from "../src/data/products.js";
import {filterProducts,sanitizeCart,addToCart,setQuantity,cartSummary,validateCheckout,validateAppointment,createOrder} from "../src/models/shop.js";
import {readState,writeState,STORAGE_KEY} from "../src/services/storage.js";
import {normalizeText,money} from "../src/utils/format.js";

test("catálogo: búsqueda normalizada, categoría, favoritos y ordenamiento",()=>{
 assert.equal(filterProducts(PRODUCTS,{term:"lumIere"}).length,1);
 assert.equal(filterProducts(PRODUCTS,{category:"Anillos"}).length,2);
 assert.equal(filterProducts(PRODUCTS,{favoritesOnly:true,favorites:[5]}).length,1);
 const sorted=filterProducts(PRODUCTS,{sort:"price-asc"});
 assert.equal(sorted[0].price,160000);
 assert.equal(sorted.at(-1).price,450000);
 assert.equal(normalizeText("ÉCLAT"),"eclat");
});
test("carrito: agrega unidades, respeta existencia y calcula total",()=>{
 let cart=[];
 for(let i=0;i<PRODUCTS[4].stock;i++){
  const result=addToCart(cart,PRODUCTS[4]);assert.equal(result.added,true);cart=result.items;
 }
 assert.equal(addToCart(cart,PRODUCTS[4]).added,false);
 assert.equal(cartSummary(cart,PRODUCTS).subtotal,1350000);
 cart=setQuantity(cart,5,2,PRODUCTS);
 assert.equal(cartSummary(cart,PRODUCTS).count,2);
 cart=setQuantity(cart,5,0,PRODUCTS);
 assert.equal(cart.length,0);
});
test("storage: saneamiento frente a datos alterados",()=>{
 assert.deepEqual(sanitizeCart([{id:1,qty:900},{id:2,qty:-3},{id:999,qty:1}],PRODUCTS),[{id:1,qty:5}]);
 const values=new Map();
 const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
 assert.deepEqual(readState(storage).cart,[]);
 assert.equal(writeState({cart:[{id:1,qty:2}],favorites:[],orders:[],appointments:[]},storage),true);
 assert.equal(JSON.parse(values.get(STORAGE_KEY)).cart[0].qty,2);
 values.set(STORAGE_KEY,"{broken");assert.deepEqual(readState(storage).orders,[]);
});
test("checkout: validaciones y referencia de pedido demostrativo",()=>{
 assert.ok(validateCheckout({name:"A",email:"mal",accept:false}).name);
 assert.equal(Object.keys(validateCheckout({name:"Cliente Demo",email:"cliente@example.com",accept:true})).length,0);
 const o=createOrder([{id:1,qty:2}],PRODUCTS,new Date("2026-11-10T12:00:00Z"),"ABCD");
 assert.equal(o.subtotal,640000);
 assert.match(o.id,/^JC-\d+-ABCD$/);
 assert.equal(o.status,"Registrado (demo)");
 assert.match(money(320000),/320/);
});
test("agenda: campos obligatorios, horario y conflictos locales",()=>{
 const valid={name:"Cliente Demo",email:"demo@example.com",date:"2027-01-20",time:"09:00",type:"Selección de regalo"};
 assert.deepEqual(validateAppointment(valid,[],"2027-01-19"),{});
 assert.ok(validateAppointment({...valid,date:"2027-01-18"},[],"2027-01-19").date);
 assert.ok(validateAppointment(valid,[{date:"2027-01-20",time:"09:00"}],"2027-01-19").time);
 assert.ok(validateAppointment({...valid,time:"21:00"},[],"2027-01-19").time);
});
