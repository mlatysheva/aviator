import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, ValueGetterParams } from 'ag-grid-community';
import getSymbolFromCurrency from 'currency-symbol-map';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { PROMO_DISOUNT } from '../../../constants/appConstants';
import { USER_ID, TRIP_ID } from '../../../constants/localStorage';
import { IUser, ITrip } from '../../../models';
import { setSelectedTrip, clearSelectedTrip } from '../../../store/actions/select.actions';
import { selectUserCurrency } from '../../../store/selectors/user.selectors';
import { AppState } from '../../../store/state.models';
import { UserService } from '../../../user/services/user.service';
import { CartApiService } from '../../services/cart-api.service';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {

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

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  colDefs: ColDef[];
  defaultColDef: ColDef;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private http: HttpClient,
    private cartApiService: CartApiService,
    private userService: UserService,
  ) {
    this.colDefs = [
      {
        headerName: 'No.',
        checkboxSelection: true,
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
    this.trips$ = this.cartApiService.getPaidTripsByUserId(this.userId);
  }

  onCellClicked(event: any) {
    this.selectedRows$.next(this.agGrid.api.getSelectedNodes().length);
  }

  onSelectionChanged(event: any) {
    this.selectedRows$.next(this.agGrid.api.getSelectedNodes().length);
  }

  priceRenderer(params: ValueGetterParams) {
    return `${this.currency} ${params.data.totalAmount}`;
  }

  actionCellRenderer(params: any) {
    const eGui = document.createElement("div");

    eGui.innerHTML = `
      <div class="material-icons" title="More" data-action="more">more</div>
    `;
    return eGui;
  }

  onActionMenuClicked(params: any) {
    this.selectedRows = this.agGrid?.gridOptions?.api?.getSelectedNodes().length;

    if (params.column.colId === "moreActions" && params.event.target.dataset.action) {
      const action = params.event.target.dataset.action;
      const tripId = params.node.data.id;

      if (action === "more") {
        localStorage.setItem(TRIP_ID, tripId);
        const currentTrip$ = this.cartApiService.getTrip(tripId);
        currentTrip$.subscribe((currentTrip) => {
          this.store.dispatch(setSelectedTrip({ ...currentTrip }));
          this.router.navigate(['summary']);
        });
      }
    }
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
  return params.data.outboundDepartureDate + ', ' + params.data.outboundDepartureTime + ' - ' + params.data.outboundArrivalTime + (params.data.roundTrip ? '<br>' + params.data.returnDepartureDate + ', ' + params.data.returnDepartureTime + ' - ' + params.data.returnArrivalTime : '');
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
