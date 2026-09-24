import { apiRequest } from "./api";

// --- SERVICO DE FUNCIONARIOS DO PDV ---
export const funcionarioService = {
    // --- LISTA TODOS OS FUNCIONÁRIOS ---
    listar() {
        return apiRequest("/admin/funcionarios");
    },

    // --- CADASTRAR NOVO FUNCIONÁRIO ---
    criar(payload) {
        return apiRequest("/admin/funcionarios", {
            method: "POST",
            body: JSON.stringify(payload)
        });
    },

    // --- EDITAR FUNCIONÁRIO ---
    atualizar(id, payload) {
        return apiRequest(`/admin/funcionarios/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload)
        });
    },

    // --- ATIVAR/DESATIVAR FUNCIONÁRIO ---
    alterarStatus(id, ativo) {
        return apiRequest(`/admin/funcionarios/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ ativo })
        });
    }
};
