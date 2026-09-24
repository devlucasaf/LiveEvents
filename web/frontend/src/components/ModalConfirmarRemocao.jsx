import "../styles/modal-confirmar-remocao.css";

// --- CONFIRMAR REMOÇÃO DE ITEM DO CARRINHO ---
export default function ModalConfirmarRemocao({ aberto, item, onConfirmar, onCancelar }) {
    if (!aberto) {
        return null;
    }

    return (
        <div className="modal-remover__overlay" onClick={onCancelar} role="presentation">
            {/* --- CAIXA CENTRAL --- */}
            <div className="modal-remover" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-remover-titulo">
                {/* --- ÍCONE DE ALERTA --- */}
                <div className="modal-remover__icone">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18" />
                        <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                    </svg>
                </div>

                {/* --- TÍTULO --- */}
                <h3 id="modal-remover-titulo" className="modal-remover__titulo">
                    Remover do carrinho?
                </h3>

                {/* --- MENSAGEM COM RESUMO DO ITEM --- */}
                <p className="modal-remover__mensagem">
                    Tem certeza que deseja remover este item do carrinho?
                </p>

                {/* --- RESUMO DO ITEM QUE SERÁ REMOVIDO --- */}
                {item && (
                    <div className="modal-remover__resumo">
                        <strong className="modal-remover__evento">{item.eventoTitulo}</strong>
                        <span className="modal-remover__detalhe">
                            {item.setor} • {item.modalidadeLabel}
                        </span>
                        <span className="modal-remover__qtd">Quantidade: {item.quantidade}</span>
                    </div>
                )}

                {/* --- ACOES: CANCELAR OU CONFIRMAR REMOCAO --- */}
                <div className="modal-remover__acoes">
                    <button type="button" className="modal-remover__btn modal-remover__btn--secundario" onClick={onCancelar}>
                        Cancelar
                    </button>
                    <button type="button" className="modal-remover__btn modal-remover__btn--perigo" onClick={onConfirmar} autoFocus>
                        Sim, remover
                    </button>
                </div>
            </div>
        </div>
    );
}
