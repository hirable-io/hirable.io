import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVacancyEntity implements MigrationInterface {
  name = 'CreateVacancyEntity1761528679375'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "vacancies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" uuid NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "location" character varying NOT NULL, "minimum_salary_value" integer NOT NULL, "maximum_salary_value" integer NOT NULL, "status" character varying NOT NULL, "modality" character varying NOT NULL, CONSTRAINT "REL_053198d00d977357314f47d1cf" UNIQUE ("company_id"), CONSTRAINT "PK_3b45154a366568190cc15be2906" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "vacancy_tags" ("vacancy_id" uuid NOT NULL, "tag_id" integer NOT NULL, CONSTRAINT "PK_cdd42d30a5183c376187bd03e58" PRIMARY KEY ("vacancy_id", "tag_id"))`);
    await queryRunner.query(`CREATE INDEX "IDX_76bb000d21eb4fffe647fa8371" ON "vacancy_tags" ("vacancy_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_ca423a6687c708314517e6c09c" ON "vacancy_tags" ("tag_id") `);
    await queryRunner.query(`ALTER TABLE "vacancies" ADD CONSTRAINT "FK_053198d00d977357314f47d1cf2" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "vacancy_tags" ADD CONSTRAINT "FK_76bb000d21eb4fffe647fa8371e" FOREIGN KEY ("vacancy_id") REFERENCES "vacancies"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "vacancy_tags" ADD CONSTRAINT "FK_ca423a6687c708314517e6c09cf" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vacancy_tags" DROP CONSTRAINT "FK_ca423a6687c708314517e6c09cf"`);
    await queryRunner.query(`ALTER TABLE "vacancy_tags" DROP CONSTRAINT "FK_76bb000d21eb4fffe647fa8371e"`);
    await queryRunner.query(`ALTER TABLE "vacancies" DROP CONSTRAINT "FK_053198d00d977357314f47d1cf2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ca423a6687c708314517e6c09c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_76bb000d21eb4fffe647fa8371"`);
    await queryRunner.query(`DROP TABLE "vacancy_tags"`);
    await queryRunner.query(`DROP TABLE "vacancies"`);
  }
}
