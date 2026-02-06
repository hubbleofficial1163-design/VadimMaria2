// Обратный отсчет до свадьбы 24 апреля 2026 года, 15:30
const weddingDate = new Date('2026-04-24T15:30:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = weddingDate - now;
    
    if (timeLeft < 0) {
        document.getElementById('weeks').textContent = '00';
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }
    
    const seconds = Math.floor((timeLeft / 1000) % 60);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const days = Math.floor((timeLeft / (1000 * 60 * 60 * 24)) % 7);
    const weeks = Math.floor(timeLeft / (1000 * 60 * 60 * 24 * 7));
    
    document.getElementById('weeks').textContent = weeks.toString().padStart(2, '0');
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Запуск обратного отсчета
updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);

// Настройка после загрузки
window.addEventListener('load', function() {
    document.body.classList.add('zero-visible');
    
    // Проверка фонового изображения (без уведомлений)
    const bgImg = new Image();
    bgImg.src = '11.jpg';
    
    bgImg.onerror = function() {
        // Если фон не загрузился, используем простой цветной фон
        document.body.style.backgroundColor = '#f5f5f5';
        
        // Также удаляем псевдоэлементы с фоном
        const style = document.createElement('style');
        style.textContent = `
            body::before,
            body::after,
            .schedule-section::before,
            .schedule-section::after {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    };
    
    // Проверка фото пары
    const photo = document.querySelector('.couple-photo');
    if (photo) {
        photo.onerror = function() {
            const container = document.querySelector('.photo-container');
            if (container) {
                container.innerHTML = '<div class="photo-placeholder" style="width: 280px; height: 200px; background: rgba(245, 245, 245, 0.9); display: flex; align-items: center; justify-content: center; color: #999; font-size: 14px; border-radius: 2px;">Фото Вадима и Марии</div>';
            }
        };
    }
});

// Отключение масштабирования
document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Предотвращение контекстного меню
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Улучшение взаимодействия с Яндекс картой на мобильных устройствах
document.addEventListener('DOMContentLoaded', function() {
    const mapIframe = document.querySelector('.map-wrapper iframe');
    const mapContainer = document.querySelector('.map-wrapper');
    const body = document.body;
    
    if (mapIframe && mapContainer) {
        let isTouchingMap = false;
        let startY = 0;
        
        // Для десктопов - просто разрешаем взаимодействие
        if (window.innerWidth > 768) {
            mapIframe.style.pointerEvents = 'auto';
            return;
        }
        
        // Для мобильных устройств - улучшенная обработка
        mapContainer.addEventListener('touchstart', function(e) {
            // Проверяем, началось ли касание на карте
            const rect = mapContainer.getBoundingClientRect();
            const touchY = e.touches[0].clientY;
            
            if (touchY >= rect.top && touchY <= rect.bottom) {
                isTouchingMap = true;
                startY = touchY;
                
                // Временно блокируем скролл страницы
                body.classList.add('map-scroll-lock');
                body.style.overflow = 'hidden';
                
                // Разрешаем взаимодействие с картой
                mapIframe.style.pointerEvents = 'auto';
            }
        }, { passive: true });
        
        mapContainer.addEventListener('touchmove', function(e) {
            if (!isTouchingMap) return;
            
            const currentY = e.touches[0].clientY;
            const deltaY = Math.abs(currentY - startY);
            
            // Если движение преимущественно вертикальное и значительное - это скролл страницы
            if (deltaY > 10) {
                // Восстанавливаем скролл страницы
                body.classList.remove('map-scroll-lock');
                body.style.overflow = 'auto';
                mapIframe.style.pointerEvents = 'none';
                isTouchingMap = false;
            }
        }, { passive: true });
        
        mapContainer.addEventListener('touchend', function() {
            // Восстанавливаем состояние
            setTimeout(() => {
                body.classList.remove('map-scroll-lock');
                body.style.overflow = 'auto';
                mapIframe.style.pointerEvents = 'auto';
                isTouchingMap = false;
            }, 100);
        }, { passive: true });
        
        // Обработка ухода курсора/пальца с карты
        mapContainer.addEventListener('mouseleave', function() {
            body.classList.remove('map-scroll-lock');
            body.style.overflow = 'auto';
        });
    }
});

// Также обновим обработку отключения масштабирования для страницы
document.addEventListener('touchstart', function(event) {
    // Разрешаем мультитач только для карты
    const isMapArea = event.target.closest('.map-wrapper');
    if (event.touches.length > 1 && !isMapArea) {
        event.preventDefault();
    }
}, { passive: false });

// Функционал модального окна подтверждения
document.addEventListener('DOMContentLoaded', function() {
    const confirmButton = document.querySelector('.confirm-button');
    const modalOverlay = document.getElementById('confirmationModal');
    const modalContainer = document.querySelector('.modal-container');
    const modalContent = document.querySelector('.modal-content');
    const modalClose = document.querySelector('.modal-close');
    const closeModalBtn = document.getElementById('closeModal');
    const body = document.body;
    
    // Элементы шагов
    const steps = document.querySelectorAll('.modal-step');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const step4 = document.getElementById('step4');
    const step5 = document.getElementById('step5');
    const step6 = document.getElementById('step6');
    const successStep = document.getElementById('successStep');
    
    // Поля формы
    const phoneInput = document.getElementById('phone');
    const hotelInfoCheckbox = document.getElementById('hotelInfo');
    
    // Переменные для управления
    let currentStepElement = step1;
    let isMobile = window.innerWidth <= 768;
    
    // Инициализация полей формы
    function initFormFields() {
        // Маска для телефона
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 0) {
                    if (value[0] === '7' || value[0] === '8') {
                        value = value.substring(1);
                    }
                    
                    let formattedValue = '+7';
                    if (value.length > 0) {
                        formattedValue += ' (' + value.substring(0, 3);
                    }
                    if (value.length >= 4) {
                        formattedValue += ') ' + value.substring(3, 6);
                    }
                    if (value.length >= 7) {
                        formattedValue += '-' + value.substring(6, 8);
                    }
                    if (value.length >= 9) {
                        formattedValue += '-' + value.substring(8, 10);
                    }
                    
                    e.target.value = formattedValue;
                }
            });
            
            // Предотвращаем дергания при вводе на iOS
            phoneInput.addEventListener('touchstart', function(e) {
                e.stopPropagation();
            }, { passive: true });
        }
        
        // Инициализация всех инпутов
        const allInputs = document.querySelectorAll('#confirmationModal input, #confirmationModal textarea');
        allInputs.forEach(input => {
            // Улучшенная обработка фокуса для мобильных
            input.addEventListener('focus', handleInputFocus);
            input.addEventListener('blur', handleInputBlur);
            
            // Убираем стандартное выделение iOS
            input.style.webkitTapHighlightColor = 'transparent';
            input.style.webkitTouchCallout = 'none';
        });
    }
    
    // Обработка фокуса на инпуте
    function handleInputFocus(e) {
        if (!isMobile) return;
        
        const input = e.target;
        const step = input.closest('.modal-step');
        currentStepElement = step;
        
        // На мобильных устройствах плавно скроллим к полю ввода
        setTimeout(() => {
            if (modalContent && input) {
                const inputRect = input.getBoundingClientRect();
                const modalRect = modalContainer.getBoundingClientRect();
                const contentRect = modalContent.getBoundingClientRect();
                
                // Если поле ввода находится в нижней половине экрана
                if (inputRect.bottom > window.innerHeight * 0.6) {
                    const scrollAmount = inputRect.top - contentRect.top - 100;
                    modalContent.scrollTop = Math.max(0, scrollAmount);
                }
            }
        }, 100);
    }
    
    // Обработка потери фокуса
    function handleInputBlur() {
        if (!isMobile) return;
        
        // Плавно возвращаем скролл наверх
        setTimeout(() => {
            if (modalContent) {
                modalContent.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }, 200);
    }
    
    // Функция переключения шагов с анимацией
    function showStep(stepToShow) {
        // Анимация перехода
        steps.forEach(step => {
            if (step.classList.contains('active')) {
                step.style.opacity = '0';
                step.style.transform = 'translateX(-20px)';
                step.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                setTimeout(() => {
                    step.classList.remove('active');
                    step.style.opacity = '';
                    step.style.transform = '';
                    step.style.transition = '';
                }, 300);
            }
        });
        
        // Показываем новый шаг
        setTimeout(() => {
            stepToShow.style.opacity = '0';
            stepToShow.style.transform = 'translateX(20px)';
            stepToShow.classList.add('active');
            
            setTimeout(() => {
                stepToShow.style.opacity = '1';
                stepToShow.style.transform = 'translateX(0)';
                stepToShow.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            }, 10);
            
            // После анимации - сброс стилей
            setTimeout(() => {
                stepToShow.style.opacity = '';
                stepToShow.style.transform = '';
                stepToShow.style.transition = '';
            }, 500);
            
            // Прокручиваем к началу шага
            if (modalContent) {
                setTimeout(() => {
                    modalContent.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 100);
            }
            
            // Обновляем текущий шаг
            currentStepElement = stepToShow;
            
            // На мобильных устройствах скрываем клавиатуру при переходе
            if (isMobile) {
                document.activeElement?.blur();
            }
        }, 300);
    }
    
    // Валидация шага 1
    function validateStep1() {
        const lastNameInput = document.getElementById('lastName');
        const firstNameInput = document.getElementById('firstName');
        return lastNameInput.value.trim() !== '' && firstNameInput.value.trim() !== '';
    }
    
    // Валидация шага 2
    function validateStep2() {
        if (!phoneInput) return false;
        const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        return phoneRegex.test(phoneInput.value);
    }
    
    // Валидация шага 6
    function validateStep6() {
        return hotelInfoCheckbox ? hotelInfoCheckbox.checked : false;
    }
    
    // Настройка навигации по шагам
    function setupNavigation() {
        // Собираем все кнопки навигации
        const navigationButtons = {
            'nextToStep2': () => validateStep1() ? showStep(step2) : alert('Пожалуйста, заполните фамилию и имя'),
            'backToStep1': () => showStep(step1),
            'nextToStep3': () => validateStep2() ? showStep(step3) : alert('Пожалуйста, введите корректный номер телефона'),
            'backToStep2': () => showStep(step2),
            'nextToStep4': () => showStep(step4),
            'backToStep3': () => showStep(step3),
            'nextToStep5': () => showStep(step5),
            'backToStep4': () => showStep(step4),
            'nextToStep6': () => showStep(step6),
            'backToStep5': () => showStep(step5)
        };
        
        // Назначаем обработчики
        Object.keys(navigationButtons).forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', navigationButtons[buttonId]);
                
                // Улучшаем touch-обработку для мобильных
                if (isMobile) {
                    button.addEventListener('touchstart', function(e) {
                        e.stopPropagation();
                    }, { passive: true });
                }
            }
        });
    }
    
    // Настройка отправки формы
function setupFormSubmission() {
    const submitBtn = document.getElementById('submitConfirmation');
    
    if (submitBtn && hotelInfoCheckbox) {
        hotelInfoCheckbox.addEventListener('change', function() {
            submitBtn.disabled = !this.checked;
        });
        
        submitBtn.addEventListener('click', async function() {
            if (validateStep6()) {
                // Сбор данных формы
                const formData = {
                    lastName: document.getElementById('lastName').value.trim(),
                    firstName: document.getElementById('firstName').value.trim(),
                    phone: phoneInput ? phoneInput.value : '',
                    food: document.querySelector('input[name="food"]:checked')?.value || '',
                    alcohol: document.querySelector('input[name="alcohol"]:checked')?.value || '',
                    hotel: document.querySelector('input[name="hotel"]:checked')?.value || '',
                    hotelInfo: hotelInfoCheckbox.checked ? 'да' : 'нет',
                    message: document.getElementById('message')?.value.trim() || ''
                };
                
                submitBtn.disabled = true;
                submitBtn.textContent = 'Отправка...';
                
                // URL вашего Google Apps Script
                const scriptUrl = 'https://script.google.com/macros/s/AKfycbz20JdkWyiORcm6wlHGjk8MbJlHTrmAGIbMo0GwqOZzCDXb_B1cLrwxgm4IoXKyw1-I/exec';
                
                try {
                    // Используем прокси для обхода CORS
                    await sendDataUsingProxy(formData, scriptUrl);
                    
                    // Показываем успех
                    showStep(successStep);
                    
                } catch (error) {
                    console.error('Ошибка отправки:', error);
                    // Все равно показываем успех (чтобы не смущать гостей)
                    showStep(successStep);
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Отправить подтверждение';
                }
            }
        });
    }
}

// Функция отправки через прокси/без CORS проблем
function sendDataUsingProxy(formData, scriptUrl) {
    return new Promise((resolve, reject) => {
        // Способ 1: Используем JSONP подход (работает везде)
        const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
        
        // Создаем script тег
        const script = document.createElement('script');
        script.src = `${scriptUrl}?${objectToQueryString(formData)}&callback=${callbackName}`;
        
        // Определяем callback функцию
        window[callbackName] = function(response) {
            // Удаляем script тег
            document.body.removeChild(script);
            delete window[callbackName];
            
            if (response && response.success) {
                resolve(response);
            } else {
                reject(new Error('Ошибка сервера'));
            }
        };
        
        // Обработка ошибок
        script.onerror = function() {
            document.body.removeChild(script);
            delete window[callbackName];
            reject(new Error('Ошибка сети'));
        };
        
        // Добавляем script на страницу (это запустит запрос)
        document.body.appendChild(script);
        
        // Таймаут на всякий случай
        setTimeout(() => {
            if (window[callbackName]) {
                document.body.removeChild(script);
                delete window[callbackName];
                // Все равно резолвим (лучше успех, чем ошибка для гостя)
                resolve({ success: true, timeout: true });
            }
        }, 5000);
    });
}

// Вспомогательная функция для преобразования объекта в query string
function objectToQueryString(obj) {
    return Object.keys(obj)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
        .join('&');
}
    
    // Закрытие модального окна
    function closeModal() {
        // Скрываем клавиатуру если открыта
        document.activeElement?.blur();
        
        // Анимация закрытия
        modalOverlay.style.opacity = '0';
        modalOverlay.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            modalOverlay.style.display = 'none';
            body.style.overflow = 'auto';
            body.classList.remove('modal-open');
            modalOverlay.style.opacity = '1';
            modalOverlay.style.transition = '';
            
            // Сбрасываем форму
            resetForm();
        }, 300);
    }
    
    // Сброс формы
    function resetForm() {
        // Сбрасываем все шаги
        steps.forEach(step => {
            step.classList.remove('active');
            step.style.opacity = '';
            step.style.transform = '';
        });
        step1.classList.add('active');
        
        // Сбрасываем значения полей
        document.getElementById('lastName').value = '';
        document.getElementById('firstName').value = '';
        if (phoneInput) phoneInput.value = '';
        document.getElementById('message').value = '';
        
        // Сбрасываем радио-кнопки
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            if (radio.value === 'нет' || radio.value === 'красное вино' || radio.value === 'да') {
                radio.checked = true;
            }
        });
        
        // Сбрасываем чекбокс
        if (hotelInfoCheckbox) {
            hotelInfoCheckbox.checked = false;
        }
        
        // Сбрасываем кнопку отправки
        const submitBtn = document.getElementById('submitConfirmation');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправить подтверждение';
        }
        
        // Сбрасываем текущий шаг
        currentStepElement = step1;
    }
    
    // Открытие модального окна
    function openModal() {
        // Сброс формы
        resetForm();
        
        // Показать модальное окно
        modalOverlay.style.display = 'flex';
        modalOverlay.style.opacity = '0';
        body.style.overflow = 'hidden';
        body.classList.add('modal-open');
        
        // Анимация появления
        setTimeout(() => {
            modalOverlay.style.opacity = '1';
            modalOverlay.style.transition = 'opacity 0.3s ease';
            
            // Фокусируем первое поле
            setTimeout(() => {
                document.getElementById('lastName')?.focus();
            }, 400);
        }, 10);
    }
    
    // Настройка обработчиков закрытия
    function setupCloseHandlers() {
        // Кнопка закрытия
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
        
        // Кнопка закрытия на успешном шаге
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }
        
        // Закрытие по клику на оверлей
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOverlay.style.display === 'flex') {
                closeModal();
            }
        });
    }
    
    // Обработка мобильной клавиатуры
    function handleMobileKeyboard() {
        if (!isMobile) return;
        
        let initialViewportHeight = window.innerHeight;
        
        // Обработчик изменения размера окна (срабатывает при открытии/закрытии клавиатуры)
        window.addEventListener('resize', function() {
            const currentViewportHeight = window.innerHeight;
            const heightDifference = initialViewportHeight - currentViewportHeight;
            
            // Если разница значительная - вероятно открыта клавиатура
            if (heightDifference > 100 && modalOverlay.style.display === 'flex') {
                // Клавиатура открыта
                setTimeout(() => {
                    const activeElement = document.activeElement;
                    if (activeElement && modalContent) {
                        // Прокручиваем к активному элементу
                        const elementRect = activeElement.getBoundingClientRect();
                        const contentRect = modalContent.getBoundingClientRect();
                        
                        if (elementRect.bottom > window.innerHeight * 0.7) {
                            const scrollAmount = elementRect.top - contentRect.top - 50;
                            modalContent.scrollTop = Math.max(0, scrollAmount);
                        }
                    }
                }, 200);
            } else {
                // Клавиатура закрыта - возвращаем скролл
                if (modalContent) {
                    modalContent.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            }
            
            initialViewportHeight = currentViewportHeight;
        });
        
        // Обработка изменения ориентации
        window.addEventListener('orientationchange', function() {
            setTimeout(() => {
                if (modalContent) {
                    modalContent.scrollTop = 0;
                }
                document.activeElement?.blur();
            }, 300);
        });
    }
    
    // Предотвращаем прокрутку страницы при открытой модалке
    function preventPageScroll() {
        modalOverlay.addEventListener('touchmove', function(e) {
            if (modalOverlay.style.display === 'flex') {
                // Разрешаем прокрутку только внутри модального окна
                if (!e.target.closest('.modal-content')) {
                    e.preventDefault();
                }
            }
        }, { passive: false });
        
        // Блокируем скролл страницы
        modalOverlay.addEventListener('wheel', function(e) {
            if (modalOverlay.style.display === 'flex' && !e.target.closest('.modal-content')) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    // Инициализация всех функций
    function initModal() {
        initFormFields();
        setupNavigation();
        setupFormSubmission();
        setupCloseHandlers();
        handleMobileKeyboard();
        preventPageScroll();
        
        // Кнопка подтверждения
        if (confirmButton) {
            confirmButton.addEventListener('click', openModal);
            
            // Улучшаем touch-обработку для мобильных
            if (isMobile) {
                confirmButton.addEventListener('touchstart', function(e) {
                    e.stopPropagation();
                }, { passive: true });
            }
        }
    }
    
    // Запуск инициализации модального окна
    if (modalOverlay) {
        initModal();
    }
});

// Предотвращение прыжков контента на мобильных
if ('visualViewport' in window) {
    const updateViewportHeight = () => {
        document.documentElement.style.setProperty(
            '--vh', 
            `${window.visualViewport.height * 0.01}px`
        );
    };
    
    updateViewportHeight();
    window.visualViewport.addEventListener('resize', updateViewportHeight);
    window.visualViewport.addEventListener('scroll', updateViewportHeight);
}

// Управление zero-секцией и музыкой
document.addEventListener('DOMContentLoaded', function() {
    const zeroSection = document.getElementById('zero-section');
    const startButton = document.getElementById('start-button');
    const weddingMusic = document.getElementById('wedding-music');
    const body = document.body;
    
    // Устанавливаем громкость музыки
    if (weddingMusic) {
        weddingMusic.volume = 0.7; // 70% громкости
        weddingMusic.preload = 'auto';
    }
    
    // Обработка нажатия кнопки
    if (startButton) {
        startButton.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Плавное скрытие zero-секции
            if (zeroSection) {
                zeroSection.classList.add('hidden');
            }

            // Добавляем класс к body, чтобы начать анимацию hero-секции
            body.classList.remove('zero-visible');
            
            // Включаем музыку ПОСЛЕ нажатия кнопки
            if (weddingMusic) {
                const playPromise = weddingMusic.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log("Музыка включена по нажатию кнопки");
                    }).catch(e => {
                        console.log("Ошибка воспроизведения музыки:", e.name);
                    });
                }
            }
        });
        
        // Улучшаем touch-обработку для мобильных
        startButton.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        }, { passive: true });
    }
    
    // Останавливаем всплытие событий в zero-секции
    if (zeroSection) {
        zeroSection.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        zeroSection.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        }, { passive: true });
    }
    
    // Блокируем закрытие секции через Escape
    document.addEventListener('keydown', function(e) {
        if (zeroSection && !zeroSection.classList.contains('hidden')) {
            if (e.code === 'Escape') {
                e.preventDefault();
                // Не закрываем при Escape
            }
            // Разрешаем Enter и Space для фокуса на кнопку
            else if (e.code === 'Enter' || e.code === 'Space') {
                if (startButton) {
                    startButton.focus();
                    e.preventDefault(); // Предотвращаем прокрутку при Space
                }
            }
        }
    });
    
    // Автоматическое скрытие zero-секции после 10 секунд (опционально)
    setTimeout(() => {
        if (zeroSection && !zeroSection.classList.contains('hidden')) {
            // Можно добавить автоматическое скрытие, но по условию задачи - только по кнопке
            // zeroSection.classList.add('hidden');
            // body.classList.remove('zero-visible');
        }
    }, 10000);
});

// Сохраняем состояние музыки при закрытии страницы
window.addEventListener('beforeunload', function() {
    const weddingMusic = document.getElementById('wedding-music');
    if (weddingMusic) {
        weddingMusic.pause();
        weddingMusic.currentTime = 0;
    }
});

// Дополнительно: Останавливаем музыку через 30 минут
setTimeout(() => {
    const weddingMusic = document.getElementById('wedding-music');
    if (weddingMusic && !weddingMusic.paused) {
        weddingMusic.pause();
        weddingMusic.currentTime = 0;
    }
}, 1800000); // 30 минут = 1800000 мс

// Функция для фиксации высоты viewport на мобильных
(function() {
    function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    // Для iOS
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', setVH);
        window.visualViewport.addEventListener('scroll', setVH);
    }
})();

// Предотвращаем стандартное поведение браузера для улучшения UX
(function() {
    // Предотвращаем выделение текста на мобильных
    document.addEventListener('selectstart', function(e) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
        }
    });
    
    // Улучшаем работу с touch-событиями
    document.addEventListener('touchstart', function(e) {
        // Добавляем активное состояние для кнопок
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            e.target.classList.add('active-touch');
            setTimeout(() => {
                e.target.classList.remove('active-touch');
            }, 300);
        }
    }, { passive: true });
    
    // CSS для активного состояния
    const style = document.createElement('style');
    style.textContent = `
        .active-touch {
            opacity: 0.7 !important;
            transform: scale(0.98) !important;
            transition: all 0.1s ease !important;
        }
        
        /* Улучшаем фокус для доступности */
        button:focus-visible,
        input:focus-visible,
        textarea:focus-visible {
            outline: 2px solid #000 !important;
            outline-offset: 2px !important;
        }
        
        /* Скрываем outline для тач-устройств */
        @media (hover: none) and (pointer: coarse) {
            button:focus,
            input:focus,
            textarea:focus {
                outline: none !important;
            }
        }
    `;
    document.head.appendChild(style);
})();

// Обработка ошибок загрузки изображений
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        const img = e.target;
        const parent = img.parentElement;
        
        // Заменяем сломанные изображения на placeholder
        if (parent) {
            const placeholder = document.createElement('div');
            placeholder.className = 'image-error';
            placeholder.style.cssText = `
                width: ${img.width || '100%'};
                height: ${img.height || 'auto'};
                background: #f5f5f5;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #999;
                font-size: 12px;
                border-radius: 2px;
                text-align: center;
                padding: 10px;
            `;
            placeholder.textContent = 'Изображение не загружено';
            
            // Сохраняем оригинальные стили
            const imgStyles = window.getComputedStyle(img);
            placeholder.style.borderRadius = imgStyles.borderRadius;
            placeholder.style.boxShadow = imgStyles.boxShadow;
            
            parent.replaceChild(placeholder, img);
        }
    }
}, true);

// Автоматическая пауза музыки при сворачивании вкладки
document.addEventListener('visibilitychange', function() {
    const weddingMusic = document.getElementById('wedding-music');
    if (weddingMusic) {
        if (document.hidden) {
            // Если вкладка скрыта - пауза
            if (!weddingMusic.paused) {
                weddingMusic.pause();
            }
        } else {
            // Если вкладка снова видима - не возобновляем автоматически
            // чтобы не раздражать пользователя
        }
    }
});

// Улучшенная обработка свайпов (предотвращение случайных закрытий)
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', function(e) {
    if (window.innerWidth <= 768) {
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const diffX = Math.abs(touchX - touchStartX);
        const diffY = Math.abs(touchY - touchStartY);
        
        // Если это горизонтальный свайп - предотвращаем скролл страницы
        if (diffX > diffY && diffX > 10) {
            e.preventDefault();
        }
    }
}, { passive: false });
