SELECT 'CREATE DATABASE ecommerce'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ecommerce')\gexec

\c ecommerce

CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  "id" BIGSERIAL PRIMARY KEY,
  "first_name" VARCHAR(70) NOT NULL,
  "last_name" VARCHAR(70) NOT NULL,
  "email" VARCHAR(100) UNIQUE NOT NULL,
  "password" VARCHAR(200),
  "address" VARCHAR(100),
  "city" VARCHAR(100),
  "postal_code" INT,
  "country_code" INT
);

CREATE TABLE IF NOT EXISTS "countries" (
  "code" INT PRIMARY KEY,
  "name" VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS "products" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "supplier_id" INT,
  "price" BIGINT NOT NULL,
  "quantity" INT NOT NULL,
  "created_at" DATE
);

CREATE TABLE IF NOT EXISTS "product_spec" (
  "product_id" INT NOT NULL,
  "data" JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS "suppliers" (
  "id" INT PRIMARY KEY,
  "country_code" INT,
  "name" VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS "products_ratings" (
  "id" BIGSERIAL PRIMARY KEY,
  "product_id" BIGINT,
  "rating" DECIMAL(3,2) NOT NULL,
  "user_id" BIGINT,
  "comment" VARCHAR(200) NOT NULL,
  "created_at" DATE
);

CREATE TABLE IF NOT EXISTS "orders" (
  "id" BIGSERIAL PRIMARY KEY,
  "user_id" BIGINT,
  "email" VARCHAR(100),
  "status" VARCHAR(10) NOT NULL,
  "created_at" DATE
);

CREATE TABLE IF NOT EXISTS "order_items" (
  "order_id" BIGINT PRIMARY KEY,
  "product_id" BIGINT,
  "quantity" INT
);

CREATE TABLE IF NOT EXISTS "order_info" (
  "order_id" BIGINT NOT NULL,
  "first_name" VARCHAR(70) NOT NULL,
  "last_name" VARCHAR(70) NOT NULL,
  "address" VARCHAR(100) NOT NULL,
  "city" VARCHAR(100) NOT NULL,
  "postal_code" INT NOT NULL,
  "country_code" INT NOT NULL
);

CREATE TABLE IF NOT EXISTS "cart" (
  "id" VARCHAR(14) NOT NULL UNIQUE,
  "product_id" INT NOT NULL,
  "count" INT NOT NULL
);

ALTER TABLE "users" ADD FOREIGN KEY ("country_code") REFERENCES "countries" ("code") ON DELETE CASCADE;

ALTER TABLE "products" ADD FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id");

ALTER TABLE "product_spec" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "suppliers" ADD FOREIGN KEY ("country_code") REFERENCES "countries" ("code");

ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id") ON DELETE CASCADE;

ALTER TABLE "order_items" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "order_info" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id") ON DELETE CASCADE;

ALTER TABLE "products_ratings" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "products_ratings" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

CREATE OR REPLACE FUNCTION trigger_set_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_date ON products;
CREATE TRIGGER set_date
BEFORE INSERT ON products
FOR ROW
EXECUTE PROCEDURE trigger_set_date();

DROP TRIGGER IF EXISTS set_date ON orders;
CREATE TRIGGER set_date
BEFORE INSERT ON orders
FOR ROW
EXECUTE PROCEDURE trigger_set_date();

DROP TRIGGER IF EXISTS set_date ON products_ratings;
CREATE TRIGGER set_date
BEFORE INSERT ON products_ratings
FOR ROW
EXECUTE PROCEDURE trigger_set_date();

CREATE INDEX t_gist ON products USING gist(name gist_trgm_ops);

DROP ROLE IF EXISTS webapp;
CREATE ROLE webapp PASSWORD 'supersecretpassword' LOGIN;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO webapp;
GRANT INSERT ON ALL TABLES IN SCHEMA public TO webapp;
GRANT DELETE ON TABLE cart TO webapp;
GRANT UPDATE ON ALL TABLES IN SCHEMA public TO webapp;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO webapp;
