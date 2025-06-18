import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as allSchema from "@/db/schema";

export const auth = betterAuth({        
    // For Social Authentication, uncomment and configure the providers you want to use
    socialProviders: { 
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        }, 
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        },
    },
    // For Email and Password Authentication
    emailAndPassword: {  
        enabled: true
    },
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: {
            ...allSchema
        },

    })
})