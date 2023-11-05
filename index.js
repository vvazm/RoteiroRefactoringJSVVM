const { readFileSync } = require('fs');

function gerarFaturaStr(fatura, pecas) {
  
  // função c1
  function calcularTotalApresentacao(apre) {
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

  // função c2
  function getPeca(apresentacao) {
    return pecas[apresentacao.id];
  }

  // função c3.1
  function calcularCredito(apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (getPeca(apre).tipo === "comedia") creditos += Math.floor(apre.audiencia / 5);
    return creditos;   
  } 

  // função c3.2
  function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR",
      { style: "currency", currency: "BRL",
        minimumFractionDigits: 2 }).format(valor/100);
  }
  let totalFatura = 0;

  let faturaStr = `Fatura ${fatura.cliente}\n`;

  for (let apre of fatura.apresentacoes) {
    
    let total = calcularTotalApresentacao(apre, getPeca(apre));

    // mais uma linha da fatura
    faturaStr += `  ${getPeca(apre).nome}: ${formatarMoeda(total / 100)} (${apre.audiencia} assentos)\n`;
    totalFatura += total;
  }

  faturaStr += `Valor total: ${formatarMoeda(totalFatura / 100)}\n`;
  faturaStr += `Créditos acumulados: ${calcularCredito(apre)} \n`;
  return faturaStr;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);
