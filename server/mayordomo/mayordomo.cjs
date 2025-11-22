import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

export default class IreneButler {
    constructor() {
        this.users = [];
        this.providers = [];
        this.logs = [];
        this.avatar = null;
    }

    loadAvatar() {
        const avatarPath = path.join(process.cwd(), "public_html", "assets", "images", "irene_avatar.png");
        if (fs.existsSync(avatarPath)) {
            this.avatar = "/assets/images/irene_avatar.png";
        } else {
            this.avatar = "/assets/images/default_avatar.png";
        }
    }

    registerUser(info) {
        this.users.push({
            ...info,
            joined: new Date().toISOString()
        });
        this.logs.push(\Nuevo usuario registrado: \\);
    }

    registerProvider(info) {
        this.providers.push({
            ...info,
            joined: new Date().toISOString()
        });
        this.logs.push(\Nuevo proveedor registrado: \\);
    }

    autoInviteProvider(email, link) {
        this.logs.push(\Enviando invitación automática a proveedor: \\);

        return {
            status: "ok",
            to: email,
            inviteLink: link
        };
    }

    guideUser(section) {
        const guides = {
            "catalog": "Aquí puedes explorar todos nuestros productos premium.",
            "agents": "Este módulo te permitirá descubrir nuestras IA avanzadas.",
            "provider_signup": "Regístrate como proveedor para vender tus productos.",
            "support": "Aquí puedes apoyarnos y conocer nuestra misión."
        };

        return guides[section] || "Estoy aquí para ayudarte en lo que necesites.";
    }

    getActivityLog() {
        return this.logs.slice(-50);
    }
}
