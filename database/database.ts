import { Sequelize, DataTypes } from "sequelize";
import dbConfig from "./config";
import Consulta from "../domain/consulta";
import Paciente from "../domain/paciente";
import { seedConsultas } from "../seeders/insere.consultas";

class Db {
  private sequelize!: Sequelize;

  /**
   * Inicializa o BD
   *
   * @returns {Promise<boolean>} True se o BD está acessível, False caso contrário
   */
  async init(): Promise<boolean> {
    try {
      // Configuração do Sequelize
      this.sequelize = new Sequelize(
        dbConfig.database,
        dbConfig.username,
        dbConfig.password,
        {
          host: dbConfig.host,
          dialect: dbConfig.dialect,
          logging: false,
        },
      );

      // Testa a conexão
      await this.sequelize.authenticate();
      console.log("Conexão com o banco de dados foi bem-sucedida.");

      Paciente.initialize(this.getSequelize());
      Consulta.initialize(this.getSequelize());

      Paciente.hasMany(Consulta, {
        foreignKey: {
          name: "idPaciente",
          type: DataTypes.UUID,
        },
        as: "consultas",
      });

      Consulta.belongsTo(Paciente, {
        foreignKey: {
          name: "idPaciente",
          type: DataTypes.UUID,
        },
        as: "paciente",
      });

      await this.sequelize.sync({ force: false });
      console.log("Modelos sincronizados com o banco de dados.");

      return true;
    } catch (error) {
      console.error("Erro ao conectar ao banco de dados:", error);
      return false;
    }
  }

  /**
   * Getter para acessar a instância do Sequelize
   *
   * @returns {Sequelize} A instância do Sequelize
   */
  getSequelize(): Sequelize {
    if (!this.sequelize) {
      throw new Error(
        "Sequelize não foi inicializado. Certifique-se de chamar init() primeiro.",
      );
    }
    return this.sequelize;
  }
}

const db = new Db();

export default db;
