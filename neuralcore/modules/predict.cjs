module.exports = function() {
    return {
        predictLoad() {
            const r = Math.random();
            if (r < 0.33) return 'low';
            if (r < 0.66) return 'medium';
            return 'high';
        },
        predictTraffic() {
            return Math.floor(Math.random() * 500);
        }
    };
};
