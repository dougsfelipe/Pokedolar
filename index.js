let request = new XMLHttpRequest();

function leftPad(value, totalWidth, paddingChar) {
  var length = totalWidth - value.toString().length + 1;
  return Array(length).join(paddingChar || '0') + value;
};




var data = new Date();

// Guarda cada pedaço em uma variável
var dia = data.getDate();           // 1-31
var mes = data.getMonth();          // 0-11 (zero=janeiro)
var ano4 = data.getFullYear();       // 4 dígitos

dia = dia - 1;
diaantigo = dia - 1;



mes = mes + 1;
mes = leftPad(mes, 2);
console.log(mes)
// Formata a data e a hora (note o mês + 1)
var str_data = mes + '-' + dia + '-' + ano4;
var str_data_antiga = mes + '-' + diaantigo + '-' + ano4;

var semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

var arr = str_data.split("-");
console.log(arr);
var teste3 = new Date(arr[2], arr[0] -1, arr[1]);
console.log(teste3);
var dia2 = teste3.getDay();
console.log(semana[dia2]);

if(semana[dia2] === "Sábado"){

  var str_data = mes + '-' + (dia-1) + '-' + ano4;
  var str_data_antiga = mes + '-' + (diaantigo-1) + '-' + ano4;

}else if(semana[dia2]==="Domingo"){
  var str_data = mes + '-' + (dia-2) + '-' + ano4;
  var str_data_antiga = mes + '-' + (diaantigo-2) + '-' + ano4;

}else if(semana[dia2] === "Segunda"){
  var str_data_antiga = mes + '-' + (diaantigo-3) + '-' + ano4;
}

console.log(str_data_antiga);
console.log(str_data);
tesate = "1";

cotacaoComprar = 0;
cotacaoVendar = 0;
dolarantigo = 0;
// Mostra o resutado



var url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${str_data}'&$format=json`;

function requestPokeInfo(url) {

}
/* 
</div>
        <h2> ${dolarantigo} </h2>
        </div> */

console.log(url);
request.open('GET', url, true);
//`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='07-21-2010'&$format=json`, url, true);

function createCard() {
  card = `
      <div class="pokemon-picture">
        <img class="pokemonImg" src="${pokemon.sprites.front_default}" alt="Sprite of ${pokemon.name}">
        <div class="infos"> 
        <h1> ${pokemon.name} 

        ${(cotacaoVendar >= dolarantigo)? `<img id="up" src="assets/icon-up.svg" alt="">` : `<img id="up" src="assets/icon-down.svg" alt="">`}
        
        </h1> 
        <div class="cotacoes">
          <div class="cotacao">
         Cotação Venda: <b>${cotacaoVendar} R$</b> 
         </div>
         <div class="cotacao">
         Cotação Compra: <b>${cotacaoComprar} R$</b> 
         </div>

         <div class="data">
               Verificado em <b>${str_data}</b> 
         </div>
        
      </div>
      `;
  return card;
}


request.onload = function () {
  if (request.readyState == 4 && request.status == 200) {
    var resposta = JSON.parse(request.responseText);
    var valores = resposta.value[0];
    console.log(valores.cotacaoCompra);
    console.log(valores.cotacaoVenda);
    console.log(valores.dataHoraCotacao);

    cotacaoVendar = valores.cotacaoVenda;
    cotacaoComprar = valores.cotacaoCompra;
    var test = valores.cotacaoVenda.toString();
    var array = test.split('');

    var string = '';
    for (var i = 0; i < 4; i++) {
      if (array[i] != '.') {
        string = string + array[i];
      }
    }

    tesate = string;


    var url2 = `https://pokeapi.co/api/v2/pokemon/${tesate}/`;
    console.log(url2)


    fetch(url2)
      .then(response => response.json())
      .then(data => {
        pokemon = data;
      })
      .catch(err => console.log("d"));


    fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${str_data_antiga}'&$format=json`)
      .then(response => response.json())
      .then(data => {
        dolar = data;
      })
      .catch(err => console.log("d"));



    setTimeout(() => {
      console.log(pokemon.name);
      console.log(dolar);
      var resposta2 = dolar;
      var valores2 = resposta2.value[0];

      dolarantigo = valores2.cotacaoVenda;
      console.log(dolarantigo)
      document.getElementById("cards").innerHTML = createCard();
    }, 2000);





  }
};



request.onerror = function () {
  console.log("Erro:" + request);
};
request.send();
