function generar(){

const nombre = document.getElementById("nombre").value;
const lugares = document.getElementById("lugares").value;
const celularInvitado = document.getElementById("celularInvitado").value;

if(!nombre || !lugares || !celularInvitado){
alert("Completa todos los campos");
return;
}

const id = crypto.randomUUID();

const link = `${window.location.origin}/invitacion-rosy/index.html?nombre=${encodeURIComponent(nombre)}&lugares=${lugares}&id=${id}`;

const mensaje = `Hola ${nombre} \u{1F4E9}
Aquí está tu invitación:
${link}`;

window.open(
`https://wa.me/${celularInvitado}?text=${encodeURIComponent(mensaje)}`,
"_blank"
);

}
