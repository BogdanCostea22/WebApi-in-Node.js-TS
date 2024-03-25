CREATE TYPE operation_entity_type_enum AS ENUM ('CREDIT', 'DEBIT');

CREATE TABLE wallets.operation (
  id serial PRIMARY KEY,
  wallet_id uuid,
  transaction_id text,
  coins int,
  type operation_entity_type_enum NOT NULL DEFAULT 'CREDIT', -- Use the created type
  created timestamptz NOT NULL DEFAULT now()
);


ALTER TABLE wallets.operation
ADD CONSTRAINT fk_operation_wallet FOREIGN KEY (wallet_id) REFERENCES wallets.wallet(id) ON DELETE CASCADE;
