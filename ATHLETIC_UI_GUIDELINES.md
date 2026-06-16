# ATHLETIC_UI_GUIDELINES.md

## Objetivo do projeto

Criar uma plataforma premium de fisiologia, performance e análise esportiva para o Athletic Club.

A plataforma deve parecer uma central de performance de clube profissional, inspirada em:

* Chelsea FC Player Experience
* Apple Sports
* Apple Fitness
* Formula 1 Telemetry
* Catapult
* Apollo
* Hudl
* 21st.dev Motion Components

O objetivo NÃO é criar um dashboard administrativo.

O objetivo é criar uma experiência visual e funcional de elite para fisiologia, preparação física e comissão técnica.

---

# Direção visual

## Fundo

Usar fundo 100% preto:

```css
#000000
```

Evitar:

* gradientes pesados
* texturas fortes
* fundos cinza
* aparência SaaS comum

---

# Header

## Logo AC

A logo AC deve ser o centro visual da plataforma.

Regras:

* usar logo AC outline branca
* centralizada no topo
* sem texto ao lado
* sem “Athletic Club” escrito ao lado
* tamanho maior que a logo PR
* deve parecer integrada ao layout, não apenas colada

Tamanhos sugeridos:

Desktop:

```txt
88px a 104px
```

Tablet:

```txt
72px a 84px
```

Mobile:

```txt
56px a 68px
```

---

## Logo PR

A logo PR deve aparecer como assinatura tecnológica.

Regras:

* usar logo PR outline branca
* canto superior direito
* menor que a logo AC
* texto discreto: “Powered by PR Logic Sports”
* não disputar atenção com a logo AC

Tamanhos sugeridos:

Desktop:

```txt
72px a 88px
```

Tablet:

```txt
56px a 68px
```

Mobile:

```txt
44px a 56px
```

---

## Live Status

Canto superior esquerdo:

* ponto vermelho
* AO VIVO
* horário
* treino atual
* campo atual

Exemplo:

```txt
● AO VIVO
14:32:07
Treino tático • Campo A
```

---

# Navegação

A navegação deve ser dividida ao redor da logo AC.

Lado esquerdo:

* Dashboard
* Equipe
* Atletas

Lado direito:

* Sessões
* Calendário
* Relatórios
* Alertas

Regras:

* sem linhas
* sem underline
* sem botões pesados
* sem bordas
* sem containers
* sem barra inferior
* apenas texto/ícone minimalista

Item ativo:

* branco
* levemente mais forte
* sem underline

Item inativo:

* branco com baixa opacidade
* hover suave

---

# Minimalismo

Remover sempre que possível:

* linhas divisórias
* bordas fortes
* cards desnecessários
* caixas administrativas
* sombras pesadas
* botões com fundo
* barras
* headers com containers
* footers delimitados

A interface deve parecer que os dados estão flutuando sobre o fundo preto.

---

# Cards

Somente os cards de atletas podem ter shape visual.

Cards de atletas:

* podem ter borda muito sutil
* podem ter formato premium
* podem ter glass leve
* podem ter glow sutil
* podem ter sombra interna
* devem destacar o atleta

Outros dados:

* devem ser leves
* sem caixas pesadas
* sem bordas visíveis
* sem aparência de tabela administrativa

---

# Tipografia

Usar branco como base.

Hierarquia por:

* tamanho
* peso
* opacidade
* espaçamento

Não por caixas.

Textos secundários:

```css
rgba(255,255,255,0.45)
```

Textos principais:

```css
rgba(255,255,255,0.95)
```

---

# Cores de dados

Usar poucas cores.

Verde:

* positivo
* normal
* pronto

Amarelo:

* atenção
* monitoramento

Laranja:

* carga elevada

Vermelho:

* crítico
* risco
* alerta

Evitar cores desnecessárias.

Nada de visual gamer.

---

# Motion Design

Usar Framer Motion.

Todo movimento deve parecer premium.

Referência:

* Chelsea FC
* Apple Sports
* Apple Vision Pro
* 21st.dev

Usar:

* spring animations
* AnimatePresence
* layoutId
* Shared Layout Transitions
* scale
* opacity
* blur
* depth
* transform3d
* perspective

Evitar:

* fade seco
* troca instantânea
* bounce exagerado
* animações genéricas
* slider tradicional

---

# Configuração de motion padrão

