// scripts/validation.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedbackForm');
    if (!form) return;

    // Контейнер для сообщения об успехе
    const successContainer = document.getElementById('successMessageContainer');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Сбрасываем предыдущие ошибки и сообщения
        clearErrors();
        clearSuccessMessage();

        let isValid = true;

        // 1. Проверка имени (не пустое, минимум 2 слова)
        const name = document.getElementById('name');
        const nameValue = name.value.trim();
        if (nameValue === '') {
            showError(name, 'Введите имя и фамилию');
            isValid = false;
        } else {
            const words = nameValue.split(' ').filter(word => word.length > 0);
            if (words.length < 2) {
                showError(name, 'Введите имя и фамилию (минимум 2 слова)');
                isValid = false;
            }
        }

        // 2. Проверка email
        const email = document.getElementById('email');
        const emailValue = email.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailValue === '') {
            showError(email, 'Введите email');
            isValid = false;
        } else if (!emailPattern.test(emailValue)) {
            showError(email, 'Введите корректный email (например: name@domain.ru)');
            isValid = false;
        }

        // 3. Проверка темы
        const subject = document.getElementById('subject');
        if (!subject.value) {
            showError(subject, 'Выберите тему сообщения');
            isValid = false;
        }

        // 4. Проверка сообщения
        const message = document.getElementById('message');
        const messageValue = message.value.trim();
        if (messageValue === '') {
            showError(message, 'Введите сообщение');
            isValid = false;
        } else if (messageValue.length < 10) {
            showError(message, 'Сообщение должно содержать минимум 10 символов');
            isValid = false;
        }

        // 5. Проверка согласия
        const consent = document.getElementById('consent');
        if (!consent.checked) {
            showError(consent, 'Необходимо согласие на обработку персональных данных');
            isValid = false;
        }

        // Если всё корректно - диспатчим событие для consoleLogger
        if (isValid) {
            const formData = {
                name: nameValue,
                email: emailValue,
                subject: subject.value,
                message: messageValue || '(не заполнено)',
                timestamp: new Date().toISOString()
            };

            // Создаем и диспатчим кастомное событие
            const event = new CustomEvent('formValid', { detail: formData });
            document.dispatchEvent(event);

            // Показываем сообщение об успехе
            showSuccessMessage('Ваше сообщение отправлено. Спасибо!');

            // Очищаем форму
            form.reset();
            
            // Прокручиваем к сообщению об успехе
            if (successContainer) {
                successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Функция показа ошибки
    function showError(input, message) {
        // Добавляем класс ошибки
        input.classList.add('error-style');
        
        // Создаем сообщение об ошибке
        const errorMsg = document.createElement('p');
        errorMsg.className = 'error-message';
        errorMsg.textContent = message;
        
        // Находим родительский элемент form-group и добавляем ошибку после поля
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            // Удаляем предыдущую ошибку в этой группе, если есть
            const oldError = formGroup.querySelector('.error-message');
            if (oldError) oldError.remove();
            
            // Вставляем новую ошибку
            if (input.type === 'checkbox') {
                // Для чекбокса вставляем после лейбла
                const label = formGroup.querySelector('label');
                if (label) {
                    label.after(errorMsg);
                }
            } else {
                // Для остальных полей вставляем после поля
                input.after(errorMsg);
            }
        }
    }

    // Функция очистки ошибок
    function clearErrors() {
        // Удаляем все сообщения об ошибках
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        
        // Убираем класс ошибки со всех полей
        document.querySelectorAll('.error-style').forEach(el => {
            el.classList.remove('error-style');
        });
    }

    // Функция показа сообщения об успехе
    function showSuccessMessage(message) {
        if (successContainer) {
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.innerHTML = `<i class="fas fa-check-circle" aria-hidden="true"></i> ${message}`;
            successContainer.innerHTML = '';
            successContainer.appendChild(successDiv);
        }
    }

    // Функция очистки сообщения об успехе
    function clearSuccessMessage() {
        if (successContainer) {
            successContainer.innerHTML = '';
        }
    }

    // Сброс ошибок при вводе
    document.querySelectorAll('#feedbackForm input, #feedbackForm select, #feedbackForm textarea').forEach(input => {
        input.addEventListener('input', function() {
            // Убираем класс ошибки
            this.classList.remove('error-style');
            
            // Удаляем сообщение об ошибке для этого поля
            const formGroup = this.closest('.form-group');
            if (formGroup) {
                const errorMsg = formGroup.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            }
        });

        // Для select также отслеживаем change
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', function() {
                this.classList.remove('error-style');
                const formGroup = this.closest('.form-group');
                if (formGroup) {
                    const errorMsg = formGroup.querySelector('.error-message');
                    if (errorMsg) errorMsg.remove();
                }
            });
        }
    });

    // Для чекбокса отслеживаем change
    const consentCheckbox = document.getElementById('consent');
    if (consentCheckbox) {
        consentCheckbox.addEventListener('change', function() {
            this.classList.remove('error-style');
            const formGroup = this.closest('.form-group');
            if (formGroup) {
                const errorMsg = formGroup.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            }
        });
    }
});
