import {email, z} from "zod"

export const SignupSchema=z.object({
    email:z.string(),
    password:z.string(),
    name:z.string()
})

export const SigninSchema=z.object({
    email:z.string(),
    password:z.string()
})

export const CreateRoom=z.object({
    slug:z.string().min(3).max(20)
})