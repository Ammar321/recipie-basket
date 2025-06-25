import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingPriceToFoodItem1750871208885 implements MigrationInterface {
    name = 'AddingPriceToFoodItem1750871208885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "food_item" ADD "price" integer DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "food_item" DROP COLUMN "price"`);
    }

}
