# Notas da Release — Test Quest v0.6.0

**Título sugerido no GitHub:** `Test Quest v0.6.0 — Integração orientada com o Study Stack`

## Resumo

A v0.6.0 completa o fluxo de prática entre o Study Stack e o Test Quest. Uma
lista pode nascer dentro de um Assunto, ser resolvida no Test Quest e retornar
automaticamente ao card correto no Study Stack, sem transformar o título
editável em identificador ou fonte da sequência.

## Principais mudanças

- abertura direta de **Preparar resolução** quando o Study Stack solicita uma
  nova lista;
- vínculo visível com Assunto, sequência e nome sugerido;
- nome da lista permanece editável;
- entrega do resultado pelo contrato `1.1.0`;
- respostas discursivas parciais enviadas com pontuação de 50%;
- **Salvar no Study Stack e voltar** como ação principal vinculada;
- **Baixar cópia da sessão** como nome explícito do backup nativo;
- exportação manual para o Study Stack disponível somente como recuperação;
- resultado informa quantas questões compõem a base do aproveitamento;
- desempenho por assunto separa total, respondidas e tempo;
- contexto removido após a entrega, evitando vínculo residual.

## Compatibilidade

- versão da aplicação: `0.6.0`;
- schema da sessão preservado em `7`;
- contrato de contexto recebido: `1.0.0`;
- contrato de resultado enviado: `1.1.0`;
- sessões e históricos anteriores continuam compatíveis.

## Validação

- 47 arquivos de teste automatizados aprovados;
- fluxo conjunto aprovado nas branches `dev` dos dois projetos;
- entrada vinculada, título editável, sequência e retorno aprovados manualmente;
- consumo único e abertura direta sem vínculo residual confirmados;
- nenhum defeito bloqueador ou importante conhecido.

## Limitações

Os dados continuam locais ao navegador. Não há backend ou sincronização entre
dispositivos, e questões discursivas continuam dependendo do Veredito Final do
usuário.

## Pós-publicação

Após a publicação coordenada com o Study Stack v0.3.0, execute um smoke test do
fluxo completo nas URLs públicas e confirme versão, persistência, retorno,
fallback de recuperação e Console.
