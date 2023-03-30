import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BaseEntity } from 'typeorm';
import bcrypt from 'bcrypt';
import { ObjectType, Int, Field } from 'type-graphql'


@Entity()
@ObjectType()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id!: string;


    @Column({ nullable: false })
    @Field(() => String)
    userName!: string;

    @Column({ unique: true, nullable: false })
    @Field(() => String)
    emailId!: string;

    @Column({ nullable: false })
    @Field(() => String)
    password!: string;

    @BeforeInsert()
    async hashUserPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async CompareUserPassword(password: string) {
        return await bcrypt.compare(password, this.password);
    }
}