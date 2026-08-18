/* --- BASE DE DATOS LOCAL PARA HISTORIAL Y LOGROS --- */
let carrerasGuardadas = JSON.parse(localStorage.getItem('carreras_potrero')) || [];
let logrosDesbloqueados = JSON.parse(localStorage.getItem('logros_potrero')) || [];

/* --- ESTADO INICIAL DEL JUGADOR --- */
let gameState = {
    year: 2023,
    age: 9,
    money: 300,
    energy: 100,
    
    // Dispositivo y Permisos
    celular: "Celu Viejito", 
    permisoSalirSolo: false, 
    
    // Stats Iniciales
    stats: {
        velocidad: 65,
        tiro: 40,
        pase: 45,
        fisico: 30,
        resistencia: 35,
        liderazgo: 25
    },
    ovr: 40,
    
    // YouTube y Finanzas
    ytChannel: false,
    ytSubs: 0,
    finanzasDesbloqueadas: false,
    
    // Familiares y Amigos
    hermanos: [
        { nombre: "Brian", edad2026: 26, personalidad: "Callado, tira chistes oportunos" },
        { nombre: "Nico", edad2026: 28, personalidad: "Jodón, buena onda, siempre sin un peso" }
    ],
    friends: ['Ian', 'Carlos'],
    decisionesClave: [],
    clubActual: 'Barrio Unido (Libre)',
    
    // Trofeos y Logros
    trofeosCarrera: [],
    logrosCarrera: []
};

/* --- CÁLCULO DE MEDIA (OVR) --- */
function recalcularOVR() {
    let s = gameState.stats;
    gameState.ovr = Math.round((s.velocidad + s.tiro + s.pase + s.fisico + s.resistencia + s.liderazgo) / 6);
}

