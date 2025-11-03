import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhoneToCandidateEntity implements MigrationInterface {
  name = 'AddPhoneToCandidateEntity1761514568997'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "candidates" ADD "phone" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "candidates" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying NOT NULL`);
  }
}
