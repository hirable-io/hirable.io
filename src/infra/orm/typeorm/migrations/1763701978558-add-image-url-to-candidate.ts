import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageUrlToCandidate implements MigrationInterface {
    name = 'AddImageUrlToCandidate1763701978558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidates" ADD "image_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidates" DROP COLUMN "image_url"`);
    }

}