/* --- HISTORIA Y ESCENAS --- */
const storyData = {
    'menu_principal': {
        text: "<b>POTRERO EL ÍDOLO: SIMULADOR DE CARRERA ⚽🎮</b><br>Vida familiar, colegio, Minecraft, amigos y fútbol profesional.",
        choices: [
            { text: "⚽ Iniciar Nueva Carrera (2023 - 9 Años)", nextScene: 'inicio' },
            { text: "📜 Ver Historial de Carreras", nextScene: 'ver_historial' },
            { text: "🏆 Ver Logros Desbloqueados", nextScene: 'ver_logros' }
        ]
    },

    // === 9 AÑOS - CASANOVA (2023) ===
    'inicio': {
        text: "<b>Año 2023 - Casanova (9 años) 🏠</b><br>En casa están <b>Brian</b> (23) tomando unos mates callado y <b>Nico</b> (25) pidiéndole plata a tu mamá.<br><br>Tenés 9 años: no podés salir solo a la calle. Jugás al Minecraft por llamada con tus amigos desde tu celito viejito.",
        choices: [
            { text: "📱 Jugar Minecraft en llamada con Ian y Carlos", nextScene: 'recreo_9', statsGain: { pase: 2 } },
            { text: "⚽ Ir a la escuela (Único lugar donde te juntás)", nextScene: 'recreo_9' }
        ]
    },

    'recreo_9': {
        text: "<b>En el Recreo del Colegio 🏫</b><br>Estás con Ian y Carlos. Se acerca <b>Tizi</b> (10 años) a defenderte de unos chicos que te molestaban.",
        choices: [
            { text: "🤝 Sumar a Tizi al grupo.", nextScene: 'potrero_colegio', friends: ['Tizi'], tag: 'Amigos_Fieles' },
            { text: "🫣 Salir del grupo e irte solo.", nextScene: 'potrero_colegio' }
        ]
    },

    'potrero_colegio': {
        text: "<b>Patio de la Escuela ⚽</b><br>Aprovechas el recreo al máximo.",
        choices: [
            { text: "🏃 Entrenar tu velocidad única en el patio (+5 Vel)", nextScene: 'cambio_colegio', statsGain: { velocidad: 5 } }
        ]
    },

    // === 11 Y 12 AÑOS (2025-2026) - ESTRELLA, BAGGIO Y CELU NUEVO ===
    'cambio_colegio': {
        text: "<b>Año 2025 - Ramos Mejía (11 años) 🏫</b><br>Te cambiaste al ex Luzuriaga. Conocés a Tobi 🏀 y a <b>Estrella</b> 👧.<br><br>Estrella cero deportes, pero te salva la vida: las notas te van horrible por estar pensando todo el día en el fútbol. Ella te explica pacientemente y te pasa la tarea de Matemáticas y Lengua.",
        year: 2025,
        age: 11,
        friends: ['Estrella'],
        choices: [
            { text: "🧃 Comprarle un Baggio de Manzana en agradecimiento ($150)", nextScene: 'cumple_12', reqMoney: 150, effect: () => { gameState.money -= 150; }, tag: 'Baggio_Estrella' },
            { text: "📝 Decirle 'gracias' y no comprarle nada esta vez", nextScene: 'cumple_12' }
        ]
    },

    'cumple_12': {
        text: "<b>Año 2026 - ¡Tu Cumpleaños de 12! 🎁📱</b><br>Brian y Nico entran a tu pieza con una cajita: <b>¡Te regalaron un Celu Mucho Mejor juntando plata entre los dos!</b><br><br>Ahora podés grabar Minecraft fluido para YouTube. Y en la escuela, Estrella te sigue pasando las tareas a cambio de su Baggio.",
        year: 2026,
        age: 12,
        effect: () => { gameState.celular = "SmartPhone Nuevo (Regalo de Hermanos)"; },
        choices: [
            { text: "🫂 Agradecer a tus hermanos e ir al colegio", nextScene: 'secundaria_2026', statsGain: { liderazgo: 5 } }
        ]
    },

    'secundaria_2026': {
        text: "<b>Patio de Secundaria (12 años) 🏫🔥</b><br>Jugando con Tobi, Michael y Thiago 👓, la pelota va al techo. Michael se sube, y al escuchar a la preceptora, <b>¡se tira del techo!</b> 💥<br><br>Se rompe el tobillo 🚑 pero rescata la pelota. Queda como leyenda total y todas las pibas andan atrás de él 😎. Estrella te mira desde el banco riéndose y te dice: <i>'Si no te ponés a estudiar, vas a terminar igual'</i>.",
        choices: [
            { text: "🧃 Comprarle otro Baggio a Estrella para que te salve el examen", nextScene: 'cumple_13', reqMoney: 150, effect: () => { gameState.money -= 150; }, tag: 'Baggio_Estrella' },
            { text: "🔥 Ir a apoyar a Michael en su recuperación", nextScene: 'cumple_13', friends: ['Michael', 'Thiago'] }
        ]
    },

    // === 13 AÑOS (2027) - SALIR SOLO Y FÚTBOL ===
    'cumple_13': {
        text: "<b>Año 2027 - 13 Años 🔑🔓</b><br>Tu mamá te da permiso para ir y volver solo del colegio y salir al barrio. Ya podés irte a probar a un club por tu cuenta.",
        year: 2027,
        age: 13,
        effect: () => { gameState.permisoSalirSolo = true; },
        choices: [
            { text: "🏃 Ir solo a probarte a un club de Inferiores", nextScene: 'etapa_profesional', statsGain: { fisico: 5, resistencia: 5 } },
            { text: "🍕 Juntarte solo con tus amigos en la plaza", nextScene: 'etapa_profesional', statsGain: { liderazgo: 5 } }
        ]
    },

    // === CARRERA PROFESIONAL ===
    'etapa_profesional': {
        text: "<b>Desarrollo Profesional 🏟️</b><br>Llegaste a Primera División mientras tus videos de YouTube de Minecraft dieron sus frutos.",
        year: 2030,
        age: 16,
        choices: [
            { text: "🏆 Jugar la Champions League con el FC Barcelona", nextScene: 'menu_principal', effect: () => { gameState.trofeosCarrera.push("Champions League 🇪🇸🏆"); }, isFinal: true },
            { text: "🌍 Jugar la Copa del Mundo con la Selección", nextScene: 'menu_principal', effect: () => { gameState.trofeosCarrera.push("Copa del Mundo 🌍🏆"); }, isFinal: true }
        ]
    },

    'ver_historial': {
        text: () => {
            if (carrerasGuardadas.length === 0) return "<b>No hay carreras registradas aún.</b>";
            let html = "<b>HISTORIAL DE CARRERAS:</b><br><br>";
            carrerasGuardadas.forEach((c, idx) => {
                html += `<b>Carrera #${idx + 1}:</b> Media ${c.ovr} | Celu: ${c.celu} | Trofeos: ${c.trofeos.length}<br>`;
            });
            return html;
        },
        choices: [
            { text: "⬅️ Volver al Menú", nextScene: 'menu_principal' }
        ]
    },

    'ver_logros': {
        text: () => {
            if (logrosDesbloqueados.length === 0) return "<b>Sin logros desbloqueados.</b>";
            return "<b>LOGROS EN TU VITRINA:</b><br><br>• " + logrosDesbloqueados.join("<br>• ");
        },
        choices: [
            { text: "⬅️ Volver al Menú", nextScene: 'menu_principal' }
        ]
    }
};

