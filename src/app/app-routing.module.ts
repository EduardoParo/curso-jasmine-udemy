import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViaCepComponent } from './features/viaCep/via-cep.component';
import { PokemonComponent } from './features/pokemon/pokemon.component';

const routes: Routes = [
  { path: '', component: PokemonComponent },
  { path: 'viacep', component: ViaCepComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
