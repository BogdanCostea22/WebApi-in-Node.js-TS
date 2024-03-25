CREATE TABLE IF NOT EXISTS wallets.wallet (
    id uuid not null constraint wallet_id_pk primary key not null,
    version int default 0,
    coins int default 0
);