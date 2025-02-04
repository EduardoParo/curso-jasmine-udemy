import { Component, OnInit, ViewChild } from '@angular/core';
import { PoModalComponent, PoNotificationService, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { finalize } from 'rxjs';
import { PokemonService } from '../../shared/services/pokemon.service';
import { TableService } from '../../shared/services/table.service';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
})
export class PokemonComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;
  isLoading = false;
  titleToolbar = '';
  breadcrumb: any;
  title = '';
  infoPage = '';
  items: any[] = [];
  columns!: PoTableColumn[];
  resApi = '';
  isMoreItems = false;
  numPage = 0;
  titleModal = '';
  tableActions!: PoTableAction[];
  abilitiesPokemon!: any[];

  constructor(
    private tableService: TableService,
    private pokemonService: PokemonService,
    private poNotification: PoNotificationService,
  ) {

  }

  ngOnInit(): void {
    this.title = 'Pokemon';
    this.onInitBreadCrumb();
    this.onInitItems();
    this.onInitColumns();
  }

  getAppName(): string {
    return 'FORMAÇÃO JASMINE';
  }

  onInitBreadCrumb(): void {
    this.breadcrumb = {
      items: [{ label: 'Home', link: '/' }, { label: this.title }],
    };
  };

  onInitColumns(): void {
    this.columns = this.tableService.getColumnsPokemons();

    this.tableActions = [
      {
        action: this.handleAction.bind(this),
        icon: 'po-icon-eye',
        label: 'Mostrar',
      },
    ];
  };

  handleAction(pokemon: any): void {
    this.titleModal = pokemon.name;
    this.pokemonService.getPokemonInformation(pokemon.url)
      .then(res => {
        this.abilitiesPokemon = res.abilities;
        this.poModal.open();
      }

      )
      .catch(err => {
        this.poNotification.error('Erro - handleAction');
      });
  };

  onInitItems(): void {
    this.isLoading = true;
    this.pokemonService.getAllPokemons(this.numPage)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res) => {
          if (res.results) {
            if (this.items.length >= 1) {
              this.items = this.items.concat(res.results);
            } else {
              this.items = res.results;
            }
          }
        },
        error: (err) => {
          this.poNotification.error('Erro - onInitItems');
        }

      });
  };

  loadMoreItems(): void {
    this.numPage += 5;
    this.onInitItems();
  };

  closeModal(): void {
    this.poModal.close();
  }
}
