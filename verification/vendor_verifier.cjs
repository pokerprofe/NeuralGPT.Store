/**
 * Vendor Verification Engine (VVE)
 * Reglas internas para evaluar proveedores antes de aceptarlos.
 * NO usa conexiones externas. Cero coste.
 */

module.exports = {
  verifyVendor(v) {
    const result = {
      score: 0,
      flags: [],
      approved: false
    };

    // 1) Email corporativo obligatorio
    if (v.email && v.email.includes('@') && !v.email.endsWith('@gmail.com')) {
      result.score += 20;
    } else {
      result.flags.push('Invalid or non-corporate email.');
    }

    // 2) Website obligatorio
    if (v.website && v.website.startsWith('http')) {
      result.score += 20;
    } else {
      result.flags.push('Missing or invalid website.');
    }

    // 3) País válido
    if (v.country && v.country.length >= 2) {
      result.score += 10;
    } else {
      result.flags.push('Invalid country.');
    }

    // 4) Certificaciones
    const certs = (v.certs || '').toLowerCase();
    if (certs.includes('ce') || certs.includes('fcc') || certs.includes('rohs')) {
      result.score += 20;
    } else {
      result.flags.push('Missing standard certifications (CE/FCC/RoHS).');
    }

    // 5) Catálogo o producto de ejemplo
    if (v.example && v.example.startsWith('http')) {
      result.score += 15;
    } else {
      result.flags.push('No verifiable product example.');
    }

    // 6) Política de devoluciones visible
    if (v.returns && v.returns.length >= 10) {
      result.score += 15;
    } else {
      result.flags.push('No clear return policy.');
    }

    // Aprobación final
    result.approved = result.score >= 60;
    return result;
  }
};
