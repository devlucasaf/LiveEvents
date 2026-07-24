using System.ComponentModel.DataAnnotations;

namespace LiveEventsTicket.Backend.Modules.Pedido.Dto;

public class TransferirIngressoDto
{
    // --- EMAIL DO DESTINATARIO ---
    [Required(ErrorMessage = "Informe o e-mail do destinatário.")]
    [EmailAddress(ErrorMessage = "Informe um e-mail válido.")]
    public string EmailDestinatario { get; set; } = string.Empty;

    // --- CPF DO DESTINATARIO ---
    [Required(ErrorMessage = "Informe o CPF do destinatário.")]
    public string CpfDestinatario { get; set; } = string.Empty;
}
