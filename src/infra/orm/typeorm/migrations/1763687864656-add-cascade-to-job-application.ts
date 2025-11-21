import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeToJobApplication implements MigrationInterface {
  name = 'AddCascadeToJobApplication1763687864656'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "job_applications" DROP CONSTRAINT "FK_6ed185c3d4417cc1f5ec3f28e5d"`);
    await queryRunner.query(`ALTER TABLE "job_applications" DROP CONSTRAINT "FK_3366b15d34d6b7e014743373d0b"`);
    await queryRunner.query(`ALTER TABLE "job_applications" ADD CONSTRAINT "FK_6ed185c3d4417cc1f5ec3f28e5d" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "job_applications" ADD CONSTRAINT "FK_3366b15d34d6b7e014743373d0b" FOREIGN KEY ("vacancy_id") REFERENCES "vacancies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "job_applications" DROP CONSTRAINT "FK_3366b15d34d6b7e014743373d0b"`);
    await queryRunner.query(`ALTER TABLE "job_applications" DROP CONSTRAINT "FK_6ed185c3d4417cc1f5ec3f28e5d"`);
    await queryRunner.query(`ALTER TABLE "job_applications" ADD CONSTRAINT "FK_3366b15d34d6b7e014743373d0b" FOREIGN KEY ("vacancy_id") REFERENCES "vacancies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "job_applications" ADD CONSTRAINT "FK_6ed185c3d4417cc1f5ec3f28e5d" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }
}
