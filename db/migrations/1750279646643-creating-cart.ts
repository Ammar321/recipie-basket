import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatingCart1750279646643 implements MigrationInterface {
    name = 'CreatingCart1750279646643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "cart" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "foodItemId" uuid, CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE IF EXISTS "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE IF EXISTS "cart" ADD CONSTRAINT "FK_85f897c506a5845ccef451f5107" FOREIGN KEY ("foodItemId") REFERENCES "food_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE IF EXISTS"cart" DROP CONSTRAINT "FK_85f897c506a5845ccef451f5107"`);
        await queryRunner.query(`ALTER TABLE IF EXISTS"cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "cart"`);
    }

}
