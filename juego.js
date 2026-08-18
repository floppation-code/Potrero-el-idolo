let gameState = {
    year: 2023, age: 9, money: 300, energy: 100,
    stats: { vel: 65, tiro: 40, pase: 45, fis: 30 },
    carrera: { goles: 0, asistencias: 0 },
    logros: [],
    hermanos: { brian: "Callado", nico: "Jodón" }
};

// Función para calcular si ganas o perdés (Realismo)
function intentar(stat, dificultad) {
    let azar = Math.floor(Math.random() * 100);
    return (gameState.stats[stat] + azar) > dificultad;
}

const storyData = {
    'inicio': {
        text: "<b>Año 2023 (9 años) - Casanova.</b><br>Vivís con tus viejos. Brian (26) toma mate y Nico (28) está buscando plata para salir. Tu celu es viejito.",
        choices: [
            { text: "1. Jugar Minecraft en el celu (Ganás pase)", nextScene: 'minecraft' },
            { text: "2. Pedirle a Nico que te enseñe (Ganás velocidad)", nextScene: 'entreno_nico' },
            { text: "3. Ir a la escuela a ver a los pibes (Tizi/Ian)", nextScene: 'escuela' },
            { text: "4. Trabajar ayudando en casa (+$50)", nextScene: 'trabajo' },
            { text: "5. Dormir (Recuperar energía)", nextScene: 'dormir' }
        ]
    },
    'escuela': {
        text: "En el recreo, unos pibes molestan a Tizi. ¿Qué hacés?",
        choices: [
            { text: "Defenfer a Tizi (Requiere Fis > 50)", nextScene: 'pelea' },
            { text: "Pedirle ayuda a Estrella con la tarea", nextScene: 'estrella' },
            { text: "Volver al aula", nextScene: 'inicio' }
        ]
    },
    'pelea': {
        text: "Te enfrentas a los pibes...",
        choices: [{ text: "¡Luchar!", action: () => {
            if(intentar('fis', 60)) { alert("¡Ganaste! Tizi ahora confía en vos."); renderScene('inicio'); }
            else { alert("Te pegaron y te lesionaste (Energía -40)."); gameState.energy -= 40; renderScene('inicio'); }
        }}]
    },
    'trabajo': {
        text: "Limpiaste todo. Estás agotado pero tenés plata.",
        action: () => { gameState.money += 50; gameState.energy -= 30; },
        choices: [{ text: "Volver", nextScene: 'inicio' }]
    },
    'minecraft': {
        text: "Viciando al Minecraft. Subiste tu habilidad de pase.",
        action: () => { gameState.stats.pase += 5; },
        choices: [{ text: "Volver", nextScene: 'inicio' }]
    }
};

function renderScene(sceneId) {
    let s = storyData[sceneId];
    document.getElementById('story-text').innerHTML = s.text;
    let cont = document.getElementById('choices-container');
    cont.innerHTML = '';
    s.choices.forEach(c => {
        let btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerText = c.text;
        btn.onclick = () => {
            if(c.action) c.action();
            renderScene(c.nextScene);
        };
        cont.appendChild(btn);
    });
    // UI Update
    document.getElementById('stat-year').innerText = gameState.year;
    document.getElementById('stat-age').innerText = gameState.age;
    document.getElementById('stat-money').innerText = "$" + gameState.money;
    document.getElementById('stat-energy').innerText = gameState.energy + "%";
}

renderScene('inicio');
