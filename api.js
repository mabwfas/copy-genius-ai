// CopyGenius AI - API Module
const GeniusAPI = {
    storage: {
        get(key, defaultValue = null) { try { return JSON.parse(localStorage.getItem(`genius_${key}`)) || defaultValue; } catch { return defaultValue; } },
        set(key, value) { localStorage.setItem(`genius_${key}`, JSON.stringify(value)); }
    },

    templates: {
        professional: {
            intro: ["Introducing the {name} – designed for those who demand excellence.", "Experience premium quality with the {name}.", "Elevate your expectations with our {name}."],
            body: ["Crafted with precision and attention to detail, this product delivers exceptional {features}.", "Engineered for {audience}, featuring {features} that set new industry standards."],
            close: ["Invest in quality. Choose {name} today.", "Order now and experience the difference."]
        },
        casual: {
            intro: ["Meet your new favorite {name}! 🎉", "Say hello to the {name} – it's kind of amazing.", "You're going to love this {name}!"],
            body: ["With awesome features like {features}, it's perfect for {audience}.", "Whether you're {audience}, the {features} make everything easier."],
            close: ["Grab yours now! ✨", "Trust us, you need this in your life."]
        },
        luxury: {
            intro: ["Discover unparalleled sophistication with the {name}.", "For the discerning individual: the {name}.", "Indulge in the extraordinary with our {name}."],
            body: ["Meticulously crafted to perfection, featuring {features} that epitomize luxury.", "Exclusively designed for {audience} who appreciate the finer things."],
            close: ["Experience luxury redefined.", "Elevate your lifestyle today."]
        },
        playful: {
            intro: ["🚀 Boom! The {name} just dropped!", "Guess what? The {name} is here and it's FIRE! 🔥", "OMG have you seen the new {name}?!"],
            body: ["It's got {features} and honestly it slaps. Perfect for {audience}!", "We're not saying it's magic, but {features} come pretty close!"],
            close: ["Don't sleep on this! 💤❌", "Get it before your friends do! 😎"]
        },
        seo: {
            intro: ["Shop the best {name} online | Premium quality {keywords}.", "{name} - Top rated {keywords} for {audience}."],
            body: ["Our {name} features {features}. Ideal for {audience} looking for quality {keywords}.", "Discover why customers love our {name} with {features}. Best {keywords} available."],
            close: ["Free shipping available. Buy {name} now.", "Shop now for best prices on {keywords}."]
        },
        storytelling: {
            intro: ["Every great journey deserves the right companion. Meet the {name}.", "Picture this: You, living your best life with the {name}.", "There's a story behind every great product. This is ours."],
            body: ["Born from a passion for excellence, the {name} combines {features} to create something truly special for {audience}.", "We designed the {name} because we believe {audience} deserve {features} without compromise."],
            close: ["Write your story with {name}.", "Your journey starts here."]
        }
    },

    generate(params) {
        const { name, features, audience, keywords, tone, length } = params;
        const template = this.templates[tone] || this.templates.professional;

        const pick = arr => arr[Math.floor(Math.random() * arr.length)];
        const replace = text => text.replace(/{name}/g, name).replace(/{features}/g, features).replace(/{audience}/g, audience).replace(/{keywords}/g, keywords || name);

        const variations = [];
        for (let i = 0; i < 3; i++) {
            let desc = replace(pick(template.intro)) + ' ' + replace(pick(template.body)) + ' ' + replace(pick(template.close));

            if (length === 'short') desc = desc.split('.').slice(0, 2).join('.') + '.';
            else if (length === 'long') desc += ' ' + replace(pick(template.body));

            variations.push({ id: Date.now().toString(36) + i, text: desc, wordCount: desc.split(/\s+/).length, charCount: desc.length });
        }
        return variations;
    },

    history: {
        getAll() { return GeniusAPI.storage.get('history', []); },
        save(history) { GeniusAPI.storage.set('history', history); },
        add(generation) {
            const history = this.getAll();
            generation.id = Date.now().toString(36);
            generation.createdAt = new Date().toISOString();
            history.unshift(generation);
            if (history.length > 50) history.pop();
            this.save(history);
            return generation;
        },
        delete(id) { let history = this.getAll(); history = history.filter(h => h.id !== id); this.save(history); }
    },

    customTemplates: {
        getAll() { return GeniusAPI.storage.get('customTemplates', []); },
        save(templates) { GeniusAPI.storage.set('customTemplates', templates); },
        add(template) {
            const templates = this.getAll();
            template.id = 'tpl-' + Date.now().toString(36);
            templates.unshift(template);
            this.save(templates);
            return template;
        },
        delete(id) { let templates = this.getAll(); templates = templates.filter(t => t.id !== id); this.save(templates); }
    },

    toast: {
        show(msg, type = 'success') {
            const container = document.getElementById('toast-container') || this.createContainer();
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i> ${msg}`;
            container.appendChild(toast);
            setTimeout(() => toast.classList.add('show'), 10);
            setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
        },
        createContainer() {
            const c = document.createElement('div');
            c.id = 'toast-container';
            c.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;';
            document.body.appendChild(c);
            const s = document.createElement('style');
            s.textContent = '.toast{display:flex;align-items:center;gap:10px;padding:12px 20px;background:#1e1e3f;border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#fff;margin-bottom:10px;transform:translateX(120%);transition:0.3s;}.toast.show{transform:translateX(0);}.toast-success{border-left:3px solid #10b981;}';
            document.head.appendChild(s);
            return c;
        }
    }
};
window.GeniusAPI = GeniusAPI;
