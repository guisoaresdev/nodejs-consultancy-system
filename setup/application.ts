import db from "../database/database";
import ConsultorioController from "../controllers/consultorio.controller";
import NewConsultorioView from "../views/new.consultorio.view";
import PromptSync from "prompt-sync";

class Application {
  private prompt: any;
  private consultorioController: ConsultorioController;
  private consultorioView: NewConsultorioView;

  constructor() {
    this.prompt = PromptSync();
    this.consultorioController = new ConsultorioController();
    this.consultorioView = new NewConsultorioView(
      this.prompt,
      this.consultorioController,
    );
  }

  async init() {
    console.log("Inicializando o sistema...");

    const dbInitialized = await db.init();
    if (!dbInitialized) {
      console.error(
        "Erro ao inicializar o banco de dados. Encerrando a aplicação.",
      );
      process.exit(1);
    }

    try {
      await this.consultorioView.menuPrincipal();
    } catch (error) {
      console.error("Erro inesperado durante a execução:", error);
      process.exit(1);
    }
  }
}

export default Application;