import { ObjectType, Field, ID, HideField } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { hashPasswordTransform } from '../../common/helpers/crypto';

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @HideField()
  @Column({
    transformer: hashPasswordTransform,
  })
  password: string;
}
