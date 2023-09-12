/* eslint-disable indent */
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export abstract class BaseEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @CreateDateColumn({
    name: "created_date",
    type: "timestamp",
    unique: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdDate: Date;

  @UpdateDateColumn({ name: "updated_date", type: "timestamp", unique: false })
  updatedDate: Date;

  @DeleteDateColumn({
    name: "deleted_date",
    type: "timestamp",
    unique: false,
    nullable: true,
  })
  deletedDate: Date | null;

  @Column({ name: "synced", type: "boolean", unique: false, default: false })
  synced: boolean;
}
