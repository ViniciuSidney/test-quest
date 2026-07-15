# Fluxos e Telas

## Tela 1 — Importação

### Objetivo

Preparar uma nova sessão ou retomar uma sessão já salva.

### Elementos

- painel de sessão salva;
- campo de arquivo `.txt`;
- nome da lista;
- opções de embaralhamento e exibição do gabarito;
- textarea de importação;
- botão para carregar exemplo;
- validação da importação;
- modal com o modelo aceito;
- botão para iniciar.

### Estados

- sem sessão salva;
- com sessão salva;
- campos vazios;
- importação válida;
- importação inválida;
- modal aberto ou fechado.

## Tela 2 — Resolução

### Objetivo

Permitir a resolução contínua das questões, com acompanhamento de progresso, tempo e anotações.

### Áreas

- painel de progresso e temporizador;
- mapa de questões;
- controles de pausa, revisão e retorno;
- painel independente de anotações;
- painel principal da questão;
- barra de ações da questão atual.

### Estados

- questão objetiva;
- questão discursiva;
- questão respondida;
- questão não respondida;
- questão marcada para revisão;
- temporizador rodando;
- temporizador pausado.

## Tela 3 — Resultado

### Objetivo

Apresentar o desempenho da sessão e apoiar a revisão.

### Elementos

- percentual de acertos;
- total de objetivas corretas;
- quantidade de questões respondidas;
- tempo total;
- tempo médio;
- resumo por assunto;
- revisão individual;
- exportação de respostas, anotações e sessão;
- retorno à resolução ou início de nova lista.

## Fluxo principal — Nova sessão

1. O usuário abre a tela de importação.
2. Cola uma lista ou seleciona um arquivo.
3. Informa ou confirma o nome da lista.
4. Valida a importação.
5. Inicia a sessão.
6. Resolve as questões e registra anotações.
7. Finaliza a sessão.
8. Analisa o resultado.
9. Exporta os arquivos desejados.

## Fluxo — Retomar sessão

1. A aplicação identifica dados no `localStorage`.
2. Exibe o painel de sessão salva.
3. O usuário seleciona **Continuar sessão**.
4. A aplicação restaura questão atual, respostas, anotações, tempos e marcações.
5. O temporizador volta a contar somente na tela de resolução.

## Fluxo — Voltar ao import

1. O usuário seleciona **Voltar ao import**.
2. O tempo da questão atual é registrado.
3. O temporizador é interrompido.
4. O estado é salvo.
5. A tela de importação exibe a opção de continuar.

## Fluxo — Exportação

1. O usuário finaliza a sessão.
2. A aplicação gera o conteúdo localmente.
3. O navegador cria e baixa o arquivo.
4. Nenhum dado é enviado para um servidor.
