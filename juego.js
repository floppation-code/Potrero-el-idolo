/* --- BASE DE DATOS LOCAL Y LOGROS --- */
let carrerasGuardadas = JSON.parse(localStorage.getItem('carreras_potrero')) || [];
let logrosDesbloqueados = JSON.parse(localStorage.getItem('logros_potrero')) || [];

/* --- ESTADO DEL JUGADOR --- */
let gameState = {
    year: 2023,
    age: 9,
    money: 300,
    energy: 100,
    
    // Dispositivo y Colegio
    celular: "Celu Viejito 📱",
    permisoSalirSolo: false,
    notaColegio: 3,
    ubicacion: "Casanova (Casa y Colegio)",
    
    // Stats de Juego
    stats: {
        velocidad: 65,
        tiro: 40,
        pase: 45,
        fisico: 30,
        resistencia: 35
    },
    ovr: 43,
    
    // Estadísticas de Carrera
    goles: 0,
    asistencias: 0,
    partidosJugados: 0,
    lesionado: false,
    
    // YouTube
    ytSubs: 0,
    ytMonetizado: false,
    
    // Personajes y Relaciones
    friends: ['Ian', 'Carlos'],
    hermanos: {
        brian: "Brian (23 años en 2023): Callado, toma mate y tira chistes oportunos.",
        nico: "Nico (25 años en 2023): De joda, simpático pero siempre sin un peso."
    },
    
    logrosActuales: [],
    trofeos: []
};

/* --- CÁLCULO DE MEDIA (OVR) --- */
function recalcularOVR() {
    let s = gameState.stats;
    gameState.ovr = Math.round((s.velocidad + s.tiro + s.pase + s.fisico + s.resistencia) / 5);
}

/* --- SISTEMA DE DIFICULTAD Y PROBABILIDAD --- */
function intentarAccion(stat, dificultad) {
    let azar = Math.floor(Math.random() * 50);
    let total = gameState.stats[stat] + azar;
    return total >= dificultad;
}

function desbloquearLogro(nombreLogro) {
    if (!gameState.logrosActuales.includes(nombreLogro)) {
        gameState.logrosActuales.push(nombreLogro);
    }
    if (!logrosDesbloqueados.includes(nombreLogro)) {
        logrosDesbloqueados.push(nombreLogro);
        localStorage.setItem('logros_potrero', JSON.stringify(logrosDesbloqueados));
    }
}

