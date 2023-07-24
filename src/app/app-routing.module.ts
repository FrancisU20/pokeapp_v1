import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SelectPokemonComponent } from './components/select-pokemon/select-pokemon.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditComponent } from './components/edit/edit.component';
import { EditPokemonsComponent } from './components/edit-pokemons/edit-pokemons.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'select-pokemon', component: SelectPokemonComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'edit-info', component: EditComponent },
  { path: 'edit-pokemons', component: EditPokemonsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
