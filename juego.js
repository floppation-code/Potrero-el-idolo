/* --- ESTADO DEL JUGADOR --- */
let gameState = {
    year: 2023,
    age: 9,
    soccerLevel: 0, 
    money: 300, // Recreo inicial contado
    energy: 100,
    happiness: 80,
    currentScene: 'inicio',
    inventory: [],
    friends: ['Ian', 'Carlos'],
    route: 'estándar' // Define caminos ramificados
};

const soccerLevels = ["Malísimo", "Limitado", "Masó", "Aceptable", "Destacado", "Promesa total"];

/* --- ÁRBOL DE DECISIONES CON RAMIFICACIONES Y KIOSKO --- */
const storyData = {
    'inicio': {
        text: "<b>Año 2023 - Casanova</b><br>Tenés 9 años, medís 1.26m y sos malísimo en el fútbol. Vivís con tu familia: les alcanza para comer e impuestos básicos, pero están con lo justo (no llegan a los $200.000-$300.000 al mes). Ir a entrenar a un club pagado no es una opción.<br><br>En el recreo estás con Ian y Carlos (amigos desde 1ro). Se acerca <b>Tizi</b> (10 años, vive en La Candela). Tizi y Carlos se conocían de vista de un club de barrio pero no se hablaban. Tizi ve que unos pibes te cargan por errarle a la pelota y salta a defenderte.<br><br>¿Cómo reaccionás ante el gesto de Tizi?",
        choices: [
            { text: "Bancarte la parada con Tizi y armar grupo con los 4.", nextScene: 'grupo_casanova_unido', stats: { happiness: 10 }, friends: ['Tizi'] },
            { text: "Irte avergonzado a la aula a ahorrar tus pocos pesos.", nextScene: 'ruta_solitario', stats: { money: 200, happiness: -10 } }
        ]
    },

    'grupo_casanova_unido': {
        text: "Tizi calma las cosas. Carlos mete chistes para aliviar el ambiente e Ian se mata de risa. Quedan en ir a jugar a un potrero en Castillo el sábado. Como en tu casa el dinero está ajustado, tu mamá te da solo $300 para el fin de semana.",
        choices: [
            { text: "Usar los $300 para viajar en colectivo a Castillo a jugar.", nextScene: 'potrero_castillo', stats: { money: -300, soccer: 2 } },
            { text: "Ahorrar la plata para el futuro e ir caminando cansándote.", nextScene: 'camino_largo_castillo', stats: { energy: -30, soccer: 1 } }
        ]
    },

    'ruta_solitario': {
        text: "Te aislaste un tiempo. En casa se siente el ajuste económico, pero lográs juntar unos pesos guardando lo del recreo. Entrenás solo pateando contra la pared de tu casa.",
        choices: [
            { text: "Buscar reencontrarte con Ian, Carlos y Tizi en el potrero.", nextScene: 'potrero_castillo', stats: { soccer: 1 } },
            { text: "Seguir entrenando solo hasta el cambio de colegio.", nextScene: 'cambio_colegio' }
        ]
    },

    'potrero_castillo': {
        text: "En el potrero de Castillo el juego es rústico. Ian traba fuerte, Tizi te cubre las espaldas y Carlos tira magia. A pesar de tus limitaciones físicas y técnicas, te ponés firme de 9. Soñás con el Barcelona aunque la realidad de Casanova sea dura.",
        choices: [
            { text: "Avanzar en el tiempo hacia el cambio de colegio...", nextScene: 'cambio_colegio' }
        ]
    },

    'camino_largo_castillo': {
        text: "Llegaste agotado por caminar desde Casanova hasta Castillo, pero jugaste con el alma. Ian y Tizi valoraron tu esfuerzo.",
        choices: [
            { text: "Avanzar en el tiempo hacia el cambio de colegio...", nextScene: 'cambio_colegio' }
        ]
    },

    // ETAPA RAMOS MEJÍA (11 AÑOS - 2025)
    'cambio_colegio': {
        text: "<b>Año 2025 - Ramos Mejía</b><br>Tenés 11 años. Te cambiaste al colegio de Ramos Mejía (el ex Luzuriaga). En tu casa la situación monetaria sigue justa, pero juntaste un poco de plata. En el aula conocés a <b>Tobi</b> (11 años, de Castillo, juega al básquet).<br><br>En este colegio hay un <b>Kiosko grande</b> que vende golosinas e impulsadores (bebidas y snacks que te dan energía/potencial tipo Potrero).",
        year: 2025,
        age: 11,
        location: 'Ramos Mejía (Primaria)',
        classes: 'ramos-mode',
        choices: [
            { text: "Ir al Kiosko a ver qué impulsadores podés comprar.", nextScene: 'kiosko_ramos' },
            { text: "Hacerte amigo de Tobi e ir a la cancha de básquet.", nextScene: 'amigo_tobi', friends: ['Tobi'] }
        ]
    },

    'kiosko_ramos': {
        text: "<b>Kiosko del Colegio</b><br>El kiosquero tiene varios productos estratégicos. Tu saldo actual es de <b>$" + gameState.money + "</b>.<br>Selecciona una opción:",
        choices: [
            { text: "[Impulsador] Bebida Energizante ($300) -> +20% Energía / +1 Fútbol", nextScene: 'compra_energizante', reqMoney: 300, kiosk: true },
            { text: "[Impulsador] Turrón de la Suerte ($200) -> +15 Felicidad / +1 Fútbol", nextScene: 'compra_turron', reqMoney: 200, kiosk: true },
            { text: "Guardar la plata e ir a clases con Tobi.", nextScene: 'amigo_tobi', friends: ['Tobi'] }
        ]
    },

    'compra_energizante': {
        text: "Te tomaste el impulsador energizante. Sentís una sobrecarga de potencia en los recreos y empezás a patear más fuerte.",
        choices: [
            { text: "Avanzar a la Secundaria...", nextScene: 'secundaria_ramos' }
        ],
        effect: () => { gameState.money -= 300; gameState.energy = Math.min(100, gameState.energy + 20); gameState.soccerLevel += 1; }
    },

    'compra_turron': {
        text: "Compraste el turrón. Te da la energía justa para aguantar la jornada y destacar en los juegos de precisión.",
        choices: [
            { text: "Avanzar a la Secundaria...", nextScene: 'secundaria_ramos' }
        ],
        effect: () => { gameState.money -= 200; gameState.happiness += 15; gameState.soccerLevel += 1; }
    },

    'amigo_tobi': {
        text: "Tobi se vuelve un gran compañero. Aunque juega al básquet, te enseña sobre la importancia del salto y el físico.",
        choices: [
            { text: "Avanzar a la Secundaria...", nextScene: 'secundaria_ramos' }
        ]
    },

    // SECUNDARIA (12 AÑOS - 2026)
    'secundaria_ramos': {
        text: "<b>Año 2026 - Secundaria en Ramos Mejía</b><br>Tenés 12 años. Entrás al primer año en el mismo colegio. Tobi está en tu curso y conocés a <b>Michael</b> (12/13 años, alto, juega re bien al fútbol, barrio desconocido) y a <b>Thiago</b> (12 años, alto, robusto, usa lentes, juega 'masó').<br><br>Se viene el torneo del colegio que puede cambiar tu destino.",
        year: 2026,
        age: 12,
        location: 'Ramos Mejía (Secundaria)',
        choices: [
            { text: "Entrenar duro con Michael (Te enseña técnica de 9).", nextScene: 'entreno_michael', stats: { soccer: 3 }, friends: ['Michael', 'Thiago'] },
            { text: "Pasar por el Kiosko antes del torneo a comprar el impulsador definitivo.", nextScene: 'kiosko_secundaria', friends: ['Michael', 'Thiago'] }
        ]
    },

    'kiosko_secundaria': {
        text: "<b>Kiosko de la Secundaria</b><br>Tienen el impulsador 'Barça Pack' (Gatorade + Barra Proteica) por $500. Te otorga un rendimiento superior directo en la cancha.",
        choices: [
            { text: "Comprar 'Barça Pack' ($500) para romperla en el torneo.", nextScene: 'torneo_impulsado', reqMoney: 500, kiosk: true },
            { text: "Jugar el torneo a puro corazón sin impulsadores.", nextScene: 'torneo_corazon' }
        ]
    },

    'entreno_michael': {
        text: "Michael te enseña a perfilarte como los delanteros de Europa. Thiago te bancó en los entrenamientos y Tobi te tomó los tiempos. Tu nivel dio un salto enorme.",
        choices: [
            { text: "Jugar la Final del Torneo.", nextScene: 'final_torneo_exito' }
        ]
    },

    'torneo_impulsado': {
        text: "Con el impulsador del kiosko en el cuerpo, jugás el torneo en tu punto máximo. Sos un 9 imparable: hacés 4 goles en el campeonato y Michael te mete las asistencias.",
        choices: [
            { text: "Ver el desenlace de tu carrera.", nextScene: 'final_juego' }
        ],
        effect: () => { gameState.money -= 500; gameState.soccerLevel += 4; }
    },

    'torneo_corazon': {
        text: "Jugaron a puro pulmón. Thiago trabó todo, Michael gambeteó a medio equipo y vos empujaste dos pelotas claves abajo del arco. Llegaron a la final.",
        choices: [
            { text: "Ver el desenlace de tu carrera.", nextScene: 'final_juego' }
        ]
    },

    'final_torneo_exito': {
        text: "El entrenamiento con Michael dio sus frutos. En la última jugada del torneo escolar, metés un zapatazo al ángulo. Salen campeones.",
        choices: [
            { text: "Ver el desenlace de tu carrera.", nextScene: 'final_juego' }
        ]
    },

    'final_juego': {
        text: "",
        isFinal: true,
        choices: [
            { text: "Reiniciar Historia y probar otros caminos.", nextScene: 'inicio', reset: true }
        ]
    }
};

