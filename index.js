let request = new XMLHttpRequest();


//Make Month in the corret formatation
function colocarZeros(valor, tamanhoTotal, padding) {
  var length = tamanhoTotal - valor.toString().length + 1;
  return Array(length).join(padding || '0') + valor;
};



//Prgar data atual
var data = new Date();

// Guarda cada pedaço em uma variável
var dia = data.getDate();           // 1-31
var mes = data.getMonth();          // 0-11 (zero=janeiro)
var ano4 = data.getFullYear();       // 4 dígitos

//Pega o dia anterio devido a API so pegar o dia anterior
dia = dia - 1;
diaantigo = dia - 1;

//Formata o mes de forma correta
mes = mes + 1;
mes = colocarZeros(mes, 2);

//Variavel que armazena os dias da semana para checagem futura a partir do numero do index
var semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

// Formata a data de forma que a API entenda xx-xx-xxxx
var str_data = mes + '-' + dia + '-' + ano4;  //Data do dia
var str_data_antiga = mes + '-' + diaantigo + '-' + ano4; //data do dia anterior



//Converte a data em um array para pegar o dia da semana
var array_data = str_data.split("-");
var dia_semana_index = new Date(array_data[2], array_data[0] - 1, array_data[1]);
var dia_semana_data = dia_semana_index.getDay();


//Verifica o dia da semana, porque dia de sabado e domingo a API nao retorna nada
if (semana[dia_semana_data] === "Sábado") {

  var str_data = mes + '-' + (dia - 1) + '-' + ano4;
  var str_data_antiga = mes + '-' + (diaantigo - 1) + '-' + ano4;

} else if (semana[dia_semana_data] === "Domingo") {
  var str_data = mes + '-' + (dia - 2) + '-' + ano4;
  var str_data_antiga = mes + '-' + (diaantigo - 2) + '-' + ano4;

} else if (semana[dia_semana_data] === "Segunda-Feira") {
  var str_data_antiga = mes + '-' + (diaantigo - 3) + '-' + ano4;
}

//Valores Base
pokemon_base = "1";
cotacaoComprar = 0;
cotacaoVendar = 0;
dolarantigo = 0;


// Mostra o resutado no HTML
function criarCard() {
  card = `
      <div class="pokemon-picture">
        <img class="pokemonImg" src="${pokemon.sprites.front_default}" alt="Sprite of ${pokemon.name}">
        <div class="infos"> 
        <h1> ${pokemon.name} 

        ${(cotacaoVendar >= dolarantigo) ? `<img id="up" src="assets/icon-up.svg" alt="">` : `<img id="up" src="assets/icon-down.svg" alt="">`}
        
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

//Pega URL da url da cotação do dolar 
var url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${str_data}'&$format=json`;

//Abre a request da API do dolar
request.open('GET', url, true);

//Pega a resposta da requisição
request.onload = function () {
  //Caso ele consiga pegar a resposta
  if (request.readyState == 4 && request.status == 200) {
    var resposta = JSON.parse(request.responseText);
    var valores = resposta.value[0];

    //Valores da cotação
    cotacaoVendar = valores.cotacaoVenda;
    cotacaoComprar = valores.cotacaoCompra;

    //Pega o valor do dolar atual e pega os 3 primeiros digitos sem o '.'
    var array_dolar_atual = valores.cotacaoVenda.toString();
    var array_dolar_atual_split = array_dolar_atual.split('');

    //Inicializa a string vazia e concatena para pegar os 3 primeiros digitos
    var string = '';
    for (var i = 0; i < 4; i++) {
      if (array_dolar_atual_split[i] != '.') {
        string = string + array_dolar_atual_split[i];
      }
    }

    //Define o numero do pokemon a partir da string base (3 primeiros digitos do dolar)
    pokemon_base = string;

    //Define a URL que a PokeAPI vai paegar
    var url2 = `https://pokeapi.co/api/v2/pokemon/${pokemon_base}/`;

    //Faz a requisição para pegar os dados do Pokemon
    fetch(url2)
      .then(response => response.json())
      .then(data => {
        pokemon = data;
      })
      .catch(err => console.log(err));


    //Faz a requisição para pegar o valor do dolar do dia anterior
    fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${str_data_antiga}'&$format=json`)
      .then(response => response.json())
      .then(data => {
        dolar = data;
      })
      .catch(err => console.log(err));



    //Devido a demora da API devolver os requests, o site tem um timeout de 2 segundos para carregar as informações
    setTimeout(() => {
      var dolar_antigo_obj_arr = dolar;
      var dolar_antigo_obj = dolar_antigo_obj_arr.value[0];
      dolarantigo = dolar_antigo_obj.cotacaoVenda;
      document.getElementById("cards").innerHTML = criarCard();
    }, 2000);

  }
};


//Tratamento de erros
request.onerror = function () {
  console.log("Erro:" + request);
};
request.send();
