// Re-exporta el cliente de Supabase desde db.js para compatibilidad
// Todos los routers deben usar db.js directamente; este archivo es solo un alias.
import db from './db.js';

export const supabaseAdmin = db;
export default db;