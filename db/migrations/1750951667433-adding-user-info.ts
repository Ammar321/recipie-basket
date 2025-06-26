import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingUserInfo1750951667433 implements MigrationInterface {
    name = 'AddingUserInfo1750951667433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE IF EXISTS "user" ADD "ph_number" character varying`);
        await queryRunner.query(`ALTER TABLE IF EXISTS "user" ADD "city" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "ph_number"`);
    }

}
