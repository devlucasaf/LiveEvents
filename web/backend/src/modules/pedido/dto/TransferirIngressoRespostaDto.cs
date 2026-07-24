namespace LiveEventsTicket.Backend.Modules.Pedido.Dto;

public class TransferirIngressoRespostaDto
{
    public int 		PedidoId 			{ get; set; }
    public int 		NovoUsuarioId 		{ get; set; }
    public string 	NovoUsuarioNome 	{ get; set; } = string.Empty;
    public string 	NovoUsuarioEmail 	{ get; set; } = string.Empty;
    public DateTime TransferidoEm 		{ get; set; }
    public string 	Mensagem 			{ get; set; } = string.Empty;
}