/* --- CONTROLADORES DE INTERFAZ Y LÓGICA --- */
const ui = {
    year: document.getElementById('stat-year'),
    age: document.getElementById('stat-age'),
    soccer: document.getElementById('stat-soccer'),
    money: document.getElementById('stat-money'),
    energy: document.getElementById('stat-energy'),
    story: document.getElementById('story-text'),
    choices: document.getElementById('choices-container'),
    container: document.getElementById('game-container'),
    location: document.getElementById('location')
};

function updateUI() {
    ui.year.innerText = gameState.year;
    ui.age.innerText = gameState.age;
    ui.money.innerText = "$" + gameState.money;
    ui.energy.innerText = gameState.energy + "%";

    let idx = Math.min(gameState.soccerLevel, soccerLevels.length - 1);
    ui.soccer.innerText = soccerLevels[idx];
}

function renderScene(sceneId) {
    const scene = storyData[sceneId];
    if (!scene) return;

    if (scene.effect) scene.effect();

    gameState.currentScene = sceneId;
    if (scene.year) gameState.year = scene.year;
    if (scene.age) gameState.age = scene.age;
    if (scene.location) ui.location.innerText = scene.location;
    
    if (scene.classes) {
        ui.container.classList.add(scene.classes);
    } else if (sceneId === 'inicio') {
        ui.container.classList.remove('ramos-mode');
        ui.location.innerText = "Casanova, Argentina";
    }

    if (scene.isFinal) {
        let evaluacionBarca = gameState.soccerLevel >= 5 
            ? "¡Ovisores de filiales europeas anotaron tu nombre! Estás en camino al sueño del Barcelona." 
            : "Sos un delantero respetado en la zona oeste, pero vas a tener que seguir entrenando duro para Europa.";

        ui.story.innerHTML = `
            <div class="final-card">
                <h2>RESUMEN DE TU CARRERA (12 AÑOS)</h2>
                <p><b>Nivel de Juego:</b> ${ui.soccer.innerText}</p>
                <p><b>Amigos de la Vida:</b> ${gameState.friends.join(", ")}</p>
                <p><b>Estado Económico Personal:</b> $${gameState.money}</p>
                <hr>
                <p>${evaluacionBarca}</p>
            </div>`;
    } else {
        ui.story.innerHTML = scene.text;
    }

    ui.choices.innerHTML = '';
    scene.choices.forEach(choice => {
        // Validación de dinero para opciones de Kiosko
        if (choice.reqMoney && gameState.money < choice.reqMoney) {
            return; // No muestra la opción si no alcanza la plata
        }

        const button = document.createElement('button');
        button.innerText = choice.text;
        button.classList.add('choice-btn');
        if (choice.kiosk) button.classList.add('kiosk-btn');

        button.addEventListener('click', () => makeChoice(choice));
        ui.choices.appendChild(button);
    });

    updateUI();
}

function makeChoice(choice) {
    if (choice.stats) {
        if (choice.stats.soccer) gameState.soccerLevel += choice.stats.soccer;
        if (choice.stats.happiness) gameState.happiness += choice.stats.happiness;
        if (choice.stats.money) gameState.money += choice.stats.money;
        if (choice.stats.energy) gameState.energy += choice.stats.energy;
    }
    
    if (choice.friends) {
        choice.friends.forEach(f => {
            if (!gameState.friends.includes(f)) gameState.friends.push(f);
        });
    }

    if (choice.reset) {
        gameState = {
            year: 2023,
            age: 9,
            soccerLevel: 0,
            money: 300,
            energy: 100,
            happiness: 80,
            currentScene: 'inicio',
            inventory: [],
            friends: ['Ian', 'Carlos'],
            route: 'estándar'
        };
    }

    renderScene(choice.nextScene);
}

// Iniciar el juego
renderScene('inicio');
  
