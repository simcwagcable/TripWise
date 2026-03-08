// scripts/consoleLogger.js
document.addEventListener('DOMContentLoaded', function() {
    // Слушаем кастомное событие formValid от validation.js
    document.addEventListener('formValid', function(event) {
        // Получаем данные формы из события
        const formData = event.detail;
        
        // Очищаем консоль для наглядности
        console.clear();
        
        // Вывод
        console.log('ДАННЫЕ ФОРМЫ ОБРАТНОЙ СВЯЗИ');
        console.log('Имя и фамилия:', formData.name);
        console.log('Email:', formData.email);
        console.log('Тема:', formData.subject);
        console.log('Сообщение:', formData.message);
        console.log('Отправлено:', new Date(formData.timestamp).toLocaleString('ru-RU'));
        console.log('Данные успешно получены и обработаны');
    });
});