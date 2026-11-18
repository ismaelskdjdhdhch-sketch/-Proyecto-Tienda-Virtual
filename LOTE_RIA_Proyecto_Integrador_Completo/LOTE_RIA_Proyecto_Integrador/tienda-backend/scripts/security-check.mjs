const BASE_URL = process.env.API_URL || 'http://localhost:3001';

async function runSecurityAudit() {
  console.log('=== AUDITORÍA AUTOMATIZADA DE SEGURIDAD LOTE RIA ===');
  try {
    const resAdmin = await fetch(`${BASE_URL}/api/admin/reports/ventas`);
    console.log(`[Prueba 9.1.1] Acceso sin privilegios -> HTTP ${resAdmin.status} (Esperado: 401/403)`);
  } catch {
    console.log('[Aviso] Servidor local no iniciado. Ejecuta "npm start" en tienda-backend.');
  }
}

runSecurityAudit();
