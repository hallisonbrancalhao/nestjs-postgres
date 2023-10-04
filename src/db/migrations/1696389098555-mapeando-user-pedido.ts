import { MigrationInterface, QueryRunner } from "typeorm";

export class mapeandoUserPedido1696389098555 implements MigrationInterface {
    name = 'mapeandoUserPedido1696389098555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pedido" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "valor_total" integer NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "usuarioId" uuid, CONSTRAINT "PK_af8d8b3d07fae559c37f56b3f43" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pedido" ADD CONSTRAINT "FK_440272d326db467ee25802678e8" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedido" DROP CONSTRAINT "FK_440272d326db467ee25802678e8"`);
        await queryRunner.query(`DROP TABLE "pedido"`);
    }

}
