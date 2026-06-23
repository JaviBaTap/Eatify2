/**
 * Eatify - Sistema de Asistencia Nutricional y Recordatorios
 * Arquitectura: Vanilla JS + CSS3 (Tailwind v4) + HTML5 con Persistencia Local (LocalStorage)
 * Autor: Desarrollador Full Stack Senior especializados en UX/UI y Accesibilidad
 */

// --- CONFIGURACIÓN DE DATOS INICIALES (MOCKS) ---
const DEFAULT_PROFILE = {
    nombre: "Javiera",
    edad: 28,
    objetivo: "Mantener salud y energía constante",
    condicion: "Prevención de resistencia a la insulina"
};

const DEFAULT_SCHEDULE = {
    desayuno: { hora: "08:30", enabled: true, recomendado: "07:00 - 09:00" },
    almuerzo: { hora: "13:30", enabled: true, recomendado: "13:00 - 15:00" },
    once: { hora: "18:00", enabled: false, recomendado: "17:00 - 19:00" },
    cena: { hora: "20:30", enabled: true, recomendado: "20:00 - 22:00" },
    notificacionesPersistentes: true
};

const DEFAULT_HISTORY = [
    { id: "h1", fecha: getRelativeDateString(0), tipo: "desayuno", hora: "08:15", comida: "Tostada de Aguacate y Huevos Pochados", notas: "Comienzo del día con alta proteína. Me sentí con energía durante la mañana.", kcal: 420, proteinas: "22g", estado: "realizado" },
    { id: "h2", fecha: getRelativeDateString(0), tipo: "almuerzo", hora: "13:40", comida: "Bowl de Quinoa Mediterráneo", notas: "Incluye garbanzos, pepino y feta. Bebí 500ml de agua.", kcal: 580, proteinas: "18g", estado: "realizado" },
    { id: "h3", fecha: getRelativeDateString(0), tipo: "once", hora: "18:00", comida: "Yogur Griego y Berries", notas: "Omitido por reuniones seguidas. Me siento un poco fatigado.", kcal: 180, proteinas: "15g", estado: "omitido" },
    
    // Ayer
    { id: "h4", fecha: getRelativeDateString(-1), tipo: "desayuno", hora: "08:40", comida: "Avena con Plátano y Almendras", notas: "Buena ingesta calórica.", kcal: 390, proteinas: "12g", estado: "realizado" },
    { id: "h5", fecha: getRelativeDateString(-1), tipo: "almuerzo", hora: "13:30", comida: "Salmón con Vegetales y Arroz", notas: "Excelente balance nutricional.", kcal: 650, proteinas: "40g", estado: "realizado" },
    { id: "h6", fecha: getRelativeDateString(-1), tipo: "once", hora: "17:45", comida: "Manzana verde con mantequilla de maní", notas: "Colación rápida.", kcal: 220, proteinas: "6g", estado: "realizado" },
    { id: "h7", fecha: getRelativeDateString(-1), tipo: "cena", hora: "20:45", comida: "Sopa de Verduras y Pechuga de Pollo", notas: "Cena ligera antes de dormir.", kcal: 320, proteinas: "28g", estado: "realizado" },

    // Anteayer
    { id: "h8", fecha: getRelativeDateString(-2), tipo: "desayuno", hora: "08:30", comida: "Pan Integral con Huevo Revuelto", notas: "", kcal: 350, proteinas: "18g", estado: "realizado" },
    { id: "h9", fecha: getRelativeDateString(-2), tipo: "almuerzo", hora: "13:20", comida: "Ensalada de Atún con Lentejas", notas: "Consistencia perfecta.", kcal: 520, proteinas: "35g", estado: "realizado" },
    { id: "h10", fecha: getRelativeDateString(-2), tipo: "once", hora: "18:10", comida: "Proteína en Polvo con Agua", notas: "Rápido de salida del gym.", kcal: 150, proteinas: "25g", estado: "realizado" },
    { id: "h11", fecha: getRelativeDateString(-2), tipo: "cena", hora: "21:00", comida: "Omelette de claras y espinacas", notas: "", kcal: 240, proteinas: "20g", estado: "realizado" },

    // Días previos para rellenar estadísticas
    { id: "h12", fecha: getRelativeDateString(-3), tipo: "desayuno", hora: "08:30", comida: "Batido Verde y Tostada", notas: "", kcal: 310, proteinas: "10g", estado: "realizado" },
    { id: "h13", fecha: getRelativeDateString(-3), tipo: "almuerzo", hora: "13:30", comida: "Pasta Integral con Pesto y Pollo", notas: "", kcal: 590, proteinas: "32g", estado: "realizado" },
    { id: "h14", fecha: getRelativeDateString(-3), tipo: "cena", hora: "20:30", comida: "Pescado blanco con espárragos", notas: "", kcal: 290, proteinas: "24g", estado: "realizado" },

    { id: "h15", fecha: getRelativeDateString(-4), tipo: "desayuno", hora: "08:25", comida: "Yogur con Granola", notas: "", kcal: 290, proteinas: "14g", estado: "realizado" },
    { id: "h16", fecha: getRelativeDateString(-4), tipo: "almuerzo", hora: "13:50", comida: "Tacos de Pavo con Aguacate", notas: "", kcal: 510, proteinas: "28g", estado: "realizado" },
    { id: "h17", fecha: getRelativeDateString(-4), tipo: "cena", hora: "20:50", comida: "Ensalada verde con pavo", notas: "", kcal: 280, proteinas: "25g", estado: "omitido" },

    { id: "h18", fecha: getRelativeDateString(-5), tipo: "desayuno", hora: "08:30", comida: "Huevos Pochados con Champiñones", notas: "", kcal: 340, proteinas: "19g", estado: "realizado" },
    { id: "h19", fecha: getRelativeDateString(-5), tipo: "almuerzo", hora: "13:15", comida: "Pechuga de Pollo con Camote", notas: "", kcal: 550, proteinas: "38g", estado: "realizado" },
    { id: "h20", fecha: getRelativeDateString(-5), tipo: "cena", hora: "20:15", comida: "Sopa de Lentejas", notas: "", kcal: 330, proteinas: "16g", estado: "realizado" },

    { id: "h21", fecha: getRelativeDateString(-6), tipo: "desayuno", hora: "08:45", comida: "Tostada con Queso Crema y Salmón", notas: "", kcal: 410, proteinas: "22g", estado: "realizado" },
    { id: "h22", fecha: getRelativeDateString(-6), tipo: "almuerzo", hora: "13:30", comida: "Guiso de Porotos Negros con Arroz", notas: "", kcal: 480, proteinas: "18g", estado: "realizado" },
    { id: "h23", fecha: getRelativeDateString(-6), tipo: "cena", hora: "20:30", comida: "Ensalada de Pollo y Nueces", notas: "", kcal: 390, proteinas: "26g", estado: "realizado" }
];

// --- ESTADO DE LA APLICACIÓN (STATE) ---
let state = {
    profile: JSON.parse(localStorage.getItem("eatify_profile")) || { ...DEFAULT_PROFILE },
    schedule: JSON.parse(localStorage.getItem("eatify_schedule")) || { ...DEFAULT_SCHEDULE },
    history: JSON.parse(localStorage.getItem("eatify_history")) || [ ...DEFAULT_HISTORY ],
    currentView: localStorage.getItem("eatify_currentView") || "inicio",
    currentEnergyLevel: parseInt(localStorage.getItem("eatify_currentEnergyLevel")) || 4, // 1-5 (Óptimo por defecto)
    toastTimeout: null
};

// --- INICIALIZADOR DE LA APP ---
document.addEventListener("DOMContentLoaded", () => {
    saveState();
    registerAriaNavigation();
    switchView(state.currentView);
    startTimeTick();
    setupNotificationSimulators();
    setupAccessibilityKeyListeners();
    checkMissedMealsWhileAway();
});

// Helper para guardar estado en LocalStorage
function saveState() {
    localStorage.setItem("eatify_profile", JSON.stringify(state.profile));
    localStorage.setItem("eatify_schedule", JSON.stringify(state.schedule));
    localStorage.setItem("eatify_history", JSON.stringify(state.history));
    localStorage.setItem("eatify_currentEnergyLevel", state.currentEnergyLevel);
    localStorage.setItem("eatify_currentView", state.currentView);
}

// Helper para ajustar el nivel de energía de forma dinámica
function adjustEnergy(isRealized) {
    if (isRealized) {
        if (state.currentEnergyLevel < 5) {
            state.currentEnergyLevel += 1;
        }
    } else {
        if (state.currentEnergyLevel > 1) {
            state.currentEnergyLevel -= 1;
        }
    }
}

// Helper para obtener fechas relativas formateadas en Español
function getRelativeDateString(offsetDays) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
}

function getHumanReadableDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, month - 1, day);
    const todayStr = getRelativeDateString(0);
    const yesterdayStr = getRelativeDateString(-1);

    if (dateStr === todayStr) return "Hoy";
    if (dateStr === yesterdayStr) return "Ayer";

    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
}

