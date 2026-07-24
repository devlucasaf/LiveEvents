namespace PontoVenda.Backend.Modules.Balcao.Model;

public class ItemPedidoWeb
{
    public int      Id              { get; set; }
    public int      PedidoId        { get; set; }
    public int      IngressoId      { get; set; }
    public int      Quantidade      { get; set; }
    public decimal  PrecoUnitario   { get; set; }
    public string   Modalidade      { get; set; } = "INTEIRA";
    public string?  Subtipo         { get; set; }
    public string?  DocumentosJson  { get; set; }
}
