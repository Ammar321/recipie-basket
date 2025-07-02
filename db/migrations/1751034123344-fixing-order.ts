import { MigrationInterface, QueryRunner } from "typeorm";

export class FixingOrder1751034123344 implements MigrationInterface {
    name = 'FixingOrder1751034123344'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop constraint only if it exists (PostgreSQL safe check)
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.table_constraints
                    WHERE constraint_name = 'FK_cdb99c05982d5191ac8465ac010'
                      AND table_name = 'order_items'
                ) THEN
                    ALTER TABLE "order_items" DROP CONSTRAINT "FK_cdb99c05982d5191ac8465ac010";
                END IF;
            END
            $$;
        `);
        await queryRunner.query(`ALTER TABLE "order_items" RENAME COLUMN "productId" TO "foodItemId"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_164ae3d037359cc3e345399aae1" FOREIGN KEY ("foodItemId") REFERENCES "food_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_164ae3d037359cc3e345399aae1"`);
        await queryRunner.query(`ALTER TABLE "order_items" RENAME COLUMN "foodItemId" TO "productId"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_cdb99c05982d5191ac8465ac010" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
