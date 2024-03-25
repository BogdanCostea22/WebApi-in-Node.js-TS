import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
} from "typeorm";

export enum OperationType {
  DEBIT = "DEBIT",
  CREDIT = "CREDIT",
}

@Entity({ name: "wallets.operation" })
export class OperationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: "wallet_id" })
  walletId: string;

  @Column({ name: "transaction_id" })
  transactionId: string;

  @Column()
  coins: number;

  @Column({
    type: "enum",
    enum: OperationType,
    default: OperationType.CREDIT,
  })
  type: string;

  @CreateDateColumn({ name: "created", type: "timestamptz", nullable: false })
  createdAt: Date;
}
