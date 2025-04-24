import { DataSource } from "typeorm";
import { User } from "./user/entities/user-entity"; // Adjust this import according to where your entities are located

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false, // Do not use synchronize in production!
  entities: [User], // List of entities that TypeORM should be aware of
  migrations: ["src/migrations/*.ts"], // Path to migrations
});
