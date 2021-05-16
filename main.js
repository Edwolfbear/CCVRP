class Cliente {
  constructor(demanda, x, y) {
    this.demanda = demanda;
    this.estado = "sin entregar";
    this.x = x;
    this.y = y;
  }
}

class Vehiculo {
  constructor(capacidad) { this.capacidad = capacidad; }

  entregar(cliente) { cliente.estado = "entregado"; }
}

class Deposito {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const Q = 120;

var central = new Deposito(0, 0);
var vehiculos = [
  new Vehiculo(Q),
  new Vehiculo(Q)
];
