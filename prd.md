PRD — Minhas Plantas

Produto: Minhas Plantas
Versão: MVP 1.0
Plataformas: Mobile Web + Web Desktop
Stack prevista: Next.js + TypeScript + Tailwind + Firebase + Vercel + GitHub
Prioridade: Mobile first
Objetivo: Controle simples, visual e rápido do manejo de plantas domésticas.

1. Visão do produto

O Minhas Plantas será uma aplicação web responsiva para pessoas que cultivam plantas em casa e desejam acompanhar plantas, grupos, adubações, bioinsumos, ciclos de manejo e evolução fotográfica sem precisar utilizar planilhas ou sistemas complexos.

O produto deve responder rapidamente à principal pergunta do usuário:

“Quando foi a última vez que adubei esta planta e quando devo fazer novamente?”

A experiência deve ser centrada em manejo, e não em cadastro.

O usuário deve conseguir:

cadastrar uma planta em poucos segundos;
organizar plantas individualmente ou em grupos;
cadastrar produtos minerais ou biológicos;
registrar aplicações rapidamente;
criar ciclos recorrentes de manejo;
acompanhar a última aplicação;
visualizar o próximo manejo;
registrar fotografias ao longo do tempo;
comparar fotografias;
consultar o histórico de cada planta;
receber avisos de manejo ao entrar no aplicativo.
2. Princípios do produto
2.1 Simplicidade antes de completude

Nenhuma informação deve ser obrigatória quando não for essencial ao funcionamento.

Para criar uma planta:

Foto + nome → salvar.

Espécie, localização, grupo e demais informações são complementares.

2.2 Manejo em primeiro lugar

A aplicação deve priorizar:

O que preciso fazer?

e depois:

O que já fiz?

2.3 Registro extremamente rápido

Registrar uma aplicação deve exigir poucos toques.

2.4 Fotografia como principal indicador de crescimento

O MVP não deve transformar o acompanhamento em um sistema de mensuração agronômica.

A evolução será predominantemente visual.

2.5 Ciência como suporte

A biblioteca científica deve auxiliar na criação dos ciclos, oferecendo recomendações baseadas em referências validadas.

Ela não deve transformar o aplicativo em um sistema rígido de prescrição.

2.6 Mobile first real

Toda decisão de UX deve partir do celular.

A versão desktop deve ser uma expansão da mesma experiência, não uma versão desktop reduzida.

2.7 Preparação para expansão

A arquitetura deve permitir futuramente:

modo horta;
diferentes tipos de cultivo;
mais parâmetros de manejo;
biblioteca científica expandida;
recomendações inteligentes;
notificações;
compartilhamento;
funcionalidades avançadas.

Essas funcionalidades não fazem parte do MVP.

3. Público-alvo
Persona principal

Pessoa que possui aproximadamente 10–50 plantas domésticas e utiliza diferentes produtos para manutenção, mas possui dificuldade em lembrar:

quando aplicou;
qual produto utilizou;
em qual planta;
qual dose utilizou;
qual será a próxima aplicação.

Não é necessário conhecimento técnico em agronomia.

O produto deve funcionar tanto para iniciantes quanto para usuários mais experientes.

4. Objetivos do MVP
Objetivo principal

Permitir que o usuário controle o histórico e os ciclos de adubação de suas plantas com o mínimo possível de interação.

Objetivos secundários
Criar um inventário visual das plantas.
Organizar plantas em grupos.
Registrar produtos utilizados.
Registrar aplicações.
Criar ciclos recorrentes.
Mostrar próximas aplicações.
Acompanhar evolução através de fotografias.
Criar uma base de dados estruturada para futuras funcionalidades.
5. Escopo funcional do MVP
5.1 Autenticação

Utilizar Firebase Authentication.

Métodos
Login com Google.
Logout.
Persistência de sessão.
Regra fundamental

Cada usuário deve visualizar e manipular somente seus próprios dados.

O userId deve estar associado a todos os dados privados do usuário.

Firebase Security Rules devem impedir acesso cruzado entre usuários.

6. Dashboard

O Dashboard é a tela principal.

A informação mais importante deve aparecer primeiro.

Estrutura
Header
Saudação.
Nome do usuário.
Avatar.
Acesso às configurações.

Exemplo:

Bom dia, Diego 🌱

Seção: Hoje

Mostrar imediatamente os manejos:

Exemplo

Cuidados de hoje

Monstera deliciosa
NPK 10-10-10
Adubação
Aplicar

Orquídeas
Biofertilizante
Aplicação
Aplicar

Estados

Sem tarefas

Tudo certo por aqui 🌿
Nenhum cuidado programado para hoje.

Tarefas atrasadas

