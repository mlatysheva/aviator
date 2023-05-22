import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColDef, GridReadyEvent, ValueGetterParams } from 'ag-grid-community';
import { AppState } from '../../../store/state.models';
import { CartApiService } from '../../services/cart-api.service';
import { ITrip, IUser } from '../../../models';
import { Observable, map, switchMap, tap } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { selectUserCurrency } from '../../../store/selectors/user.selectors';
import getSymbolFromCurrency from 'currency-symbol-map';
import { TRIP_ID, USER_ID } from '../../../constants/localStorage';
import { PROMO_DISOUNT } from '../../../constants/appConstants';
import { BehaviorSubject } from 'rxjs';
import { clearSelectedTrip, setSelectedTrip } from '../../../store/actions/select.actions';
import { UserService } from '../../../user/services/user.service';



@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})

export class CartPageComponent implements OnInit {

  userId = localStorage.getItem(USER_ID) || '';
  user$: Observable<IUser>;

  trips$: Observable<ITrip[]>;

  cartCount$: Observable<number>;
  cartCount: number;

  totalPrice$: Observable<number>;
  totalPrice: number;

  currency$ = this.store.select(selectUserCurrency);
  currency: string | undefined;

  isCodeApplied = false;
  promoCode: string | undefined;

  selectedRows$ = new BehaviorSubject<number>(0);
  selectedRows: number | undefined;

