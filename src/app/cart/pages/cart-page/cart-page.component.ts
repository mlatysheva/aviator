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
import { state } from '@angular/animations';


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

  currency = this.store.select(selectUserCurrency);

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
        headerName: 'More Actions',
        width: 70,
        editable: false,
        cellEditorPopup: true,
        colId: 'moreActions',
        // cellRenderer: this.renderEditButton,
        cellRenderer: actionCellRenderer,
        // cellRenderer: this.getSelectedValue.bind(this),
        cellStyle: { cursor: 'pointer' },
        onCellClicked: this.showActionsMenu.bind(this),
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


  private onDataChangeHandler() {
    console.log('onDataChangeHandler');
  }

  ngOnInit(): void {
    console.log('we are in ngOnInit');
  }

  onGridReady(params: GridReadyEvent) {
    console.log('we are in onGridReady');
    this.cart$ = this.cartApiService.getCart(this.cartId);
    this.trips$ = this.cartApiService.getTripsByCartId(this.cartId);
    this.currency = this.store.select(state => state.user.currency);
    console.log(this.currency);


    this.totalPrice$ = this.trips$.pipe(
      map((trips) => {
        console.log(trips);
        const price =  trips.reduce((acc, trip) => acc + trip.totalAmount, 0);
        console.log(price);
        return price;
      }
    ));
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
  
  onCellClicked(params: any) {
    console.log(params.column.colId);
    console.log(params.event.target.dataset);
    if (params.column.colId === "moreActions" && params.event.target.dataset.action) {
      const action = params.event.target.dataset.action;
      console.log('we are in moreActions');

      if (action === "edit") {
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

  renderEditButton() {
    const eIconGui = document.createElement('span');         
    return  eIconGui.innerHTML = '<em class="material-icons">more_vert</em>';          
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
  const eIconGui = document.createElement('div');         
  return eIconGui.innerHTML = `
    <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Example icon-button with a menu">
      <mat-icon>more_vert</mat-icon>
    </button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item>
        <mat-icon>dialpad</mat-icon>
        <span>Redial</span>
      </button>
      <button mat-menu-item disabled>
        <mat-icon>voicemail</mat-icon>
        <span>Check voice mail</span>
      </button>
      <button mat-menu-item>
        <mat-icon>notifications_off</mat-icon>
        <span>Disable alerts</span>
      </button>
    </mat-menu>
  `
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

