const { readFileSync } = require('fs');

class ServicoCalculoFatura {
  calcularCredito(pecas, apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (pecas[apre.id].tipo === "comedia") 
      creditos += Math.floor(apre.audiencia / 5);
    return creditos;   
  }

  calcularTotalCreditos(pecas, apresentacoes) {
    let totalCreditos = 0;
    for (let apre of apresentacoes) {
      totalCreditos += this.calcularCredito(pecas, apre);
    }
    return totalCreditos;
  }

  calcularTotalApresentacao(pecas, apre) {
    let total = 0;
    switch (pecas[apre.id].tipo) {
      case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) {
          total += 1000 * (apre.audiencia - 30);
        }
        break;
      case "comedia":
        total = 30000;
        if (apre.audiencia > 20) {
          total += 10000 + 500 * (apre.audiencia - 20);
        }
        total += 300 * apre.audiencia;
        break;
      default:
        throw new Error(`Peça desconhecida: ${pecas[apre.id].tipo}`);
    }
    return total;
  }

  calcularTotalFatura(pecas, apresentacoes) {
    let totalFatura = 0;
    for (let apre of apresentacoes) {
      totalFatura += this.calcularTotalApresentacao(pecas, apre);
    }
    return totalFatura;
  }
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(valor / 100);
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));

function getPeca(apre, pecas) {
  return pecas[apre.id];
}

const servicoCalculoFatura = new ServicoCalculoFatura();
const totalCreditos = servicoCalculoFatura.calcularTotalCreditos(pecas, faturas.apresentacoes);
const totalFatura = servicoCalculoFatura.calcularTotalFatura(pecas, faturas.apresentacoes);

function gerarFaturaStr(fatura, pecas) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${getPeca(apre, pecas).nome}: ${formatarMoeda(
      servicoCalculoFatura.calcularTotalApresentacao(pecas, apre)
    )} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(totalFatura)}\n`;
  faturaStr += `Créditos acumulados: ${totalCreditos} \n`;
  return faturaStr;
}

const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);

// Função HTML

function gerarFaturaHTML(fatura, pecas) {
  let faturaHTML = "<html>\n";
  faturaHTML += "<p>Fatura " + fatura.cliente + "</p>\n<ul>\n";

  for (let apre of fatura.apresentacoes) {
    const peca = getPeca(apre, pecas);
    const total = servicoCalculoFatura.calcularTotalApresentacao(pecas, apre);

    faturaHTML += `<li> ${peca.nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos) </li>\n`;
  }

  faturaHTML += "</ul>\n";
  faturaHTML += "<p>Valor total: " + formatarMoeda(totalFatura) + "</p>\n";
  faturaHTML += "<p>Créditos acumulados: " + totalCreditos + "</p>\n";
  faturaHTML += "</html>";

  return faturaHTML;
}

const faturaHTML = gerarFaturaHTML(faturas, pecas);
console.log(faturaHTML);