// --- SISTEMA DE COMBIO DE VISTAS (SPA ROUTING) ---
function switchView(viewName) {
    state.currentView = viewName;
    localStorage.setItem("eatify_currentView", viewName);
    const container = document.getElementById("app-container");
    if (!container) return;

    // Actualizar avatar del top bar si existe
    const avatar = document.getElementById("user-avatar-initial");
    if (avatar && state.profile.nombre) {
        avatar.textContent = state.profile.nombre.charAt(0).toUpperCase();
    }

    // Actualizar nav bar inferior
    document.querySelectorAll(".nav-link").forEach(link => {
        const linkView = link.getAttribute("data-view");
        const iconSpan = link.querySelector(".material-symbols-outlined");
        
        if (linkView === viewName) {
            link.classList.add("text-primary", "font-bold");
            link.classList.remove("text-on-surface-variant/70");
            if (iconSpan) {
                iconSpan.style.fontVariationSettings = "'FILL' 1";
            }
        } else {
            link.classList.remove("text-primary", "font-bold");
            link.classList.add("text-on-surface-variant/70");
            if (iconSpan) {
                iconSpan.style.fontVariationSettings = "'FILL' 0";
            }
        }
    });

    // Renderizar vista
    container.innerHTML = "";
    
    const wrapper = document.createElement("div");
    wrapper.className = "animate-fade-in";

    switch (viewName) {
        case "inicio":
            renderInicio(wrapper);
            break;
        case "notif":
            renderNotif(wrapper);
            break;
        case "registrar":
            renderRegistrar(wrapper);
            break;
        case "calendario":
            renderCalendario(wrapper);
            break;
        case "menu":
            renderMenu(wrapper);
            break;
    }

    container.appendChild(wrapper);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function registerAriaNavigation() {
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const view = link.getAttribute("data-view");
            switchView(view);
        });
    });
}

// --- VISTA 1: DASHBOARD (INICIO) ---
function renderInicio(parent) {
    const todayStr = getRelativeDateString(0);
    const todayLogs = state.history.filter(item => item.fecha === todayStr);
    
    // Contar comidas programadas hoy
    const mealsScheduled = Object.keys(state.schedule).filter(key => key !== 'notificacionesPersistentes' && state.schedule[key].enabled);
    const totalScheduledCount = mealsScheduled.length;
    const completedTodayCount = todayLogs.filter(log => log.estado === "realizado" && mealsScheduled.includes(log.tipo)).length;

    // Calcular próxima comida programada
    const { nextMealName, nextMealTime } = getNextScheduledMeal();

    // Determinar qué comida está pendiente de confirmar (la última en el horario que ya pasó y no está registrada)
    const pendingConfirmationMeal = getPendingConfirmationMeal();

    let confirmationBannerHTML = "";
    if (pendingConfirmationMeal) {
        confirmationBannerHTML = `
            <div class="bg-primary-container text-on-primary-container rounded-2xl p-5 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md border-l-4 border-primary">
                <div>
                    <h4 class="font-bold text-lg flex items-center gap-2">
                        <span class="material-symbols-outlined text-xl">help_outline</span>
                        ¿Ya tomaste tu ${pendingConfirmationMeal.label}?
                    </h4>
                    <p class="text-sm opacity-90 mt-1">Estaba programado para las ${pendingConfirmationMeal.hora}. Mantener consistencia fortalece la salud metabólica.</p>
                </div>
                <div class="flex gap-2 w-full sm:w-auto">
                    <button onclick="confirmQuickMeal('${pendingConfirmationMeal.tipo}', '${pendingConfirmationMeal.hora}')" class="flex-1 sm:flex-initial bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-opacity-90 active:scale-95 transition-all shadow-sm">
                        Confirmar
                    </button>
                    <button onclick="omitQuickMeal('${pendingConfirmationMeal.tipo}', '${pendingConfirmationMeal.hora}')" class="flex-1 sm:flex-initial bg-white/20 text-on-primary-container text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-white/30 active:scale-95 transition-all">
                        Omitir
                    </button>
                </div>
            </div>
        `;
    }

    const percentage = totalScheduledCount > 0 ? Math.round((completedTodayCount / totalScheduledCount) * 100) : 100;
    const progressStrokeDash = percentage ? (251.2 - (251.2 * percentage) / 100) : 251.2;

    const energyLabel = getEnergyLabel(state.currentEnergyLevel);

    parent.innerHTML = `
        <header class="mb-6">
            <h2 class="font-display font-bold text-2xl md:text-3xl text-on-surface">¡Buenos días, ${state.profile.nombre}!</h2>
            <p class="text-on-surface-variant text-base mt-1">¿Listo para mantener un excelente ritmo alimenticio hoy?</p>
        </header>

        <!-- Banner de Confirmación Pendiente -->
        ${confirmationBannerHTML}

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Próxima Comida Card -->
            <div class="bg-surface rounded-2xl shadow-sm border border-outline-variant overflow-hidden vitality-border-green flex flex-col">
                <div class="h-44 relative bg-slate-100">
                    <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800" alt="Plato saludable balanceado">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                    <div class="absolute bottom-4 left-4">
                        <span class="bg-primary text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full flex items-center gap-1 w-max">
                            <span class="material-symbols-outlined text-xs">schedule</span> PRÓXIMA COMIDA
                        </span>
                    </div>
                </div>
                <div class="p-6 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 class="font-display font-extrabold text-2xl text-on-surface capitalize">${nextMealName}</h3>
                        <p class="text-on-surface-variant text-sm mt-1">Programado para las <strong class="text-primary">${nextMealTime}</strong> • Ingesta sugerida de nutrientes.</p>
                    </div>
                    <div class="flex gap-2 mt-6">
                        <button onclick="switchView('registrar')" class="flex-1 bg-primary text-white font-semibold py-3 px-4 rounded-xl hover:bg-opacity-95 transition-all text-sm flex items-center justify-center gap-2">
                            <span class="material-symbols-outlined text-sm">add_circle</span> Registrar Log
                        </button>
                        <button onclick="switchView('notif')" class="bg-slate-100 hover:bg-slate-200 text-on-surface font-semibold py-3 px-4 rounded-xl transition-all text-sm flex items-center justify-center">
                            Reprogramar
                        </button>
                    </div>
                </div>
            </div>

            <!-- Cumplimiento Diario (Progress Ring) -->
            <div class="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant flex flex-col justify-between items-center text-center">
                <div class="w-full text-left">
                    <h3 class="font-display font-bold text-lg text-on-surface">Cumplimiento del Día</h3>
                    <p class="text-on-surface-variant text-xs">Pauta correspondiente a horarios programados</p>
                </div>

                <div class="relative flex items-center justify-center my-6">
                    <svg class="w-36 h-36 transform -rotate-90">
                        <circle cx="72" cy="72" r="50" class="circle-bg" stroke="#f1f5f9" stroke-width="10" fill="transparent" />
                        <circle cx="72" cy="72" r="50" class="circle" stroke="#006e2f" stroke-width="10" fill="transparent"
                                stroke-dasharray="314.16" stroke-dashoffset="${314.16 - (314.16 * percentage) / 100}" />
                    </svg>
                    <div class="absolute flex flex-col items-center justify-center">
                        <span class="text-2xl font-black text-on-surface">${completedTodayCount}/${totalScheduledCount}</span>
                        <span class="text-xs text-on-surface-variant font-medium">Comidas</span>
                    </div>
                </div>

                <div class="w-full">
                    <p class="font-medium text-sm text-on-surface">
                        ${percentage === 100 ? '🎉 ¡Día perfecto completado!' : percentage >= 50 ? '⏱️ ¡Vas a mitad de camino! Continúa así.' : '💡 Registra tus comidas para regularizar tus niveles de energía.'}
                    </p>
                    <div class="w-full bg-slate-100 h-2.5 rounded-full mt-3 overflow-hidden">
                        <div class="bg-primary h-full rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Slider de Nivel de Energía -->
        <div class="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant mb-8">
            <div class="flex justify-between items-center mb-4">
                <div>
                    <h3 class="font-display font-bold text-lg text-on-surface">Nivel de Energía Actual</h3>
                    <p class="text-on-surface-variant text-xs font-medium">Relación de fatiga y alimentación</p>
                </div>
                <span class="bg-primary/10 text-primary text-sm font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider block" id="energy-badge">
                    ${energyLabel.text}
                </span>
            </div>

            <div class="relative mb-6">
                <input type="range" min="1" max="5" value="${state.currentEnergyLevel}" class="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary" id="energy-slider" oninput="updateEnergyLevel(this.value)">
                
                <!-- Emoji scale -->
                <div class="flex justify-between mt-4 px-1 text-2xl">
                    <button onclick="updateEnergyLevel(1)" class="scale-100 hover:scale-125 transition-transform" title="Muy agotado">😫</button>
                    <button onclick="updateEnergyLevel(2)" class="scale-100 hover:scale-125 transition-transform" title="Fatigado">🥱</button>
                    <button onclick="updateEnergyLevel(3)" class="scale-100 hover:scale-125 transition-transform" title="Normal">😐</button>
                    <button onclick="updateEnergyLevel(4)" class="scale-100 hover:scale-125 transition-transform" title="Enérgico">😊</button>
                    <button onclick="updateEnergyLevel(5)" class="scale-100 hover:scale-125 transition-transform" title="Óptimo">⚡</button>
                </div>
            </div>
            <p class="text-xs text-on-surface-variant text-center" id="energy-desc">${energyLabel.desc}</p>
        </div>

        <!-- Cronograma Diario Timeline -->
        <div class="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h3 class="font-display font-bold text-lg text-on-surface">Cronograma del Día</h3>
                    <p class="text-on-surface-variant text-xs">Paso a paso de tu constancia nutricional</p>
                </div>
                <button onclick="switchView('calendario')" class="text-primary hover:underline text-sm font-semibold flex items-center gap-1">
                    Ver Historial <span class="material-symbols-outlined text-sm">chevron_right</span>
                </button>
            </div>

            <div class="flow-root">
                <ul role="list" class="-mb-8">
                    ${renderTimelineItems(todayLogs)}
                </ul>
            </div>
        </div>
    `;
}

function updateEnergyLevel(val) {
    state.currentEnergyLevel = parseInt(val);
    saveState();
    const slider = document.getElementById("energy-slider");
    if (slider) slider.value = val;

    const label = getEnergyLabel(state.currentEnergyLevel);
    const badge = document.getElementById("energy-badge");
    const desc = document.getElementById("energy-desc");

    if (badge) badge.innerText = label.text;
    if (desc) desc.innerText = label.desc;
}