Usar como base:

```tsx
const spring = {
  type: "spring",
  stiffness: 180,
  damping: 22,
  mass: 0.9,
}
```

Para transições mais suaves:

```tsx
const softSpring = {
  type: "spring",
  stiffness: 120,
  damping: 18,
  mass: 0.8,
}
```

---

# Carrossel de atletas

O carrossel é a principal experiência visual do projeto.

Não usar:

* Swiper
* Slick
* slider comum
* carousel genérico

Criar experiência própria com Framer Motion.

Atleta central:

```txt
scale: 1
opacity: 1
blur: 0
z-index alto
translateZ positivo
```

Primeiro lateral:

```txt
scale: 0.78 a 0.82
opacity: 0.55 a 0.75
blur: 1px
```

Segundo lateral:

```txt
scale: 0.60 a 0.68
opacity: 0.18 a 0.45
blur: 3px a 5px
```

A experiência deve parecer:

```txt
navegar por atletas em profundidade
```

e não:

```txt
passar cards em um slider
```

---

# Ao clicar no atleta

A transição deve parecer que o card se transforma no perfil.

Usar:

* layoutId no card
* layoutId na foto
* layoutId no nome
* layoutId no número
* AnimatePresence
* Shared Layout Transition

Não fazer:

```txt
card some → perfil aparece
```

Fazer:

```txt
card transforma → perfil abre
```

---

# Dashboard

Dashboard deve mostrar:

* distância total
* velocidade média
* velocidade máxima
* sprints
* player load
* carga
* tempo de sessão
* alertas
* comparativos
* termografia

Mas visualmente:

* dados soltos
* sem excesso de cards
* sem aparência de ERP
* sem tabela pesada

---

# Perfil individual

Tela do atleta deve ter:

* atleta em destaque
* foto grande
* nome
* número
* posição
* métricas físicas
* comparativos
* adversários
* indicadores circulares
* dados fisiológicos

Não transformar em tela de cadastro.

É uma tela de performance.

---

# Calendário

Tela calendário deve seguir:

* fundo preto absoluto
* logo AC centralizada
* calendário limpo
* sem margens pesadas
* sem linhas excessivas
* jogadores/imagem na parte inferior se existir
* aparência de planejamento esportivo profissional

---

# Termografia

Termografia deve parecer módulo de fisiologia profissional.

Mostrar:

* mapa corporal frontal
* mapa corporal traseiro
* comparação hoje
* comparação 7 dias
* assimetria
* alertas

Motion:

* troca com fade + scale
* zonas com pulse muito sutil

---

# Alertas

Alertas devem ser discretos.

Não usar popup invasivo.

Usar:

* glow leve
* pulse sutil
* texto objetivo
* cor conforme gravidade

Exemplos:

```txt
2 atletas com carga elevada
1 atleta com termografia alterada
3 atletas abaixo da recuperação ideal
```

---

# Gráficos

Gráficos devem parecer Apple Fitness / Formula 1 Telemetry.

Usar:

* linhas desenhando
* barras crescendo
* animação progressiva
* pouca cor
* fundo limpo
* sem grid pesado

---

# Responsividade

Desktop:

* experiência cinematográfica
* carrossel amplo
* logo AC central forte

Tablet:

* swipe fluido
* cards próximos

Mobile:

* card central domina
* laterais aparecem parcialmente
* navegação pode rolar horizontalmente

---

# Performance

Manter 60 FPS.

Usar:

* transform3d
* will-change
* motion values
* memo quando necessário
* lazy loading de imagens

Evitar:

* animações que mudam width/height com frequência
* sombras exageradas
* blur pesado em muitos elementos ao mesmo tempo

---

# O que nunca fazer

Nunca deixar parecer:

* ERP
* SaaS genérico
* dashboard financeiro
* sistema médico antigo
* template Bootstrap
* painel administrativo

Nunca usar:

* excesso de azul
* excesso de gradiente
* borda em tudo
* tabela pesada
* botão com fundo em tudo
* header com linha separadora
* footer delimitado

---

# Sensação final

O usuário deve sentir:

```txt
Estou dentro de uma central de performance de um clube profissional.
```

A plataforma deve parecer:

```txt
Apple + Chelsea FC + Formula 1 Telemetry + Catapult + Apollo
```

com identidade Athletic Club e assinatura tecnológica PR Logic Sports.
