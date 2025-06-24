import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatingOrders1750280000000 implements MigrationInterface {
    name = 'CreatingOrders1750280000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create orders table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "orders" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "order_number" character varying NOT NULL,
                "status" character varying NOT NULL DEFAULT 'pending',
                "total_amount" decimal(10,2) NOT NULL,
                "delivery_address" character varying,
                "special_instructions" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                CONSTRAINT "UQ_orders_order_number" UNIQUE ("order_number"),
                CONSTRAINT "PK_orders" PRIMARY KEY ("id")
            )
        `);

        // Create order_items table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "order_items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "quantity" integer NOT NULL,
                "unit_price" decimal(10,2) NOT NULL,
                "total_price" decimal(10,2) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "orderId" uuid,
                "productId" uuid,
                CONSTRAINT "PK_order_items" PRIMARY KEY ("id")
            )
        `);

        // Add foreign key constraints
        await queryRunner.query(`ALTER TABLE IF EXISTS "orders" ADD CONSTRAINT "FK_orders_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE IF EXISTS "order_items" ADD CONSTRAINT "FK_order_items_order" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE IF EXISTS "order_items" ADD CONSTRAINT "FK_order_items_product" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.query(`ALTER TABLE IF EXISTS "order_items" DROP CONSTRAINT "FK_order_items_product"`);
        await queryRunner.query(`ALTER TABLE IF EXISTS "order_items" DROP CONSTRAINT "FK_order_items_order"`);
        await queryRunner.query(`ALTER TABLE IF EXISTS "orders" DROP CONSTRAINT "FK_orders_user"`);

        // Drop tables
        await queryRunner.query(`DROP TABLE IF EXISTS "order_items"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "orders"`);
    }
} 