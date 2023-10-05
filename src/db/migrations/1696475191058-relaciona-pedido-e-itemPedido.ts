import { MigrationInterface, QueryRunner } from 'typeorm';

export class relacionaPedidoEItemPedido1696475191058
  implements MigrationInterface
{
  name = 'relacionaPedidoEItemPedido1696475191058';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "item-pedido" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantidade" integer NOT NULL, "preco-venda" integer NOT NULL, "pedidoId" uuid, CONSTRAINT "PK_1fb61bd5ceb3e3b7b82890d401c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "pedido" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "pedido" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "pedido" DROP COLUMN "deleted_at"`);
    await queryRunner.query(
      `ALTER TABLE "item-pedido" ADD CONSTRAINT "FK_efd07e75d3fe3ceddbeb2994589" FOREIGN KEY ("pedidoId") REFERENCES "pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item-pedido" DROP CONSTRAINT "FK_efd07e75d3fe3ceddbeb2994589"`,
    );
    await queryRunner.query(`ALTER TABLE "pedido" ADD "deleted_at" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "pedido" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "pedido" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`DROP TABLE "item-pedido"`);
  }
}