  isPaymentDisabled$ = new BehaviorSubject<boolean>(true);

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  colDefs: ColDef[];
  defaultColDef: ColDef;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private cartApiService: CartApiService,
    private userService: UserService,
  ) {
    this.colDefs = [
      {
        headerName: 'No.',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        onCellClicked: this.onCellClicked.bind(this),
        width: 120,
        showDisabledCheckboxes: true,
        cellStyle: { color: '#0090BD', 'fontWeight': '700' },
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
      onCellClicked: this.onSelectionChanged.bind(this),
    };
  }

  ngOnInit(): void {
    this.currency$.subscribe((currency) => {
      this.currency = getSymbolFromCurrency(currency);
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.user$ = this.userService.getUserById(this.userId);
    this.user$.subscribe((user) => {
      this.promoCode = user.promoCode;
      this.isCodeApplied = user.isCodeApplied || false;
    });
    
    this.trips$ = this.cartApiService.getUnpaidTripsByUserId(this.userId);

    this.trips$.subscribe((trips) => {
      this.cartApiService.cartCount$.next(trips.length);
      this.cartCount = trips.length;
      this.isPaymentDisabled$.next(trips.length === 0);
    });

    this.calculateTotalPrice(1);
    this.selectedRows$.next(this.agGrid.api.getSelectedNodes().length);
  }

  onCellClicked(event: any) {
    this.selectedRows$.next(this.agGrid.api.getSelectedNodes().length);
  }

  onSelectionChanged(event: any) {
    this.selectedRows$.next(this.agGrid.api.getSelectedNodes().length);
  }

  priceRenderer(params: ValueGetterParams) {
    return `${this.currency} ${Math.round(params.data.totalAmount.sumPrice 
      + params.data.totalAmount.totalTax
      + (params.data.totalAmountFrom?.sumPrice || 0)
      + (params.data.totalAmountFrom?.totalTax || 0))
    }`;
  }

  actionCellRenderer(params: any) {
    const eGui = document.createElement("div");

    eGui.innerHTML = `
      <div class="material-icons" title="Edit" data-action="edit">edit</div>
      <div class="material-icons" title="Delete" data-action="delete">delete</div>
    `;
    return eGui;
  }

  calculateTotalPrice(factor = 1) {
    this.totalPrice$ = this.trips$.pipe(
      map((trips) => {
        const price = trips.reduce((acc, trip) =>
          acc + (trip.totalCalculatedAmount || 0), 0);
        return Math.round(price * factor);
      }
    ));
  }

  onActionMenuClicked(params: any) {
    this.selectedRows = this.agGrid?.gridOptions?.api?.getSelectedNodes().length;

    if (params.column.colId === "moreActions" && params.event.target.dataset.action) {
      const action = params.event.target.dataset.action;
      const tripId = params.node.data.id;

      if (action === "edit") {
        localStorage.setItem(TRIP_ID, tripId);
        const currentTrip$ = this.cartApiService.getTrip(tripId);
        currentTrip$.subscribe((currentTrip) => {
          this.store.dispatch(setSelectedTrip({ ...currentTrip }));
          this.router.navigate(['flights']);
        });
      }

      if (action === "delete") {
        this.cartApiService.deleteTrip(tripId, this.userId).pipe(
          switchMap(() => this.cartApiService.getUnpaidTripsByUserId(this.userId)),
          tap(() => this.cartApiService.cartCount$.next(this.cartCount - 1)),
          tap(() => this.calculateTotalPrice(1)),
          tap(() => this.store.dispatch(clearSelectedTrip())),
          tap(() => localStorage.removeItem(TRIP_ID)),
          tap(() => params.api.applyTransaction({ remove: [params.node.data] }))
        ).subscribe();
      }
    }
  }

  addNewTrip() {
    this.router.navigate(['main']);
    localStorage.removeItem(TRIP_ID);
  }

  applyPromoCode() {
    if (this.promoCode && !this.isCodeApplied) {
      this.calculateTotalPrice(0.95);
      this.isCodeApplied = true;
      this.trips$ = this.cartApiService.applyPromoCode(this.userId, PROMO_DISOUNT);
      alert(`Promo Code "${this.promoCode}" with a 5% discount will be applied!`);
    } else if (this.isCodeApplied) {
      alert('Promo Code has already been applied!');
    } else {
      alert('Please enter a valid promo code!');
    }
  }

  onPayment() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    if (selectedNodes.length === 0) {
      alert('Please select a row to make a payment');
      return;
    }

    const selectedData = selectedNodes.map(node => node.data);
    const totalPrice = selectedData[0].totalCalculatedAmount;

    alert(`Payment of ${this.currency} ${Math.round(totalPrice)} has been successful!`);
    for (const data of selectedData) {
      this.cartApiService.payTrip(data.id);
    }
    this.cartApiService.cartCount$.next(this.cartCount - selectedData.length);
    this.store.dispatch(clearSelectedTrip());
    localStorage.removeItem(TRIP_ID);
    this.agGrid.api.applyTransaction({
      remove: selectedData
    });
    this.calculateTotalPrice(1);
  }
}

function flightNosGetter(params: ValueGetterParams) {
  return params.data.outboundFlightNo + '  \n' + params.data.returnFlightNo;
}

function flightGetter(params: ValueGetterParams) {
  return params.data.originCity + ' - ' + params.data.destinationCity + (params.data.roundTrip ? '<br>' + params.data.destinationCity + ' - ' + params.data.originCity : '');
}

function tripTypeGetter(params: ValueGetterParams) {
  return params.data.roundTrip ? 'Round Trip' : 'One Way';
}

function dateTimeGetter(params: ValueGetterParams) {
  // return params.data.outboundDepartureDate + ', ' + params.data.outboundDepartureTime + ' - ' + params.data.outboundArrivalTime + (params.data.roundTrip ? '<br>' + params.data.returnDepartureDate + ', ' + params.data.returnDepartureTime + ' - ' + params.data.returnArrivalTime : '');
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  } as const;
  console.log(typeof params.data.outboundDepartureDate);
  console.log(params.data.outboundDepartureDate);
  return (new Date(params.data.outboundDepartureDate).toLocaleString('en-GB', options)) 
  // + ', ' + params.data.outboundDepartureTime 
  // + ' - ' + params.data.outboundArrivalTime 
  + (params.data.roundTrip ? '<br>' + (new Date(params.data.returnDepartureDate).toLocaleString('en-GB', options)) 
  // + ', ' + params.data.returnDepartureTime + ' - ' + params.data.returnArrivalTime
  : '');
}

function passengersGetter(params: ValueGetterParams) {
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


