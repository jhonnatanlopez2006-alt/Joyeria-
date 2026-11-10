/**
 * Repositorio local de demostración. NO es una API ni reemplaza una base de datos.
 * No se almacenan nombres/correos de formularios ni credenciales.
 */
export const STORAGE_KEY="joyeria-jc-fase2-v1";
export const emptyState=()=>({cart:[],favorites:[],orders:[],appointments:[]});
export function readState(storage=globalThis.localStorage){
 try{
  const parsed=JSON.parse(storage.getItem(STORAGE_KEY));
  if(!parsed||typeof parsed!=="object")return emptyState();
  return {cart:Array.isArray(parsed.cart)?parsed.cart:[],favorites:Array.isArray(parsed.favorites)?parsed.favorites:[],
   orders:Array.isArray(parsed.orders)?parsed.orders:[],appointments:Array.isArray(parsed.appointments)?parsed.appointments:[]};
 }catch{return emptyState();}
}
export function writeState(state,storage=globalThis.localStorage){
 try{
  storage.setItem(STORAGE_KEY,JSON.stringify({cart:state.cart,favorites:state.favorites,orders:state.orders,appointments:state.appointments}));
  return true;
 }catch{return false;}
}
