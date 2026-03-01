document.addEventListener("DOMContentLoaded", ()=>{

/*==========================
REPRODUCCIÓN DE AUDIO
==============================*/

const modal = document.getElementById("audioModal");
const btnConAudio = document.getElementById("btnConAudio");
const btnSinAudio = document.getElementById("btnSinAudio");
const musica = document.getElementById("musicaFondo");

btnConAudio.addEventListener("click", () => {
    musica.play();
    cerrarModal();
});

btnSinAudio.addEventListener("click", () => {
    cerrarModal();
});

function cerrarModal(){
    modal.style.opacity = "0";
    modal.style.pointerEvents = "none";
    setTimeout(()=>{
        modal.style.display="none";
    },400);
}

/*CONTROL DE VISIBILIDAD*/
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        musica.pause();
    } else {
        if (localStorage.getItem("audioElegido") === "si") {
            musica.play().catch(()=>{});
        }
    }
});


/* =========================
   ANIMACIÓN POR SECCIÓN
========================= */

const paginas = document.querySelectorAll(".pagina");

const observer = new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add("activa");
}
});
},{
threshold:0.35
});

paginas.forEach(pagina=> observer.observe(pagina));

// Activar primera sección manualmente
if(paginas.length > 0){
paginas[0].classList.add("activa");
}


/* =========================
   PARÁMETROS URL
========================= */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzUXO0OUn3tzEQHmuSKSG_4OZyXpN9uhxh2CbaMSDg3qoezEVigrnLewNo2f1mhvnc8Gw/exec";
const MI_NUMERO = "50230988019";

const params = new URLSearchParams(window.location.search);
const nombre = params.get("nombre") || "Invitado Especial";
const lugares = params.get("lugares") || "1";
const id = params.get("id");

const nombreEl = document.getElementById("nombreInvitado");
const lugaresEl = document.getElementById("lugaresInvitado");
const btn = document.getElementById("btnConfirmar");
const estado = document.getElementById("estadoConfirmacion");

if(nombreEl) nombreEl.innerText = nombre;
if(lugaresEl) lugaresEl.innerText = lugares;


/* =========================
   VALIDAR CONFIRMACIÓN
========================= */

async function verificarConfirmacion(){
if(!id) return;

try{
const res = await fetch(`${SCRIPT_URL}?id=${id}`,{
  method: "GET",
  mode: "cors"
});
const data = await res.json();

if(data && data.existe === true){
estado.innerText = "YA HAS CONFIRMADO TU ASISTENCIA 💛";
btn.style.display = "none";
}
}catch(e){
console.log("Error validando confirmación");
}
}

verificarConfirmacion();


/* =========================
   CONFIRMAR
========================= */

if(btn){
btn.addEventListener("click", async ()=>{

const mensaje = `Hola Rosy y Santiago \u{1F48D} \u{2728}

Confirmo mi asistencia:

Nombre: ${nombre}
Lugares: ${lugares}`;

try{
await fetch(SCRIPT_URL,{
  method: "POST",
  mode: "cors",
  headers: {
    "Content-Type": "text/plain"
  },
  body: JSON.stringify({nombre,lugares,id})
});
}catch(e){
console.log("Error guardando confirmación");
}

window.open(
`https://wa.me/${MI_NUMERO}?text=${encodeURIComponent(mensaje)}`,
"_blank"
);

estado.innerText = "Confirmación enviada 💛";
btn.style.display = "none";

});
}


/* =========================
   CONTADOR
========================= */

const fechaEvento = new Date("March 28, 2026 14:00:00").getTime();
const fechaDiaBoda = new Date("March 28, 2026 00:00:00").getTime();
const contadorEl = document.getElementById("contador");

if(contadorEl){

const intervalo = setInterval(()=>{

const ahora = new Date().getTime();
let diff = fechaEvento - ahora;

if(ahora >= fechaEvento){
contadorEl.innerHTML = `
<div class="bloque-tiempo">
<span>0</span>
<small>Horas</small>
</div>
<div class="bloque-tiempo">
<span>0</span>
<small>Min</small>
</div>
`;
clearInterval(intervalo);
return;
}

const dias = Math.floor(diff / (1000*60*60*24));
const horas = Math.floor((diff % (1000*60*60*24))/(1000*60*60));
const minutos = Math.floor((diff % (1000*60*60))/(1000*60));

if(ahora >= fechaDiaBoda){
contadorEl.innerHTML = `
<h3>HOY ES EL GRAN DÍA 🎉</h3>
<div class="bloque-tiempo">
<span>${horas}</span>
<small>Horas</small>
</div>
<div class="bloque-tiempo">
<span>${minutos}</span>
<small>Min</small>
</div>
`;
}else{
contadorEl.innerHTML = `
<div class="bloque-tiempo">
<span>${dias}</span>
<small>Días</small>
</div>
<div class="bloque-tiempo">
<span>${horas}</span>
<small>Horas</small>
</div>
<div class="bloque-tiempo">
<span>${minutos}</span>
<small>Min</small>
</div>
`;
}

},1000);

};

});