Mostrar uma seção prioritária:

2 cuidados atrasados

Com destaque visual maior que os próximos cuidados.

7. Próximos cuidados

Mostrar próximos manejos em ordem cronológica.

Exemplo:

Amanhã
🌿 Costela-de-adão — NPK

Em 5 dias
🌱 Suculentas — Bioinsumo

Em 12 dias
🌿 Orquídea — Biofertilizante

O sistema deve calcular automaticamente a data com base no ciclo ativo.

8. Plantas

Tela de inventário visual.

Visualização padrão

Cards com:

fotografia;
nome;
espécie, quando disponível;
grupo;
última aplicação;
próxima aplicação.

Exemplo:

Costela-de-adão
Monstera deliciosa

NPK 10-10-10
Adubada há 18 dias
Próxima: em 12 dias

A informação “adubada há X dias” deve ter alta prioridade visual.

Busca

Permitir pesquisa por:

nome;
espécie;
grupo.
Filtros

MVP:

Todas;
Grupos;
Com manejo hoje;
Com manejo atrasado.
9. Cadastro de planta

O cadastro deve ser curto.

Etapa inicial

Adicionar foto

Câmera ou galeria.

Nome

Campo livre.

Espécie

Opcional.

Grupo

Opcional.

Local

Opcional.

Observação

Opcional.

Regra UX

Não criar wizard desnecessário.

O usuário deve conseguir salvar uma planta rapidamente.

10. Página da planta

A página individual é uma das telas mais importantes do sistema.

Header

Foto grande da planta.

Nome.

Espécie, se cadastrada.

Resumo

Mostrar:

Última adubação

NPK 10-10-10
18 dias atrás

Próximo manejo

em 12 dias

Ações rápidas
Registrar aplicação
Nova foto
Criar ciclo
Editar planta
11. Timeline da planta

A planta terá uma timeline cronológica.

Exemplo:

22 AGO 2026

📷 Foto adicionada

💧 NPK 10-10-10
5 mL/L · solo

04 AGO 2026

📷 Foto adicionada

22 JUL 2026

🌱 Bioinsumo X
10 mL/L · solo

A timeline deve combinar:

fotografias;
aplicações;
alterações relevantes;
observações.
12. Sistema de fotografias

As fotografias serão armazenadas no Firebase Storage.

Cada foto deve possuir:

id
plantId
userId
storagePath
url
createdAt
note opcional
Funções
Adicionar foto
câmera;
galeria.
Timeline

Mostrar fotos cronologicamente.

Comparação

Permitir selecionar duas fotos e visualizar:

Antes × Depois

A comparação deve utilizar interface simples, preferencialmente:

lado a lado no desktop;
comparação vertical ou slider no mobile.
13. Grupos

Permitir organizar plantas.

Exemplos:

Suculentas
Orquídeas
Sala
Varanda
Plantas tropicais

Um grupo pode conter várias plantas.

Manejo de grupo

Uma aplicação pode ser registrada para um grupo inteiro.

Exemplo:

Grupo: Suculentas
Produto: Bioinsumo X
Dose: 5 mL/L
Método: solo

O sistema deverá registrar a aplicação para todas as plantas pertencentes ao grupo.

A arquitetura deve preservar o vínculo da aplicação com o grupo e com as plantas afetadas.

14. Produtos

Os produtos serão divididos em dois tipos principais.

Mineral

Exemplos:

NPK 10-10-10
NPK 4-14-8
outros fertilizantes minerais
Biológico

Categoria genérica de bioinsumo.

O usuário poderá definir livremente o nome.

Exemplo:

Bioinsumo Trichoderma X

Não criar inicialmente uma taxonomia excessivamente complexa.

Cadastro

Campos:

Nome

Obrigatório.

Tipo

Mineral
Biológico

Descrição

Opcional.

Fabricante

Opcional.

Observação

Opcional.

15. Registro de aplicação

Deve ser uma das interações mais rápidas do sistema.

Campos
Produto

Seleção do produto cadastrado.

Planta ou grupo

Seleção.

Data

Padrão: hoje.

Editável.

Dose

Campo numérico.

Unidade

Exemplos:

mL/L
mL
g/L
g
mg/L
outro
Volume

Opcional.

Método

Seleção rápida:

Solo
Foliar
Água/irrigação
Outro
Observação

Opcional.

Confirmação

Após salvar:

Aplicação registrada 🌱

Mostrar:

produto;
planta;
data;
próxima aplicação, caso exista ciclo.
16. Ciclos de manejo

O ciclo é o mecanismo responsável por transformar uma aplicação em uma rotina.

Estrutura

Um ciclo possui:

