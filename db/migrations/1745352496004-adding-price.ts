import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePriceColumnXXXX implements MigrationInterface {
  name = 'UpdatePriceColumnXXXX';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "food_item"
      ALTER COLUMN "price" TYPE decimal(10,2) USING "price"::decimal,
      ALTER COLUMN "price" SET NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "food_item"
      ALTER COLUMN "price" TYPE integer USING "price"::integer;
    `);
  }
}
