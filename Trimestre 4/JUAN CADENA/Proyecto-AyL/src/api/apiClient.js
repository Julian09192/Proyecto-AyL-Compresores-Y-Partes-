// src/api/apiClient.js
// Cliente HTTP centralizado para comunicarse con el backend Express (localhost:3001)

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const apiClient = {

  // ─── PRODUCTOS ───────────────────────────────────────────────
  productos: {
    listar: async () => {
      const res = await fetch(`${API_URL}/productos`);
      return await res.json();
    },
    obtener: async (id) => {
      const res = await fetch(`${API_URL}/productos/${id}`);
      return await res.json();
    },
    crear: async (data) => {
      const res = await fetch(`${API_URL}/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return await res.json();
    },
    actualizar: async (id, data) => {
      const res = await fetch(`${API_URL}/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return await res.json();
    },
    eliminar: async (id) => {
      const res = await fetch(`${API_URL}/productos/${id}`, {
        method: "DELETE"
      });
      return await res.json();
    }
  },

  // ─── USUARIOS ────────────────────────────────────────────────
  usuarios: {
    listar: async () => {
      const res = await fetch(`${API_URL}/usuarios`);
      return await res.json();
    },
    obtener: async (id) => {
      const res = await fetch(`${API_URL}/usuarios/${id}`);
      return await res.json();
    },
    actualizar: async (id, data) => {
      const res = await fetch(`${API_URL}/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return await res.json();
    }
  },

  // ─── AUTENTICACIÓN ───────────────────────────────────────────
  auth: {
    checkEmail: async (email) => {
      const res = await fetch(`${API_URL}/auth/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      return await res.json();
    },
    syncUser: async ({ id, email, nombre }) => {
      const res = await fetch(`${API_URL}/auth/sync-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, email, nombre })
      });
      return await res.json();
    },
    resetPassword: async (email, redirectTo) => {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, redirectTo })
      });
      return await res.json();
    }
  },

  // ─── PEDIDOS ─────────────────────────────────────────────────
  pedidos: {
    listar: async () => {
      const res = await fetch(`${API_URL}/api/pedidos`);
      return await res.json();
    },
    obtener: async (id) => {
      const res = await fetch(`${API_URL}/api/pedidos/${id}`);
      return await res.json();
    },
    crear: async (data) => {
      const res = await fetch(`${API_URL}/api/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return await res.json();
    },
    actualizarEstado: async (id, estado) => {
      const res = await fetch(`${API_URL}/api/pedidos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado })
      });
      return await res.json();
    }
  }
};

export default apiClient;