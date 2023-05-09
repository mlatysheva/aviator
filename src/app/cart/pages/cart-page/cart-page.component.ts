import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { CellClickedEvent, ColDef, GridReadyEvent, ValueGetterParams } from 'ag-grid-community';
import { AppState } from '../../../store/state.models';
import { HttpClient } from '@angular/common/http';
import { CartApiService } from '../../services/cart-api.service';
import { USER_ID } from '../../../constants/localStorage';
import { ICart } from '../../../models/cart';
import { ITrip } from '../../../models';
import { Observable, Subscription } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { NewLineKind } from 'typescript';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})

export class CartPageComponent implements OnInit {
  cartId = '00e0d78e-b1e7-4099-a1c7-7b73cd92d12f';
  cart$: Subscription;
  // cart$ = this.cartApiService.getCart(this.cartId);
  trips: ITrip[] = [];
  trips$: Observable<ITrip[]>;

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  public colDefs: ColDef[] = [
    {
      headerName: 'No.',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 120,
      showDisabledCheckboxes: true,
      cellStyle: { color: '#0090BD', 'fontWeight': '700'},
      valueGetter: flightNosGetter,
    },
    { 
      headerName: 'Flight',
      filter: true,
      floatingFilter: false,
      cellRenderer: flightGetter,
    },
    {
      headerName: 'Trip Type',
      width: 140,
      valueGetter: tripTypeGetter,
      sortable: true,
      unSortIcon: true
    },
    {
      headerName: 'Date & Time',
      minWidth: 230,
      cellRenderer: dateTimeGetter,
      sortable: true,
      unSortIcon: true,
    },
    {
      headerName: 'Passengers',
      width: 140,
      cellRenderer: passengersGetter,
    },
    { 
      headerName: 'Price',
      width: 120,
      field: 'totalAmount',
      cellStyle: { color: "#7F8906" },
      sortable: true,
      unSortIcon: true
    },
    {
      width: 70,
      cellRenderer: moreActionsRenderer,
      cellStyle: { cursor: 'pointer' },
      onCellClicked: this.showActionsMenu.bind(this),
    }
  ];

  defaultColDef: ColDef = {
    resizable: true,
    autoHeight: true,
    wrapText: true, 
    wrapHeaderText: true,
    autoHeaderHeight: true,    
    cellStyle: { 
      padding: '1rem', 
      lineHeight: '1.5rem', 
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: '500',
    },
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private cartApiService: CartApiService,
  ) {}

  ngOnInit(): void {
    this.cart$ = this.cartApiService.getCart(this.cartId);
    this.trips$ = this.cartApiService.getTripsByCartId(this.cartId);
  }

  onGridReady(params: GridReadyEvent) {
    // this.trips$ = this.cartApiService.getTripsByCartId(this.cartId);
  }

  showActionsMenu(event: CellClickedEvent) {
    console.log(event);
  }

  clearSelection() {
    this.agGrid.api.deselectAll();
  }

  addNewTrip() {
    this.router.navigate(['main']);
  }
}

function flightNosGetter(params: ValueGetterParams) {
  return params.data.outboundFlightNo + '  \n' + params.data.returnFlightNo;
}

function flightGetter(params: ValueGetterParams) {
  return params.data.originCity + ' - ' + params.data.destinationCity + (params.data.roundTrip ? '<br>' + params.data.destinationCity + ' - ' + params.data.originCity : '');
}

function tripTypeGetter (params: ValueGetterParams) {
  return params.data.roundTrip ? 'Round Trip' : 'One Way';
}

function dateTimeGetter (params: ValueGetterParams) {
  return params.data.outboundDepartureDate + ', ' + params.data.outboundDepartureTime + ' - ' + params.data.outboundArrivalTime + (params.data.roundTrip ? '<br>' + params.data.returnDepartureDate + ', ' + params.data.returnDepartureTime  + ' - ' + params.data.returnArrivalTime : '');
}

function passengersGetter (params: ValueGetterParams) {
  let adult = 0;
  let child = 0;
  let infant = 0;
  params.data.passengers.map((passenger: any) => {
    if (passenger.ageCategory === 'adult') {
      adult++;
    } else if (passenger.ageCategory === 'child') {
      child++;
    } else if (passenger.ageCategory === 'infant') {
      infant++;
    }
  });
  return adult + ' x Adult' + (child ? '<br>' + child + ' x Child' : '') + (infant ? '<br>' + infant + ' x Infant' : '');
}

function moreActionsRenderer() {
  return '<i class="material-icons">more_vert</i>'
  // const eIconGui = document.createElement('div');         
  // return eIconGui.innerHTML = `
  //   <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Example icon-button with a menu">
  //     <mat-icon>more_vert</mat-icon>
  //   </button>
  //   <mat-menu #menu="matMenu">
  //     <button mat-menu-item>
  //       <mat-icon>dialpad</mat-icon>
  //       <span>Redial</span>
  //     </button>
  //     <button mat-menu-item disabled>
  //       <mat-icon>voicemail</mat-icon>
  //       <span>Check voice mail</span>
  //     </button>
  //     <button mat-menu-item>
  //       <mat-icon>notifications_off</mat-icon>
  //       <span>Disable alerts</span>
  //     </button>
  //   </mat-menu>
  // `
} 

// <mat-icon>more_vert</mat-icon>

function actionCellRenderer(params: any) {
  const eGui = document.createElement("div");

  const editingCells = params.api.getEditingCells();
  // checks if the rowIndex matches in at least one of the editing cells
  const isCurrentRowEditing = editingCells.some((cell: any) => {
    return cell.rowIndex === params.node.rowIndex;
  });

  if (isCurrentRowEditing) {
    eGui.innerHTML = `
    <mat-icon>more_vert</mat-icon>
      <button  class="action-button update"  data-action="update"> update  </button>
      <button  class="action-button cancel"  data-action="cancel" > cancel </button>
    `;
  } else {
    eGui.innerHTML = `
      <button class="action-button edit"  data-action="edit" > edit  </button>
      <button class="action-button delete" data-action="delete" > delete </button>
    `;
  }

  return eGui;
}