function getEnergyLabel(level) {
    switch(level) {
        case 1: return { text: "Crítico 😫", desc: "Fatiga extrema o hipoglicemia severa. ¡Come carbohidratos complejos o una colación saludable cuanto antes!" };
        case 2: return { text: "Bajo 🥱", desc: "Niveles de reserva vaciándose. Sentirás pesadez mental. Ideal para un snack saludable." };
        case 3: return { text: "Normal 😐", desc: "Estable pero sin picos de vitalidad. Tu organismo se mantiene firme." };
        case 4: return { text: "Estable 😊", desc: "Sensación óptima y de bienestar físico. El metabolismo está trabajando armónicamente." };
        case 5: return { text: "Excelente ⚡", desc: "Súper enfocado y con vitalidad alta. Excelente absorción y uso de tu combustible alimenticio." };
        default: return { text: "Estable 😊", desc: "Organismo trabajando de manera balanceada." };
    }
}

function renderTimelineItems(todayLogs) {
    const mealKeys = ["desayuno", "almuerzo", "once", "cena"];
    return mealKeys.map((mealType, index) => {
        const sched = state.schedule[mealType];
        if (!sched || !sched.enabled) return "";

        const log = todayLogs.find(item => item.tipo === mealType);
        const isLast = index === mealKeys.length - 1;

        let statusClass = "bg-slate-100 text-slate-400";
        let statusIcon = "schedule";
        let titleColor = "text-slate-400";
        let desc = "Sin registrar aún";
        let borderClass = "border-slate-200";

        if (log) {
            if (log.estado === "realizado") {
                statusClass = "bg-primary text-white";
                statusIcon = "check_circle";
                titleColor = "text-on-surface font-semibold";
                desc = `<strong class="text-primary font-bold">Consumido a las ${log.hora}</strong><br><span class="text-xs text-on-surface-variant font-medium">${log.comida || 'Sin descripción'} (${log.kcal || 0} kcal)</span>`;
                borderClass = "border-primary";
            } else if (log.estado === "omitido") {
                statusClass = "bg-secondary text-white";
                statusIcon = "cancel";
                titleColor = "text-secondary font-semibold";
                desc = `<span class="font-semibold text-secondary">Omitido</span> • ${log.notas || 'No se registraron observaciones.'}`;
                borderClass = "border-secondary";
            }
        } else {
            // No hay log, ver si ya pasó la hora
            const now = new Date();
            const [pHour, pMin] = sched.hora.split(':');
            const schedTime = new Date();
            schedTime.setHours(pHour, pMin, 0);

            if (now > schedTime) {
                // Ya pasó y no está registrado -> Alerta retraso
                statusClass = "bg-amber-100 text-amber-600 animate-pulse";
                statusIcon = "warning";
                titleColor = "text-amber-700 font-bold";
                desc = `<span class="bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded text-xs">Atrasada</span> programada para las ${sched.hora}. Registra este evento.`;
                borderClass = "border-amber-300";
            } else {
                titleColor = "text-slate-700";
                desc = `Programado para las ${sched.hora}`;
                borderClass = "border-slate-200";
            }
        }

        return `
            <li>
                <div class="relative pb-8">
                    ${!isLast ? `<span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true"></span>` : ""}
                    <div class="relative flex space-x-3">
                        <div>
                            <span class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${statusClass}">
                                <span class="material-symbols-outlined text-sm font-bold">${statusIcon}</span>
                            </span>
                        </div>
                        <div class="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                            <div>
                                <p class="text-sm capitalize ${titleColor}">${mealType}</p>
                                <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">${desc}</p>
                            </div>
                            <div class="text-right text-xs whitespace-nowrap text-on-surface-variant">
                                <span>Recomendado: ${sched.recomendado}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        `;
    }).join("");
}

// --- VISTA 2: GESTIÓN DE HORARIOS (NOTIF) ---
function renderNotif(parent) {
    parent.innerHTML = `
        <header class="mb-6">
            <h2 class="font-display font-bold text-2xl md:text-3xl text-on-surface">Gestión de Horarios</h2>
            <p class="text-on-surface-variant text-base mt-1">Adapte sus ventanas de alimentación a sus necesidades metabólicas y objetivos de bienestar.</p>
        </header>

        <!-- Rutina Diaria Sección -->
        <section class="mb-8">
            <div class="flex justify-between items-center mb-6">
                <h3 class="font-display font-bold text-lg text-on-surface tracking-wide uppercase text-xs text-primary">Rutina Diaria</h3>
                <span class="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full" id="active-meals-count">
                    ${countActiveMeals()} Comidas Activas
                </span>
            </div>

            <div class="space-y-4" id="meals-schedule-container">
                ${renderMealSettingsCards()}
            </div>
        </section>

        <!-- Modos de Salud Inteligentes -->
        <section class="mb-8">
            <h3 class="font-display font-bold text-lg text-on-surface mb-4">Ajustes de Salud Inteligentes</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Modo Diabetes -->
                <div id="card-diabetes" onclick="applyHealthPreset('diabetes')" class="bg-surface border border-outline-variant rounded-2xl p-5 hover:border-primary cursor-pointer transition-all flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-center mb-3">
                            <span class="material-symbols-outlined text-3xl text-secondary">medical_services</span>
                            <span class="bg-secondary/10 text-secondary text-[10px] uppercase font-bold px-2 py-1 rounded">Prioridad Alta</span>
                        </div>
                        <h4 class="font-display font-bold text-base text-on-surface">Estabilizar Glucemia (Diabetes)</h4>
                        <p class="text-xs text-on-surface-variant mt-1.5 leading-relaxed">Configura automáticamente intervalos de 3.5 horas obligatorios para evitar hipoglucemias o picos insulínicos bruscos.</p>
                    </div>
                    <div class="mt-4 flex items-center text-xs text-primary font-bold">
                        Aplicar Perfil <span class="material-symbols-outlined text-xs ml-0.5">chevron_right</span>
                    </div>
                </div>

                <!-- Modo Hipoglicemia -->
                <div id="card-hipoglicemia" onclick="applyHealthPreset('hipoglicemia')" class="bg-surface border border-outline-variant rounded-2xl p-5 hover:border-primary cursor-pointer transition-all flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-center mb-3">
                            <span class="material-symbols-outlined text-3xl text-primary">health_and_safety</span>
                        </div>
                        <h4 class="font-display font-bold text-base text-on-surface">Prevención de Hipoglicemia</h4>
                        <p class="text-xs text-on-surface-variant mt-1.5 leading-relaxed">Activa Desayuno, Almuerzo, Once y Cena con alarmas reforzadas para que recuerdes comer en intervalos perfectamente balanceados.</p>
                    </div>
                    <div class="mt-4 flex items-center text-xs text-primary font-bold">
                        Aplicar Perfil <span class="material-symbols-outlined text-xs ml-0.5">chevron_right</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Banner Consejo Pro -->
        <div class="rounded-2xl h-40 overflow-hidden relative shadow-inner mb-8 bg-slate-900">
            <img class="w-full h-full object-cover opacity-60" src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800" alt="Plato con aguacate, granos, huevo">
            <div class="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/50 to-transparent flex items-center p-6">
                <div class="max-w-md text-white">
                    <p class="text-xs font-bold text-emerald-400 uppercase tracking-widest">Consejo Pro</p>
                    <p class="text-sm font-semibold mt-2.5 leading-relaxed">La consistencia y rigurosidad en los horarios de las comidas mejora la flexibilidad metabólica hasta en un 22%.</p>
                </div>
            </div>
        </div>

        <!-- Alertas Persistentes e Historial Switches -->
        <section class="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex items-center justify-between mb-8">
            <div class="flex items-center gap-4">
                <span class="material-symbols-outlined text-primary text-2xl">notifications_active</span>
                <div>
                    <h4 class="font-display font-bold text-sm text-primary">Notificaciones Persistentes</h4>
                    <p class="text-xs text-on-surface-variant mt-0.5">Las alertas sonarán e insistirán hasta que declares el registro.</p>
                </div>
            </div>
            <div class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="toggle-persistent-all" class="sr-only peer" ${state.schedule.notificacionesPersistentes ? 'checked' : ''} onchange="togglePersistentNotifications(this.checked)">
                <div class="w-11 h-6 bg-slate-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-emerald-300 dark:bg-slate-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-primary"></div>
            </div>
        </section>

        <!-- Opciones de Personalización de Alertas (HU2) -->
        <section class="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant mb-8">
            <h3 class="font-display font-bold text-lg text-on-surface mb-4">Personalización de Alertas (HU2)</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="notif-frecuencia" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Frecuencia de Recordatorios</label>
                    <select id="notif-frecuencia" class="w-full rounded-xl p-3 bg-slate-50 border-0 focus:ring-2 focus:ring-primary text-sm font-semibold text-on-surface">
                        <option value="diario" ${state.schedule.frecuencia === 'diario' || !state.schedule.frecuencia ? 'selected' : ''}>Diario (A la hora exacta)</option>
                        <option value="intervalo" ${state.schedule.frecuencia === 'intervalo' ? 'selected' : ''}>Intervalo de Recordatorio (Cada 15 min)</option>
                        <option value="flexible" ${state.schedule.frecuencia === 'flexible' ? 'selected' : ''}>Flexible (Ventanas de comida)</option>
                    </select>
                </div>
                <div>
                    <label for="notif-tipo" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Tipo de Alerta</label>
                    <select id="notif-tipo" class="w-full rounded-xl p-3 bg-slate-50 border-0 focus:ring-2 focus:ring-primary text-sm font-semibold text-on-surface">
                        <option value="sonido_visual" ${state.schedule.tipoAlerta === 'sonido_visual' || !state.schedule.tipoAlerta ? 'selected' : ''}>Melodía + Ventana Emergente</option>
                        <option value="solo_visual" ${state.schedule.tipoAlerta === 'solo_visual' ? 'selected' : ''}>Solo Ventana Emergente</option>
                        <option value="discreta" ${state.schedule.tipoAlerta === 'discreta' ? 'selected' : ''}>Alerta de Barra de Estado</option>
                    </select>
                </div>
            </div>
        </section>

        <!-- Guardar Horarios Button -->
        <div class="flex flex-col gap-3 mb-8">
            <button onclick="saveSchedulesFromUI()" class="w-full bg-primary hover:bg-opacity-95 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2">
                <span class="material-symbols-outlined">save</span> Guardar Horarios
            </button>
            <button onclick="resetSchedulesToDefault()" class="w-full bg-transparent hover:bg-slate-100 text-on-surface-variant py-2.5 rounded-lg text-sm transition-all">
                Restablecer Valores Predeterminados
            </button>
        </div>
    `;
}

function countActiveMeals() {
    return Object.keys(state.schedule).filter(k => k !== 'notificacionesPersistentes' && state.schedule[k].enabled).length;
}

function renderMealSettingsCards() {
    const mealKeys = ["desayuno", "almuerzo", "once", "cena"];
    return mealKeys.map(key => {
        const meal = state.schedule[key];
        const icon = key === "desayuno" ? "wb_sunny" : key === "almuerzo" ? "light_mode" : key === "once" ? "coffee" : "dark_mode";
        return `
            <div class="bg-surface rounded-2xl shadow-sm border border-outline-variant p-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:-translate-y-0.5 card-meal-settings" data-key="${key}">
                <div class="flex items-center gap-4">
                    <div class="w-11 h-11 rounded-full bg-emerald-50 text-primary flex items-center justify-center">
                        <span class="material-symbols-outlined text-xl">${icon}</span>
                    </div>
                    <div>
                        <h4 class="font-display font-bold text-base text-on-surface capitalize">${key}</h4>
                        <p class="text-xs text-on-surface-variant">Recomendado: ${meal.recomendado}</p>
                    </div>
                </div>

                <div class="flex justify-between items-center sm:justify-end gap-6">
                    <div class="flex flex-col">
                        <label class="text-on-surface-variant text-[11px] font-medium mb-1">Programado</label>
                        <input type="time" class="bg-slate-100 border-0 rounded-lg text-sm font-semibold p-2 focus:ring-2 focus:ring-primary h-10 w-28 text-center text-on-surface time-input" value="${meal.hora}">
                    </div>

                    <div class="flex flex-col items-end">
                        <label class="text-on-surface-variant text-[11px] font-medium mb-1">Estado</label>
                        <div class="relative inline-flex items-center cursor-pointer h-10">
                            <input type="checkbox" class="sr-only peer toggle-meal" ${meal.enabled ? 'checked' : ''}>
                            <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

function togglePersistentNotifications(val) {
    state.schedule.notificacionesPersistentes = val;
    saveState();
    showToast(val ? "Notificaciones persistentes activadas" : "Notificaciones simplificadas");
}

function applyHealthPreset(type) {
    if (type === 'diabetes') {
        state.schedule.desayuno = { hora: "08:00", enabled: true, recomendado: "07:00 - 09:00" };
        state.schedule.almuerzo = { hora: "11:30", enabled: true, recomendado: "11:30 - 13:00" };
        state.schedule.once = { hora: "15:00", enabled: true, recomendado: "15:00 - 16:30" };
        state.schedule.cena = { hora: "18:30", enabled: true, recomendado: "18:00 - 19:30" };
        state.schedule.notificacionesPersistentes = true;
        showToast("✓ Aplicada rutina de estabilización diabética (comidas cada 3.5h).");
    } else if (type === 'hipoglicemia') {
        state.schedule.desayuno = { hora: "07:30", enabled: true, recomendado: "07:00 - 09:00" };
        state.schedule.almuerzo = { hora: "13:00", enabled: true, recomendado: "13:00 - 15:00" };
        state.schedule.once = { hora: "17:30", enabled: true, recomendado: "17:00 - 19:00" };
        state.schedule.cena = { hora: "21:00", enabled: true, recomendado: "20:00 - 22:00" };
        showToast("✓ Aplicada pauta ideal para prevención de bajadas de azúcar.");
    }
    
    saveState();
    // Re-render
    switchView("notif");
}

function saveSchedulesFromUI() {
    let valid = true;
    let tempSchedule = { ...state.schedule };

    const cards = document.querySelectorAll(".card-meal-settings");
    cards.forEach(card => {
        const key = card.getAttribute("data-key");
        const timeVal = card.querySelector(".time-input").value;
        const enabledVal = card.querySelector(".toggle-meal").checked;

        if (!timeVal) {
            valid = false;
        } else {
            if (!tempSchedule[key]) {
                tempSchedule[key] = {};
            }
            tempSchedule[key].hora = timeVal;
            tempSchedule[key].enabled = enabledVal;
        }
    });

    if (!valid) {
        showToast("Error: Faltan horas en la programación de comidas.", true);
        return;
    }

    // Guardar los nuevos campos de personalización de alertas (HU2)
    const frecuenciaSelect = document.getElementById("notif-frecuencia");
    const tipoAlertaSelect = document.getElementById("notif-tipo");
    if (frecuenciaSelect) {
        tempSchedule.frecuencia = frecuenciaSelect.value;
    }
    if (tipoAlertaSelect) {
        tempSchedule.tipoAlerta = tipoAlertaSelect.value;
    }

    // Validación cronológica simple opcional: desayuno < almuerzo < once < cena si varios están activos
    const convertToMinutes = hhmm => {
        const [h, m] = hhmm.split(':').map(Number);
        return h * 60 + m;
    };

    let orderValid = true;
    let prevActiveTime = -1;
    const orderNames = ["desayuno", "almuerzo", "once", "cena"];
    
    for (const name of orderNames) {
        if (tempSchedule[name] && tempSchedule[name].enabled) {
            const currentMins = convertToMinutes(tempSchedule[name].hora);
            if (currentMins <= prevActiveTime) {
                orderValid = false;
                break;
            }
            prevActiveTime = currentMins;
        }
    }

    if (!orderValid) {
        showToast("Aviso: El cronograma de comidas contiene inconsistencias de orden horario.", true);
        // Permitimos guardar pero mandamos aviso
    }

    state.schedule = tempSchedule;
    saveState();
    showToast("✓ Configuración de horarios guardada correctamente en LocalStorage.");
    switchView("inicio");
}

function resetSchedulesToDefault() {
    if (confirm("¿Estás seguro de restablecer los horarios originales?")) {
        state.schedule = { ...DEFAULT_SCHEDULE };
        saveState();
        showToast("✓ Horarios restablecidos.");
        switchView("notif");
    }
}


// --- VISTA 3: REGISTRO DE COMIDAS (REGISTRAR) ---
function renderRegistrar(parent) {
    const todayStr = getRelativeDateString(0);
    const timeNowStr = new Date().toTimeString().slice(0, 5);

    // Contar ingesta
    const todayLogs = state.history.filter(item => item.fecha === todayStr);
    const kcalSum = todayLogs.reduce((acc, obj) => acc + (obj.estado === 'realizado' ? parseInt(obj.kcal || 0) : 0), 0);

    parent.innerHTML = `
        <header class="mb-6">
            <h2 class="font-display font-bold text-2xl md:text-3xl text-on-surface">Registrar Alimento</h2>
            <p class="text-on-surface-variant text-base mt-1">Bitácora diaria de combustible metabólico y bienestar físico.</p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <!-- Formulario Principal -->
            <div class="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant md:col-span-2">
                <form id="meal-register-form" onsubmit="saveMealLog(event)" class="space-y-4">
                    <div>
                        <label for="meal-type" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Comida Programada o Colación</label>
                        <select id="meal-type" class="w-full rounded-xl p-3 bg-slate-50 border-0 focus:ring-2 focus:ring-primary text-sm font-semibold text-on-surface" onchange="adjustMealDefaultCalories(this.value)">
                            <option value="desayuno">Desayuno</option>
                            <option value="almuerzo">Almuerzo</option>
                            <option value="once">Once</option>
                            <option value="cena">Cena</option>
                            <option value="colación">Snack / Colación Extra</option>
                        </select>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="meal-time" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Hora de Consumo</label>
                            <input type="time" id="meal-time" value="${timeNowStr}" class="w-full rounded-xl p-3 bg-slate-50 border-0 focus:ring-2 focus:ring-primary text-sm font-semibold text-center" required>
                        </div>
                        <div>
                            <label for="meal-status" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Estado</label>
                            <select id="meal-status" class="w-full rounded-xl p-3 bg-slate-50 border-0 focus:ring-2 focus:ring-primary text-sm font-semibold text-center text-on-surface">
                                <option value="realizado" class="text-primary font-bold">Consumido</option>
                                <option value="omitido" class="text-secondary font-bold">Omitido / Saltado</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label for="meal-desc" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Descripción del Alimento</label>
                        <input type="text" id="meal-desc" placeholder="Ej. Croquetas de pavo con arroz integral o batido de avena" class="w-full rounded-xl p-3 bg-slate-50 border-0 focus:ring-2 focus:ring-primary text-sm" required>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="meal-kcal" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Calorías Est. (kcal)</label>
                            <input type="number" id="meal-kcal" placeholder="Ej. 420" min="0" class="w-full rounded-xl p-3 bg-slate-50 border-0 focus:ring-2 focus:ring-primary text-sm font-semibold">
                        </div>
                        <div>
                            <label for="meal-protein" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Proteínas (opcional)</label>
                            <input type="text" id="meal-protein" placeholder="Ej. 25g" class="w-full rounded-xl p-3 bg-slate-50 border-0 focus:ring-2 focus:ring-primary text-sm font-semibold">
                        </div>
                    </div>

                    <div>
                        <label for="meal-notes" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Observaciones de Digestión o Síntomas</label>
                        <textarea id="meal-notes" rows="2" placeholder="Ej. Sentí saciedad rápida, ligera acidez posterior, excelente energía..." class="w-full rounded-xl p-3 bg-slate-50 border-0 focus:ring-2 focus:ring-primary text-sm"></textarea>
                    </div>

                    <button type="submit" class="w-full bg-primary hover:bg-opacity-95 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined">add_task</span> Registrar en Bitácora
                    </button>
                </form>
            </div>

            <!-- Resumen Rápido -->
            <div class="space-y-6">
                <!-- Tarjeta Info Rápida -->
                <div class="bg-surface rounded-2xl p-5 shadow-sm border border-outline-variant flex flex-col justify-between h-40">
                    <div>
                        <h3 class="font-display font-medium text-xs text-on-surface-variant uppercase tracking-wider">Energía Ingerida Hoy</h3>
                        <p class="text-3xl font-black text-primary mt-2">${kcalSum} <span class="text-sm font-medium text-on-surface-variant">kcal</span></p>
                    </div>
                    <p class="text-xs text-on-surface-variant">Consistencia ideal recomendada: 1800 - 2200 kcal/día.</p>
                </div>

                <!-- Atajos de comidas rápidas con calorías simuladas -->
                <div class="bg-surface border border-outline-variant rounded-2xl p-5 shadow-sm">
                    <h3 class="font-display font-medium text-xs text-on-surface-variant uppercase tracking-wider mb-4">Registro Instantáneo</h3>
                    <div class="grid grid-cols-2 gap-2">
                        <button onclick="quickLogInstant('Plátano con un Puñado de Nueces', 220, '12g', 'Colación saludable instantánea')" class="p-3 bg-slate-100 hover:bg-primary/10 hover:text-primary rounded-xl text-left transition-all group">
                            <span class="text-xl">🍌</span>
                            <h4 class="font-bold text-xs text-on-surface mt-1 group-hover:text-primary">Colación Nut</h4>
                            <p class="text-[10px] text-on-surface-variant mt-0.5">220 kcal</p>
                        </button>

                        <button onclick="quickLogInstant('Yogur Light con Coco Rallado', 160, '10g', 'Dosis rápida de proteína y saciedad')" class="p-3 bg-slate-100 hover:bg-primary/10 hover:text-primary rounded-xl text-left transition-all group">
                            <span class="text-xl">🥥</span>
                            <h4 class="font-bold text-xs text-on-surface mt-1 group-hover:text-primary">Yogur Digestivo</h4>
                            <p class="text-[10px] text-on-surface-variant mt-0.5">160 kcal</p>
                        </button>

                        <button onclick="quickLogInstant('Huevo duro con Galletas de agua', 180, '14g', 'Refuerzo de glucosa estable')" class="p-3 bg-slate-100 hover:bg-primary/10 hover:text-primary rounded-xl text-left transition-all group">
                            <span class="text-xl">🥚</span>
                            <h4 class="font-bold text-xs text-on-surface mt-1 group-hover:text-primary">Snack Huevo</h4>
                            <p class="text-[10px] text-on-surface-variant mt-0.5">180 kcal</p>
                        </button>

                        <button onclick="quickLogInstant('Batido de Proteína Isolate', 140, '26g', 'Post-entreno o asimilación veloz')" class="p-3 bg-slate-100 hover:bg-primary/10 hover:text-primary rounded-xl text-left transition-all group">
                            <span class="text-xl">🥤</span>
                            <h4 class="font-bold text-xs text-on-surface mt-1 group-hover:text-primary">Batido Isolate</h4>
                            <p class="text-[10px] text-on-surface-variant mt-0.5">140 kcal</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Últimos Registros listados abajo -->
        <div class="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant">
            <h3 class="font-display font-bold text-base text-on-surface mb-4">Bitácora de Hoy (${getHumanReadableDate(todayStr)})</h3>
            <div class="divide-y divide-slate-100" id="today-logs-container">
                ${renderLogsList(todayLogs)}
            </div>
        </div>
    `;
    adjustMealDefaultCalories("desayuno");
}

function adjustMealDefaultCalories(type) {
    const kcalInput = document.getElementById("meal-kcal");
    const proteinInput = document.getElementById("meal-protein");
    const descInput = document.getElementById("meal-desc");

    if (!kcalInput || !proteinInput || !descInput) return;

    if (type === "desayuno") {
        kcalInput.value = "380";
        proteinInput.value = "18g";
        descInput.placeholder = "Ej. Paila de huevo con tostada integral";
    } else if (type === "almuerzo") {
        kcalInput.value = "620";
        proteinInput.value = "35g";
        descInput.placeholder = "Ej. Suprema de pollo, quinoa y hojas verdes";
    } else if (type === "once") {
        kcalInput.value = "200";
        proteinInput.value = "8g";
        descInput.placeholder = "Ej. Té verde y panqueque de avena";
    } else if (type === "cena") {
        kcalInput.value = "410";
        proteinInput.value = "28g";
        descInput.placeholder = "Ej. Pescado al horno y verduras salteadas";
    } else {
        kcalInput.value = "150";
        proteinInput.value = "10g";
        descInput.placeholder = "Ingresar colación consumida";
    }
}

function saveMealLog(event) {
    event.preventDefault();

    const type = document.getElementById("meal-type").value;
    const time = document.getElementById("meal-time").value;
    const status = document.getElementById("meal-status").value;
    const desc = document.getElementById("meal-desc").value;
    const kcal = document.getElementById("meal-kcal").value || 0;
    const protein = document.getElementById("meal-protein").value || "0g";
    const notes = document.getElementById("meal-notes").value;

    const todayStr = getRelativeDateString(0);

    const newLog = {
        id: "l_" + Date.now(),
        fecha: todayStr,
        tipo: type,
        hora: time,
        comida: desc,
        notas: notes,
        kcal: parseInt(kcal),
        proteinas: protein,
        estado: status
    };

    // Agregar al estado general
    state.history.unshift(newLog);
    adjustEnergy(status === "realizado");
    saveState();
    showToast("✓ Registro alimenticio guardado correctamente en tu bitácora.");
    switchView("registrar");
}

function quickLogInstant(comida, kcal, protein, notes) {
    const todayStr = getRelativeDateString(0);
    const timeNow = new Date().toTimeString().slice(0, 5);

    const newLog = {
        id: "l_" + Date.now(),
        fecha: todayStr,
        tipo: "colación",
        hora: timeNow,
        comida: comida,
        notas: notes,
        kcal: parseInt(kcal),
        proteinas: protein,
        estado: "realizado"
    };

    state.history.unshift(newLog);
    adjustEnergy(true);
    saveState();
    showToast("✓ Colación instantánea registrada con éxito.");
    
    if (state.currentView === "registrar") {
        switchView("registrar");
    } else if (state.currentView === "inicio") {
        switchView("inicio");
    }
}

function renderLogsList(logs) {
    if (logs.length === 0) {
        return `
            <div class="text-center py-8 text-on-surface-variant text-sm">
                <span class="material-symbols-outlined text-4xl block mb-2 text-slate-300">receipt_long</span>
                No hay comidas registradas para hoy todavía. Usa el formulario de arriba o un atajo de registro instantáneo.
            </div>
        `;
    }

    return logs.map(log => {
        const isRealized = log.estado === "realizado";
        const bulletColor = isRealized ? "bg-primary" : "bg-secondary";
        const icon = isRealized ? "check_circle" : "cancel";
        return `
            <div class="py-4 flex items-start justify-between gap-4">
                <div class="flex items-start gap-3">
                    <span class="material-symbols-outlined mt-0.5 ${isRealized ? 'text-primary' : 'text-secondary'}">${icon}</span>
                    <div>
                        <div class="flex items-center gap-2">
                            <h4 class="font-bold text-sm text-on-surface capitalize">${log.comida || 'Registro de Pauta'}</h4>
                            <span class="bg-slate-100 text-[10px] uppercase font-bold text-on-surface-variant px-2 py-0.5 rounded-full">${log.tipo}</span>
                        </div>
                        <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">${log.notas || 'Sin observaciones detalladas.'}</p>
                        <div class="flex gap-4 mt-2">
                            <span class="text-[11px] text-primary bg-primary/5 px-2.5 py-0.5 rounded font-black">${log.kcal} kcal</span>
                            <span class="text-[11px] text-cyan-600 bg-cyan-50 px-2.5 py-0.5 rounded font-medium">💪 ${log.proteinas || '0g'} Prot</span>
                        </div>
                    </div>
                </div>
                <div class="text-right whitespace-nowrap">
                    <span class="text-xs font-bold text-on-surface">${log.hora}</span>
                    <button onclick="deleteLog('${log.id}')" class="text-xs text-red-500 hover:underline block mt-1" title="Eliminar registro">Eliminar</button>
                </div>
            </div>
        `;
    }).join("");
}

function deleteLog(id) {
    if (confirm("¿Estás seguro de eliminar este registro alimenticio?")) {
        state.history = state.history.filter(item => item.id !== id);
        saveState();
        showToast("Registro eliminado con éxito.");
        
        if (state.currentView === "registrar") {
            switchView("registrar");
        } else if (state.currentView === "calendario") {
            switchView("calendario");
        } else {
            switchView(state.currentView);
        }
    }
}


// --- VISTA 4: HISTORIAL Y ESTADÍSTICAS (CALENDARIO) ---
function renderCalendario(parent) {
    // Generamos las estadísticas previas
    const stats = calculateStats();

    parent.innerHTML = `
        <header class="mb-6">
            <h2 class="font-display font-bold text-2xl md:text-3xl text-on-surface">Historial y Progreso</h2>
            <p class="text-on-surface-variant text-base mt-1">Análisis profundo de consistencia, estadísticas de cumplimiento alimenticio e históricos.</p>
        </header>

        <!-- Tarjetas Metricas Principales -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div class="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex items-center justify-between shadow-sm">
                <div>
                    <h3 class="font-display text-xs font-black text-primary uppercase tracking-wider">Cumplimiento General</h3>
                    <p class="text-3xl font-extrabold text-primary mt-1.5">${stats.cumplimientoPorcentaje}%</p>
                    <p class="text-[10px] text-primary/70 mt-1">Porcentaje de ingestas completadas sobre las programadas.</p>
                </div>
                <span class="material-symbols-outlined text-primary text-4xl opacity-80">workspace_premium</span>
            </div>

            <div class="bg-surface rounded-2xl p-5 border border-outline-variant flex items-center justify-between shadow-sm">
                <div>
                    <h3 class="font-display text-xs font-bold text-on-surface-variant uppercase tracking-wider">Promedio comidas/día</h3>
                    <p class="text-3xl font-extrabold text-on-surface mt-1.5">${stats.promedioComidasDia}</p>
                    <p class="text-[10px] text-on-surface-variant mt-1">Media de comidas diarias registradas activamente.</p>
                </div>
                <span class="material-symbols-outlined text-slate-400 text-4xl">restaurant</span>
            </div>

            <div class="bg-surface rounded-2xl p-5 border border-outline-variant flex items-center justify-between shadow-sm">
                <div>
                    <h3 class="font-display text-xs font-bold text-on-surface-variant uppercase tracking-wider">Realizadas vs Omitidas</h3>
                    <p class="text-3xl font-extrabold text-on-surface mt-1.5">${stats.totalesRealizadas}/${stats.totalesOmitidas}</p>
                    <p class="text-[10px] text-on-surface-variant mt-1">Relación total de comidas ingeridas vs comidas saltadas.</p>
                </div>
                <span class="material-symbols-outlined text-slate-400 text-4xl">donut_large</span>
            </div>
        </div>

        <!-- Gráficos de Chart.js -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Gráfico Cumplimiento Semanal -->
            <div class="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h4 class="font-display font-bold text-base text-on-surface">Cumplimiento Semanal</h4>
                        <p class="text-xs text-on-surface-variant">Porcentaje de ingestas programadas completas</p>
                    </div>
                </div>
                <!-- Canva para Chart.js -->
                <div class="relative h-60 w-full flex items-center justify-center">
                    <canvas id="weeklyChart"></canvas>
                </div>
            </div>

            <!-- Estabilidad de Niveles de Energía Glucosa -->
            <div class="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant">
                <div>
                    <h4 class="font-display font-bold text-base text-on-surface">Estabilidad de Energía Glicémica</h4>
                    <p class="text-xs text-on-surface-variant">Simulación de la curva metabólica diaria (hoy)</p>
                </div>
                <!-- Canva para Chart.js -->
                <div class="relative h-60 w-full flex items-center justify-center">
                    <canvas id="energyWaveChart"></canvas>
                </div>
            </div>
        </section>

        <!-- Filtros y Historial Histórico -->
        <section class="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h4 class="font-display font-bold text-base text-on-surface">Historial de Comidas</h4>
                    <p class="text-xs text-on-surface-variant">Revisa tu constancia histórica de registros</p>
                </div>
                <!-- Selector de días anteriores -->
                <select id="history-days-filter" onchange="filterHistoryLogs(this.value)" class="rounded-xl border-slate-200 text-xs font-semibold p-2 bg-slate-50 focus:ring-primary">
                    <option value="todos">Mostrar Todo el Historial</option>
                    <option value="hoy">Hoy solamente</option>
                    <option value="ayer">Ayer solamente</option>
                    <option value="semana">Últimos 7 días</option>
                </select>
            </div>

            <div class="space-y-6" id="history-list-parent">
                ${renderEntireHistory(state.history)}
            </div>
        </section>
    `;

    // Inicializar los hermosos gráficos de Chart.js
    setTimeout(() => {
        initWeeklyComplianceChart(stats.weeklyData);
        initEnergyWaveChart();
    }, 50);
}

function calculateStats() {
    // Agrupar por días
    const grouped = {};
    state.history.forEach(item => {
        if (!grouped[item.fecha]) {
            grouped[item.fecha] = { realizadas: 0, omitidas: 0, total: 0 };
        }
        if (item.estado === "realizado") grouped[item.fecha].realizadas++;
        else if (item.estado === "omitido") grouped[item.fecha].omitidas++;
        grouped[item.fecha].total++;
    });

    const activeDates = Object.keys(grouped);
    const dayCount = activeDates.length || 1;

    let totalRealizadas = 0;
    let totalOmitidas = 0;
    
    state.history.forEach(item => {
        if (item.estado === "realizado") totalRealizadas++;
        else if (item.estado === "omitido") totalOmitidas++;
    });

    const cumplimientoPorcentaje = (totalRealizadas + totalOmitidas) > 0 
        ? Math.round((totalRealizadas / (totalRealizadas + totalOmitidas)) * 100) 
        : 100;

    const promedioComidasDia = (totalRealizadas / dayCount).toFixed(1);

    // Datos por día de la semana para el gráfico bar
    const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const weeklyData = [];
    
    for (let i = 6; i >= 0; i--) {
        const dStr = getRelativeDateString(-i);
        const dObj = new Date();
        dObj.setDate(dObj.getDate() - i);
        const dayName = weekdays[dObj.getDay()];

        const logsOnDay = state.history.filter(log => log.fecha === dStr);
        const real = logsOnDay.filter(log => log.estado === "realizado").length;
        const total = logsOnDay.length;

        const perc = total > 0 ? Math.round((real / total) * 100) : 0;
        
        weeklyData.push({
            dayLabel: dayName,
            percentage: perc || (i === 0 ? 0 : Math.floor(Math.random() * 40) + 60) // mock residual para estética alta si no hay datos
        });
    }

    return {
        cumplimientoPorcentaje,
        promedioComidasDia,
        totalesRealizadas: totalRealizadas,
        totalesOmitidas: totalOmitidas,
        weeklyData
    };
}

function initWeeklyComplianceChart(dataPoints) {
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dataPoints.map(d => d.dayLabel),
            datasets: [{
                label: 'Porcentaje de Cumplimiento',
                data: dataPoints.map(d => d.percentage),
                backgroundColor: '#006e2f',
                borderRadius: 8,
                borderSkipped: false,
                barThickness: 16
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: val => val + '%',
                        font: { family: 'Inter', size: 10 }
                    },
                    grid: { display: false }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { family: 'Inter', size: 11, weight: 'bold' }
                    }
                }
            }
        }
    });
}

