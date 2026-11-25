{
const ST={
mkt:["Marketplaces","Onde o cliente compra (Mercado Livre, Privalia, Dafiti...).",["O pedido existe e está pago no painel do marketplace?","Foi cancelado lá pelo cliente?"]],
site:["Sites Aramis e Urban","Loja própria na plataforma Wake (antes VTEX). Também entra pelo Anymarket.",["Pagamento aprovado?","Endereço e CPF corretos no pedido?"]],
any:["Anymarket","Porta de entrada. Recebe todos os pedidos e manda para o Wake.",["O pedido entrou?","Tem erro de integração (SKU, estoque, preço)?","Está duplicado?"]],
wec:["Wake Ecommerce","Ponte entre o Anymarket e o Wake OMS.",["O pedido aparece aqui?","Foi rejeitado? Qual o log?","Precisa reprocessar?"]],
oms:["Wake OMS","O cérebro. Decide quem atende: CD  ou loja.",["Status: aguardando, em separação, faturado, cancelado","Filial certa?","Tem estoque na filial?","É omnichannel ou comum?"]],
omni:["Loja atende (omnichannel)","A loja física separa e envia no lugar do CD.",["Qual loja recebeu?","A loja aceitou e separou?","Quem fatura? (ainda a validar)"]],
sin:["SinB2C","Painel que mostra em que etapa o pedido está.",["O pedido avançou para separação?","Voltou o retorno do faturamento?","Está parado há quanto tempo?"]],
wms:["Senior WMS","Sistema do CD: separação (picking) e conferência.",["Tem estoque no endereço físico?","Pedido em onda, em pick ou pendente?","Houve corte?"]],
reab:["Reabastecimento","Quando falta produto no CD, o pedido é cortado. Time de Reabastecimento trata.",["Qual SKU faltou?","Vai repor ou cancelar o item?"]],
linx:["Linx ERP","Gera a nota fiscal (NF-e). Ponto mais sensível.",["NF-e autorizada ou rejeitada?","Qual o código de rejeição?","O retorno chegou no SinB2C?"]],
inte:["Intelipost","Cria a etiqueta, escolhe a transportadora e acompanha o rastreio.",["Etiqueta criada?","Transportadora certa para o CEP?","Rastreio atualizando?"]],
transp:["Transportadora","Coleta no CD ou loja e entrega ao cliente.",["Coletou?","Tem ocorrência (ausente, endereço não encontrado)?"]],
track:["Rastreio de volta","O código de rastreio volta para SinB2C, Linx e site para o cliente acompanhar.",["O cliente vê o rastreio no site/marketplace?"]]
};
const info=document.getElementById('info');
const btns=[...document.querySelectorAll('.st')];
const show=k=>{const s=ST[k];btns.forEach(b=>b.classList.toggle('on',b.dataset.k===k));
 info.innerHTML='<h3>'+s[0]+'</h3><p>'+s[1]+'</p><ul>'+s[2].map(x=>'<li>'+x+'</li>').join('')+'</ul>'};
btns.forEach(b=>b.addEventListener('click',()=>show(b.dataset.k)));
show('oms');

const STEPS=[
["Confirme o número e a origem","Saber de onde veio (ML, site, loja) diz qual caminho o pedido fez."],
["Veja se entrou no Anymarket","Se não entrou aqui, nada depois vai ter o pedido. É a porta."],
["Valide no Wake OMS","Mostra se foi recebido, para qual filial foi e o status real."],
["Consulte o SinB2C","Mostra em que etapa parou: separação, faturamento ou envio."],
["Senior WMS se for separação ou corte","Só aqui você vê se o produto existe de verdade no CD."],
["Linx ERP se for nota fiscal","Toda falha de NF-e tem um código. O código diz o que corrigir."],
["Intelipost se for etiqueta ou rastreio","Aqui está a transportadora, o prazo e o histórico da entrega."]];
document.getElementById('steps').innerHTML=STEPS.map(s=>'<div class="step"><b>'+s[0]+'</b><p class="why">Por quê: '+s[1]+'</p></div>').join('');

const T={int:["Integração","in"],pag:["Pagamento","wk"],can:["Cancelamento","xc"],est:["Estoque e ruptura","xc"],cad:["Cadastro e SKU","wk"],sep:["Separação","ex"],nf:["Nota fiscal","ex"],end:["Endereço e frete","ex"],ent:["Entrega e rastreio","in"],omn:["Omnichannel","om"]};
const P=[
["int","Pedido não aparece no Anymarket","Cliente comprou, mas o pedido não existe no hub.","Anymarket (busca por nº do pedido do canal) e painel do marketplace","Integração com o canal parada, token do canal expirado, ou pedido ainda não pago no canal (alguns só liberam após pagamento).",["Confirme que o pedido existe e está pago no marketplace","Veja se outros pedidos do mesmo canal entraram hoje","Se nenhum entrou: problema geral, abra chamado no Anymarket"],"Suporte Anymarket (com nº do pedido e print)"],
["int","Pedido no Anymarket, mas não chegou ao Wake","Aparece no Anymarket com erro ou parado.","Anymarket (status e mensagem de erro) e logs do Wake Ecommerce","SKU do pedido não existe no Wake, produto inativo, ou falha de comunicação momentânea.",["Leia a mensagem de erro do Anymarket","Confira se o SKU existe e está ativo no Wake","Corrija o cadastro e reprocesse o pedido"],"Time de cadastro / TI se o erro se repetir"],
["int","Pedido rejeitado no Wake Ecommerce","Wake recusou o pedido vindo do Anymarket.","Wake Ecommerce (log do pedido)","Dados obrigatórios faltando (CPF, endereço), SKU, canal ou preço inválido.",["Abra o log e copie o motivo","Corrija o dado na origem","Reprocesse e confirme que chegou no Wake OMS"],"TI / responsável pela integração"],
["int","Pedido duplicado","Mesmo pedido aparece duas vezes.","Anymarket e Wake OMS (compare nº do canal, cliente, valor)","Reenvio da integração ou reprocessamento feito duas vezes.",["Confirme que é o mesmo pedido do canal","Cancele só a cópia, antes de separar","Nunca fature os dois"],"Seu líder antes de cancelar"],
["cad","Divergência de preço ou valor","Valor no OMS diferente do marketplace.","Anymarket (preço enviado) e pedido no canal","Preço ou promoção atualizado em um sistema e não no outro.",["Compare item a item: preço, desconto, frete","Anote a diferença","Não fature com valor errado: segure e escale"],"Time comercial / e-commerce"],
["cad","SKU não encontrado ou trocado","Pedido trava por produto desconhecido ou cor/tamanho errado.","Anymarket, Wake OMS e Senior WMS (mesmo SKU nos três)","SKU cadastrado diferente entre sistemas (de-para errado).",["Pegue o SKU do pedido","Procure ele no Wake e no WMS","Se não bater, peça correção do cadastro e reprocesse"],"Time de cadastro"],
["pag","Pagamento pendente ou em análise","Pedido parado em aguardando pagamento.","Wake (status de pagamento) e marketplace","Boleto/PIX não pago ainda, ou antifraude analisando. Enquanto não confirma, o pedido não segue.",["Veja a forma de pagamento e a data","Boleto vencido ou PIX expirado tende a cancelar sozinho","Não force a liberação de pedido não pago"],"Financeiro / antifraude"],
["pag","Pagamento recusado ou antifraude reprovou","Pedido cancelado ou bloqueado por pagamento.","Wake (status de pagamento)","Cartão recusado pelo banco ou compra marcada como suspeita.",["Confirme o motivo no status","Garanta que o pedido não foi para separação","Se já foi, avise o CD para parar"],"Financeiro / antifraude"],
["can","Cliente cancelou, mas o pedido seguiu","Cancelado no marketplace, ativo no OMS ou no CD.","Marketplace, Anymarket, Wake OMS e SinB2C (compare status)","O cancelamento não sincronizou entre os sistemas. É um erro conhecido em vários OMS.",["Confirme o cancelamento no canal","Cancele no Wake OMS","Se já está no WMS, peça para tirar da separação","Se já faturou, precisa cancelar a NF-e"],"Seu líder + CD"],
["can","Cancelar pedido já em separação","Pedido precisa ser cancelado, mas está em onda/pick.","Senior WMS (status da onda)","Depois que a onda é formada, o WMS só aceita o cancelamento se estiver configurado para isso.",["Veja se está em onda, em pick ou conferido","Avise o CD para retirar da onda","Confirme que o estoque voltou"],"Time do CD"],
["can","Cancelar pedido já faturado","A NF-e já foi emitida e o pedido precisa ser cancelado.","Linx ERP e Senior WMS","A nota precisa ser cancelada na SEFAZ. Se a mercadoria já saiu na coleta, não dá para cancelar: vira devolução.",["Veja se já foi coletado","Não coletado: cancelar NF-e no prazo legal","Coletado: tratar como devolução/reversa"],"Fiscal + seu líder"],
["est","Ruptura: pedido cortado por falta de estoque","Item cortado na separação.","Senior WMS (corte) e Wake OMS (estoque)","O sistema mostrava estoque, mas o produto não estava no endereço físico.",["Anote SKU e quantidade cortada","Encaminhe ao time de Reabastecimento","Defina: repor, trocar filial ou cancelar o item e avisar o cliente"],"Reabastecimento"],
["est","Estoque divergente entre sistemas","Site vende o que o CD não tem (ou o contrário).","Anymarket, Wake OMS e Senior WMS (saldo do SKU)","Atualização de estoque atrasada ou falhou entre os sistemas.",["Compare o saldo do SKU nos três","Avise para corrigir antes de vender mais","Se repetir, abra chamado de integração"],"Reabastecimento / TI"],
["est","Pedido parado em aguardando envio no OMS","Não vai para nenhuma filial.","Wake OMS (filial e estoque)","Nenhuma filial com estoque suficiente, ou filial errada (confira se é CD ou loja).",["Veja qual filial foi escolhida","Confira estoque nela","Se não tiver em lugar nenhum: tratar como ruptura"],"Seu líder / Reabastecimento"],
["omn","Omnichannel: loja não atendeu","Pedido enviado para a loja, sem andamento.","Wake OMS (filial da loja) e SinB2C","Loja não viu, não tem o produto ou recusou.",["Confirme qual loja recebeu","Ligue/fale com a loja","Se a loja não puder atender, peça redirecionamento para outra filial ou CD"],"Loja + seu líder"],
["sep","Pedido não avança para separação","SinB2C parado antes do WMS.","SinB2C e Senior WMS","Pedido não foi integrado ao WMS, ou bloqueado (pagamento, cadastro).",["Veja o último status no SinB2C","Procure o pedido no WMS","Se não existe no WMS: problema de integração, escale"],"TI / CD"],
["sep","Separação travada (pick pendente)","Pedido no WMS há muito tempo sem concluir.","Senior WMS (status, endereço do SKU)","SKU sem endereço físico, produto em local errado ou separador ainda não pegou.",["Veja há quanto tempo está pendente","Confira endereço do SKU","Fale com o CD sobre a fila"],"Time do CD"],
["nf","NF-e rejeitada","Faturamento não sai e aparece um código de rejeição.","Linx ERP (mensagem da SEFAZ)","Erros de cadastro do cliente (CPF, IE), NCM vencido, CFOP errado (5 = mesmo estado, 6 = outro estado) ou nota duplicada.",["Copie o código (ex.: 778 NCM inexistente, 204 duplicidade, 237 CPF inválido)","Corrija o dado no cadastro","Reenvie a nota (na rejeição o número pode ser reaproveitado)"],"Fiscal"],
["nf","Faturado, mas o status não voltou","Nota emitida, mas SinB2C/marketplace ainda mostram sem faturar.","Linx ERP e SinB2C","O retorno do faturamento para o SinB2C falhou ou atrasou.",["Confirme que a NF-e está autorizada no Linx","Veja se o SinB2C recebeu","Peça reenvio do retorno"],"TI / integração"],
["end","CEP inválido ou sem transportadora","Não consegue cotar frete nem gerar etiqueta.","Intelipost (cotação) e dados do pedido","CEP digitado errado, CEP novo ou região que nenhuma transportadora contratada atende.",["Confira o CEP nos Correios","Corrija o endereço com o cliente","Se o CEP está certo, peça outra transportadora"],"Atendimento ao cliente + logística"],
["end","Etiqueta não gerada","Pedido faturado sem etiqueta.","Intelipost","Falta NF-e no pedido, volumes/peso faltando ou erro da transportadora.",["Veja se a NF-e chegou na Intelipost","Confira volumes e peso","Abra chamado com nº do pedido ou da NF"],"Suporte Intelipost"],
["ent","Não foi coletado","Etiqueta pronta, mas a transportadora não passou.","Intelipost (status de despacho)","Coleta não agendada ou pedido fora da lista de postagem.",["Confirme se está na lista de coleta do dia","Fale com a transportadora"],"Logística / transportadora"],
["ent","Rastreio parado ou errado","Cliente reclama que o rastreio não mexe.","Intelipost (histórico e código)","Código errado, transportadora sem integração ou ocorrência na entrega.",["Veja o último evento","Corrija o código se estiver errado (dá para fazer em massa por planilha)","Se tiver ocorrência, trate com a transportadora"],"Suporte Intelipost / transportadora"],
["ent","Entrega atrasada","Passou do prazo prometido.","Intelipost (prazo previsto x real)","Atraso na separação, no faturamento ou na transportadora.",["Descubra em qual etapa atrasou (use o método)","Atualize o cliente com nova previsão"],"Logística + atendimento"],
["ent","Devolução ou troca","Cliente quer devolver.","Marketplace/site, Intelipost (reversa) e Linx","Produto errado, defeito ou arrependimento.",["Gere a reversa","Ao chegar no CD, confira o produto","Fiscal emite a nota de devolução"],"Atendimento + fiscal"]
];
let f='all';
const chips=document.getElementById('chips');
chips.innerHTML='<button class="chip" data-f="all" aria-pressed="true">Todos</button>'+Object.entries(T).map(([k,v])=>'<button class="chip" data-f="'+k+'" aria-pressed="false">'+v[0]+'</button>').join('');
const grid=document.getElementById('grid'),q=document.getElementById('q'),empty=document.getElementById('empty');
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const render=()=>{const t=norm(q.value.trim());
 const list=P.filter(p=>(f==='all'||p[0]===f)&&(!t||norm(p.join(' ')).includes(t)));
 grid.innerHTML=list.map(p=>'<details class="pb"><summary><span class="tag '+T[p[0]][1]+'">'+T[p[0]][0]+'</span><span class="t">'+p[1]+'<span class="s">'+p[2]+'</span></span></summary><div class="body"><dl><dt>Onde olhar</dt><dd>'+p[3]+'</dd><dt>Por que acontece</dt><dd>'+p[4]+'</dd><dt>O que fazer</dt><dd><ol>'+p[5].map(x=>'<li>'+x+'</li>').join('')+'</ol></dd><dt>Quem chamar</dt><dd><span class="who">'+p[6]+'</span></dd></dl></div></details>').join('');
 empty.style.display=list.length?'none':'block'};
chips.addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;f=b.dataset.f;chips.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',c===b));render()});
q.addEventListener('input',render);
render();

const SYS=[
["1º","Wake OMS","var(--t-wake)",["Ver pedidos aguardando envio, em separação, faturados, cancelados","Saber se vai para CD ou loja","Conferir filial, estoque e dados","Separar pedido comum de omnichannel"]],
["2º","SinB2C","var(--t-wake)",["Acompanhar a evolução do status","Achar pedido que não foi para separação ou faturamento","No omnichannel: como a loja atende e quem fatura"]],
["3º","Anymarket","var(--t-in)",["Confirmar que o pedido entrou e foi ao Wake","Ver divergência de SKU, estoque, preço, canal e duplicidade","Consultar integrações e status de processamento"]],
["4º","Senior WMS","var(--t-exe)",["Estoque disponível no CD","Entender corte por falta de estoque","Pedidos em separação, pick ou pendentes","SKU, endereço físico e regras de separação"]],
["5º","Linx ERP","var(--t-exe)",["Falhas de faturamento e NF-e","Cadastro, impostos, estoque e status fiscal","Retorno do faturamento para o SinB2C","Evitar pedido faturado errado"]],
["6º","Intelipost","var(--t-exe)",["Etiqueta, coleta e rastreio","Transportadora certa e exceções","Prazo, CEP, volumes"]],
["7º","Wake Ecommerce","var(--t-wake)",["Fluxo entre marketplaces, sites e OMS","Pedidos não integrados ou rejeitados","Logs e reprocessamento"]]];
document.getElementById('sys').innerHTML=SYS.map(s=>'<div class="sy" style="--c:'+s[2]+'"><span class="p">Prioridade '+s[0]+'</span><h3>'+s[1]+'</h3><ul>'+s[3].map(x=>'<li>'+x+'</li>').join('')+'</ul></div>').join('');

const GL=[["OMS","Sistema que gerencia o pedido do início ao fim."],["Hub (Anymarket)","Ponte que junta pedidos de vários canais num lugar só."],["SKU","Código único de cada produto, com cor e tamanho."],["Omnichannel","A loja física atende o pedido online no lugar do CD."],["CD","Centro de distribuição. Armazém central da empresa."],["Onda","Grupo de pedidos liberado junto para separar."],["Picking","Ato de pegar o produto na prateleira."],["Corte","Item que saiu do pedido por falta física."],["Ruptura","Falta de produto no estoque."],["NF-e","Nota fiscal eletrônica. Sem ela o pedido não sai."],["Rejeição","SEFAZ recusou a nota por erro de dado. Corrige e reenvia."],["SEFAZ","Órgão do governo que autoriza a nota."],["Reprocessar","Mandar o pedido de novo pela integração."],["Reversa","Logística da devolução, do cliente de volta ao CD."]];
document.getElementById('gl').innerHTML=GL.map(g=>'<div><b>'+g[0]+'</b>: '+g[1]+'</div>').join('');
}
