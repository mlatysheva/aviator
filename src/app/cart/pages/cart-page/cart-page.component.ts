import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { CellClickedEvent, ColDef, GridReadyEvent, ICellRendererParams, SelectCellEditor, ValueGetterParams } from 'ag-grid-community';
import { AppState } from '../../../store/state.models';
import { HttpClient } from '@angular/common/http';
import { CartApiService } from '../../services/cart-api.service';
import { ITrip } from '../../../models';
import { Observable, Subscription, map } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { selectUserCurrency } from '../../../store/selectors/user.selectors';
import getSymbolFromCurrency from 'currency-symbol-map';




@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})

export class CartPageComponent implements OnInit {
  cartId = '00e0d78e-b1e7-4099-a1c7-7b73cd92d12f';
  cart$: Subscription;
  trips$: Observable<ITrip[]>;

  totalPrice$: Observable<number>;
  totalPrice: number;

  currency$ = this.store.select(selectUserCurrency);
  currency: string | undefined;

  promoCode: string | undefined;

  selectedRows$: Observable<number>;
  selectedRows: number | undefined;

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  colDefs: ColDef[];
  defaultColDef: ColDef;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private http: HttpClient,
    private cartApiService: CartApiService,
  ) {
    this.colDefs = [
      {
        headerName: 'No.',
        headerCheckboxSelection: true,
        checkboxSelection: true,
        onCellClicked: this.onCheckboxClicked.bind(this),
        width: 120,
        showDisabledCheckboxes: true,
        cellStyle: { color: '#0090BD', 'fontWeight': '700'},
        headerClass: 'ag-header-cell--centered',
        valueGetter: flightNosGetter,
      },
      { 
        headerName: 'Flight',
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
        unSortIcon: true,
        cellRenderer: this.priceRenderer.bind(this),
      },
      {
        width: 100,
        editable: false,
        cellEditorPopup: true,
        colId: 'moreActions',
        cellRenderer: this.actionCellRenderer.bind(this),
        cellStyle: { 
          cursor: 'pointer',
          opacity: '0.5',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
         },
        onCellClicked: this.onActionMenuClicked.bind(this),
        cellEditor: 'agSelectCellEditor',
      },
    ];
  
    this.defaultColDef = {
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
        textAlign: 'center',
      },
      cellClass: 'cellCenter',
    };
  }

  ngOnInit(): void {
    this.currency$.subscribe((currency) => {
      this.currency = getSymbolFromCurrency(currency);
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.cart$ = this.cartApiService.getCart(this.cartId);
    this.trips$ = this.cartApiService.getTripsByCartId(this.cartId);

    this.totalPrice$ = this.trips$.pipe(
      map((trips) => {
        const price =  trips.reduce((acc, trip) => acc + trip.totalAmount, 0);
        this.totalPrice = price;
        return price;
      }
    ));
  }

  onCellClicked(e: any) { 
    this.selectedRows = this.agGrid?.gridOptions?.api?.getSelectedNodes().length;
    console.log(this.selectedRows);
  }

  onCheckboxClicked(event: CellClickedEvent) {
    // this.selectedRows = this.agGrid.gridOptions.api.getSelectedRows().length;
    console.log('onCheckboxClicked', event);

    this.selectedRows = this.agGrid?.gridOptions?.api?.getSelectedNodes().length;
    console.log('selectedRows', this.selectedRows);
  }

  onSelectionChanged(event: any) {
    console.log('onSelectionChanged', event);

    // this.selectedRows = event.api.getSelectedRows().length;
    this.selectedRows = this.agGrid?.gridOptions?.api?.getSelectedNodes().length;
    console.log('selectedRows', this.selectedRows);
  }


  priceRenderer(params: ValueGetterParams) {
    return `${this.currency} ${params.data.totalAmount}`;
  }

  actionCellRenderer(params: any) {
    const eGui = document.createElement("div");

    eGui.innerHTML = `
      <div class="material-icons" title="Edit" data-action="edit">edit</div>
      <div class="material-icons" title="Delete" data-action="delete">delete</div>
    `;
    return eGui;
  }

  onActionMenuClicked(params: any) {
    this.selectedRows = this.agGrid?.gridOptions?.api?.getSelectedNodes().length;

    if (params.column.colId === "moreActions" && params.event.target.dataset.action) {
      const action = params.event.target.dataset.action;
      const tripId = params.node.data.id;
      console.log('tripId', tripId);

      if (action === "edit") {
        this.router.navigate(['flights']);

        params.api.startEditingCell({
          rowIndex: params.node.rowIndex,
          // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
        });
      }

      if (action === "delete") {
        params.api.applyTransaction({
          remove: [params.node.data]
        });
      }
    }
  }

  addNewTrip() {
    this.router.navigate(['main']);
  }

  applyPromoCode() {
    if (this.promoCode) {
      alert(`Promo Code "${this.promoCode}" has been applied!`);
    } else {
      alert('Please enter a valid promo code!');
    }
  }

  onPayment() {
    alert(`Payment of ${this.currency}${this.totalPrice} is successful!`);
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


