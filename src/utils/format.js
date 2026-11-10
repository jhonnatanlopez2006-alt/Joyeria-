/** Utilidades sin dependencias de terceros. */
export const money = value => new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(value);
export const normalizeText = value => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("es").trim();
export const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
export const localDateString = (date = new Date()) => {
 const year = date.getFullYear(),month = String(date.getMonth()+1).padStart(2,"0"),day = String(date.getDate()).padStart(2,"0");
 return year+"-"+month+"-"+day;
};
