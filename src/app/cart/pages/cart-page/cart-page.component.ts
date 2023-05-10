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
import getSymbolFromCurrency from 'currency-symbol-map'



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

  currency$ = this.store.select(selectUserCurrency);
  currency: string | undefined;

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
        width: 100,
        editable: false,
        cellEditorPopup: true,
        colId: 'moreActions',
        // cellRenderer: this.renderMenuWithActions.bind(this),
        cellRenderer: this.actionCellRenderer.bind(this),
        cellStyle: { 
          cursor: 'pointer',
          opacity: '0.5',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
         },
        // onCellClicked: this.showActionsMenu.bind(this),
        onCellClicked: this.onCellClicked.bind(this),
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['Delete', 'Edit'],
            handleGridCellEvent: this.onDataChangeHandler.bind(this),
        }
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
      },
    };
  }

  ngOnInit(): void {
    this.currency$.subscribe((currency) => {
      this.currency = currency;
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.cart$ = this.cartApiService.getCart(this.cartId);
    this.trips$ = this.cartApiService.getTripsByCartId(this.cartId);

    this.totalPrice$ = this.trips$.pipe(
      map((trips) => {
        const price =  trips.reduce((acc, trip) => acc + trip.totalAmount, 0);
        return price;
      }
    ));
  }

  private onDataChangeHandler() {
    // console.log('onDataChangeHandler');
  }

  renderMenuWithActions(params: ICellRendererParams) {
    const eGui = document.createElement('div');
    eGui.innerHTML =  `
      <select name="actions" id="actions">
        <option value="options" default>...</option>
        <option value="edit" data-action="edit">Edit</option>
        <option value="delete" data-action="delete">Delete</option>
      </select>
    `
    return eGui;
  }

  actionCellRenderer(params: any) {
    const eGui = document.createElement("div");

    eGui.innerHTML = `
      <div class="material-icons" title="Edit" data-action="edit">edit</div>
      <div class="material-icons" title="Delete" data-action="delete">delete</div>
    `;
  
    return eGui;
  }

  showActionsMenu(params: any) {
    const actionType = params.event.target.dataset.action;
    if (actionType === 'edit') {
      this.agGrid.api.startEditingCell({
        rowIndex: params.node.rowIndex,
        colKey: 'moreActions'
      });
    } else if (actionType === 'delete') {
      this.agGrid.api.applyTransaction({ remove: [params.node.data] });
    } 
  }

  onCellClicked(params: any) {
    if (params.column.colId === "moreActions" && params.event.target.dataset.action) {
      const action = params.event.target.dataset.action;

      if (action === "edit") {
        this.router.navigate(['flights', this.cartId]);

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

      if (action === "update") {
        params.api.stopEditing(false);
      }

      if (action === "cancel") {
        params.api.stopEditing(true);
      }
    }
  }

  onRowEditingStarted(params: any) {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  }

  onRowEditingStopped(params: any) {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  }

  renderEditButton() {
    const eIconGui = document.createElement('span');         
    return  eIconGui.innerHTML = '<em class="material-icons">more_vert</em>';          
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

