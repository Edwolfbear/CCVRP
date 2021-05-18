// CLASSES

class Deposito {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Vehiculo {
  constructor(capacidad, ubicacion, color = "#000000") {
    this.capacidad = capacidad;
    this.ubicacion = ubicacion;
    this.color = color;
    this.estado = "Entregando"
    this.kilometraje = 0;
  }

  distancia(ubicacion) {
    return (
       ((this.ubicacion.x-ubicacion.x)**2)
      +((this.ubicacion.y-ubicacion.y)**2)
    )**(1/2);
  }

  buscarRuta(clientes) {
    let distancias = [];
    for(cliente of clientes) {
      if(cliente.estado == "Sin entregar") {
        distancias.push([
          this.distancia(cliente),
          clientes.indexOf(cliente)
        ]);
      }
    }

    if(distancias.length == 0) {
      this.estado = "Calculando nueva ruta";
      return 0;
    }

    let clienteIndex = distancias[
      distancias.map(row => row[0]).indexOf(
        Math.min(...distancias.map(row => row[0]))
      )
    ][1];

    let clienteIndexAnterior = clientes.indexOf(this.ubicacion);

    this.capacidad -= clientes[clienteIndex].demanda;

    if(this.capacidad < 0) {
      this.capacidad += clientes[clienteIndex].demanda;
      this.estado = "Calculando nueva ruta";
    } else {
      this.estado = "Entregando";
      this.kilometraje += this.distancia(clientes[clienteIndex]);
      this.entregar(clientes[clienteIndex]);
      this.irA(clientes[clienteIndex]);
    }

    return {
      origen: clienteIndexAnterior+1,
      destino: clienteIndex+1,
      kilometraje: this.kilometraje
    };
  }

  irA(ubicacion) { this.ubicacion = ubicacion; }