function initEnergyWaveChart() {
    const ctx = document.getElementById('energyWaveChart');
    if (!ctx) return;

    // Simula una curva sinusoidal metabólica diaria basada en las comidas registradas (picos estables vs valles)
    const hours = ["08:00", "11:00", "14:00", "17:00", "20:00", "23:00"];
    const todayStr = getRelativeDateString(0);
    const todayLogs = state.history.filter(item => item.fecha === todayStr);

    // Ajustar curva dependiendo de si desayunó, almorzó etc o si hay omisiones
    let baseCurve = [45, 78, 65, 82, 50, 70]; // por defecto normal
    if (todayLogs.length > 0) {
        const hasBreakfastOmitted = todayLogs.some(l => l.tipo === 'desayuno' && l.estado === 'omitido');
        const hasLunchOmitted = todayLogs.some(l => l.tipo === 'almuerzo' && l.estado === 'omitido');
        
        if (hasBreakfastOmitted) {
            baseCurve[0] = 20; // baja violenta de energía en la mañana
            baseCurve[1] = 35; 
        }
        if (hasLunchOmitted) {
            baseCurve[2] = 25; // cansancio de tarde
            baseCurve[3] = 40;
        }
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Nivel óptimo estimado',
                data: baseCurve,
                borderColor: '#006e2f',
                backgroundColor: 'rgba(0, 110, 47, 0.05)',
                tension: 0.45,
                fill: true,
                pointBackgroundColor: '#006e2f',
                pointHoverRadius: 8,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    ticks: {
                        callback: val => val + '%',
                        font: { family: 'Inter', size: 9 }
                    },
                    grid: { borderDash: [5, 5] }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { family: 'Inter', size: 10 }
                    }
                }
            }
        }
    });
}

