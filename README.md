# Nosso Cafofo - API
O projeto "Nosso Cafofo" visa facilitar e aprimorar o gerenciamento de contas em repúblicas estudantis, proporcionando uma solução eficiente e intuitiva para os residentes. Esta API será a espinha dorsal do sistema, oferecendo funcionalidades cruciais para o controle financeiro e organizacional das repúblicas, utilizada para interagir com o banco de dados (persistência) e obter/atualizar as informações necessárias.

## Tecnologias Utilizadas
A API do "Nosso Cafofo" é desenvolvida seguindo padrões RESTful, garantindo uma comunicação consistente e previsível entre o frontend e o backend. 

### Express
A API foi construída utilizando o framework web Node.js Express. O Express é conhecido por ser minimalista e flexível, oferecendo uma abordagem descomplicada para a construção de aplicativos web e APIs RESTful. Sua simplicidade o torna uma escolha popular para o desenvolvimento rápido e eficiente de servidores.

### TypeScript
O TypeScript foi a linguagem escolhida para o desenvolvimento do backend. Com a tipagem estática proporcionada pelo TypeScript, ganhamos benefícios como detecção de erros em tempo de compilação, melhor autocompletar durante o desenvolvimento e código mais seguro. 

### Banco de Dados
O PostgreSQL foi escolhido como banco de dados relacional. O PostgreSQL é uma escolha robusta e confiável para aplicações que demandam integridade de dados, suporte a transações complexas e flexibilidade no esquema de dados, e foi utilizado junto ao ORM Knex. O Knex é um construtor de consultas SQL para Node.js que simplifica a comunicação com o banco de dados. Ele fornece uma camada de abstração para a execução de consultas SQL e gerenciamento de esquemas, tornando o acesso ao banco de dados mais fácil e intuitivo.

### Swagger
A documentação da API foi facilitada com o uso do Swagger, que é uma ferramenta que permite a criação, documentação e teste de APIs de forma eficiente. Com a documentação gerada automaticamente, os desenvolvedores podem entender rapidamente os endpoints disponíveis, os parâmetros necessários e as respostas esperadas, facilitando a integração e o desenvolvimento de clientes front-end.

A combinação de Express, Knex, PostgreSQL e Swagger proporciona uma base sólida para o desenvolvimento da API do "Nosso Cafofo", oferecendo eficiência no acesso ao banco de dados, documentação clara e uma estrutura modular que facilita a manutenção e expansão do sistema.

### Front-end 
O código-fonte do projeto front-end que utiliza desta API está presente em outro repositório na plataforma do GitHub, disponínel em [Nosso Cafofo - Front-end](https://github.com/VJEFERSON/nosso-cafofo-interface).

## Funcionalidades do projeto

### Cadastro de Moradores
Permitirá o registro fácil e seguro de informações pessoais dos moradores da república, incluindo nome, contato e dados de emergência.

### Controle de Despesas
Possibilitará o registro e monitoramento das despesas compartilhadas, como aluguel, contas de serviços públicos e compras coletivas.

### Divisão de Despesas
Automatizará a divisão justa das despesas entre os moradores, considerando variáveis como área ocupada, consumo individual e outros critérios pré-definidos.

### Histórico Financeiro
Manterá um registro detalhado das transações financeiras, permitindo aos moradores visualizar seu histórico e acompanhar as mudanças ao longo do tempo.

### Notificações e Lembretes
Enviará notificações automáticas sobre datas de vencimento, eventos importantes e outras informações relevantes para garantir uma comunicação eficiente.

### Geração de Relatórios
Oferecerá a capacidade de gerar relatórios personalizados sobre as despesas, permitindo uma análise aprofundada das finanças da república.

## Inicialização

```bash
git clone https://github.com/vjeferson/nosso-cafofo-api.git
cd nosso-cafofo-api
npm install
npm start:dev
```

`npm start:dev` inicia o servidor na porta 3001.
Por padrão, a aplicação está posta para ser executada na porta 3001. Para alterar basta trocar o valor da propriedade de PORT presente no arquivo de environment do projeto:

```bash
# Isso inicia o servidor na porta 3001,
# mas você pode usar qualquer porta que desejar
PORT = 3001
```

## Status do projeto
O projeto encontra-se concluído, estando na sua versão 2.0.0.
