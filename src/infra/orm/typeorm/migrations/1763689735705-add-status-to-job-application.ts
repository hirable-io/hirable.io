import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusToJobApplication implements MigrationInterface {
    name = 'AddStatusToJobApplication1763689735705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_applications" ADD "status" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_applications" DROP COLUMN "status"`);
    }

}
