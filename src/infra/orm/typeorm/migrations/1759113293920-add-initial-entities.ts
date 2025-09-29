import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInitialEntities implements MigrationInterface {
    name = 'AddInitialEntities1759113293920';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "phone" character varying NOT NULL, "role" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "companies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "document" character varying NOT NULL, "contact_name" character varying NOT NULL, "phone" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "UQ_13496c970093729e7ab04eb7da4" UNIQUE ("document"), CONSTRAINT "REL_ee0839cba07cb0c52602021ad4" UNIQUE ("user_id"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "candidates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "full_name" character varying NOT NULL, "bio" text NOT NULL, "resume_url" character varying, "user_id" uuid NOT NULL, CONSTRAINT "REL_94a5fe85e7f5bd0221fa7d6f19" UNIQUE ("user_id"), CONSTRAINT "PK_140681296bf033ab1eb95288abb" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "candidates_tags" ("candidate_id" uuid NOT NULL, "tag_id" integer NOT NULL, CONSTRAINT "PK_4cad4820c4e81d8ec1d89084e0f" PRIMARY KEY ("candidate_id", "tag_id"))`);
    await queryRunner.query(`CREATE INDEX "IDX_9ef4d091e648e076eec7660595" ON "candidates_tags" ("candidate_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_e99eb45159f04366f0accd4a49" ON "candidates_tags" ("tag_id") `);
    await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "FK_ee0839cba07cb0c52602021ad4b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "candidates" ADD CONSTRAINT "FK_94a5fe85e7f5bd0221fa7d6f19c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "candidates_tags" ADD CONSTRAINT "FK_9ef4d091e648e076eec76605952" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "candidates_tags" ADD CONSTRAINT "FK_e99eb45159f04366f0accd4a494" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "candidates_tags" DROP CONSTRAINT "FK_e99eb45159f04366f0accd4a494"`);
    await queryRunner.query(`ALTER TABLE "candidates_tags" DROP CONSTRAINT "FK_9ef4d091e648e076eec76605952"`);
    await queryRunner.query(`ALTER TABLE "candidates" DROP CONSTRAINT "FK_94a5fe85e7f5bd0221fa7d6f19c"`);
    await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "FK_ee0839cba07cb0c52602021ad4b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e99eb45159f04366f0accd4a49"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9ef4d091e648e076eec7660595"`);
    await queryRunner.query(`DROP TABLE "candidates_tags"`);
    await queryRunner.query(`DROP TABLE "tags"`);
    await queryRunner.query(`DROP TABLE "candidates"`);
    await queryRunner.query(`DROP TABLE "companies"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
