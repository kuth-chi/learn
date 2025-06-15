import { pgTable, integer, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 125}).notNull(),
  age: integer("age").notNull(),
  email: varchar("email", { length: 75}).notNull().unique(),
});