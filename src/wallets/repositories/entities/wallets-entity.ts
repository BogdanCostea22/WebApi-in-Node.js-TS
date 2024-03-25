import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
} from "typeorm";

@Entity({ name: "wallets.wallet" })
export class WalletEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  version: number;

  @Column()
  coins: number;
}
