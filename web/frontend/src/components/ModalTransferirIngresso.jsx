import { useEffect, useState } from "react";
import "../styles/modal-transferir-ingresso.css";

// --- FORMATA UM CPF CONFORME O USUARIO DIGITA ---
function formatarCpf(valor) {
    const digitos = String(valor || "").replace(/\D/g, "").slice(0, 11);

    if (digitos.length <= 3) {
        return digitos;
    }

    if (digitos.length <= 6) {
        return `${digitos.slice(0, 3)}.${digitos.slice(3)}`;
    }

    if (digitos.length <= 9) {
        return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6)}`;
    }
    return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`;
}

// --- TRANSFERIR INGRESSO PARA OUTRO USUÁRIO POR EMAIL + CPF ---
export default function ModalTransferirIngresso({aberto, pedido, processando, erro, sucesso, onConfirmar, onFechar}) {
    const [email,      setEmail]      = useState("");
    const [cpf,        setCpf]        = useState("");
    const [erroLocal,  setErroLocal]  = useState("");

    // --- LIMPA O FORMULÁRIO SEMPRE QUE O MODAL FOR ABERTO ---
    useEffect(() => {
        if (aberto) {
            setEmail("");
            setCpf("");
            setErroLocal("");
        }
    }, [aberto]);

    if (!aberto) {
        return null;
    }

    // --- VALIDA E DISPARA A CONFIRMAÇÃO PARA O COMPONENTE PAI ---
    function submeter(evento) {
        evento.preventDefault();
        setErroLocal("");

        // --- CHECA EMAIL BÁSICO ---
        const emailNorm = email.trim();
        if (!emailNorm || !/^\S+@\S+\.\S+$/.test(emailNorm)) {
            setErroLocal("Informe um e-mail válido.");
            return;
        }

        // --- CHECA CPF COM 11 DIGITOS ---
        const cpfDigitos = cpf.replace(/\D/g, "");
        if (cpfDigitos.length !== 11) {
            setErroLocal("Informe um CPF com 11 dígitos.");
            return;
        }

        // --- ENTREGA OS DADOS AO CALLBACK DO PAI ---
        onConfirmar({
            emailDestinatario: emailNorm,
            cpfDestinatario:   cpfDigitos
        });
    }

    return (
        <div className="modal-transferir__overlay" onClick={onFechar} role="presentation">
            {/* --- CAIXA CENTRAL COM STOP PROPAGATION P/ CLIQUES INTERNOS --- */}
            <div className="modal-transferir" onClick={(e) => e.stopPropagation()} role="dialog"
                aria-modal="true" aria-labelledby="modal-transferir-titulo">
                {/* --- ICONE DE TRANSFERENCIA --- */}
                <div className="modal-transferir__icone">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 17l-4-4 4-4" />
                        <path d="M3 13h13a4 4 0 004-4V7" />
                        <path d="M17 7l4 4-4 4" />
                        <path d="M21 11H8a4 4 0 00-4 4v2" />
                    </svg>
                </div>

                {/* --- TITULO --- */}
                <h3 id="modal-transferir-titulo" className="modal-transferir__titulo">
                    Transferir ingresso
                </h3>

                {/* --- MENSAGEM EXPLICATIVA --- */}
                <p className="modal-transferir__mensagem">
                    Informe o <strong>e-mail</strong> e o <strong>CPF</strong> da pessoa que receberá o ingresso.
                    Os dois dados precisam pertencer à mesma conta já cadastrada.
                </p>

                {/* --- RESUMO DO INGRESSO QUE SERA TRANSFERIDO --- */}
                {pedido && (
                    <div className="modal-transferir__resumo">
                        <strong className="modal-transferir__evento">
                            {pedido.evento?.titulo || `Pedido #${pedido.id}`}
                        </strong>
                        <span className="modal-transferir__detalhe">
                            {pedido.setor || "Setor não informado"} • Qtd: {pedido.quantidade || 1}
                        </span>
                    </div>
                )}

                {/* --- FORMULARIO DE TRANSFERENCIA --- */}
                <form className="modal-transferir__form" onSubmit={submeter}>
                    <label className="modal-transferir__label" htmlFor="transferir-email">
                        E-mail do destinatário
                    </label>
                    <input
                        id="transferir-email"
                        type="email"
                        className="modal-transferir__input"
                        placeholder="destinatario@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={processando}
                        autoFocus
                    />

                    <label className="modal-transferir__label" htmlFor="transferir-cpf">
                        CPF do destinatário
                    </label>
                    <input
                        id="transferir-cpf"
                        type="text"
                        inputMode="numeric"
                        className="modal-transferir__input"
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={(e) => setCpf(formatarCpf(e.target.value))}
                        disabled={processando}
                        maxLength={14}
                    />

                    {/* --- MENSAGENS DE ERRO/SUCESSO --- */}
                    {(erroLocal || erro) && (
                        <p className="modal-transferir__erro">{erroLocal || erro}</p>
                    )}
                    {sucesso && (
                        <p className="modal-transferir__sucesso">{sucesso}</p>
                    )}

                    {/* --- AVISOS SOBRE A OPERACAO --- */}
                    <ul className="modal-transferir__avisos">
                        <li>O QR Code atual será invalidado e regenerado para o novo dono.</li>
                        <li>Não é possível transferir ingressos já usados no check-in.</li>
                        <li>Links de compartilhamento ativos serão revogados por segurança.</li>
                    </ul>

                    {/* --- CANCELAR OU CONFIRMAR --- */}
                    <div className="modal-transferir__acoes">
                        <button type="button" className="modal-transferir__btn modal-transferir__btn--secundario" onClick={onFechar} disabled={processando}>
                            {sucesso ? "Fechar" : "Cancelar"}
                        </button>
                        {!sucesso && (
                            <button type="submit" className="modal-transferir__btn modal-transferir__btn--primario" disabled={processando}>
                                {processando ? "Transferindo..." : "Confirmar transferência"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
