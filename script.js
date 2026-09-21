// Элементы Слайда 1
const slide1 = document.getElementById('slide-1');
const slider = document.getElementById('love-slider');
const pointer = document.getElementById('pointer');
const displayValue = document.getElementById('display-value');
const btnNext = document.getElementById('btn-next');
const img10 = document.getElementById('img-10');
const img30 = document.getElementById('img-30');
const img50 = document.getElementById('img-50');
const img80 = document.getElementById('img-80');

// Элементы Слайда 2
const slide2 = document.getElementById('slide-2');
const monthYearLabel = document.getElementById('month-year-label');
const daysGrid = document.getElementById('days-grid');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const meetTimeInput = document.getElementById('meet-time');
const btnFinish = document.getElementById('btn-finish');

let isGlitching = false;

// Настройки заблокированного календаря
const CURRENT_YEAR = 2026;
let currentMonth = new Date().getMonth(); 
let selectedDay = null;

const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

function changeActiveImage(activeImg) {
    [img10, img30, img50, img80].forEach(img => img.classList.remove('active'));
    if (activeImg) activeImg.classList.add('active');
}

function updateGauge(value) {
    if (isGlitching) return;
    let val = parseInt(value);
    let angle = -90 + (val * 1.8);
    pointer.style.transform = `rotate(${angle}deg)`;
    displayValue.innerText = "0%";

    if (val >= 10 && val < 30) changeActiveImage(img10);
    else if (val >= 30 && val < 50) changeActiveImage(img30);
    else if (val >= 50 && val < 80) changeActiveImage(img50);
    else if (val >= 80) changeActiveImage(img80);
    else changeActiveImage(null);

    if (val === 100) triggerGlitch();
}

function triggerGlitch() {
    isGlitching = true;
    slider.disabled = true;
    let duration = 5000; 
    let intervalTime = 50;
    let elapsed = 0;

    const glitchInterval = setInterval(() => {
        elapsed += intervalTime;
        let randomNum = Math.floor(Math.random() * 900) + 100;
        displayValue.innerText = randomNum + "%";
        let randomAngle = Math.floor(Math.random() * 30) - 15;
        pointer.style.transform = `rotate(${randomAngle}deg)`;

        if (elapsed >= duration) {
            clearInterval(glitchInterval);
            finalizeGauge();
        }
    }, intervalTime);
}

function finalizeGauge() {
    displayValue.innerText = "-1%";
    pointer.style.transform = 'rotate(-95deg)'; 
    btnNext.classList.add('show');
}

slider.addEventListener('input', (e) => updateGauge(e.target.value));

// Переход на 2 слайд (Календарь)
btnNext.addEventListener('click', () => {
    slide1.classList.add('hidden');
    setTimeout(() => {
        slide1.style.display = 'none'; 
        slide2.classList.remove('hidden');
        renderCalendar();
    }, 500);
});

// Логика сборки календаря с защитой от хитрых дат
function renderCalendar() {
    daysGrid.innerHTML = "";
    monthYearLabel.innerText = `${monthNames[currentMonth]} ${CURRENT_YEAR}`;

    let firstDayIndex = new Date(CURRENT_YEAR, currentMonth, 1).getDay();
    let startShift = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    let daysInMonth = new Date(CURRENT_YEAR, currentMonth + 1, 0).getDate();

    // Получаем точку отсчета: сегодня + 7 дней (блокируем текущую неделю)
    const today = new Date();
    const minSelectableDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

    for (let i = 0; i < startShift; i++) {
        let emptyDiv = document.createElement('div');
        emptyDiv.classList.add('empty');
        daysGrid.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        let dayDiv = document.createElement('div');
        dayDiv.innerText = day;

        // Создаем объект даты для текущего проверяемого дня на календаре
        let checkDate = new Date(CURRENT_YEAR, currentMonth, day);

        // Проверяем: если дата меньше, чем (сегодня + 7 дней), то блокируем её
        if (checkDate < minSelectableDate) {
            dayDiv.style.color = '#ccc';
            dayDiv.style.cursor = 'not-allowed';
            dayDiv.style.background = 'none';
            dayDiv.classList.add('empty'); // Чтобы hover-эффект не срабатывал
        } else {
            // Если дата доступна для выбора
            if (selectedDay && selectedDay.day === day && selectedDay.month === currentMonth) {
                dayDiv.classList.add('selected');
            }

            dayDiv.addEventListener('click', () => {
                document.querySelectorAll('.days-grid div').forEach(d => d.classList.remove('selected'));
                dayDiv.classList.add('selected');
                selectedDay = { day: day, month: currentMonth };
            });
        }

        daysGrid.appendChild(dayDiv);
    }
}

// Переключение месяцев
prevMonthBtn.addEventListener('click', () => {
    if (currentMonth > 0) {
        currentMonth--;
        renderCalendar();
    }
});

nextMonthBtn.addEventListener('click', () => {
    if (currentMonth < 11) {
        currentMonth++;
        renderCalendar();
    }
});

// Кнопка подтверждения свидания
btnFinish.addEventListener('click', () => {
    if (!selectedDay) {
        alert('Пожалуйста, выбери доступную дату на календаре!, это важно:( ) 💕');
        return;
    }
    let finalDate = `${selectedDay.day} ${monthNames[selectedDay.month]} ${CURRENT_YEAR}`;
    let finalTime = meetTimeInput.value;
    
    alert(`честно выбрала))???`);
});
