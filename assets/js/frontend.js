(function($) {
    'use strict';
    
    $(document).ready(function() {
        // Обработка клика по кнопке внешнего товара
        $('.single_add_to_cart_button.external').on('click', function(e) {
            const $button = $(this);
            const href = $button.attr('href');
            
            // Проверяем наличие placeholder для user ID
            if (!href || href.indexOf('USER_PLACEHOLDER_') === -1) {
                return true; // Продолжаем обычную работу ссылки
            }
            
            e.preventDefault();
            
            // Если пользователь не авторизован
            if (!wcAffiliateParams.isLoggedIn) {
                showAuthWarning($button, href);
            } else {
                // Заменяем placeholder на реальный ID
                const finalUrl = replaceUserPlaceholders(href, wcAffiliateParams.userId);
                window.location.href = finalUrl;
            }
        });
    });
    
    /**
     * Показ предупреждения для неавторизованных пользователей
     */
    function showAuthWarning($button, originalUrl) {
        // Удаляем существующее модальное окно, если есть
        $('#wc-affiliate-warning-modal').remove();
        
        // Создаем модальное окно
        const modal = `
            <div id="wc-affiliate-warning-modal" class="wc-affiliate-modal">
                <div class="wc-affiliate-modal-content">
                    <span class="wc-affiliate-modal-close">&times;</span>
                    <div class="wc-affiliate-modal-icon">⚠️</div>
                    <h3 class="wc-affiliate-modal-title">Внимание</h3>
                    <p class="wc-affiliate-modal-message">${wcAffiliateParams.warningMessage}</p>
                    <div class="wc-affiliate-modal-actions">
                        <button class="wc-affiliate-btn wc-affiliate-btn-secondary" id="wc-affiliate-cancel">
                            Отмена
                        </button>
                        <a href="${removeUserPlaceholders(originalUrl)}" 
                           class="wc-affiliate-btn wc-affiliate-btn-primary" 
                           id="wc-affiliate-continue">
                            Продолжить
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(modal);
        
        // Показываем модальное окно
        setTimeout(() => {
            $('#wc-affiliate-warning-modal').addClass('show');
        }, 10);
        
        // Обработчики закрытия
        $('.wc-affiliate-modal-close, #wc-affiliate-cancel').on('click', function() {
            closeModal();
        });
        
        $(window).on('click', function(e) {
            if ($(e.target).attr('id') === 'wc-affiliate-warning-modal') {
                closeModal();
            }
        });
    }
    
    /**
     * Закрытие модального окна
     */
    function closeModal() {
        $('#wc-affiliate-warning-modal').removeClass('show');
        setTimeout(() => {
            $('#wc-affiliate-warning-modal').remove();
        }, 300);
    }
    
    /**
     * Замена placeholder на реальный ID пользователя
     */
    function replaceUserPlaceholders(url, userId) {
        return url.replace(/USER_PLACEHOLDER_\d+/g, userId);
    }
    
    /**
     * Удаление параметров с placeholder
     */
    function removeUserPlaceholders(url) {
        try {
            const urlObj = new URL(url);
            const params = new URLSearchParams(urlObj.search);
            
            // Удаляем параметры с placeholder
            for (const [key, value] of params.entries()) {
                if (value.includes('USER_PLACEHOLDER_')) {
                    params.delete(key);
                }
            }
            
            urlObj.search = params.toString();
            return urlObj.toString();
        } catch (e) {
            console.error('Error processing URL:', e);
            return url;
        }
    }
    
})(jQuery);
