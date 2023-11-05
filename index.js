const { readFileSync } = require('fs');

function calcularTotalApresentacao(apre, getPeca(apre, pecas)) {
  let total = 0;
  switch (getPeca(apre).tipo) {
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
      throw new Error(`Peça desconhecida: ${getPeca(apre).tipo}`);
  }
  return total;
}

function calcularTotalFatura(fatura, pecas) {
  let totalFatura = 0;
  for (let apre of fatura.apresentacoes) {
    totalFatura += calcularTotalApresentacao(apre, getPeca(apre, pecas));
  }
 return totalFatura;
}

function calcularCredito(apre) {
  let creditos = 0;
  creditos += Math.max(apre.audiencia - 30, 0);
  if (getPeca(apre).tipo === "comedia") 
     creditos += Math.floor(apre.audiencia / 5);
  return creditos;   
}

function calcularTotalCreditos(fatura) {
  let totalCreditos = 0;

  for (let apre of fatura.apresentacoes) {
    totalCreditos += calcularCredito(apre);
  }
}

function getPeca(apre, pecas) {
  return pecas[apre.id];
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(valor / 100);
}

function gerarFaturaStr(fatura, pecas) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${getPeca(apre, pecas).nome}: ${formatarMoeda(
      calcularTotalApresentacao(apre, getPeca(apre, pecas))
    )} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura(fatura, pecas))}\n`;
  faturaStr += `Créditos acumulados: ${calcularTotalCreditos(fatura)} \n`;
  return faturaStr;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);

// Função HTML

function gerarFaturaHTML(fatura, pecas) {
  let faturaHTML = "<html>\n";
  faturaHTML += "<p>Fatura " + fatura.cliente + "</p>\n<ul>\n";

  for (let apre of fatura.apresentacoes) {
    const peca = getPeca(apre, pecas);
    const total = calcularTotalApresentacao(apre, peca);

    faturaHTML += `<li> ${peca.nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos) </li>\n`;
  }

  const valorTotal = calcularTotalFatura(fatura, pecas);
  const creditosAcumulados = calcularTotalCreditos(fatura);

  faturaHTML += "</ul>\n";
  faturaHTML += "<p>Valor total: " + formatarMoeda(valorTotal) + "</p>\n";
  faturaHTML += "<p>Créditos acumulados: " + creditosAcumulados + "</p>\n";
  faturaHTML += "</html>";

  return faturaHTML;
}

const faturaHTML = gerarFaturaHTML(faturas, pecas);
console.log(faturaHTML);
