import { Sequelize, DataTypes } from "sequelize";
import dbConfig from "./config";
import createModelConsulta from "./schemas/consulta";
import createModelPaciente from "./schemas/paciente";

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

      const Paciente = createModelPaciente(this.sequelize, DataTypes);
      // Criação dos modelos usando o método init
      const Consulta = createModelConsulta(this.sequelize, DataTypes);

      // Cria os relacionamentos
      Paciente.hasMany(Consulta, {
        foreignKey: "id_paciente",
        as: "consultas",
      });
      Consulta.belongsTo(Paciente, {
        foreignKey: "id_paciente",
        as: "paciente",
      });

      // Sincroniza os modelos com o banco de dados
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
