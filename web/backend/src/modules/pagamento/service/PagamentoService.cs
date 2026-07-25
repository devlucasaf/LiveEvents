using LiveEventsTicket.Backend.Modules.Pedido.Dto;
using LiveEventsTicket.Backend.Modules.Pedido.Service;
using PagamentoEntity = LiveEventsTicket.Backend.Modules.Pagamento.Model.Pagamento;

namespace LiveEventsTicket.Backend.Modules.Pagamento.Service;

public class PagamentoService
{
    // --- PROCESSAR PAGAMENTO ---
    public PagamentoEntity ProcessarPagamento(CriarPedidoDto dto, int pedidoId)
    {
        var tipo = dto.Pagamento.Tipo.ToUpperInvariant();

        // --- PAGAMENTO VIA CARTAO ---
        if (tipo == "CARTAO")
        {
            var numero          = dto.Pagamento.NumeroCartao ?? string.Empty;
            var ultimoDigito    = numero.LastOrDefault();
            var aprovado        = char.IsDigit(ultimoDigito) && ((ultimoDigito - '0') % 2 == 0);

            return new PagamentoEntity
            {
                PedidoId    = pedidoId,
                Tipo        = "CARTAO",
                Status      = aprovado
                    ? StatusPagamento.Aprovado
                    : StatusPagamento.Recusado
            };
        }

        // --- PAGAMENTO VIA PIX ---
        return new PagamentoEntity
        {
            PedidoId    = pedidoId,
            Tipo        = "PIX",
            Status      = StatusPagamento.Aprovado,
            CodigoPix   = $"PIX-{Guid.NewGuid():N}"[..20]
        };
    }
}
