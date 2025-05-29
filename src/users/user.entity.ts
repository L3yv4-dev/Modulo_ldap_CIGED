import {CreateDateColumn, Column, PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @CreateDateColumn()
  createdAt: Date;
}