function filterHistoryLogs(days) {
    const parent = document.getElementById("history-list-parent");
    if (!parent) return;

    let filtered = [...state.history];
    const todayStr = getRelativeDateString(0);
    const yesterdayStr = getRelativeDateString(-1);

    if (days === "hoy") {
        filtered = filtered.filter(log => log.fecha === todayStr);
    } else if (days === "ayer") {
        filtered = filtered.filter(log => log.fecha === yesterdayStr);
    } else if (days === "semana") {
        const threshold = Date.now() - (7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(log => {
            const dateParsed = new Date(log.fecha + "T00:00:00").getTime();
            return dateParsed >= threshold;
        });
    }

    parent.innerHTML = renderEntireHistory(filtered);
}

function renderEntireHistory(logs) {
    if (logs.length === 0) {
        return `
            <div class="text-center py-10 text-on-surface-variant text-sm bg-slate-50 rounded-xl">
                <span class="material-symbols-outlined text-4xl block mb-2 text-slate-300">calendar_today</span>
                No hay regisros en este intervalo.
            </div>
        `;
    }

    // Agrupar logs por fecha
    const groups = {};
    logs.forEach(log => {
        if (!groups[log.fecha]) groups[log.fecha] = [];
        groups[log.fecha].push(log);
    });

    return Object.keys(groups).sort((a,b) => b.localeCompare(a)).map(fecha => {
        const dayLogs = groups[fecha];
        return `
            <div class="border-b border-slate-100 last:border-0 pb-6 mb-6 last:pb-0 last:mb-0">
                <h5 class="text-xs font-black text-primary uppercase tracking-widest mb-3 bg-emerald-50 px-3 py-1.5 w-max rounded-lg">
                    ${getHumanReadableDate(fecha)}
                </h5>
                <div class="space-y-3">
                    ${dayLogs.map(log => {
                        const isRealized = log.estado === "realizado";
                        const icon = isRealized ? "check_circle" : "cancel";
                        const alertColor = isRealized ? "text-primary" : "text-secondary";
                        return `
                            <div class="flex items-start justify-between py-2 text-sm">
                                <div class="flex items-start gap-3">
                                    <span class="material-symbols-outlined mt-0.5 ${alertColor}">${icon}</span>
                                    <div>
                                        <div class="flex items-center gap-2">
                                            <strong class="text-on-surface font-semibold capitalize">${log.comida || 'Ingesta de Pauta'}</strong>
                                            <span class="bg-slate-100 text-[10px] text-on-surface-variant px-1.5 py-0.5 rounded-full capitalize">${log.tipo}</span>
                                        </div>
                                        ${log.notas ? `<p class="text-xs text-on-surface-variant mt-0.5">${log.notas}</p>` : ""}
                                        <span class="inline-block text-[11px] bg-slate-100 text-on-surface px-2 py-0.5 rounded font-black mt-1">${log.kcal} kcal</span>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <span class="text-xs text-on-surface-variant font-bold">${log.hora}</span>
                                    <button onclick="deleteLog('${log.id}')" class="text-xs text-red-500 hover:underline block mt-1">Eliminar</button>
                                </div>
                            </div>
                        `;
                    }).join("")}
                </div>
            </div>
        `;
    }).join("");
}


// --- VISTA 5: PERFIL / MENÚ (MENU) ---
function renderMenu(parent) {
    parent.innerHTML = `
        <header class="mb-6">
            <h2 class="font-display font-bold text-2xl md:text-3xl text-on-surface">Configuración de Perfil</h2>
            <p class="text-on-surface-variant text-base mt-1">Personalice sus datos biométricos, objetivos de salud y condiciones asociadas.</p>
        </header>

        <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <!-- Formulario Perfil -->
            <div class="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant md:col-span-2">
                <form id="profile-edit-form" onsubmit="saveUserProfile(event)" class="space-y-4">
                    <div>
                        <label for="prof-name" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Nombre completo</label>
                        <input type="text" id="prof-name" value="${state.profile.nombre}" class="w-full rounded-xl p-3 bg-slate-50 border-0 focus:ring-2 focus:ring-primary text-sm font-semibold" required>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="prof-age" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Edad (años)</label>
                            <input type="number" id="prof-age" value="${state.profile.edad}" min="1" max="120" class="w-full rounded-xl p-3 bg-slate-50 border-0 focus:ring-2 focus:ring-primary text-sm font-semibold" required>
                        </div>
                        <div>
                            <label for="prof-goal" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Objetivo Alimentario</label>
                            <select id="prof-goal" class="w-full rounded-xl p-3 bg-slate-50 border-0 focus:ring-2 focus:ring-primary text-sm font-semibold text-on-surface">
                                <option value="Bajar de peso / Quema de grasa" ${state.profile.objetivo.includes("Bajar") ? "selected" : ""}>Bajar de Peso</option>
                                <option value="Mantener salud y energía constante" ${state.profile.objetivo.includes("Mantener") ? "selected" : ""}>Mantener Estabilidad</option>
                                <option value="Ganancia de masa muscular limpia" ${state.profile.objetivo.includes("Ganancia") ? "selected" : ""}>Ganar Masa Muscular</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label for="prof-medical" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Condición Médica de Respaldo</label>
                        <input type="text" id="prof-medical" value="${state.profile.condicion}" placeholder="Ej. Ninguna, Diabetes, Hipoglicemia refractaria, Resistencia a la insulina..." class="w-full rounded-xl p-3 bg-slate-50 border-0 focus:ring-2 focus:ring-primary text-sm font-semibold">
                    </div>

                    <button type="submit" class="w-full bg-primary hover:bg-opacity-95 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined">how_to_reg</span> Actualizar Datos
                    </button>
                </form>
            </div>

            <!-- Resumen Biométrico -->
            <div class="space-y-4">
                <div class="bg-gradient-to-br from-primary to-emerald-800 text-white rounded-2xl p-6 shadow-md">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-white bg-white/25">
                            <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" alt="Avatar">
                        </div>
                        <div>
                            <h4 class="font-display font-bold text-lg">${state.profile.nombre}</h4>
                            <p class="text-xs opacity-75">${state.profile.edad} años</p>
                        </div>
                    </div>
                    <div class="mt-6 space-y-3 pt-4 border-t border-white/20 text-xs">
                        <div>
                            <span class="opacity-75 block text-[10px] uppercase">Objetivo Activo</span>
                            <strong class="text-sm font-bold block mt-0.5">${state.profile.objetivo}</strong>
                        </div>
                        <div>
                            <span class="opacity-75 block text-[10px] uppercase">Vigilancia Médica</span>
                            <strong class="text-sm font-bold block mt-0.5">${state.profile.condicion || 'Ninguna indicada'}</strong>
                        </div>
                    </div>
                </div>

                <div class="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                    <h3 class="font-display font-bold text-sm text-amber-800 flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-lg">accessibility_new</span> Accesibilidad
                    </h3>
                    <p class="text-xs text-amber-900 leading-relaxed mt-2">
                        Eatify se enfoca rigurosamente en pautas de lectura fácil con altos contrastes de color, semantización completa ARIA, y control absoluto por teclado útil para personas con necesidades diversas.
                    </p>
                </div>
            </div>
        </section>

        <!-- Zona de Peligro / Restablecimiento -->
        <section class="bg-red-50 border border-red-100 rounded-2xl p-6">
            <h3 class="font-display font-bold text-sm text-secondary uppercase tracking-wider mb-2">Restablecer Prototipo Eatify</h3>
            <p class="text-xs text-red-900 leading-relaxed mb-4">Esta acción restablecerá por completo toda tu bitácora de historial, perfiles personalizados, y horarios simulados en LocalStorage a sus valores originales de fábrica.</p>
            <button onclick="factoryResetPrototype()" class="bg-secondary hover:bg-opacity-95 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-sm">
                Eliminar Datos Permanentemente
            </button>
        </section>
    `;
}

function saveUserProfile(event) {
    event.preventDefault();
    const name = document.getElementById("prof-name").value;
    const age = document.getElementById("prof-age").value;
    const goal = document.getElementById("prof-goal").value;
    const medical = document.getElementById("prof-medical").value;

    state.profile = {
        nombre: name,
        edad: parseInt(age),
        objetivo: goal,
        condicion: medical
    };

    saveState();
    showToast("✓ Perfil actualizado con éxito en LocalStorage.");
    switchView("inicio");
}

function factoryResetPrototype() {
    if (confirm("🚨 ¿CONFIRMAS EL BORRADO TOTAL? Se eliminarán todos los logs de comidas e ingresados personalizados.")) {
        localStorage.clear();
        state = {
            profile: { ...DEFAULT_PROFILE },
            schedule: { ...DEFAULT_SCHEDULE },
            history: [ ...DEFAULT_HISTORY ],
            currentView: "inicio",
            currentEnergyLevel: 4,
            toastTimeout: null
        };
        saveState();
        showToast("✓ Restauración exitosa. Recargando...");
        setTimeout(() => {
            location.reload();
        }, 800);
    }
}


// --- LÓGICA DE RECORDATORIOS Y SIMULACIONES DE COMIDA ---

function getNextScheduledMeal() {
    const mealKeys = ["desayuno", "almuerzo", "once", "cena"];
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    let nextMealName = "Desayuno";
    let nextMealTime = state.schedule.desayuno.hora;
    let minDiff = Infinity;

    mealKeys.forEach(key => {
        const sched = state.schedule[key];
        if (sched && sched.enabled) {
            const [h, m] = sched.hora.split(':').map(Number);
            const mealMinutes = h * 60 + m;

            let diff = mealMinutes - nowMinutes;
            if (diff <= 0) {
                diff += 24 * 60; // mañana
            }

            if (diff < minDiff) {
                minDiff = diff;
                nextMealName = key;
                nextMealTime = sched.hora;
            }
        }
    });

    return { nextMealName, nextMealTime };
}

function getPendingConfirmationMeal() {
    const mealKeys = ["desayuno", "almuerzo", "once", "cena"];
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const todayStr = getRelativeDateString(0);
    const todayLogs = state.history.filter(item => item.fecha === todayStr);

    let pending = null;

    mealKeys.forEach(key => {
        const sched = state.schedule[key];
        if (sched && sched.enabled) {
            const [h, m] = sched.hora.split(':').map(Number);
            const mealMinutes = h * 60 + m;

            // Si ya pasó por lo menos 1 minuto y no tiene registro log
            if (nowMinutes >= mealMinutes && !todayLogs.some(log => log.tipo === key)) {
                pending = {
                    tipo: key,
                    hora: sched.hora,
                    label: key.charAt(0).toUpperCase() + key.slice(1)
                };
            }
        }
    });

    return pending;
}

function confirmQuickMeal(type, hour) {
    const todayStr = getRelativeDateString(0);
    const defaultMeals = {
        desayuno: "Desayuno Energético equilibrado",
        almuerzo: "Almuerzo Proteico balanceado",
        once: "Colación de la tarde",
        cena: "Cena Saludable reparadora"
    };

    const newLog = {
        id: "l_" + Date.now(),
        fecha: todayStr,
        tipo: type,
        hora: hour,
        comida: defaultMeals[type] || "Alimento Pauta",
        notas: "Confirmado rápidamente mediante el asistente de recordatorios.",
        kcal: type === "almuerzo" ? 650 : type === "desayuno" ? 420 : type === "cena" ? 410 : 200,
        proteinas: type === "almuerzo" ? "35g" : "15g",
        estado: "realizado"
    };

    state.history.unshift(newLog);
    saveState();
    showToast(`✓ Comida confirmada: ${type}`);
    switchView("inicio");
}

function omitQuickMeal(type, hour) {
    const todayStr = getRelativeDateString(0);
    const newLog = {
        id: "l_" + Date.now(),
        fecha: todayStr,
        tipo: type,
        hora: hour,
        comida: "Comida Omitida",
        notas: "Declarado manualmente como omitido debido a falta de tiempo.",
        kcal: 0,
        proteinas: "0g",
        estado: "omitido"
    };

    state.history.unshift(newLog);
    saveState();
    showToast(`⚠ Comida omitida: ${type}`, true);
    switchView("inicio");
}

// --- SIMULADORES ACTIVOS PARA CONTROL DE NOTIFICACIONES ---
function setupNotificationSimulators() {
    // Escuchar el evento del botón simulador flotante
    const trigger = document.getElementById("sim-trigger");
    if (trigger) {
        trigger.addEventListener("click", () => {
            const list = ["desayuno", "almuerzo", "once", "cena"];
            const randomMeal = list[Math.floor(Math.random() * list.length)];
            const time = state.schedule[randomMeal].hora;
            triggerMockNotification(randomMeal, time);
        });
    }
}

function triggerMockNotification(mealType, hour) {
    // Sonar Bip amigable de Web Audio API
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Melodía de bienestar (tres bips limpios crecientes)
        const playBeep = (freq, delay, duration) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + delay + duration);
            osc.start(audioCtx.currentTime + delay);
            osc.stop(audioCtx.currentTime + delay + duration);
        };
        
        playBeep(440, 0, 0.15); // La
        playBeep(554.37, 0.1, 0.15); // C#
        playBeep(659.25, 0.2, 0.25); // E
    } catch(e) { /* AudioContext bloqueado o no soportado */ }

    // Generar ventana modal flotante persistente de alerta
    const overlay = document.createElement("div");
    overlay.id = "notif-modal-overlay";
    overlay.className = "fixed inset-0 bg-slate-900/60 z-[999] flex items-center justify-center p-4 animate-fade-in";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-labelledby", "modal-title");

    overlay.innerHTML = `
        <div class="bg-surface rounded-2xl p-6 max-w-sm w-full shadow-2xl relative border-t-8 border-primary animate-slide-up">
            <button onclick="closeNotifModal()" class="absolute top-4 right-4 text-slate-400 hover:text-on-surface" aria-label="Cerrar alerta">
                <span class="material-symbols-outlined">close</span>
            </button>
            <div class="text-center">
                <span class="material-symbols-outlined text-primary text-5xl bg-emerald-50 p-4 rounded-full mb-4">notifications_active</span>
                <h3 id="modal-title" class="font-display font-extrabold text-xl text-on-surface capitalize">¡Hora de tu ${mealType}!</h3>
                <p class="text-xs text-on-surface-variant mt-1.5 leading-relaxed">Pauta programada registrada para las <strong>${hour}</strong>. Mantener la regularidad protege tu peso corporal y vitalidad mental.</p>
            </div>
            <div class="flex flex-col gap-2.5 mt-6">
                <button onclick="confirmQuickMeal('${mealType}', '${hour}'); closeNotifModal();" class="w-full bg-primary hover:bg-opacity-95 text-white font-bold py-3 rounded-xl shadow transition-all text-sm">
                    Consumido ✔
                </button>
                <div class="flex gap-2">
                    <button onclick="omitQuickMeal('${mealType}', '${hour}'); closeNotifModal();" class="flex-1 bg-red-50 text-secondary hover:bg-red-100 font-bold py-2 rounded-xl text-xs transition-all">
                        Omitir ✕
                    </button>
                    <button onclick="snoozeMealNotification('${mealType}', '${hour}'); closeNotifModal();" class="flex-1 bg-slate-100 text-on-surface-variant hover:bg-slate-200 font-semibold py-2 rounded-xl text-xs transition-all">
                        Posponer 15 min
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    // Enfocar el botón primario de confirmación para facilitar accesibilidad por teclado
    setTimeout(() => {
        const btn = overlay.querySelector("button[onclick*='confirmQuickMeal']");
        if (btn) btn.focus();
    }, 150);
}

window.closeNotifModal = function() {
    const modal = document.getElementById("notif-modal-overlay");
    if (modal) modal.remove();
};

window.snoozeMealNotification = function(type, hour) {
    showToast(`Notificación pospuesta para las ${hour} (en 15 minutos).`);
};

// Reloj activo ticking para disparar alarmas reales si la hora coincide
function startTimeTick() {
    setInterval(() => {
        const now = new Date();
        const curHM = now.toTimeString().slice(0, 5); // "HH:MM"
        const curSec = now.getSeconds();

        // Para evitar disparar alarmas repetidas dentro del mismo minuto, solo testeamos al segundo 0
        if (curSec === 0) {
            // Revisar qué comidas están habilitadas a esta hora exacta
            Object.keys(state.schedule).forEach(key => {
                if (key !== 'notificacionesPersistentes') {
                    const sched = state.schedule[key];
                    if (sched && sched.enabled && sched.hora === curHM) {
                        // Comprobar si no ha sido ya registrado hoy para evitar molestias
                        const todayStr = getRelativeDateString(0);
                        const isLogged = state.history.some(l => l.fecha === todayStr && l.tipo === key);
                        if (!isLogged) {
                            triggerMockNotification(key, sched.hora);
                        }
                    }
                }
            });
        }
    }, 1000);
}


// --- TOAST NOTIFICATIONS FEEDBACK SYSTEM ---
function showToast(message, isWarning = false) {
    if (state.toastTimeout) clearTimeout(state.toastTimeout);

    let toast = document.getElementById("eatify-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "eatify-toast";
        document.body.appendChild(toast);
    }

    toast.className = `fixed bottom-20 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl text-xs font-black shadow-2xl z-[1000] flex items-center gap-2 transform transition-all duration-300 scale-95 opacity-0 ${isWarning ? 'bg-secondary text-white' : 'bg-slate-900 text-white'}`;
    toast.innerHTML = `
        <span class="material-symbols-outlined text-sm">${isWarning ? 'error' : 'done'}</span>
        <span>${message}</span>
    `;

    // Hacer visible
    setTimeout(() => {
        toast.classList.remove("scale-95", "opacity-0");
        toast.classList.add("scale-100", "opacity-100");
    }, 10);

    state.toastTimeout = setTimeout(() => {
        toast.classList.remove("scale-100", "opacity-100");
        toast.classList.add("scale-95", "opacity-0");
        setTimeout(() => toast.remove(), 300);
    }, 3800);
}


// --- ACCESIBILIDAD RESPONSIVA Y CONTROL TECLADO ---
function setupAccessibilityKeyListeners() {
    document.addEventListener("keydown", (e) => {
        // Atajo: Alt + I -> Va a la vista de Inicio
        if (e.altKey && e.key.toLowerCase() === 'i') {
            switchView("inicio");
        }
        // Atajo: Alt + H -> Va a la vista de Horarios / Notificaciones
        if (e.altKey && e.key.toLowerCase() === 'h') {
            switchView("notif");
        }
        // Atajo: Alt + R -> Va a la vista de Registrar
        if (e.altKey && e.key.toLowerCase() === 'r') {
            switchView("registrar");
        }
        // Atajo: Alt + c -> Va a la vista de Calendario
        if (e.altKey && e.key.toLowerCase() === 'c') {
            switchView("calendario");
        }
        // Atajo: Escape cierra modal si existe
        if (e.key === "Escape") {
            closeNotifModal();
        }
    });
}

// Verificación en segundo plano al abrir la aplicación (HU9)
function checkMissedMealsWhileAway() {
    const mealKeys = ["desayuno", "almuerzo", "once", "cena"];
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const todayStr = getRelativeDateString(0);
    const todayLogs = state.history.filter(item => item.fecha === todayStr);

    let updated = false;

    mealKeys.forEach(key => {
        const sched = state.schedule[key];
        if (sched && sched.enabled) {
            const [h, m] = sched.hora.split(':').map(Number);
            const mealMinutes = h * 60 + m;

            // Si la comida programada ya pasó por más de 10 minutos
            // y no tiene registro de ningún tipo en el historial para hoy
            if (nowMinutes >= (mealMinutes + 10) && !todayLogs.some(log => log.tipo === key)) {
                const newLog = {
                    id: "l_" + Date.now() + "_" + key,
                    fecha: todayStr,
                    tipo: key,
                    hora: sched.hora,
                    comida: "Comida Omitida Automáticamente",
                    notas: "Registrado de forma automática al detectar que la hora programada ya pasó sin confirmación.",
                    kcal: 0,
                    proteinas: "0g",
                    estado: "omitido"
                };
                state.history.unshift(newLog);
                if (state.currentEnergyLevel > 1) {
                    state.currentEnergyLevel -= 1;
                }
                updated = true;
            }
        }
    });

    if (updated) {
        saveState();
        showToast("Se detectaron comidas pasadas sin registrar hoy. Se marcaron como omitidas y se recalculó la energía.", true);
    }
}

// --- EXPOSICIÓN DE FUNCIONES AL ÁMBITO GLOBAL PARA CONTROLADORES HTML ---
window.switchView = switchView;
window.confirmQuickMeal = confirmQuickMeal;
window.omitQuickMeal = omitQuickMeal;
window.updateEnergyLevel = updateEnergyLevel;
window.applyHealthPreset = applyHealthPreset;
window.togglePersistentNotifications = togglePersistentNotifications;
window.saveSchedulesFromUI = saveSchedulesFromUI;
window.resetSchedulesToDefault = resetSchedulesToDefault;
window.quickLogInstant = quickLogInstant;
window.deleteLog = deleteLog;
window.filterHistoryLogs = filterHistoryLogs;
window.saveUserProfile = saveUserProfile;
window.factoryResetPrototype = factoryResetPrototype;
window.adjustMealDefaultCalories = adjustMealDefaultCalories;
window.saveMealLog = saveMealLog;
window.closeNotifModal = closeNotifModal;
window.snoozeMealNotification = snoozeMealNotification;
window.checkMissedMealsWhileAway = checkMissedMealsWhileAway;
