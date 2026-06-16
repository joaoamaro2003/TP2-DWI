# DECISOES.md

## Decisões de implementação e dificuldades

Durante o desenvolvimento do projeto PokéGuess foram tomadas várias decisões técnicas para garantir que o jogo funcionasse de forma eficiente, modular e fácil de manter.

---

## 1. Estrutura modular

O projeto foi dividido em vários ficheiros JavaScript separados por responsabilidade:

- api.js → comunicação com a PokéAPI
- estado.js → gestão do estado do jogo
- game.js → lógica principal do jogo
- timer.js → controlo do temporizador
- ui.js → manipulação do DOM
- main.js → inicialização e eventos
- modos/ → implementação dos diferentes modos de jogo

Esta decisão facilitou a organização do código e tornou o projeto mais fácil de depurar.

---

## 2. Uso de estado global

Foi criado um objeto central `estadoJogo` para guardar toda a informação do jogo, como:

- pontos
- vidas
- ronda
- streak
- Pokémon atual

Isto permitiu manter a lógica consistente entre todos os módulos.

---

## 3. Uso de LocalStorage

Foi utilizada a API `localStorage` para:

- guardar o histórico de partidas
- persistir dados entre sessões

Esta decisão permitiu adicionar uma funcionalidade extra sem necessidade de backend.

---

## 4. Cache da API

Foi implementado um sistema de cache na PokéAPI para evitar pedidos repetidos.

Isto melhorou o desempenho e reduziu chamadas desnecessárias à API.

---

## 5. Dificuldades encontradas

Durante o desenvolvimento surgiram algumas dificuldades:

- Gestão da sincronização entre timer e respostas
- Comunicação entre módulos JavaScript
- Garantir que o DOM atualiza corretamente após cada ronda
- Evitar erros quando a API falha ou demora a responder

Estas dificuldades foram resolvidas através de divisão de responsabilidades e organização do código.

---

## 6. Decisão dos modos de jogo

Foram implementados 4 modos principais:

- Silhueta (nível base de dificuldade)
- Estatísticas (interpretação de dados)
- Tipo + Geração (múltipla escolha)
- Evolução (lógica de cadeias evolutivas)

Esta decisão aumentou a diversidade do jogo e a dificuldade progressiva.

---

## Conclusão

O projeto foi desenvolvido com foco em organização, reutilização de código e experiência de utilizador.  
A estrutura modular e o uso de estado global foram fundamentais para o funcionamento do jogo.