/* --- HISTORIA EXPANDIDA Y RUTAS --- */
const storyData = {
    'menu_principal': {
        text: "<b>POTRERO EL ÍDOLO: SIMULADOR DE VIDA Y FÚTBOL ⚽🎮</b><br>Evolucioná desde los 9 años en Casanova hasta el profesionalismo. Podés ganar, pero también podés fracasar, lesionarte o quedar libre.",
        choices: [
            { text: "⚽ Iniciar Nueva Carrera (2023 - 9 Años)", nextScene: 'casa_9_anos' },
            { text: "📜 Ver Carreras Anteriores", nextScene: 'ver_historial' }
        ]
    },

    // ================= 9 AÑOS (2023) - CASANOVA =================
    'casa_9_anos': {
        text: "<b>Año 2023 - Tu Casa en Casanova (9 Años) 🏠</b><br>Estás en el comedor. <b>Brian</b> (23) toma mate en silencio y suelta un chiste seco que te hace escupir el jugo. <b>Nico</b> (25) entra cantando de la calle y le pide $200 a tu mamá para el colectivo.<br><br><b>Regla de casa:</b> Tu mamá NO te deja salir solo a la calle. Para hablar con tus amigos de 1ro (<b>Ian y Carlos</b>), jugás al Minecraft con el celu viejito por llamada.",
        year: 2023,
        age: 9,
        choices: [
            { text: "📱 Jugar Minecraft en llamada con Ian y Carlos (+5 Pase)", nextScene: 'vicio_minecraft', statsGain: { pase: 5 }, energyLoss: 15 },
            { text: "🏫 Ir a la Escuela (Único lugar para ver a los pibes en persona)", nextScene: 'escuela_recreo_9' },
            { text: "🧹 Ayudar a tu mamá a limpiar la casa (+$100 / -20% Energía)", nextScene: 'trabajo_casa' },
            { text: "😴 Dormir la siesta para recuperar energía (+30% Energía)", nextScene: 'dormir_9' }
        ]
    },

    'vicio_minecraft': {
        text: "<b>Tu Pieza 🎮</b><br>Te quedaste jugando con Ian y Carlos construyendo una casa en Minecraft mientras hablan por llamada. Mejoraste la coordinación de tus manos.",
        choices: [
            { text: "🏫 Al otro día: Ir a la escuela", nextScene: 'escuela_recreo_9' }
        ]
    },

    'trabajo_casa': {
        text: "<b>Limpiando el Patio 🧹</b><br>Acomodaste las cosas y barriste. Tu mamá te dio $100 de recompensa.",
        effect: function() { gameState.money += 100; gameState.energy -= 20; },
        choices: [
            { text: "👍 Guardar la plata e ir al colegio", nextScene: 'escuela_recreo_9' }
        ]
    },

    'dormir_9': {
        text: "<b>Descanso 💤</b><br>Te tiraste un rato a dormir. Recuperaste energías para el día siguiente.",
        effect: function() { gameState.energy = Math.min(100, gameState.energy + 30); },
        choices: [
            { text: "☀️ Despertar e ir a la escuela", nextScene: 'escuela_recreo_9' }
        ]
    },

    'escuela_recreo_9': {
        text: "<b>Escuela Primaria - Recreo (9 Años) 🏫</b><br>Estás en el patio charlando con <b>Ian y Carlos</b>. De repente, unos pibes más grandes te cargan por errarle a la pelota. Se acerca <b>Tizi</b> (10 años, de La Candela) a poner el pecho y defenderte.",
        choices: [
            { text: "🤝 Defenderte junto a Tizi, Ian y Carlos (Pelea / Físico)", nextScene: 'pelea_recreo' },
            { text: "🏃 Aprovechar tu velocidad (65 VEL) para sacar la pelota picando (+5 Vel)", nextScene: 'escapar_velocidad', statsGain: { velocidad: 5 } },
            { text: "🫣 Salir del patio e irte solo al aula a comer la merienda", nextScene: 'aislarse_9', effect: function() { gameState.friends = []; } }
        ]
    },

    'pelea_recreo': {
        text: "<b>¡Tensión en el Patio! 💥</b><br>Te metés a bancar la parada con Tizi.",
        choices: [
            { text: "💥 Enfrentarlos a las piñas", action: function() {
                if (intentarAccion('fisico', 50)) {
                    alert("¡Ganaron la pelea entre todos! Tizi se suma oficialmente al grupo de Ian y Carlos.");
                    gameState.friends.push('Tizi');
                    renderScene('fin_ano_9');
                } else {
                    alert("Eran más grandes... Te pegaron un empujón fuerte y te raspaste la rodilla (-30% Energía).");
                    gameState.energy -= 30;
                    renderScene('fin_ano_9');
                }
            }}
        ]
    },

    'escapar_velocidad': {
        text: "<b>¡Piques Demoledores! 🏃💨</b><br>Agarraste la pelota, le tiraste un amague a los pibes y saliste corriendo tan rápido que ni te tocaron. Tizi e Ian se matan de risa.",
        choices: [
            { text: "⏩ Terminar el año 2023", nextScene: 'fin_ano_9' }
        ]
    },

    'aislarse_9': {
        text: "<b>Solo en el Aula 🪑</b><br>Dejaste a los chicos tirados y te fuiste solo. Perdiste a tus amigos.",
        effect: function() { desbloquearLogro("0 Amigos 🚫"); },
        choices: [
            { text: "⏩ Avanzar de año", nextScene: 'fin_ano_9' }
        ]
    },

    'fin_ano_9': {
        text: "<b>Fin del Año 2023 🎆</b><br>Terminaste 4to grado. Sos un año más grande.",
        year: 2024,
        age: 10,
        choices: [
            { text: "⏩ Iniciar Año 2024 (10 Años)", nextScene: 'ano_10' }
        ]
    },

    // ================= 10 AÑOS (2024) =================
    'ano_10': {
        text: "<b>Año 2024 (10 Años) - Casanova 🏫</b><br>Seguís sin permiso para salir solo a la calle. Jugás al fútbol en el patio de la escuela y al Minecraft en casa. En el boletín tus notas vienen muy mal (3/10).",
        choices: [
            { text: "⚽ Entrenar tu tiro contra el paredón de casa (+5 Tiro)", nextScene: 'ano_11', statsGain: { tiro: 5 } },
            { text: "📱 Grabar tu primer video de Minecraft para YouTube (+100 Subs)", nextScene: 'ano_11', effect: function() { gameState.ytSubs += 100; } }
        ]
    },

    // ================= 11 Y 12 AÑOS (2025-2026) - RAMOS MEJÍA, ESTRELLA Y CELU =================
    'ano_11': {
        text: "<b>Año 2025 - Mudanza a Ramos Mejía (11 Años) 🏫</b><br>Te cambiaste de colegio al ex Luzuriaga. Conocés a <b>Tobi</b> 🏀 y a <b>Estrella</b> 👧.<br><br>Estrella cero deportes, pero es una luz estudiando. Como tus notas son horribles (3/10), ella se sienta al lado tuyo, te explica con paciencia y te pasa la tarea de Lengua y Matemática.",
        year: 2025,
        age: 11,
        ubicacion: "Ramos Mejía",
        effect: function() { if (!gameState.friends.includes('Estrella')) gameState.friends.push('Estrella'); },
        choices: [
            { text: "🧃 Comprarle un Baggio de Manzana en el kiosko en agradecimiento (-$150)", nextScene: 'baggio_estrella', reqMoney: 150 },
            { text: "📝 Decirle 'Gracias' y no comprarle nada esta vez", nextScene: 'cumple_12' }
        ]
    },

    'baggio_estrella': {
        text: "<b>Kiosko del Colegio 🧃</b><br>Le comprás el Baggio a Estrella. Se pone súper contenta y te salva de sacarte un 1 en el examen integrador.",
        effect: function() { 
            gameState.money -= 150; 
            gameState.notaColegio = 7;
            desbloquearLogro("Salvado por Estrella 🧃");
        },
        choices: [
            { text: "⏩ Avanzar a tu Cumpleaños de 12 (2026)", nextScene: 'cumple_12' }
        ]
    },

    'cumple_12': {
        text: "<b>Año 2026 - ¡Tu Cumpleaños de 12! 🎁📱</b><br>Brian (26) y Nico (28) entran a tu pieza. Nico hace quilombo y Brian te da una cajita: <b>¡Te regalaron un Celu Mucho Mejor juntando plata entre los dos!</b><br><br>Ahora podés grabar Minecraft re fluido para YouTube y transmitir en vivo.",
        year: 2026,
        age: 12,
        effect: function() { gameState.celular = "SmartPhone Nuevo 📱✨"; },
        choices: [
            { text: "🫂 Abrazar a Brian y a Nico y luego ir al colegio", nextScene: 'secundaria_michael' }
        ]
    },

    'secundaria_michael': {
        text: "<b>Patio del Colegio Secundaria (12 Años) 🏫🔥</b><br>Jugando con Tobi, Michael y Thiago 👓, la pelota va al techo. Michael sube a buscarla y, al escuchar a la preceptora, <b>¡SE TIRA DEL TECHO!</b> 💥<br><br>Se rompe el tobillo 🚑 pero rescata la pelota. Queda como leyenda total. Estrella te mira riéndose desde el banco: <i>'Si no estudias vas a terminar roto como Michael'</i>.",
        choices: [
            { text: "🧃 Comprarle otro Baggio a Estrella para que te salve las notas (-$150)", nextScene: 'cumple_13', reqMoney: 150, effect: function() { gameState.money -= 150; } },
            { text: "🔥 Ir a la clínica con Michael a hacerle el aguante", nextScene: 'cumple_13' }
        ]
    },

    // ================= 13 AÑOS (2027) - SALIR SOLO Y PRUEBAS =================
    'cumple_13': {
        text: "<b>Año 2027 - 13 Años (Años Clave) 🔑🔓</b><br>¡Llegó el día! Tu mamá habla con vos: <i>'Ya estás grande. Tenés permiso para ir y volver solo del colegio y salir al barrio'</i>.<br><br>¡Por fin tenés libertad para moverte solo y probarte en clubes de verdad!",
        year: 2027,
        age: 13,
        effect: function() { gameState.permisoSalirSolo = true; },
        choices: [
            { text: "🏃 Irte solo a probar a las Inferiores de un Club de Barrio (Examen Físico)", nextScene: 'prueba_club' },
            { text: "🍕 Juntarte solo por primera vez con los pibes en la plaza", nextScene: 'plaza_13' },
            { text: "💼 Buscar un trabajo atendiendo un almacén para juntar plata (+$500 / -40% Energía)", nextScene: 'trabajo_almacen' }
        ]
    },

    'trabajo_almacen': {
        text: "<b>Almacén del Barrio 🏪</b><br>Trabajaste atendiendo a los vecinos. Terminaste cansado pero juntaste plata para tus botines.",
        effect: function() { gameState.money += 500; gameState.energy -= 40; },
        choices: [
            { text: "⚽ Ir a la prueba del club", nextScene: 'prueba_club' }
        ]
    },

    'plaza_13': {
        text: "<b>La Plaza con los Pibes 🍕</b><br>Te juntaste con los chicos a tomar una gaseosa libremente por primera vez sin que te vayan a buscar.",
        choices: [
            { text: "⚽ Ir a probarte al club", nextScene: 'prueba_club' }
        ]
    },

    'prueba_club': {
        text: "<b>Prueba de Jugadores en Inferiores 🏟️</b><br>El DT te pone en la cancha. Tenés que demostrar tu velocidad (65 VEL) o tu juego.",
        choices: [
            { text: "⚡ Desbordar a pura velocidad por la banda (Prueba de Vel)", action: function() {
                if (intentarAccion('velocidad', 70)) {
                    alert("¡LA ROMPISTE! El DT te fichó para el club.");
                    desbloquearLogro("Fichado en Inferiores 📝");
                    renderScene('torneo_juvenil');
                } else {
                    alert("Te marcaron bien y te cansaste rápido. Te dijeron que vuelvas el año que viene.");
                    renderScene('fracaso_prueba');
                }
            }},
            { text: "🎯 Intentar pases filtrados (Prueba de Pase)", action: function() {
                if (intentarAccion('pase', 65)) {
                    alert("¡Buena visión de juego! Entraste al equipo.");
                    renderScene('torneo_juvenil');
                } else {
                    alert("Erraste 3 pases seguidos. El DT te mandó al banco.");
                    renderScene('fracaso_prueba');
                }
            }}
        ]
    },

    'fracaso_prueba': {
        text: "<b>Fracaso en la Prueba ❌</b><br>No quedaste. Así es el fútbol real: no siempre se gana. Te toca entrenar en el gimnasio o jugar torneos de barrio.",
        choices: [
            { text: "🏋️ Ir al Gimnasio a entrenar Físico y Resistencia (+10 Stats)", nextScene: 'cumple_13', statsGain: { fisico: 10, resistencia: 10 } }
        ]
    },

    'torneo_juvenil': {
        text: "<b>Final del Torneo Juvenil 🏆</b><br>Llegaste a la final. El partido está 1 a 1 en el minuto 88.",
        choices: [
            { text: "👟 Pegarle al arco desde afuera del área (Tiro)", action: function() {
                if (intentarAccion('tiro', 70)) {
                    alert("¡GOLAZO CLAVADO AL ÁNGULO! Campeones del torneo.");
                    gameState.trofeos.push("Copa Juvenil Barrio 🏆");
                    desbloquearLogro("Campeón de Barrio 🏆");
                    renderScene('etapa_18_anos');
                } else {
                    alert("La tiraste a la tribuna... Fueron a penales y PERDIERON la final.");
                    renderScene('etapa_18_anos');
                }
            }},
            { text: "💥 Ir a trabar fuerte con la cabeza (Lesión / Físico)", action: function() {
                if (intentarAccion('fisico', 75)) {
                    alert("Recuperaste la pelota y asististe para el gol del triunfo.");
                    gameState.trofeos.push("Copa Juvenil Barrio 🏆");
                    renderScene('etapa_18_anos');
                } else {
                    alert("¡CRACK! Te chocaste feo y te rompiste los ligamentos. 6 meses lesionado.");
                    gameState.lesionado = true;
                    desbloquearLogro("Lesión Grave 🚑");
                    renderScene('etapa_18_anos');
                }
            }}
        ]
    },

    // ================= 18+ AÑOS =================
    'etapa_18_anos': {
        text: "<b>Año 2032 - 18 Años Cumplidos 🔞</b><br>Ya sos mayor de edad. Ahora SÍ podés viajar al exterior si juntaste la plata suficiente ($5.000) o si te busca un representante de Europa.",
        year: 2032,
        age: 18,
        choices: [
            { text: "✈️ Viajar a España a probarte en el FC Barcelona (Requiere $5.000)", nextScene: 'barcelona_prueba', reqMoney: 5000 },
            { text: "🇦🇷 Jugar la Copa América con la Selección Argentina", nextScene: 'copa_america_final' },
            { text: "💼 Trabajar a tiempo completo para juntar los $5.000 del pasaje", nextScene: 'trabajo_grande' }
        ]
    },

    'trabajo_grande': {
        text: "<b>Trabajando Fuerte 💼</b><br>Trabajaste duro todo el año y ahorraste para el pasaje a Europa.",
        effect: function() { gameState.money += 3000; },
        choices: [
            { text: "✈️ Intentar el viaje a Europa", nextScene: 'etapa_18_anos' }
        ]
    },

    'barcelona_prueba': {
        text: "<b>Pruebas en Barcelona 🇪🇸🏟️</b><br>Estás en La Masía. Si aprobás esta prueba, firmás tu primer contrato millonario.",
        choices: [
            { text: "🔥 Demostrar todo tu nivel", action: function() {
                recalcularOVR();
                if (gameState.ovr >= 65) {
                    alert("¡FIRMATE CONTRATO EN EUROPA! Sos jugador profesional del Barcelona.");
                    gameState.trofeos.push("Champions League 🏆");
                    desbloquearLogro("Pase a Europa ✈️");
                    renderScene('menu_principal');
                } else {
                    alert("Tu nivel de OVR (" + gameState.ovr + ") es muy bajo para Europa. Quedaste libre.");
                    renderScene('menu_principal');
                }
            }}
        ]
    },

    'copa_america_final': {
        text: "<b>Final de la Copa América con la Selección 🇦🇷🏆</b><br>Minuto 90. Penal a favor.",
        choices: [
            { text: "⚽ Patear el penal decisivo", action: function() {
                if (intentarAccion('tiro', 60)) {
                    alert("¡GOL DE ARGENTINA! ¡CAMPEONES DE AMÉRICA!");
                    gameState.trofeos.push("Copa América 🏆");
                    desbloquearLogro("Campeón de América 🏆");
                    renderScene('menu_principal');
                } else {
                    alert("Lo erraste... Perdiste la Copa América.");
                    renderScene('menu_principal');
                }
            }}
        ]
    },

    'ver_historial': {
        text: function() {
            if (carrerasGuardadas.length === 0) return "<b>No tenés carreras guardadas aún.</b>";
            let html = "<b>HISTORIAL DE CARRERAS:</b><br><br>";
            carrerasGuardadas.forEach(function(c, idx) {
                html += "<b>Carrera #" + (idx + 1) + ":</b> Media " + c.ovr + " | Trofeos: " + (c.trofeos.join(", ") || "Ninguno") + "<br>";
            });
            return html;
        },
        choices: [
            { text: "⬅️ Volver al Menú", nextScene: 'menu_principal' }
        ]
    }
};

