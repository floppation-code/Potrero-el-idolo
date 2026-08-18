/* --- ESTADO DEL JUGADOR --- */
let gameState = {
    year: 2023, age: 9, money: 300, energy: 100,
    ubicacion: "Casanova",
    // Stats Nuevas
    stats: {
        velocidad: 60,
        tiro: 40,
        resistencia: 30, // Afecta el cansancio
        potencia: 30,
        liderazgo: 20,
        pase: 40
    },
    // Sistema de Equipo Realista
    equipo: null, // Acá guardaremos el nombre del club
    compañeros: [], // Lista de objetos: { nombre: "Ian", afinidad: 0 }
    ovr: 40
};

/* --- LÓGICA DE JUEGO --- */

// Calcula la reducción de energía basada en la resistencia
function gastarEnergia(cantidad) {
    // A más resistencia, menos energía gastás (la resistencia reduce el gasto entre un 0% y 50%)
    let reduccion = Math.min(gameState.stats.resistencia / 2, 50); 
    let gastoReal = Math.floor(cantidad * (1 - (reduccion / 100)));
    gameState.energy = Math.max(0, gameState.energy - gastoReal);
}

function recalcularOVR() {
    let s = gameState.stats;
    gameState.ovr = Math.round((s.velocidad + s.tiro + s.resistencia + s.potencia + s.liderazgo + s.pase) / 6);
}

// Función para mejorar relación con compañeros
function mejorarVinculo(nombreCompañero) {
    let comp = gameState.compañeros.find(c => c.nombre === nombreCompañero);
    if (comp) {
        comp.afinidad += 10;
        alert("¡Tu conexión con " + nombreCompañero + " mejoró! (Afinidad: " + comp.afinidad + ")");
    }
}

/* --- HISTORIA --- */
const storyData = {
    'menu_principal': {
        text: "<b>POTRERO EL ÍDOLO ⚽</b><br>Evolucioná con tus compañeros.",
        choices: [{ text: "⚽ Iniciar Carrera", nextScene: 'inicio' }]
    },
    'inicio': {
        text: "<b>Barrio Casanova</b><br>Tenés 9 años. Empezás a entrenar.",
        choices: [
            { text: "Entrenar físico (+10 Resistencia)", nextScene: 'inicio', effect: () => { gameState.stats.resistencia += 10; gastarEnergia(20); } },
            { text: "Unirte al Club de Barrio", nextScene: 'equipo_local' }
        ]
    },
    'equipo_local': {
        text: "<b>¡Te uniste a 'Los Pibes del Barrio'!</b><br>Ahora tenés compañeros reales.",
        effect: () => { 
            gameState.equipo = "Los Pibes del Barrio";
            gameState.compañeros = [{ nombre: "Ian", afinidad: 0 }, { nombre: "Carlos", afinidad: 0 }];
        },
        choices: [
            { text: "Pasar la tarde con Ian (+10 Afinidad)", nextScene: 'entrenamiento', effect: () => mejorarVinculo("Ian") },
            { text: "Practicar tiros con Carlos (+10 Afinidad)", nextScene: 'entrenamiento', effect: () => { mejorarVinculo("Carlos"); gameState.stats.tiro += 5; } }
        ]
    },
    'entrenamiento': {
        text: "<b>Entrenamiento grupal</b><br>La afinidad con tus compañeros ayuda en la cancha.",
        choices: [{ text: "Volver", nextScene: 'inicio' }]
    }
};

/* --- RENDERIZADO --- */
function updateUI() {
    recalcularOVR();
    document.getElementById('stat-soccer').innerText = gameState.ovr;
    document.getElementById('stat-energy').innerText = gameState.energy + "%";
    document.getElementById('stat-year').innerText = gameState.year;
    // Mostrar equipo si existe
    if(gameState.equipo) {
        document.getElementById('location').innerText = "📍 Club: " + gameState.equipo;
    }
}

function renderScene(sceneId) {
    const scene = storyData[sceneId];
    if (!scene) return;
    if (scene.effect) scene.effect();
    
    document.getElementById('story-text').innerHTML = scene.text;
    const container = document.getElementById('choices-container');
    container.innerHTML = '';
    
    scene.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.innerText = choice.text;
        btn.classList.add('choice-btn');
        btn.onclick = () => {
            if(choice.effect) choice.effect();
            renderScene(choice.nextScene);
        };
        container.appendChild(btn);
    });
    
    updateUI();
}

renderScene('menu_principal');