planta ou grupo;
produto;
dose;
unidade;
volume;
método;
frequência;
data inicial;
próxima aplicação;
status.
Frequência

Permitir:

dias;
semanas;
meses.

Exemplos:

A cada 15 dias

A cada 30 dias

A cada 3 meses

17. Assistente científico para criação de ciclos

O usuário poderá criar um ciclo manualmente ou utilizar uma recomendação da biblioteca.

Fluxo:

Criar ciclo

↓

Para qual planta?

↓

Qual produto?

↓

Deseja utilizar uma recomendação?

Usar recomendação

ou

Definir manualmente

Biblioteca científica

A biblioteca deve conter recomendações estruturadas e rastreáveis.

Cada recomendação deve possuir:

espécie/categoria;
tipo de produto;
faixa de dose;
frequência;
método;
contexto;
fonte;
referência bibliográfica;
observações;
nível de evidência.
Importante

O aplicativo não deve apresentar uma recomendação científica como verdade universal.

Deve utilizar linguagem como:

Sugestão baseada na literatura

e permitir que o usuário ajuste o ciclo.

18. Histórico de aplicações

Tela para visualizar todas as aplicações.

Filtros:

planta;
grupo;
produto;
tipo;
período.

Cada registro mostra:

22/08/2026
Monstera
NPK 10-10-10
5 mL/L
Solo

19. Alertas dentro do aplicativo

Não utilizar notificações push no MVP.

O alerta acontece quando o usuário entra no aplicativo.

Prioridade:

Atrasado

🔴 Aplicação atrasada.

Hoje

🟠 Aplicação prevista hoje.

Próximo

🟢 Próxima aplicação futura.

20. Regras de cálculo

Para um ciclo:

nextApplicationDate =
lastApplicationDate + cycleFrequency

Quando uma aplicação vinculada ao ciclo for registrada:

lastApplicationDate = applicationDate
nextApplicationDate =
applicationDate + frequency

O sistema não deve depender de cálculo no frontend para persistir informações críticas.

A lógica de negócio deve estar centralizada em uma camada de domínio reutilizável.

21. Modelo de dados

Estrutura conceitual:

User
 ├── Plants
 ├── Groups
 ├── Products
 ├── CareCycles
 ├── Applications
 └── Photos
Plant
id
userId
name
species?
groupId?
location?
coverPhoto?
notes?
createdAt
updatedAt
Group
id
userId
name
description?
coverPhoto?
createdAt
updatedAt
Product
id
userId
name
type
manufacturer?
description?
notes?
createdAt
updatedAt
CareCycle
id
userId
plantId?
groupId?
productId
dose?
unit?
volume?
method?
frequencyValue
frequencyUnit
startDate
lastApplicationDate?
nextApplicationDate?
status
recommendationId?
createdAt
updatedAt
Application
id
userId
plantId?
groupId?
productId
date
dose?
unit?
volume?
method?
notes?
cycleId?
createdAt
Photo
id
userId
plantId
storagePath
url
note?
createdAt
22. Arquitetura de software

Adotar arquitetura modular desde o início.

Separar claramente:

UI
↓
Application / Use Cases
↓
Domain
↓
Infrastructure

Evitar colocar:

regras de negócio;
cálculos;
queries Firebase;
lógica de ciclo;

diretamente dentro dos componentes React.

Estrutura sugerida
src/
├── app/
├── components/
├── features/
│   ├── plants/
│   ├── groups/
│   ├── products/
│   ├── applications/
│   ├── cycles/
│   └── photos/
├── domain/
├── services/
├── lib/
├── hooks/
├── types/
└── utils/

Cada feature deve possuir responsabilidade clara.

23. Design System

A interface deve possuir um design system próprio.

Direção visual

Botânico minimalista.

Características:

fundo claro;
verde como cor de identidade;
tons naturais secundários;
tipografia contemporânea;
fotografias grandes;
bordas suaves;
sombras discretas;
ícones minimalistas;
bastante espaço negativo.

Evitar aparência de:

dashboard corporativo;
sistema administrativo;
template SaaS;
aplicativo genérico de CRUD.
24. Navegação mobile

Bottom navigation com aproximadamente quatro áreas principais:

Início

Plantas

Cuidados

Mais

E um botão de ação destacado para:

＋ Registrar

O botão de registro deve permitir:

adicionar planta;
registrar aplicação;
adicionar foto.
25. Desktop

No desktop:

navegação lateral compacta;
conteúdo centralizado;
cards maiores;
duas ou três colunas quando fizer sentido.

A arquitetura de componentes deve ser compartilhada entre mobile e desktop.

Não criar dois produtos diferentes.

26. Responsividade

Breakpoints devem ser definidos de acordo com o conteúdo e não por dispositivo específico.

