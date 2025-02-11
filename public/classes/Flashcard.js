export class Flashcard {
    constructor(pergunta, resposta) {
      this._pergunta = pergunta;
      this._resposta = resposta;
      this._facilidade = 2.5; // Facilidade inicial
      this._intervalo = 1; // Intervalo inicial (1 dia)
      this._repeticoes = 0;
      this._proximaRevisao = new Date();
    }
  
    get pergunta() {
      return this._pergunta;
    }
  
    set pergunta(novaPergunta) {
      if (novaPergunta && novaPergunta.trim() !== "") {
        this._pergunta = novaPergunta;
      } else {
        console.error("A pergunta não pode ser vazia.");
      }
    }
  
    get resposta() {
      return this._resposta;
    }
  
    set resposta(novaResposta) {
      if (novaResposta && novaResposta.trim() !== "") {
        this._resposta = novaResposta;
      } else {
        console.error("A resposta não pode ser vazia.");
      }
    }
  
    get facilidade() {
      return this._facilidade;
    }
  
    set facilidade(novaFacilidade) {
      if (novaFacilidade >= 1.3 && novaFacilidade <= 5) {
        this._facilidade = novaFacilidade;
      } else {
        console.error("Facilidade deve estar entre 1.3 e 5.");
      }
    }

    get intervalo() {
      return this._intervalo;
    }
  
    set intervalo(novoIntervalo) {
      if (novoIntervalo >= 1) {
        this._intervalo = novoIntervalo;
      } else {
        console.error("O intervalo deve ser maior ou igual a 1.");
      }
    }
  
    get repeticoes() {
      return this._repeticoes;
    }
  
    set repeticoes(novoNumeroDeRepeticoes) {
      if (novoNumeroDeRepeticoes >= 0) {
        this._repeticoes = novoNumeroDeRepeticoes;
      } else {
        console.error("O número de repetições não pode ser negativo.");
      }
    }
  
    get proximaRevisao() {
      return this._proximaRevisao;
    }
  
    set proximaRevisao(novaData) {
      if (novaData instanceof Date) {
        this._proximaRevisao = novaData;
      } else {
        console.error("A data da próxima revisão deve ser um objeto Date.");
      }
    }
  
    atualizarRevisao(avaliacao) {
      // Avaliação de 0-5, sendo 0 "não lembro" e 5 "lembrei perfeitamente"
      if (avaliacao < 3) {
        this.repeticoes = 0;
        this.intervalo = 1;
      } else {
        this.repeticoes++;
        this.intervalo = this.intervalo * this.facilidade;
      }
  
      // Atualizando a facilidade do flashcard
      this.facilidade += 0.1 - (5 - avaliacao) * (0.08 + (5 - avaliacao) * 0.02);
      if (this.facilidade < 1.3) {
        this.facilidade = 1.3; // Evitar que a facilidade fique muito baixa
      }
  
      let dataProximaRevisao = new Date();
      dataProximaRevisao.setDate(dataProximaRevisao.getDate() + this.intervalo);
      this.proximaRevisao = dataProximaRevisao;
    }
  }
