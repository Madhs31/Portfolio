# Portfolio
## Configuração do Banco de Dados

Para configurar o banco de dados MySQL para este projeto, siga os passos abaixo:

1. Abra o **MySQL Workbench** e crie uma nova conexão com o nome **Portfolio**.

2. Conecte-se à essa conexão e execute o seguinte código SQL para criar o banco de dados e a tabela:

```sql
CREATE DATABASE IF NOT EXISTS portfolio;
USE portfolio;

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  tech VARCHAR(255),
  description TEXT,
  link VARCHAR(255)
);

-- Comando opcional para visualizar os dados da tabela:
SELECT * FROM projects;