  entregar(cliente) { cliente.estado = "Entregado"; }
}

class Cliente {
  constructor(demanda, x, y) {
    this.demanda = demanda;
    this.estado = "Sin entregar";
    this.x = x;
    this.y = y;
  }
}

var bks = 0;
function buscarRutas(deposito, vehiculos, clientes) {
  // Create Locations
  var data = [];
  var links = [];

  data.push({
    x: central.x,
    y: central.y,
    symbol: "rect",
    symbolSize: 15,
    itemStyle: { color: "#FF0000" }
  })

  for(cliente of clientes) {
    data.push({
      x: cliente.x,
      y: cliente.y,
      value: cliente.demanda
    })
  }

  // Path Finder
  let entregando = true;
  while(entregando) {
    for(let vehiculo of vehiculos) {
      let ruta = vehiculo.buscarRuta(clientes);
      if(vehiculo.estado == "Entregando") {
        bks += ruta.kilometraje;
        links.push({
          source: ruta.origen,
          target: ruta.destino,
          value: ruta.kilometraje,
          lineStyle: { color: vehiculo.color }
        });
      }
    }

    entregando = false;
    for(let vehiculo of vehiculos) {
      entregando = entregando || vehiculo.estado == "Entregando";
    }
  }
  // regresar
  for(vehiculo of vehiculos) {
    links.push({
      source: clientes.indexOf(vehiculo.ubicacion)+1,
      target: 0
    });
  }

  // CHART
  var chart = echarts.init(document.getElementById("chart"));
  document.getElementById("chart").style = `
    width: ${window.innerWidth}px;
    height: ${window.innerHeight}px;
  `;

  chart.resize();

  chart.setOption({
    tooltip: {},
    series: [{
      type: "graph",
      data: data,
      links: links,
      edgeSymbol: ["none", 'arrow'],
    }]
  });
}

((elmnt) => {
  let pos1, pos2, pos3, pos4;

  elmnt.onmousedown = (event) => {
    event = event || window.event;
    //event.preventDefault();

    pos3 = event.clientX;
    pos4 = event.clientY;

    document.onmouseup = () => {
      document.onmouseup = null;
      document.onmousemove = null;
    };

    document.onmousemove = (event) => {
      event = event || window.event;
      event.preventDefault();

      pos1 = pos3 - event.clientX;
      pos2 = pos4 - event.clientY;
      pos3 = event.clientX;
      pos4 = event.clientY;

      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    };
  };

})(document.getElementById("datagraph"));

var Q = 160;
var central = new Deposito(30, 40);
var vehiculos = [
  new Vehiculo(Q, central, "#002859"),
  new Vehiculo(Q, central, "#59004f"),
  new Vehiculo(Q, central, "#155900"),
  new Vehiculo(Q, central, "#595500"),
  new Vehiculo(Q, central, "#590000")
];
var clientes = [
  new Cliente( 7, 37, 52),
  new Cliente(30, 49, 49),
  new Cliente(16, 52, 64),
  new Cliente( 9, 20, 26),
  new Cliente(21, 40, 30),
  new Cliente(15, 21, 47),
  new Cliente(19, 17, 63),
  new Cliente(23, 31, 62),
  new Cliente(11, 52, 33),
  new Cliente( 5, 51, 21),
  new Cliente(19, 42, 41),
  new Cliente(29, 31, 32),
  new Cliente(23,  5, 25),
  new Cliente(21, 12, 42),
  new Cliente(10, 36, 16),
  new Cliente(15, 52, 41),
  new Cliente( 3, 27, 23),
  new Cliente(41, 17, 33),
  new Cliente( 9, 13, 13),
  new Cliente(28, 57, 58),
  new Cliente( 8, 62, 42),
  new Cliente( 8, 42, 57),
  new Cliente(16, 16, 57),
  new Cliente(10,  8, 52),
  new Cliente(28,  7, 38),
  new Cliente( 7, 27, 68),
  new Cliente(15, 30, 48),
  new Cliente(14, 43, 67),
  new Cliente( 6, 58, 48),
  new Cliente(19, 58, 27),
  new Cliente(11, 37, 69),
  new Cliente(12, 38, 46),
  new Cliente(23, 46, 10),
  new Cliente(26, 61, 33),
  new Cliente(17, 62, 63),
  new Cliente( 6, 63, 69),
  new Cliente( 9, 32, 22),
  new Cliente(15, 45, 35),
  new Cliente(14, 59, 15),
  new Cliente( 7,  5,  6),
  new Cliente(27, 10, 17),
  new Cliente(13, 21, 10),
  new Cliente(11,  5, 64),
  new Cliente(16, 30, 15),
  new Cliente(10, 39, 10),
  new Cliente( 5, 32, 39),
  new Cliente(25, 25, 32),
  new Cliente(17, 25, 55),
  new Cliente(18, 48, 28),
  new Cliente(10, 56, 37)
];

buscarRutas(central, vehiculos, clientes);
document.getElementById("bks").innerHTML = bks.toFixed(4);

document.getElementById("datagraph").addEventListener("change", (event) => {
  bks = 0;
  var instancia = event.target.value;
  if(instancia == "VRPNC1m") {
    var Q = 160;
    var central = new Deposito(30, 40);
    var vehiculos = [
      new Vehiculo(Q, central, "#002859"),
      new Vehiculo(Q, central, "#59004f"),
      new Vehiculo(Q, central, "#155900"),
      new Vehiculo(Q, central, "#595500"),
      new Vehiculo(Q, central, "#590000")
    ];
    var clientes = [
      new Cliente( 7, 37, 52),
      new Cliente(30, 49, 49),
      new Cliente(16, 52, 64),
      new Cliente( 9, 20, 26),
      new Cliente(21, 40, 30),
      new Cliente(15, 21, 47),
      new Cliente(19, 17, 63),
      new Cliente(23, 31, 62),
      new Cliente(11, 52, 33),
      new Cliente( 5, 51, 21),
      new Cliente(19, 42, 41),
      new Cliente(29, 31, 32),
      new Cliente(23,  5, 25),
      new Cliente(21, 12, 42),
      new Cliente(10, 36, 16),
      new Cliente(15, 52, 41),
      new Cliente( 3, 27, 23),
      new Cliente(41, 17, 33),
      new Cliente( 9, 13, 13),
      new Cliente(28, 57, 58),
      new Cliente( 8, 62, 42),
      new Cliente( 8, 42, 57),
      new Cliente(16, 16, 57),
      new Cliente(10,  8, 52),
      new Cliente(28,  7, 38),
      new Cliente( 7, 27, 68),
      new Cliente(15, 30, 48),
      new Cliente(14, 43, 67),
      new Cliente( 6, 58, 48),
      new Cliente(19, 58, 27),
      new Cliente(11, 37, 69),
      new Cliente(12, 38, 46),
      new Cliente(23, 46, 10),
      new Cliente(26, 61, 33),
      new Cliente(17, 62, 63),
      new Cliente( 6, 63, 69),
      new Cliente( 9, 32, 22),
      new Cliente(15, 45, 35),
      new Cliente(14, 59, 15),
      new Cliente( 7,  5,  6),
      new Cliente(27, 10, 17),
      new Cliente(13, 21, 10),
      new Cliente(11,  5, 64),
      new Cliente(16, 30, 15),
      new Cliente(10, 39, 10),
      new Cliente( 5, 32, 39),
      new Cliente(25, 25, 32),
      new Cliente(17, 25, 55),
      new Cliente(18, 48, 28),
      new Cliente(10, 56, 37)
    ];

    buscarRutas(central, vehiculos, clientes);
  } else if(instancia == "VRPNC2m") {
    const Q = 140 ;
    var central = new Deposito(40,40);
    var vehiculos = [
    	new Vehiculo(Q, central),
    	new Vehiculo(Q, central),
    	new Vehiculo(Q, central),
    	new Vehiculo(Q, central),
    	new Vehiculo(Q, central),
    	new Vehiculo(Q, central),
    	new Vehiculo(Q, central),
    	new Vehiculo(Q, central),
    	new Vehiculo(Q, central),
    	new Vehiculo(Q, central),
    ];
    var clientes = [
      new Cliente(18, 22,	22),
      new Cliente(26, 36,	26),
      new Cliente(11, 21,	45),
      new Cliente(30, 45,	35),
      new Cliente(21, 55,	20),
      new Cliente(19,	33,	34),
      new Cliente(15,	50,	50),
      new Cliente(16,	55,	45),
      new Cliente(29, 26,	59),
      new Cliente(26,	40,	66),
      new Cliente(37,	55,	65),
      new Cliente(16,	35,	51),
      new Cliente(12,	62,	35),
      new Cliente(31,	62,	57),
      new Cliente(8,	62,	24),
      new Cliente(19,	21,	36),
      new Cliente(20,	33,	44),
      new Cliente(13,	9,	56),
      new Cliente(15,	62,	48),
      new Cliente(22,	66,	14),
      new Cliente(28,	44,	13),
      new Cliente(12,	26,	13),
      new Cliente(6,	11,	28),
      new Cliente(27,	7,	43),
      new Cliente(14,	17,	64),
      new Cliente(18,	41,	46),
      new Cliente(17,	55,	34),
      new Cliente(29,	35,	16),
      new Cliente(13,	52,	26),
      new Cliente(22,	43,	26),
      new Cliente(25,	31,	76),
      new Cliente(28,	22,	53),
      new Cliente(27,	26,	29),
      new Cliente(19,	50,	40),
      new Cliente(10,	55,	50),
      new Cliente(12,	54,	10),
      new Cliente(14,	60,	15),
      new Cliente(24,	47,	66),
      new Cliente(16,	30,	60),
      new Cliente(33,	30,	50),
      new Cliente(15,	12,	17),
      new Cliente(11,	15,	14),
      new Cliente(18,	16,	19),
      new Cliente(17,	21,	48),
      new Cliente(21,	50,	30),
      new Cliente(27,	51,	42),
      new Cliente(19,	50,	15),
      new Cliente(20,	48,	21),
      new Cliente(5,	12,	38),
      new Cliente(22,	15,	56),
      new Cliente(12,	29,	39),
      new Cliente(19,	54,	38),
      new Cliente(22,	55,	57),
      new Cliente(16,	67,	41),
      new Cliente(7,	10,	70),
      new Cliente(26,	6,	25),
      new Cliente(14,	65,	27),
      new Cliente(21,	40,	60),
      new Cliente(24,	70,	64),
      new Cliente(13,	64,	4),
      new Cliente(15,	36,	6),
      new Cliente(18,	30,	20),
      new Cliente(11,	20,	30),
      new Cliente(28,	15,	5),
      new Cliente(9,	50,	70),
      new Cliente(37,	57,	72),
      new Cliente(30,	45,	42),
      new Cliente(10,	38,	33),
      new Cliente(8,	50,	4),
      new Cliente(11,	66,	8),
      new Cliente(3,	59,	5),
      new Cliente(1,	35,	60),
      new Cliente(6,	27,	24),
      new Cliente(10,	40,	20),
      new Cliente(20,	40,	37),
    ];

    buscarRutas(central, vehiculos, clientes);
  } else if(instancia == "VRPNC3m") {
    const Q = 200;
    var central = new Deposito (35, 35);
    var vehiculos = [
      new Vehiculo(Q, central),
      new Vehiculo(Q, central),
      new Vehiculo(Q, central),
      new Vehiculo(Q, central),
      new Vehiculo(Q, central),
      new Vehiculo(Q, central),
      new Vehiculo(Q, central),
      new Vehiculo(Q, central)
    ];
    var clientes = [
      new Cliente(	10,	41,	49	),
      new Cliente(	7,	35,	17	),
      new Cliente(	13,	55,	45	),
      new Cliente(	19,	55,	20	),
      new Cliente(	26,	15,	30	),
      new Cliente(	3,	25,	30	),
      new Cliente(	5,	20,	50	),
      new Cliente(	9,	10,	43	),
      new Cliente(	16,	55,	60	),
      new Cliente(	16,	30,	60	),
      new Cliente(	12,	20,	65	),
      new Cliente(	19,	50,	35	),
      new Cliente(	23,	30,	25	),
      new Cliente(	20,	15,	10	),
      new Cliente(	8,	30,	5	),
      new Cliente(	19,	10,	20	),
      new Cliente(	2,	5,	30	),
      new Cliente(	12,	20,	40	),
      new Cliente(	17,	15,	60	),
      new Cliente(	9,	45,	65	),
      new Cliente(	11,	45,	20	),
      new Cliente(	18,	45,	10	),
      new Cliente(	29,	55,	5	),
      new Cliente(	3,	65,	35	),
      new Cliente(	6,	65,	20	),
      new Cliente(	17,	45,	30	),
      new Cliente(	16,	35,	40	),
      new Cliente(	16,	41,	37	),
      new Cliente(	9,	64,	42	),
      new Cliente(	21,	40,	60	),
      new Cliente(	27,	31,	52	),
      new Cliente(	23,	35,	69	),
      new Cliente(	11,	53,	52	),
      new Cliente(	14,	65,	55	),
      new Cliente(	8,	63,	65	),
      new Cliente(	5,	2,	60	),
      new Cliente(	8,	20,	20	),
      new Cliente(	16,	5,	5	),
      new Cliente(	31,	60,	12	),
      new Cliente(	9,	40,	25	),
      new Cliente(	5,	42,	7	),
      new Cliente(	5,	24,	12	),
      new Cliente(	7,	23,	3	),
      new Cliente(	18,	11,	14	),
      new Cliente(	16,	6,	38	),
      new Cliente(	1,	2,	48	),
      new Cliente(	27,	8,	56	),
      new Cliente(	36,	13,	52	),
      new Cliente(	30,	6,	68	),
      new Cliente(	13,	47,	47	),
      new Cliente(	10,	49,	58	),
      new Cliente(	9,	27,	43	),
      new Cliente(	14,	37,	31	),
      new Cliente(	18,	57,	29	),
      new Cliente(	2,	63,	23	),
      new Cliente(	6,	53,	12	),
      new Cliente(	7,	32,	12	),
      new Cliente(	18,	36,	26	),
      new Cliente(	28,	21,	24	),
      new Cliente(	3,	17,	34	),
      new Cliente(	13,	12,	24	),
      new Cliente(	19,	24,	58	),
      new Cliente(	10,	27,	69	),
      new Cliente(	9,	15,	77	),
      new Cliente(	20,	62,	77	),
      new Cliente(	25,	49,	73	),
      new Cliente(	25,	67,	5	),
      new Cliente(	36,	56,	39	),
      new Cliente(	6,	37,	47	),
      new Cliente(	5,	37,	56	),
      new Cliente(	15,	57,	68	),
      new Cliente(	25,	47,	16	),
      new Cliente(	9,	44,	17	),
      new Cliente(	8,	46,	13	),
      new Cliente(	18,	49,	11	),
      new Cliente(	13,	49,	42	),
      new Cliente(	14,	53,	43	),
      new Cliente(	3,	61,	52	),
      new Cliente(	23,	57,	48	),
      new Cliente(	6,	56,	37	),
      new Cliente(	26,	55,	54	),
      new Cliente(	16,	15,	47	),
      new Cliente(	11,	14,	37	),
      new Cliente(	7,	11,	31	),
      new Cliente(	41,	16,	22	),
      new Cliente(	35,	4,	18	),
      new Cliente(	26,	28,	18	),
      new Cliente(	9,	26,	52	),
      new Cliente(	15,	26,	35	),
      new Cliente(	3,	31,	67	),
      new Cliente(	1,	15,	19	),
      new Cliente(	2,	22,	22	),
      new Cliente(	22,	18,	24	),
      new Cliente(	27,	26,	27	),
      new Cliente(	20,	25,	24	),
      new Cliente(	11,	22,	27	),
      new Cliente(	12,	25,	21	),
      new Cliente(	10,	19,	21	),
      new Cliente(	9,	20,	26	),
      new Cliente(	17,	18,	18	)
    ];

    buscarRutas(central, vehiculos, clientes);
  } else if(instancia == "VRPNC4m") {
    const Q = 200;
    var central = new Deposito (35, 35);
    var vehiculos = [
      new Vehiculo(Q, central),
      new Vehiculo(Q, central),
      new Vehiculo(Q, central),
      new Vehiculo(Q, central),
      new Vehiculo(Q, central),
      new Vehiculo(Q, central),
      new Vehiculo(Q, central),
      new Vehiculo(Q, central),
      new Vehiculo(Q, central),
      new Vehiculo(Q, central),
      new Vehiculo(Q, central),
      new Vehiculo(Q, central)
    ];
    var clientes = [
      new Cliente(	10,	41,	49	),
      new Cliente(	7,	35,	17	),
      new Cliente(	13,	55,	45	),
      new Cliente(	19,	55,	20	),
      new Cliente(	26,	15,	30	),
      new Cliente(	3,	25,	30	),
      new Cliente(	5,	20,	50	),
      new Cliente(	9,	10,	43	),
      new Cliente(	16,	55,	60	),
      new Cliente(	16,	30,	60	),
      new Cliente(	12,	20,	65	),
      new Cliente(	19,	50,	35	),
      new Cliente(	23,	30,	25	),
      new Cliente(	20,	15,	10	),
      new Cliente(	8,	30,	5	),
      new Cliente(	19,	10,	20	),
      new Cliente(	2,	5,	30	),
      new Cliente(	12,	20,	40	),
      new Cliente(	17,	15,	60	),
      new Cliente(	9,	45,	65	),
      new Cliente(	11,	45,	20	),
      new Cliente(	18,	45,	10	),
      new Cliente(	29,	55,	5	),
      new Cliente(	3,	65,	35	),
      new Cliente(	6,	65,	20	),
      new Cliente(	17,	45,	30	),
      new Cliente(	16,	35,	40	),
      new Cliente(	16,	41,	37	),
      new Cliente(	9,	64,	42	),
      new Cliente(	21,	40,	60	),
      new Cliente(	27,	31,	52	),
      new Cliente(	23,	35,	69	),
      new Cliente(	11,	53,	52	),
      new Cliente(	14,	65,	55	),
      new Cliente(	8,	63,	65	),
      new Cliente(	5,	2,	60	),
      new Cliente(	8,	20,	20	),
      new Cliente(	16,	5,	5	),
      new Cliente(	31,	60,	12	),
      new Cliente(	9,	40,	25	),
      new Cliente(	5,	42,	7	),
      new Cliente(	5,	24,	12	),
      new Cliente(	7,	23,	3	),
      new Cliente(	18,	11,	14	),
      new Cliente(	16,	6,	38	),
      new Cliente(	1,	2,	48	),
      new Cliente(	27,	8,	56	),
      new Cliente(	36,	13,	52	),
      new Cliente(	30,	6,	68	),
      new Cliente(	13,	47,	47	),
      new Cliente(	10,	49,	58	),
      new Cliente(	9,	27,	43	),
      new Cliente(	14,	37,	31	),
      new Cliente(	18,	57,	29	),
      new Cliente(	2,	63,	23	),
      new Cliente(	6,	53,	12	),
      new Cliente(	7,	32,	12	),
      new Cliente(	18,	36,	26	),
      new Cliente(	28,	21,	24	),
      new Cliente(	3,	17,	34	),
      new Cliente(	13,	12,	24	),
      new Cliente(	19,	24,	58	),
      new Cliente(	10,	27,	69	),
      new Cliente(	9,	15,	77	),
      new Cliente(	20,	62,	77	),
      new Cliente(	25,	49,	73	),
      new Cliente(	25,	67,	5	),
      new Cliente(	36,	56,	39	),
      new Cliente(	6,	37,	47	),
      new Cliente(	5,	37,	56	),
      new Cliente(	15,	57,	68	),
      new Cliente(	25,	47,	16	),
      new Cliente(	9,	44,	17	),
      new Cliente(	8,	46,	13	),
      new Cliente(	18,	49,	11	),
      new Cliente(	13,	49,	42	),
      new Cliente(	14,	53,	43	),
      new Cliente(	3,	61,	52	),
      new Cliente(	23,	57,	48	),
      new Cliente(	6,	56,	37	),
      new Cliente(	26,	55,	54	),
      new Cliente(	16,	15,	47	),
      new Cliente(	11,	14,	37	),
      new Cliente(	7,	11,	31	),
      new Cliente(	41,	16,	22	),
      new Cliente(	35,	4,	18	),
      new Cliente(	26,	28,	18	),
      new Cliente(	9,	26,	52	),
      new Cliente(	15,	26,	35	),
      new Cliente(	3,	31,	67	),
      new Cliente(	1,	15,	19	),
      new Cliente(	2,	22,	22	),
      new Cliente(	22,	18,	24	),
      new Cliente(	27,	26,	27	),
      new Cliente(	20,	25,	24	),
      new Cliente(	11,	22,	27	),
      new Cliente(	12,	25,	21	),
      new Cliente(	10,	19,	21	),
      new Cliente(	9,	20,	26	),
      new Cliente(	17,	18,	18	),
      new Cliente(	7,	37,	52	),
      new Cliente(	30,	49,	49	),
      new Cliente(	16,	52,	64	),
      new Cliente(	9,	20,	26	),
      new Cliente(	21,	40,	30	),
      new Cliente(	15,	21,	47	),
      new Cliente(	19,	17,	63	),
      new Cliente(	23,	31,	62	),
      new Cliente(	11,	52,	33	),
      new Cliente(	5,	51,	21	),
      new Cliente(	19,	42,	41	),
      new Cliente(	29,	31,	32	),
      new Cliente(	23,	5,	25	),
      new Cliente(	21,	12,	42	),
      new Cliente(	10,	36,	16	),
      new Cliente(	15,	52,	41	),
      new Cliente(	3,	27,	23	),
      new Cliente(	41,	17,	33	),
      new Cliente(	9,	13,	13	),
      new Cliente(	28,	57,	58	),
      new Cliente(	8,	62,	42	),
      new Cliente(	8,	42,	57	),
      new Cliente(	16,	16,	57	),
      new Cliente(	10,	8,	52	),
      new Cliente(	28,	7,	38	),
      new Cliente(	7, 27,	68	),
      new Cliente(	15,	30,	48	),
      new Cliente(	14,	43,	67	),
      new Cliente(	6,	58,	48	),
      new Cliente(	19,	58,	27	),
      new Cliente(	11,	37,	69	),
      new Cliente(	12,	38,	46	),
      new Cliente(	23,	46,	10	),
      new Cliente(	26,	61,	33	),
      new Cliente(	17,	62,	63	),
      new Cliente(	6,	63,	69	),
      new Cliente(	9, 32,	22	),
      new Cliente(	15,	45,	35	),
      new Cliente(	14,	59,	15	),
      new Cliente(	7,	5,	6	),
      new Cliente(	27,	10,	17	),
      new Cliente(	13,	21,	10	),
      new Cliente(	11,	5,	64	),
      new Cliente(	16,	30,	15	),
      new Cliente(	10,	39,	10	),
      new Cliente(	5,	32,	39	),
      new Cliente(	25,	25,	32	),
      new Cliente(	17,	25,	55	),
      new Cliente(	18,	48,	28	),
      new Cliente(	10,	56,	37	)
    ];

    buscarRutas(central, vehiculos, clientes);
  } else if(instancia == "VRPNC5m") {
    const Q = 200;
    var central = new Deposito (35,35);
    var vehiculos = [
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central)
    ];
    var clientes = [
      new Cliente(	10,	41,	49	),
      new Cliente(	7,	35,	17	),
      new Cliente(	13,	55,	45	),
      new Cliente(	19,	55,	20	),
      new Cliente(	26,	15,	30	),
      new Cliente(	3,	25,	30	),
      new Cliente(	5,	20,	50	),
      new Cliente(	9,	10,	43	),
      new Cliente(	16,	55,	60	),
      new Cliente(	16,	30,	60	),
      new Cliente(	12,	20,	65	),
      new Cliente(	19,	50,	35	),
      new Cliente(	23,	30,	25	),
      new Cliente(	20,	15,	10	),
      new Cliente(	8,	30,	5	),
      new Cliente(	19,	10,	20	),
      new Cliente(	2,	5,	30	),
      new Cliente(	12,	20,	40	),
      new Cliente(	17,	15,	60	),
      new Cliente(	9,	45,	65	),
      new Cliente(	11,	45,	20	),
      new Cliente(	18,	45,	10	),
      new Cliente(	29,	55,	5	),
      new Cliente(	3,	65,	35	),
      new Cliente(	6,	65,	20	),
      new Cliente(	17,	45,	30	),
      new Cliente(	16,	35,	40	),
      new Cliente(	16,	41,	37	),
      new Cliente(	9,	64,	42	),
      new Cliente(	21,	40,	60	),
      new Cliente(	27,	31,	52	),
      new Cliente(	23,	35,	69	),
      new Cliente(	11,	53,	52	),
      new Cliente(	14,	65,	55	),
      new Cliente(	8,	63,	65	),
      new Cliente(	5,	2,	60	),
      new Cliente(	8,	20,	20	),
      new Cliente(	6,	5,	51	),
      new Cliente(	31,	60,	12	),
      new Cliente(	9,	40,	25	),
      new Cliente(	5,	42,	7	),
      new Cliente(	5,	24,	12	),
      new Cliente(	7,	23,	3	),
      new Cliente(	18,	11,	14	),
      new Cliente(	16,	6,	38	),
      new Cliente(	1,	2,	48	),
      new Cliente(	27,	8,	56	),
      new Cliente(	36,	13,	52	),
      new Cliente(	30,	6,	68	),
      new Cliente(	13,	47,	47	),
      new Cliente(	10,	49,	58	),
      new Cliente(	9,	27,	43	),
      new Cliente(	14,	37,	31	),
      new Cliente(	18,	57,	29	),
      new Cliente(	2,	63,	23	),
      new Cliente(	6,	53,	12	),
      new Cliente(	7,	32,	12	),
      new Cliente(	18,	36,	26	),
      new Cliente(	28,	21,	24	),
      new Cliente(	3,	17,	34	),
      new Cliente(	13,	12,	24	),
      new Cliente(	19,	24,	58	),
      new Cliente(	10,	27,	69	),
      new Cliente(	9,	15,	77	),
      new Cliente(	20,	62,	77	),
      new Cliente(	25,	49,	73	),
      new Cliente(	25,	67,	5	),
      new Cliente(	36,	56,	39	),
      new Cliente(	6,	37,	47	),
      new Cliente(	5,	37,	56	),
      new Cliente(	15,	57,	68	),
      new Cliente(	25,	47,	16	),
      new Cliente(	9,	44,	17	),
      new Cliente(	8,	46,	13	),
      new Cliente(	18,	49,	11	),
      new Cliente(	13,	49,	42	),
      new Cliente(	14,	53,	43	),
      new Cliente(	3,	61,	52	),
      new Cliente(	23,	57,	48	),
      new Cliente(	6,	56,	37	),
      new Cliente(	26,	55,	54	),
      new Cliente(	16,	15,	47	),
      new Cliente(	11,	14,	37	),
      new Cliente(	7,	11,	31	),
      new Cliente(	41,	16,	22	),
      new Cliente(	35,	4,	18	),
      new Cliente(	26,	28,	18	),
      new Cliente(	9,	26,	52	),
      new Cliente(	15,	26,	35	),
      new Cliente(	3,	31,	67	),
      new Cliente(	1,	15,	19	),
      new Cliente(	2,	22,	22	),
      new Cliente(	22,	18,	24	),
      new Cliente(	27,	26,	27	),
      new Cliente(	20,	25,	24	),
      new Cliente(	11,	22,	27	),
      new Cliente(	12,	25,	21	),
      new Cliente(	10,	19,	21	),
      new Cliente(	9,	20,	26	),
      new Cliente(	17,	18,	18	),
      new Cliente(	7,	37,	52	),
      new Cliente(	30,	49,	49	),
      new Cliente(	16,	52,	64	),
      new Cliente(	9,	20,	26	),
      new Cliente(	21,	40,	30	),
      new Cliente(	15,	21,	47	),
      new Cliente(	19,	17,	63	),
      new Cliente(	23,	31,	62	),
      new Cliente(	11,	52,	33	),
      new Cliente(	5,	51,	21	),
      new Cliente(	19,	42,	41	),
      new Cliente(	29,	31,	32	),
      new Cliente(	23,	5,	25	),
      new Cliente(	21,	12,	42	),
      new Cliente(	10,	36,	16	),
      new Cliente(	15,	52,	41	),
      new Cliente(	3,	27,	23	),
      new Cliente(	41,	17,	33	),
      new Cliente(	9,	13,	13	),
      new Cliente(	28,	57,	58	),
      new Cliente(	8,	62,	42	),
      new Cliente(	8,	42,	57	),
      new Cliente(	16,	16,	57	),
      new Cliente(	10,	8,	52	),
      new Cliente(	28,	7,	38	),
      new Cliente(	7,	27,	68	),
      new Cliente(	15,	30,	48	),
      new Cliente(	14,	43,	67	),
      new Cliente(	6,	58,	48	),
      new Cliente(	19,	58,	27	),
      new Cliente(	11,	37,	69	),
      new Cliente(	12,	38,	46	),
      new Cliente(	23,	46,	10	),
      new Cliente(	26,	61,	33	),
      new Cliente(	17,	62,	63	),
      new Cliente(	6,	63,	69	),
      new Cliente(	9,	32,	22	),
      new Cliente(	15,	45,	35	),
      new Cliente(	14,	59,	15	),
      new Cliente(	7,	5,	6	),
      new Cliente(	27,	10,	17	),
      new Cliente(	13,	21,	10	),
      new Cliente(	11,	5,	64	),
      new Cliente(	16,	30,	15	),
      new Cliente(	10,	39,	10	),
      new Cliente(	5,	32,	39	),
      new Cliente(	25,	25,	32	),
      new Cliente(	17,	25,	55	),
      new Cliente(	18,	48,	28	),
      new Cliente(	10,	56,	37	),
      new Cliente(	18,	22,	22	),
      new Cliente(	26,	36,	26	),
      new Cliente(	11,	21,	45	),
      new Cliente(	30,	45,	35	),
      new Cliente(	21,	55,	20	),
      new Cliente(	19,	33,	34	),
      new Cliente(	15,	50,	50	),
      new Cliente(	16,	55,	45	),
      new Cliente(	29,	26,	59	),
      new Cliente(	26,	40,	66	),
      new Cliente(	37,	55,	65	),
      new Cliente(	16,	35,	51	),
      new Cliente(	12,	62,	35	),
      new Cliente(	31,	62,	57	),
      new Cliente(	8,	62,	24	),
      new Cliente(	19,	21,	36	),
      new Cliente(	20,	33,	44	),
      new Cliente(	13,	9,	56	),
      new Cliente(	15,	62,	48	),
      new Cliente(	22,	66,	14	),
      new Cliente(	28,	44,	13	),
      new Cliente(	12,	26,	13	),
      new Cliente(	6,	11,	28	),
      new Cliente(	27,	7,	43	),
      new Cliente(	14,	17,	64	),
      new Cliente(	18,	41,	46	),
      new Cliente(	17,	55,	34	),
      new Cliente(	29,	35,	16	),
      new Cliente(	13,	52,	26	),
      new Cliente(	22,	43,	26	),
      new Cliente(	25,	31,	76	),
      new Cliente(	28,	22,	53	),
      new Cliente(	27,	26,	29	),
      new Cliente(	19,	50,	40	),
      new Cliente(	10,	55,	50	),
      new Cliente(	12,	54,	10	),
      new Cliente(	14,	60,	15	),
      new Cliente(	24,	47,	66	),
      new Cliente(	16,	30,	60	),
      new Cliente(	33,	30,	50	),
      new Cliente(	15,	12,	17	),
      new Cliente(	11,	15,	14	),
      new Cliente(	18,	16,	19	),
      new Cliente(	17,	21,	48	),
      new Cliente(	21,	50,	30	),
      new Cliente(	27,	51,	42	),
      new Cliente(	19,	50,	15	),
      new Cliente(	20,	48,	21	),
      new Cliente(	5,	12,	38	),
    ];

    buscarRutas(central, vehiculos, clientes);
  } else if(instancia == "VRPNC11m") {
    const Q = 200;
    var central = new Deposito (10,45);
    var vehiculos = [
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
    ];
    var clientes = [
      new Cliente(	25,	25,	1	),
      new Cliente(	7,	25,	3	),
      new Cliente(	13,	31,	5	),
      new Cliente(	6,	32,	5	),
      new Cliente(	14,	31,	7	),
      new Cliente(	5,	32,	9	),
      new Cliente(	11,	34,	9	),
      new Cliente(	19,	46,	9	),
      new Cliente(	5,	35,	7	),
      new Cliente(	15,	34,	6	),
      new Cliente(	15,	35,	5	),
      new Cliente(	17,	47,	6	),
      new Cliente(	13,	40,	5	),
      new Cliente(	12,	39,	3	),
      new Cliente(	18,	36,	3	),
      new Cliente(	13,	73,	6	),
      new Cliente(	18,	73,	8	),
      new Cliente(	12,	24,	36	),
      new Cliente(	17,	76,	6	),
      new Cliente(	4,	76,	10	),
      new Cliente(	7,	76,	13	),
      new Cliente(	12,	78,	3	),
      new Cliente(	13,	78,	9	),
      new Cliente(	8,	79,	3	),
      new Cliente(	16,	79,	5	),
      new Cliente(	15,	79,	11	),
      new Cliente(	6,	82,	3	),
      new Cliente(	5,	82,	7	),
      new Cliente(	9,	90,	15	),
      new Cliente(	11,	84,	3	),
      new Cliente(	10,	84,	5	),
      new Cliente(	3,	84,	9	),
      new Cliente(	7,	85,	1	),
      new Cliente(	2,	87,	5	),
      new Cliente(	4,	85,	8	),
      new Cliente(	4,	87,	7	),
      new Cliente(	18,	86,	41	),
      new Cliente(	14,	86,	44	),
      new Cliente(	12,	86,	46	),
      new Cliente(	17,	85,	55	),
      new Cliente(	20,	89,	43	),
      new Cliente(	14,	89,	46	),
      new Cliente(	16,	89,	52	),
      new Cliente(	10,	92,	42	),
      new Cliente(	9,	92,	52	),
      new Cliente(	11,	94,	42	),
      new Cliente(	7,	94,	44	),
      new Cliente(	13,	94,	48	),
      new Cliente(	5,	96,	42	),
      new Cliente(	4,	99,	46	),
      new Cliente(	21,	99,	50	),
      new Cliente(	13,	83,	80	),
      new Cliente(	11,	83,	83	),
      new Cliente(	12,	85,	81	),
      new Cliente(	14,	85,	85	),
      new Cliente(	10,	85,	89	),
      new Cliente(	8,	87,	80	),
      new Cliente(	16,	87,	86	),
      new Cliente(	19,	90,	77	),
      new Cliente(	5,	90,	88	),
      new Cliente(	17,	93,	82	),
      new Cliente(	7,	93,	84	),
      new Cliente(	16,	93,	89	),
      new Cliente(	14,	94,	86	),
      new Cliente(	17,	95,	80	),
      new Cliente(	13,	99,	89	),
      new Cliente(	17,	37,	83	),
      new Cliente(	13,	50,	80	),
      new Cliente(	14,	35,	85	),
      new Cliente(	16,	35,	87	),
      new Cliente(	7,	44,	86	),
      new Cliente(	13,	46,	89	),
      new Cliente(	9,	46,	83	),
      new Cliente(	11,	46,	87	),
      new Cliente(	35,	46,	89	),
      new Cliente(	5,	48,	83	),
      new Cliente(	28,	50,	85	),
      new Cliente(	7,	50,	88	),
      new Cliente(	3,	54,	86	),
      new Cliente(	10,	54,	90	),
      new Cliente(	7,	10,	35	),
      new Cliente(	12,	10,	40	),
      new Cliente(	11,	18,	30	),
      new Cliente(	10,	17,	35	),
      new Cliente(	8,	16,	38	),
      new Cliente(	11,	14,	40	),
      new Cliente(	21,	15,	42	),
      new Cliente(	4,	11,	42	),
      new Cliente(	15,	18,	40	),
      new Cliente(	16,	21,	39	),
      new Cliente(	4,	20,	40	),
      new Cliente(	16,	18,	41	),
      new Cliente(	7,	20,	44	),
      new Cliente(	10,	22,	44	),
      new Cliente(	9,	16,	45	),
      new Cliente(	11,	20,	45	),
      new Cliente(	17,	25,	45	),
      new Cliente(	12,	30,	55	),
      new Cliente(	11,	20,	50	),
      new Cliente(	7,	22,	51	),
      new Cliente(	9,	18,	49	),
      new Cliente(	11,	16,	48	),
      new Cliente(	12,	20,	55	),
      new Cliente(	7,	18,	53	),
      new Cliente(	8,	14,	50	),
      new Cliente(	6,	15,	51	),
      new Cliente(	5,	16,	54	),
      new Cliente(	12,	28,	33	),
      new Cliente(	13,	33,	38	),
      new Cliente(	7,	30,	50	),
      new Cliente(	7,	13,	40	),
      new Cliente(	8,	15,	36	),
      new Cliente(	11,	18,	31	),
      new Cliente(	13,	25,	37	),
      new Cliente(	11,	30,	46	),
      new Cliente(	10,	25,	52	),
      new Cliente(	7,	16,	33	),
      new Cliente(	4,	25,	35	),
      new Cliente(	20,	5,	40	),
      new Cliente(	13,	5,	50	)
    ];

    buscarRutas(central, vehiculos, clientes);
  } else if(instancia == "VRPNC12m") {
    const Q= 200;
    var central = new Deposito (40, 50);
    var vehiculos = [
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
      new Vehiculo (Q, central),
    ];
    var clientes =[
      new Cliente(	10,	45,	68	),
      new Cliente(	30,	45,	70	),
      new Cliente(	10,	42,	66	),
      new Cliente(	10,	42,	68	),
      new Cliente(	10,	42,	65	),
      new Cliente(	20,	40,	69	),
      new Cliente(	20,	40,	66	),
      new Cliente(	20,	38,	68	),
      new Cliente(	10,	38,	70	),
      new Cliente(	10,	35,	66	),
      new Cliente(	10,	35,	69	),
      new Cliente(	20,	25,	85	),
      new Cliente(	30,	22,	75	),
      new Cliente(	10,	22,	85	),
      new Cliente(	40,	20,	80	),
      new Cliente(	40,	20,	85	),
      new Cliente(	20,	18,	75	),
      new Cliente(	20,	15,	75	),
      new Cliente(	10,	15,	80	),
      new Cliente(	10,	30,	50	),
      new Cliente(	20,	30,	52	),
      new Cliente(	20,	28,	52	),
      new Cliente(	10,	28,	55	),
      new Cliente(	10,	25,	50	),
      new Cliente(	40,	25,	52	),
      new Cliente(	10,	25,	55	),
      new Cliente(	10,	23,	52	),
      new Cliente(	20,	23,	55	),
      new Cliente(	10,	20,	50	),
      new Cliente(	10,	20,	55	),
      new Cliente(	20,	10,	35	),
      new Cliente(	30,	10,	40	),
      new Cliente(	40,	8,	40	),
      new Cliente(	20,	8,	45	),
      new Cliente(	10,	5,	35	),
      new Cliente(	10,	5,	45	),
      new Cliente(	20,	2,	40	),
      new Cliente(	30,	0,	40	),
      new Cliente(	20,	0,	45	),
      new Cliente(	10,	35,	30	),
      new Cliente(	10,	35,	32	),
      new Cliente(	20,	33,	32	),
      new Cliente(	10,	33,	35	),
      new Cliente(	10,	32,	30	),
      new Cliente(	10,	30,	30	),
      new Cliente(	30,	30,	32	),
      new Cliente(	10,	30,	35	),
      new Cliente(	10,	28,	30	),
      new Cliente(	10,	28,	35	),
      new Cliente(	10,	26,	32	),
      new Cliente(	10,	25,	30	),
      new Cliente(	10,	25,	35	),
      new Cliente(	20,	44,	5	),
      new Cliente(	40,	42,	10	),
      new Cliente(	10,	42,	15	),
      new Cliente(	30,	40,	5	),
      new Cliente(	40,	40,	15	),
      new Cliente(	30,	38,	5	),
      new Cliente(	10,	38,	15	),
      new Cliente(	20,	35,	5	),
      new Cliente(	10,	50,	30	),
      new Cliente(	20,	50,	35	),
      new Cliente(	50,	50,	40	),
      new Cliente(	10,	48,	30	),
      new Cliente(	10,	48,	40	),
      new Cliente(	10,	47,	35	),
      new Cliente(	10,	47,	40	),
      new Cliente(	10,	45,	30	),
      new Cliente(	10,	45,	35	),
      new Cliente(	30,	95,	30	),
      new Cliente(	20,	95,	35	),
      new Cliente(	10,	53,	30	),
      new Cliente(	10,	92,	30	),
      new Cliente(	50,	53,	35	),
      new Cliente(	20,	45,	65	),
      new Cliente(	10,	90,	35	),
      new Cliente(	10,	88,	30	),
      new Cliente(	20,	88,	35	),
      new Cliente(	10,	87,	30	),
      new Cliente(	10,	85,	25	),
      new Cliente(	30,	85,	35	),
      new Cliente(	20,	75,	55	),
      new Cliente(	10,	72,	55	),
      new Cliente(	20,	70,	58	),
      new Cliente(	30,	68,	60	),
      new Cliente(	10,	66,	55	),
      new Cliente(	20,	65,	55	),
      new Cliente(	30,	65,	60	),
      new Cliente(	10,	63,	58	),
      new Cliente(	10,	60,	55	),
      new Cliente(	10,	60,	60	),
      new Cliente(	20,	67,	85	),
      new Cliente(	40,	65,	85	),
      new Cliente(	10,	65,	82	),
      new Cliente(	30,	62,	80	),
      new Cliente(	10,	60,	80	),
      new Cliente(	30,	60,	85	),
      new Cliente(	20,	58,	75	),
      new Cliente(	10,	55,	80	),
      new Cliente(	20,	55,	85	),
    ];

    buscarRutas(central, vehiculos, clientes);
  }


  document.getElementById("bks").innerHTML = bks.toFixed(4);
});
