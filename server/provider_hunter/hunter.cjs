import fs from 'fs';

export default class ProviderHunterAI {
    constructor() {
        this.reports = [];
        this.keywords = [
            'robotics', 'ai', 'education', 'hardware',
            'automation', 'electronics', 'innovation',
            'training', 'software', 'kits', 'STEM'
        ];
    }

    analyzeSite(url, html) {
        const score = this.keywords.reduce((acc, kw) =>
            html.toLowerCase().includes(kw) ? acc + 10 : acc
        , 0);

        const result = {
            url,
            score,
            timestamp: new Date().toISOString(),
            recommendation: score >= 40 ? 'ALTO POTENCIAL'
                        : score >= 20 ? 'POTENCIAL MEDIO'
                        : 'BAJO POTENCIAL'
        };

        this.reports.push(result);
        return result;
    }

    generateMessage(businessName, contactEmail) {
        return 
Hola ,

Soy Irene, asistente automatizada de NeuralGPT.Store.
Estamos construyendo el mayor marketplace tecnológico de Europa,
y queremos invitarte a participar como proveedor oficial.

Tu empresa encaja con nuestra línea de productos innovadores.

Puedes registrarte gratuitamente aquí:
https://neuralgpt.store/providers/signup

Quedo pendiente de tu respuesta.
Atentamente,
Irene  Sistema Autónomo NeuralGPT.Store
        .trim();
    }

    getReports() {
        return this.reports.slice(-100);
    }
}
