module.exports = {
  getPrecios() {
    const data = fs.readFileSync(dbFile);
    return JSON.parse(data);
  },
  calcularTotal(categoria) {
    const precios = this.getPrecios();
    const item = precios.find(p => p.categoria === categoria);
    if (!item) return null;
    const base = item.precio + item.comision;
    const iva = base * 0.21; // 21%
    return {
      categoria: item.categoria,
      base: base.toFixed(2),
      iva: iva.toFixed(2),
      total: (base + iva).toFixed(2)
    };
  }
};
