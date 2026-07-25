using LiveEventsTicket.Backend.Modules.Pedido.Dto;
using LiveEventsTicket.Backend.Modules.Pedido.Repository;
using LiveEventsTicket.Backend.Modules.Usuario.Repository;

namespace LiveEventsTicket.Backend.Modules.Pedido.Service;

public class IngressoTransferenciaService
{
    private readonly IPedidoRepository _pedidoRepository;
    private readonly IUsuarioRepository _usuarioRepository;

    public IngressoTransferenciaService(
        IPedidoRepository pedidoRepository,
        IUsuarioRepository usuarioRepository)
    {
        _pedidoRepository = pedidoRepository;
        _usuarioRepository = usuarioRepository;
    }

    // --- REALIZA A TRANSFERENCIA DO PEDIDO INDICADO PARA O USUARIO IDENTIFICADO POR EMAIL+CPF ---
    public async Task<TransferirIngressoRespostaDto> TransferirAsync(
        int usuarioAtualId,
        int pedidoId,
        TransferirIngressoDto dto,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.EmailDestinatario))
        {
            throw new InvalidOperationException("Informe o e-mail do destinatário.");
        }

        var cpfDestino = PedidoHelpers.SomenteDigitos(dto.CpfDestinatario);
        if (string.IsNullOrWhiteSpace(cpfDestino) || cpfDestino.Length != 11)
        {
            throw new InvalidOperationException("Informe um CPF válido do destinatário.");
        }

        var emailDestino = dto.EmailDestinatario.Trim();

        // --- CARREGA O PEDIDO GARANTINDO QUE PERTENCE AO SOLICITANTE ---
        var pedido = await _pedidoRepository.BuscarPorIdEUsuarioAsync(pedidoId, usuarioAtualId, cancellationToken)
            ?? throw new KeyNotFoundException("Pedido não encontrado para este usuário.");

        if (pedido.Status != StatusPedido.Pago)
        {
            throw new InvalidOperationException("Só é possível transferir ingressos de pedidos pagos.");
        }

        if (pedido.CheckinUsosRealizados > 0)
        {
            throw new InvalidOperationException("Este ingresso já foi utilizado em check-in e não pode ser transferido.");
        }

        if (pedido.ReembolsoSolicitadoEm.HasValue)
        {
            throw new InvalidOperationException("Este pedido possui um reembolso em andamento e não pode ser transferido.");
        }

        var destinatario = await _usuarioRepository.BuscarPorEmailECpfAsync(emailDestino, cpfDestino, cancellationToken)
            ?? throw new InvalidOperationException("Nenhum usuário cadastrado combina com o e-mail e CPF informados.");

        if (destinatario.Id == usuarioAtualId)
        {
            throw new InvalidOperationException("Você não pode transferir um ingresso para si mesmo.");
        }

        // --- ATUALIZA A TITULARIDADE DO PEDIDO ---
        pedido.UsuarioId               = destinatario.Id;
        pedido.CompradorNome           = $"{destinatario.Nome} {destinatario.Sobrenome}".Trim();
        pedido.CompradorCpf            = destinatario.Cpf;
        pedido.CompradorEmail          = destinatario.Email;
        pedido.CompradorTelefone       = destinatario.Telefone;
        pedido.CompradorDataNascimento = destinatario.DataNascimento.ToString("yyyy-MM-dd");

        // --- SUBSTITUI O ENDERECO DO PEDIDO PELO DO NOVO DONO ---
        pedido.EnderecoCep         = destinatario.Cep;
        pedido.EnderecoLogradouro  = destinatario.Logradouro;
        pedido.EnderecoNumero      = destinatario.Numero;
        pedido.EnderecoComplemento = destinatario.Complemento;
        pedido.EnderecoBairro      = destinatario.Bairro;
        pedido.EnderecoCidade      = destinatario.Cidade;
        pedido.EnderecoEstado      = destinatario.Estado;

        pedido.CheckinToken  = PedidoHelpers.GerarTokenCheckin();
        pedido.QrCodeBase64  = PedidoHelpers.GerarQrCodeBase64(pedido.CheckinToken);

        if (!string.IsNullOrWhiteSpace(pedido.CompartilhamentoToken)
            && !pedido.CompartilhamentoRevogadoEm.HasValue)
        {
            pedido.CompartilhamentoRevogadoEm = DateTime.UtcNow;
        }

        // --- PERSISTE A ALTERACAO ---
        await _pedidoRepository.SalvarAlteracoesAsync(cancellationToken);

        return new TransferirIngressoRespostaDto
        {
            PedidoId         = pedido.Id,
            NovoUsuarioId    = destinatario.Id,
            NovoUsuarioNome  = pedido.CompradorNome,
            NovoUsuarioEmail = destinatario.Email,
            TransferidoEm    = DateTime.UtcNow,
            Mensagem         = $"Ingresso transferido com sucesso para {pedido.CompradorNome}."
        };
    }
}
