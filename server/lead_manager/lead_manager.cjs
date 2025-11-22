import fs from 'fs';
import path from 'path';

export default class LeadManagerAI {
    constructor() {
        this.leads = [];
        this.categories = {
            'enterprise': [],
            'startup': [],
            'provider': [],
            'investor': []
        };
        this.drivePath = 'H:/Mi unidad/NEURALGPT/LEADS';
    }

    ensureDrive() {
        if (!fs.existsSync(this.drivePath)) {
            fs.mkdirSync(this.drivePath, { recursive: true });
        }
    }

    classify(lead) {
        const email = lead.email.toLowerCase();
        if (email.includes('corp') || email.includes('enterprise')) return 'enterprise';
        if (email.includes('startup') || email.includes('studio')) return 'startup';
        if (email.includes('supply') || email.includes('provider')) return 'provider';
        if (email.includes('invest') || email.includes('capital')) return 'investor';
        return 'startup';
    }

    addLead(info) {
        const category = this.classify(info);
        const lead = {
            ...info,
            category,
            timestamp: new Date().toISOString()
        };

        this.leads.push(lead);
        this.categories[category].push(lead);

        this.exportToDrive(lead);

        return lead;
    }

    exportToDrive(lead) {
        this.ensureDrive();
        const file = path.join(this.drivePath, \lead_\.txt\);
        const content = JSON.stringify(lead, null, 2);
        fs.writeFileSync(file, content, 'utf8');
    }

    getLeads() {
        return this.leads.slice(-200);
    }

    getByCategory(cat) {
        return this.categories[cat] || [];
    }
}
