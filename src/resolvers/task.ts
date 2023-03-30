import { Query, Resolver, Mutation, Arg, Int, InputType, Field } from 'type-graphql'
import { Task } from '../entities/Task';


@InputType()
class TaskInput {
    @Field()
    title: String
}

@InputType()
class UpdateTaskInput {
    @Field(() => Boolean, { nullable: true })
    isCompleted: boolean

    @Field(() => Int)
    id: number

}


@Resolver()
export class TaskResolver {
    @Query(() => String)
    hello(
        @Arg('id', () => Int)
        id: number
    ): any {
        try {
            if (id == 1) return '786'
            throw new Error('error und keto')
        } catch (error: any) {
            throw new Error('error')
        }

    }
    @Query(() => [Task])
    async tasks(): Promise<Task[]> {
        return await Task.find({})
    }

    @Query(() => Task, { nullable: true })
    async task(
        @Arg("id", () => Int)
        id: number
    ): Promise<Task | null> {
        return await Task.findOne({
            where: {
                id
            }
        })
    }

    @Mutation(() => Task)
    async createTask(
        @Arg('title', () => String)
        title: string
    ): Promise<Task> {
        return await Task.create({ title, isCompleted: false }).save();
    }

    @Mutation(() => Boolean)
    deleteTask(
        @Arg("id", () => Int)
        id: number
    ): Boolean {
        try {
            Task.delete({ id })
            return true
        } catch {
            return false
        }
    }

    @Mutation(() => Boolean, { nullable: true })
    updateTask(
        @Arg("id", () => Int)
        id: number,

        @Arg("isCompleted", () => Boolean)
        isCompleted: boolean
    ): boolean | null {
        const task = Task.findOne({ where: { id } });

        if (!task) return null

        try {
            Task.update({ id }, { isCompleted })
            return true
        } catch (error) {
            return false
        }
    }
}