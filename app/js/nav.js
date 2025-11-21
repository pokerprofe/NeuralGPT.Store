(function () {

    const routes = {
        home: '/app/index.html',
        store: '/app/app/sections/store.html',
        models: '/app/app/sections/models.html',
        model_premium: '/app/app/sections/model_premium.html',
        ads: '/app/app/sections/ads.html',
        chat: '/app/app/sections/chat.html',
        fans: '/app/app/sections/fans_openai.html',
        edo: '/app/app/sections/edo_subscription.html',
        seller: 'app/app/sections/seller_contact.html',
        about: 'app/app/sections/about.html', '/app/app/sections/seller_contact.html',
        notifications: 'app/app/sections/notifications.html',
        automations: '/app/app/sections/automations_lab.html',
        insights: '/dashboard/admin/index.html',
        guardian: '/dashboard/guardian/guardian_panel.html',
        accounting: '/dashboard/admin/accounting.html'
    };

    async function loadSection(key) {
        const path = routes[key];
        if (!path) return;
        try {
            const html = await (await fetch(path)).text();
            document.getElementById('mainView').innerHTML = html;
        } catch (err) {
            document.getElementById('mainView').innerHTML =
            '<p style="color:#F4C857;font-size:20px;">⚠ Error cargando sección.</p>';
        }
    }

    function initNav() {
        document.querySelectorAll('.nav-links li')
        .forEach(li => {
            li.addEventListener('click', () => {
                const key = li.getAttribute('data-link');
                loadSection(key);
            });
        });

        loadSection('home');
    }

    document.addEventListener('DOMContentLoaded', initNav);

})();




