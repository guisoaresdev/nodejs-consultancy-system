# nodejs-consultancy-system

Sistema de consultório odontológico feito em Node.js com persistência de dados usando um container docker com PostgreSQL.

O sistema faz parte de um dos desafios da iUUL durante os processos premilinares à residência de software.

## Setup

### Instale todas as dependências
```
npm install
```

### Instancie o banco de dados
Nessa aplicação estou utilizando Docker pra instanciar um banco de dados postgreSQL, então utilize o comando:
```
docker compose up -d
```

### Configure as variáveis de conexão com o banco
Copie o arquivo .env.example
```
cp .env.example .env
```

Configure a conexão inserindo as variáveis expostas no arquivo docker-compose.yml
```
database=consultorio
username=postgres
password=12345
host=localhost
dialect=postgres
```

## Rodando a aplicação

```
npm start
```
