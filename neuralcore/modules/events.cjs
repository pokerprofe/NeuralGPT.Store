module.exports = function() {
    return {
        classifyEvent(e) {
            if (!e) return 'unknown';
            if (e.includes('error')) return 'critical';
            if (e.includes('load')) return 'performance';
            return 'general';
        }
    };
};
