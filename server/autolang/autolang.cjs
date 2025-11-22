export default class IreneLangAI {
    constructor() {
        this.supported = {
            'es': 'español',
            'en': 'english',
            'fr': 'français',
            'de': 'deutsch',
            'pt': 'português',
            'ar': 'العربية',
            'zh': '中文',
            'ja': '日本語'
        };

        this.messages = {
            'es': 'Hola, soy Irene. ¿En qué puedo ayudarte?',
            'en': 'Hello, I am Irene. How can I help you?',
            'fr': 'Bonjour, je suis Irene. Comment puis-je vous aider?',
            'de': 'Hallo, ich bin Irene. Wie kann ich Ihnen helfen?',
            'pt': 'Olá, eu sou Irene. Como posso ajudar?',
            'ar': 'مرحبا أنا إيرين. كيف يمكنني مساعدتك',
            'zh': '你好，我是Irene。我能帮你什么？',
            'ja': 'こんにちは、Ireneです。どうお手伝いできますか？'
        };
    }

    detect(langHeader) {
        if (!langHeader) return 'es';
        const primary = langHeader.split(',')[0].split('-')[0];
        return this.supported[primary] ? primary : 'es';
    }

    greet(lang) {
        return this.messages[lang] || this.messages['es'];
    }
}