/* --- RENDERIZADO Y LÓGICA DE INTERFAZ --- */
function updateUI() {
    recalcularOVR();
    document.getElementById('stat-year').innerText = gameState.year;
    document.getElementById('stat-age').innerText = gameState.age;
    document.getElementById('stat-soccer').innerText = gameState.ovr;
    document.getElementById('stat-energy').innerText = gameState.energy + "%";
    document.getElementById('stat-money').innerText = "$" + gameState.money.toLocaleString();
    document.getElementById('stat-celu').innerText = gameState.celular;
    document.getElementById('stat-nota').innerText = gameState.notaColegio + "/10";
    
    let listElem = document.getElementById('achievements-list');
    if (logrosDesbloqueados.length > 0) {
        listElem.innerHTML = "• " + logrosDesbloqueados.join("<br>• ");
    } else {
        listElem.innerText = "Todavía no desbloqueaste ningún logro.";
    }
}

function renderScene(sceneId) {
    const scene = storyData[sceneId];
    if (!scene) return;

    if (scene.effect) scene.effect();
    if (scene.year) gameState.year = scene.year;
    if (scene.age) gameState.age = scene.age;
    if (scene.ubicacion) document.getElementById('location').innerText = "📍 " + scene.ubicacion;

    document.getElementById('story-text').innerHTML = typeof scene.text === 'function' ? scene.text() : scene.text;

    const container = document.getElementById('choices-container');
    container.innerHTML = '';

    scene.choices.forEach(function(choice) {
        if (choice.reqMoney && gameState.money < choice.reqMoney) return;

        const button = document.createElement('button');
        button.innerText = choice.text;
        button.classList.add('choice-btn');

        button.addEventListener('click', function() {
            if (choice.statsGain) {
                for (let stat in choice.statsGain) {
                    gameState.stats[stat] += choice.statsGain[stat];
                }
            }
            if (cho
