/*
RESPUESTAS PARTE 4.1:
1. ¿En qué archivo se define la interfaz Juego?
   Respuesta: 
en el interfaces/juego.interface.ts
2. ¿Qué archivo maneja el estado global de los filtros?
   Respuesta: inicio/lista-juegos/lista-juegos.component.ts

3. ¿Dónde se configura el HttpClient para la aplicación?
   Respuesta: 
En el main.ts
/*
RESPUESTAS PARTE 4.2:
1. ¿Por qué este proyecto NO tiene app.module.ts?
   Respuesta: En lugar de declarar componentes en un módulo raíz como AppModule, ahora
    los componentes pueden ser autónomos (standalone), lo que significa que se definen y configuran 
    por sí mismos sin necesidad de estar registrados en un módulo.



2. ¿Qué ventaja tiene usar BehaviorSubject en el servicio de juegos?
   Respuesta: permite mantener y emitir el valor actual de la lista de juegos en todo momento, lo que facilita que los componentes reciban automáticamente
    el último estado disponible sin necesidad de esperar un nuevo valor. 
   Además, permite actualizar los datos desde el servicio y notificar a todos los suscriptores de forma reactiva.
*/
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Juego } from '../../interfaces/juego.interface';
import { JuegosDataService } from '../../services/juegos-data.service';

interface EstadisticasData {
  totalJuegos: number;
  juegosGratuitos: number;
  juegosDePago: number;
  mejorJuego: Juego | null;
  promedioPrecio: number;
}

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent implements OnInit {
  estadisticas$!: Observable<EstadisticasData>;

  constructor(private juegosService: JuegosDataService) {}

  ngOnInit(): void {
    this.estadisticas$ = this.juegosService.obtenerJuegos().pipe(
      map((juegos: Juego[]) => this.calcularEstadisticas(juegos))
    );
  }

  private calcularEstadisticas(juegos: Juego[]): EstadisticasData {
    const totalJuegos = juegos.length;
    const juegosGratuitos = juegos.filter(juego => juego.esGratis).length;
    const juegosDePago = totalJuegos - juegosGratuitos;
    
  
    const mejorJuego = juegos.reduce((mejor, actual) => 
      actual.rating > (mejor?.rating || 0) ? actual : mejor, 
      null as Juego | null
    );

   
    const juegosPagados = juegos.filter(juego => !juego.esGratis);
    const promedioPrecio = juegosPagados.length > 0 
      ? juegosPagados.reduce((sum, juego) => sum + juego.precio, 0) / juegosPagados.length
      : 0;

    return {
      totalJuegos,
      juegosGratuitos,
      juegosDePago,
      mejorJuego,
      promedioPrecio
    };
  }

  obtenerEstrellas(rating: number): number[] {
    const estrellas = Math.floor(rating);
    return Array(5).fill(0).map((_, i) => i < estrellas ? 1 : 0);
  }
}