import { MigrationInterface, QueryRunner } from "typeorm";

export class FoddSchema1748889932682 implements MigrationInterface {
    name = 'FoddSchema1748889932682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "food_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "food_name" character varying NOT NULL, "food_description" text NOT NULL, "food_images" text NOT NULL, "food_recipe" text NOT NULL, "prep_time_minutes" integer NOT NULL, "servings" integer NOT NULL, "cuisine_type" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_057940b0225785ec693de562cf4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_title" character varying NOT NULL, "product_description" text NOT NULL, "product_price" integer NOT NULL, "product_stock" integer NOT NULL, "product_images" text NOT NULL, "category_id" integer NOT NULL, "product_brand" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "food_ingredient" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ingredient_quantity" integer NOT NULL, "ingredient_unit" character varying NOT NULL, "foodItemId" uuid, "productId" uuid, CONSTRAINT "PK_968daeaf2cb7f0c8c868bbd7080" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE IF EXISTS "food_ingredient" ADD CONSTRAINT "FK_c0ffa2c5175543dfc2c1cc6b124" FOREIGN KEY ("foodItemId") REFERENCES "food_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE IF EXISTS "food_ingredient" ADD CONSTRAINT "FK_5f7886150f579eab34b544f61e3" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE IF EXISTS "food_ingredient" DROP CONSTRAINT "FK_5f7886150f579eab34b544f61e3"`);
        await queryRunner.query(`ALTER TABLE IF EXISTS "food_ingredient" DROP CONSTRAINT "FK_c0ffa2c5175543dfc2c1cc6b124"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "food_ingredient"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "product"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "food_item"`);
    }

}
