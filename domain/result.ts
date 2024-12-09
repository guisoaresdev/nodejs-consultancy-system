/**
 * Classe que representa o resultado de uma operação
 */
class Result<T> {
  /**
   * Resultado em caso de sucesso
   */
  #value: T | null;

  /**
   * Lista de erros em caso de fracasso
   */
  #errors: string[] | null;

  private constructor(value: T | null, errors: string[] | null) {
    this.#value = value;
    this.#errors = errors;
  }

  /**
   * Verifica se o resultado foi um sucesso
   */
  get isSuccess(): boolean {
    return this.#value !== null;
  }

  /**
   * Verifica se o resultado foi um fracasso
   */
  get isFailure(): boolean {
    return this.#errors !== null;
  }

  /**
   * Retorna o valor em caso de sucesso
   */
  get value(): T {
    if (this.#value === null) {
      throw new Error(
        "Não é possível acessar o valor de um resultado com falha.",
      );
    }
    return this.#value;
  }

  get errors(): string[] {
    if (this.#errors === null) {
      throw new Error(
        "Não é possível acessar erros de um resultado com sucesso.",
      );
    }
    return this.#errors || [];
  }

  /**
   * Cria o objeto em caso de sucesso
   *
   * @param value Valor do tipo T
   * @returns Objeto Result
   */
  static success<T>(value: T): Result<T> {
    return new Result(value, null);
  }

  /**
   * Cria o objeto em caso de fracasso
   *
   * @param errors Lista de erros
   * @returns Objeto Result
   */
  static failure<T>(errors: string[]): Result<T> {
    return new Result(null, errors);
  }
}

export default Result;
