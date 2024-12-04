import Agenda from "../classes/agenda.ts";
import Paciente from "../classes/paciente.ts";
import Consultorio from "../classes/consultorio.ts";
import ConsultorioView from "../views/consultorio.view.ts";
import PromptSync from "prompt-sync";

export default class Application {
  private consultorio: Consultorio;
  private consultorioView: ConsultorioView;

  constructor() {
    const agenda: Agenda = new Agenda();
    const pacientes: Paciente[] = [];
    const prompt = PromptSync();
    this.consultorio = new Consultorio(agenda, pacientes);
    this.consultorioView = new ConsultorioView(prompt, this.consultorio);
  }

  getConsultorioView() {
    return this.consultorioView;
  }
}
