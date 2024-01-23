-- drop database pdv;

create database pdv;

create table
    usuarios (
        id serial primary key,
        nome text not null,
        email text unique not null,
        senha text not null
    );

create table
    categorias (
        id serial primary key,
        descricao text not null
);

insert into categorias (descricao) 
values ('Informática'), ('Celulares'), ('Beleza e Perfumaria'), ('Mercado'),
 ('Livros e Papelaria'),('Brinquedos'),('Moda'),('Bebê'),('Games');

CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  quantidade_estoque INT NOT NULL,
  valor INT NOT NULL,
  categoria_id INT REFERENCES categorias(id)
);

CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  cpf VARCHAR(11) NOT NULL UNIQUE,
  cep VARCHAR(8) NOT NULL,
  rua VARCHAR(255) NOT NULL,
  numero VARCHAR(10) NOT NULL,
  bairro VARCHAR(255) NOT NULL,
  cidade VARCHAR(255) NOT NULL,
  estado VARCHAR(2) NOT NULL
);

CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  cliente_id INT REFERENCES clientes(id),
  observacao TEXT,
  valor_total INT NOT NULL
);

CREATE TABLE pedido_produtos (
  id SERIAL PRIMARY KEY,
  pedido_id INT REFERENCES pedidos(id),
  produto_id INT REFERENCES produtos(id),
  quantidade_produto INT,
  valor_produto INT NOT NULL
);

ALTER TABLE produtos ADD COLUMN produto_imagem TEXT