Prioridades:

360–430 px;
tablet;
desktop.

Nenhuma funcionalidade essencial pode depender exclusivamente de hover.

27. Firebase

Utilizar:

Firebase Authentication

Google Login.

Firestore

Dados estruturados.

Firebase Storage

Fotografias.

Security Rules

Garantir isolamento por usuário.

Regra fundamental:

request.auth.uid == resource.data.userId

adaptada às necessidades de criação, leitura, atualização e exclusão de cada entidade.

28. Segurança

O frontend nunca deve ser considerado camada de segurança.

Toda operação sensível deve ser validada também pelas regras do Firebase.

Garantir:

isolamento entre usuários;
validação de ownership;
validação dos campos;
controle de acesso às imagens;
nenhum segredo exposto no frontend;
variáveis de ambiente para configurações.
29. Performance

Prioridades:

carregamento rápido;
imagens otimizadas;
lazy loading;
evitar consultas Firestore desnecessárias;
paginação quando histórico crescer;
cache de dados quando apropriado;
componentes leves.

Fotografias devem ser comprimidas/redimensionadas antes do armazenamento quando possível.

30. MVP — fora do escopo

Não implementar inicialmente:

aplicativo nativo;
notificações push;
modo horta;
inteligência artificial para diagnóstico de doenças;
identificação automática de espécies;
previsão climática;
sensores IoT;
integração com lojas;
marketplace;
rede social;
compartilhamento público;
recomendações automáticas complexas;
gráficos avançados;
sistema de mensuração agronômica avançada.

A arquitetura deve permitir essas expansões posteriormente, mas elas não devem contaminar o MVP.

31. Critérios de sucesso do MVP

O produto estará funcionalmente validado quando um usuário novo conseguir:

Fluxo 1

Entrar com Google → adicionar planta → adicionar foto → salvar.

Fluxo 2

Cadastrar produto → registrar aplicação → visualizar última aplicação.

Fluxo 3

Registrar aplicação → criar ciclo → visualizar próxima aplicação.

Fluxo 4

Abrir o aplicativo → identificar imediatamente aplicações atrasadas ou previstas para hoje.

Fluxo 5

Abrir uma planta → visualizar histórico → adicionar nova foto → comparar evolução.

Fluxo 6

Criar grupo → adicionar plantas → registrar aplicação para o grupo → visualizar histórico individual das plantas.

32. Critérios técnicos de qualidade

Antes do deploy:

TypeScript sem erros;
ESLint sem erros críticos;
componentes reutilizáveis;
ausência de lógica de negócio espalhada pelos componentes;
Firebase Security Rules testadas;
autenticação funcionando;
isolamento de dados validado;
layout testado em mobile;
layout testado em desktop;
estados vazios implementados;
estados de loading implementados;
estados de erro implementados;
confirmação de ações destrutivas;
tratamento de upload de imagens;
Git organizado por commits funcionais.
33. Deploy
Repositório

GitHub.

Estratégia:

main
└── desenvolvimento por branches
Deploy

Vercel conectado ao GitHub.

Fluxo:

GitHub
   ↓
Pull Request
   ↓
Preview Vercel
   ↓
Testes
   ↓
Merge
   ↓
Production
34. Estratégia de desenvolvimento

O Claude Code deve atuar como Senior Full-Stack Engineer + Product Engineer + UI Engineer, não simplesmente como gerador de componentes.

Antes de alterar código, deve:

auditar o projeto;
identificar stack existente;
identificar padrões existentes;
identificar componentes reutilizáveis;
avaliar arquitetura;
verificar dependências;
preservar funcionalidades existentes.

Depois:

Fase 1 — Foundation

arquitetura;
Firebase;
autenticação;
design system;
layout base;
navegação.

Fase 2 — Core

plantas;
grupos;
produtos;
aplicações;
ciclos.

Fase 3 — Experience

dashboard;
timeline;
fotografias;
comparação;
estados;
refinamento visual.

Fase 4 — QA

testes;
responsividade;
segurança;
performance;
acessibilidade;
revisão visual;
deploy Vercel.
35. Definição final do produto

O Minhas Plantas deve parecer um aplicativo pessoal e cuidadosamente projetado para quem cultiva plantas, e não um sistema de gestão empresarial.

A experiência ideal é:

Abrir → saber o que precisa ser feito → executar → registrar → voltar para cuidar das plantas.

O produto deve esconder a complexidade da arquitetura e deixar visível somente aquilo que ajuda o usuário a cuidar melhor das plantas.

Métrica de UX principal: tempo necessário para registrar uma aplicação.

Métrica de valor principal: capacidade do usuário de identificar rapidamente a última e a próxima adubação de cada planta.