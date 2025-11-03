import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateVacancyRelations implements MigrationInterface {
  name = 'UpdateVacancyRelations1761533442076';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vacancies" DROP CONSTRAINT "FK_053198d00d977357314f47d1cf2"`);
    await queryRunner.query(`ALTER TABLE "vacancies" DROP CONSTRAINT "REL_053198d00d977357314f47d1cf"`);
    await queryRunner.query(`ALTER TABLE "vacancies" ADD CONSTRAINT "FK_053198d00d977357314f47d1cf2" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vacancies" DROP CONSTRAINT "FK_053198d00d977357314f47d1cf2"`);
    await queryRunner.query(`ALTER TABLE "vacancies" ADD CONSTRAINT "REL_053198d00d977357314f47d1cf" UNIQUE ("company_id")`);
    await queryRunner.query(`ALTER TABLE "vacancies" ADD CONSTRAINT "FK_053198d00d977357314f47d1cf2" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }
}