/* --- CONTROLADORES Y RENDERIZADO --- */
const ui = {
    year: document.getElementById('stat-year'),
    age: document.getElementById('stat-age'),
    soccer: document.getElementById('stat-soccer'),
    money: document.getElementById('stat-money'),
    energy: document.getElementById('stat-energy'),
    story: document.getElementById('story-text'),
    choices: document.getElementById('choices-container'),
    location: document.getElementById('location')
};

function updateUI() {
    recalcularOVR();
    ui.year.innerText = gameState.year;
    ui.age.innerText = gameState.age;
    ui.money.innerText = "$" + gameState.money.toLocaleString();
    ui.energy.innerText = gameState.energy + "%";
    ui.soccer.innerText = gameState.ovr + " OVR";
}

function renderScene(sceneId) {
    const scene = storyData[sceneId];
    if (!scene) return;

    if (scene.effect) scene.effect();

    gameState.currentScene = sceneId;
    if (scene.year) gameState.year = scene.year;
    if (scene.age) gameState.age = scene.age;

    if (scene.isFinal) {
        carrerasGuardadas.push({
            ovr: gameState.ovr,
            celu: gameState.celular,
            trofeos: gameState.trofeosCarrera
        });
        localStorage.setItem('carreras_potrero', JSON.stringify(carrerasGuardadas));

        ui.story.innerHTML = `
            <div class="final-card">
                <h2>CARRERA FINALIZADA 🏆</h2>
                <p><b>Media Alcanzada:</b> ${gameState.ovr}</p>
                <p><b>Celu Final:</b> ${gameState.celular}</p>
                <p><b>Trofeos:</b> ${gameState.trofeosCarrera.join(", ") || "Ninguno"}</p>
                <p><b>Amigos de la Vida:</b> ${gameState.friends.join(", ")}</p>
                <p><b>Hermanos orgullosos:</b> Brian y Nico festejando en el barrio 🥳</p>
            </div>`;
    } else {
        ui.story.innerHTML = typeof scene.text === 'function' ? scene.text() : scene.text;
    }

    ui.choices.innerHTML = '';
    scene.choices.forEach(choice => {
        if (choice.reqMoney && gameState.money < choice.reqMoney) return;

        const button = document.createElement('button');
        button.innerText = choice.text;
        button.classList.add('choice-btn');

        button.addEventListener('click', () => makeChoice(choice));
        ui.choices.appendChild(button);
    });

    updateUI();
}

function makeChoice(choice) {
    if (choice.statsGain) {
        for (let stat in choice.statsGain) {
            gameState.stats[stat] += choice.statsGain[stat];
        }
    }

    if (choice.friends) {
        choice.friends.forEach(f => {
            if (!gameState.friends.includes(f)) gameState.friends.push(f);
        });
    }

    if (choice.tag) gameState.decisionesClave.push(choice.tag);

    renderScene(choice.nextScene);
}

// Iniciar
renderScene('menu_principal');
             
