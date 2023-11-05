const { readFileSync } = require('fs');

function calcularTotalFatura(fatura, pecas) {
  let totalFatura = 0;
  for (let apre of fatura.apresentacoes) {
    totalFatura += calcularTotalApresentacao(apre, getPeca(apre, pecas));
  }
  return totalFatura;
}

function calcularTotalCreditos(fatura) {
  let creditos = 0;
  for (let apre of fatura.apresentacoes) {
    creditos += Math.max(apre.audiencia - 30, 0);
    if (getPeca(apre, pecas).tipo === "comedia") creditos += Math.floor(apre.audiencia / 5);
  }
  return creditos;
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
