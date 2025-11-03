import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLinkedidUrlToCandidate implements MigrationInterface {
  name = 'AddLinkedidUrlToCandidate1761509910822';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "candidates" ADD "linkedin_url" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "candidates" DROP COLUMN "linkedin_url"`);
  }
}
