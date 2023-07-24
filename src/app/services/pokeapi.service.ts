import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PokemonResumeInfo } from '../models/pokemon';
import { PokemonStats } from '../models/pokemon-stats';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokeapiService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getAllPokemons(page: number): PokemonResumeInfo[] {
    var pokemonArray: PokemonResumeInfo[] = [];
    this.http
      .get<any>(`${this.apiUrl}/pokemon?limit=9&offset=${page}`)
      .subscribe((data) => {
        let pokemonData = data.results;
        let idGenerator = 1;
        pokemonData.forEach((pokemon: any) => {
          let pokemonResumeInfo = new PokemonResumeInfo();
          pokemonResumeInfo.id = idGenerator;
          pokemonResumeInfo.name =
            pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
          pokemonResumeInfo.urlInfo = pokemon.url;
          this.http.get<any>(pokemon.url).subscribe((dataInfoComplete) => {
            pokemonResumeInfo.urlImage =
              dataInfoComplete.sprites.other.home.front_default;
          });
          pokemonArray.push(pokemonResumeInfo);
          idGenerator++;
        });
      });
    return pokemonArray;
  }

  getTotalPokemons(): PokemonResumeInfo[] {
    var pokemonArray: PokemonResumeInfo[] = [];
    this.http
      .get<any>(`${this.apiUrl}/pokemon?limit=1000000&offset=0`)
      .subscribe((data) => {
        let pokemonData = data.results;
        let idGenerator = 1;
        pokemonData.forEach((pokemon: any) => {
          let pokemonResumeInfo = new PokemonResumeInfo();
          pokemonResumeInfo.id = idGenerator;
          pokemonResumeInfo.name =
            pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
          pokemonResumeInfo.name = pokemonResumeInfo.name.replace(/-/g, ' ');
          pokemonResumeInfo.urlInfo = pokemon.url;
          this.http.get<any>(pokemon.url).subscribe((dataInfoComplete) => {
            if (dataInfoComplete.sprites.other.home.front_default == null) {
              if (dataInfoComplete.sprites.front_default != null) {
                pokemonResumeInfo.urlImage =
                  dataInfoComplete.sprites.front_default;
              } else {
                pokemonResumeInfo.urlImage = 'assets/pokeball.png';
              }
            } else {
              pokemonResumeInfo.urlImage =
                dataInfoComplete.sprites.other.home.front_default;
            }
          });
          pokemonArray.push(pokemonResumeInfo);
          idGenerator++;
        });
      });
    return pokemonArray;
  }

  getPokemonById(id: number): Observable<PokemonStats> {
    return this.http.get<any>(`${this.apiUrl}/pokemon/${id}`).pipe(
      map((pokemon: any) => {
        let pokemonStats = new PokemonStats();
        pokemonStats.abilities = pokemon.abilities;
        pokemonStats.base_experience = pokemon.base_experience;
        pokemonStats.forms = pokemon.forms;
        pokemonStats.game_indices = pokemon.game_indices;
        pokemonStats.height = pokemon.height;
        pokemonStats.held_items = pokemon.held_items;
        pokemonStats.id = pokemon.id;
        pokemonStats.is_default = pokemon.is_default;
        pokemonStats.location_area_encounters =
          pokemon.location_area_encounters;
        pokemonStats.moves = pokemon.moves;
        pokemonStats.name = pokemon.name;
        pokemonStats.order = pokemon.order;
        pokemonStats.past_types = pokemon.past_types;
        pokemonStats.species = pokemon.species;
        pokemonStats.sprites = pokemon.sprites;
        pokemonStats.stats = pokemon.stats;
        pokemonStats.types = pokemon.types;
        pokemonStats.weight = pokemon.weight;
        return pokemonStats;
      })
    );
  }
}
