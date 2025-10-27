import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageUrlToUser implements MigrationInterface {
  name = 'AddImageUrlToUser1761498021552';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "image_url" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "image_url"`);
  }
}
