import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as allSchema from "@/db/schema";

export const auth = betterAuth({        
    emailAndPassword: {  
        enabled: true
    },
    // For Social Authentication, uncomment and configure the providers you want to use
    // socialProviders: { 
    //     // github: { 
    //     // clientId: process.env.GITHUB_CLIENT_ID as string, 
    //     // clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
    //     // }, 
    // },
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: {
            ...allSchema
        },

    })
})