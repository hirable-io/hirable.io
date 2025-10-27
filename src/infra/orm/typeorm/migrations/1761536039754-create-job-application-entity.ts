import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateJobApplicationEntity implements MigrationInterface {
name = 'CreateJobApplicationEntity1761536039754';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "job_applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "candidate_id" uuid NOT NULL, "vacancy_id" uuid NOT NULL, "application_date" TIMESTAMP NOT NULL, CONSTRAINT "PK_c56a5e86707d0f0df18fa111280" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "job_applications" ADD CONSTRAINT "FK_6ed185c3d4417cc1f5ec3f28e5d" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "job_applications" ADD CONSTRAINT "FK_3366b15d34d6b7e014743373d0b" FOREIGN KEY ("vacancy_id") REFERENCES "vacancies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "job_applications" DROP CONSTRAINT "FK_3366b15d34d6b7e014743373d0b"`);
    await queryRunner.query(`ALTER TABLE "job_applications" DROP CONSTRAINT "FK_6ed185c3d4417cc1f5ec3f28e5d"`);
    await queryRunner.query(`DROP TABLE "job_applications"`);
  }
}
