import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from 'src/app/models/user';
import { PokeapiService } from 'src/app/services/pokeapi.service';

@Component({
  selector: 'app-select-pokemon',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isLoading: boolean = true;
  userData = new UserInfo();
  pokemonArray: any[] = [];

  constructor(private pokeapiService: PokeapiService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.retrieveUserData();
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  getPokemonDataById(id: number): void {
    this.pokeapiService.getPokemonById(id).subscribe(
      (data) => {
        this.pokemonArray.push(data);
      },
      (error) => {
        console.error('Error fetching Pokemon data:', error);
      }
    );
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
    const ageFromLocalStorage = localStorage.getItem('edad');
    this.userData.yearsOld = ageFromLocalStorage
      ? parseInt(ageFromLocalStorage)
      : 0;
    const pokemonsString = localStorage.getItem('pokemons');
    const pokemonsIndices = JSON.parse(pokemonsString!);

    pokemonsIndices.forEach((pokemonIndex: number) => {
      this.getPokemonDataById(pokemonIndex);
    });

    this.userData.pokemonsData = this.pokemonArray;
  }

  redirectToEditarPerfil(): void {
    this.router.navigate(['/edit-info']);
  }

  redirectToEditarPokemons(): void {
    this.router.navigate(['/edit-pokemons']);
  }
}
