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
      cellStyle: { color: '#0090BD', 'fontWeight': '700',  padding: '1rem', 
      lineHeight: '1.5rem', 
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'},
      valueGetter: flightNosGetter,
    },
    { 
      headerName: 'Price',
      field: 'totalAmount',
    },
    { 
      headerName: 'Flight',
      cellRenderer: function flightGetter(params: ValueGetterParams) {
        return params.data.originCity + ' - ' + params.data.destinationCity + (params.data.roundTrip ? '<br>' + params.data.destinationCity + ' - ' + params.data.originCity : '');
      },
      cellStyle: { 'lineHeight': '1.5rem' },
    },
    // {
    //   headerName: 'Trip Type',
    //   valueGetter: tripTypeGetter,
    // },
  //   {
  //     headerName: 'Date & Time',
  //     valueGetter: dateTimeGetter,
  //   },
  //   {
  //     headerName: 'Passengers',
  //     valueGetter: passengersGetter,
  //   },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
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
      alignItems: 'center'
    },
  };

  constructor(
    private store: Store<AppState>,
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

  onCellClicked(event: CellClickedEvent) {
    console.log(event);
  }

  clearSelection() {
    this.agGrid.api.deselectAll();
  }
}

function flightNosGetter(params: ValueGetterParams) {
  console.log(params);
  return params.data.outboundFlightNo + '  \n' + params.data.returnFlightNo;
}

function flightGetter (params: ValueGetterParams) {
  return params.data.originCity + ' - ' + params.data.destinationCity + (params.data.roundTrip ? ' \n' + params.data.destinationCity + ' - ' + params.data.originCity : '');
}

function tripTypeGetter (params: ValueGetterParams) {
  console.log(params);
  return params.data.flight.roundTrip ? 'Round Trip' : 'One Way';
}

function dateTimeGetter (params: ValueGetterParams) {
  return params.data.flight.departureDate + ' ' + params.data.flight.departureTime + (params.data.flight.returnFlightId ? ', ' + params.data.flight.returnDate + ' ' + params.data.flight.returnTime : '');
}

function passengersGetter (params: ValueGetterParams) {
  return params.data.flight.passengers.adult + ' x Adult' + (params.data.flight.passengers.child ? ', ' + params.data.flight.passengers.child + ' x Child' : '') + (params.data.flight.passengers.infant ? ', ' + params.data.flight.passengers.infant + ' x Infant' : '');
}
