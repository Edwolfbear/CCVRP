// CLASSES

class Deposito {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Vehiculo {
  constructor(capacidad, ubicacion) {
    this.capacidad = capacidad;
    this.ubicacion = ubicacion;
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
      if(cliente.estado == "sin entregar") {
        distancias.push([
          this.distancia(cliente),
          clientes.indexOf(cliente)
        ]);
      }
    }

    let clienteIndex = distancias[
      distancias.map(row => row[0]).indexOf(
        Math.min(...distancias.map(row => row[0]))
      )
    ][1];

    let clienteIndexAnterior = clientes.indexOf(this.ubicacion);

    this.entregar(clientes[clienteIndex]);
    this.irA(clientes[clienteIndex]);
    this.capacidad -= clientes[clienteIndex].demanda;

    return [clienteIndexAnterior+1, clienteIndex+1];
  }

  irA(ubicacion) { this.ubicacion = ubicacion; }

  entregar(cliente) { cliente.estado = "entregado"; }
}

class Cliente {
  constructor(demanda, x, y) {
    this.demanda = demanda;
    this.estado = "sin entregar";
    this.x = x;
    this.y = y;
  }
}

// VARS

const Q = 160;

var central = new Deposito(30, 40);
var vehiculos = [
  new Vehiculo(Q, central),
  new Vehiculo(Q, central),
  new Vehiculo(Q, central),
  new Vehiculo(Q, central),
  new Vehiculo(Q, central)
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
for(let i=0; i<10; i++) {
for(let vehiculo of vehiculos) {
  let ruta = vehiculo.buscarRuta(clientes);
  links.push({ source: ruta[0], target: ruta[1] });
}
}
// CHART

var chart = echarts.init(document.getElementById("chart"));
document.getElementById("chart").style = `
  width: ${window.innerWidth}px;
  height: ${window.innerHeight}px;
`;

this.chart.resize();

this.chart.setOption({
  tooltip: {},
  series: [{
    type: "graph",
    data: data,
    links: links,
    scaleLimit: { min: 1.20 },
  }]
});
