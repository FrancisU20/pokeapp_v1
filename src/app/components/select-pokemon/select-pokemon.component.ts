import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonResumeInfo } from 'src/app/models/pokemon';
import { UserInfo } from 'src/app/models/user';
import { PokeapiService } from 'src/app/services/pokeapi.service';


@Component({
  selector: 'app-select-pokemon',
  templateUrl: './select-pokemon.component.html',
  styleUrls: ['./select-pokemon.component.scss'],
})
export class SelectPokemonComponent implements OnInit {
  isLoading: boolean = true;
  page: number = 0;
  searchText: string = '';
  selectedPokemons: number[] = []; // Updated property to store the IDs of selected Pokemon
  userData = new UserInfo();
  pokemonList: PokemonResumeInfo[] = [];
  pokemonData: PokemonResumeInfo[] = [];
  pokemonDataByFilter: PokemonResumeInfo[] = [];
  isSaveButtonDisabled: boolean = true; // New property to disable the save button initially

  constructor(private pokeapiService: PokeapiService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.retrieveUserData();
    this.pokemonData = this.pokeapiService.getAllPokemons(this.page);
    this.pokemonList = await this.pokeapiService.getTotalPokemons();
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }

  nextPage() {
    this.page = this.page + 9;
    this.pokemonData = this.pokeapiService.getAllPokemons(this.page);
  }

  backPage() {
    this.page = this.page - 9;
    this.pokemonData = this.pokeapiService.getAllPokemons(this.page);
  }

  async filterPokemon() {
    if (this.searchText.length > 0) {
      const filteredPokemon = this.pokemonList.filter(
        (pokemon) =>
          pokemon.id.toString().includes(this.searchText) ||
          pokemon.name
            .toLocaleUpperCase()
            .includes(this.searchText.toLocaleUpperCase())
      );
      this.pokemonData = filteredPokemon.slice(0, 9);
    } else {
      this.pokemonData = this.pokeapiService.getAllPokemons(this.page);
    }
  }

  private calculateAge(birthday: string) {
    const birthdayDate = new Date(birthday);
    const today = new Date();
    let years = today.getFullYear() - birthdayDate.getFullYear();
    const months = today.getMonth() - birthdayDate.getMonth();
    if (
      months < 0 ||
      (months === 0 && today.getDate() < birthdayDate.getDate())
    ) {
      years--;
    }
    return years;
  }

  async retrieveUserData() {
    this.userData.name = localStorage.getItem('nombre')!;
    this.userData.hobbie = localStorage.getItem('pasatiempo')!;
    this.userData.birthday = localStorage.getItem('cumpleanos')!;
    this.userData.image = localStorage.getItem('imagen')!;
    const duiFromLocalStorage = localStorage.getItem('dui');
    this.userData.dui =
      duiFromLocalStorage !== 'undefined'
        ? duiFromLocalStorage
        : 'Menor de edad';
    this.userData.yearsOld = this.calculateAge(this.userData.birthday);
    localStorage.setItem('edad', this.userData.yearsOld.toString());
  }

  selectPokemon(pokemonId: number) {
    if (this.selectedPokemons.includes(pokemonId)) {
      this.selectedPokemons = this.selectedPokemons.filter(
        (id) => id !== pokemonId
      );
    } else if (this.selectedPokemons.length < 3) {
      this.selectedPokemons.push(pokemonId);
    }

    this.isSaveButtonDisabled = this.selectedPokemons.length !== 3;
  }

  isPokemonSelected(pokemonId: number): boolean {
    return this.selectedPokemons.includes(pokemonId);
  }

  isPokemonNotSelected(pokemonId: number): boolean {
    return this.selectedPokemons.length === 3 && !this.selectedPokemons.includes(pokemonId);
  }

  saveSelectedPokemons() {
    const selectedPokemonsToSave = this.selectedPokemons.slice(0, 3);
    localStorage.setItem('pokemons', JSON.stringify(selectedPokemonsToSave));
    this.router.navigate(['/dashboard']);
  }
}
