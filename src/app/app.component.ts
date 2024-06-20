import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, HostListener, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ActionHistory, AppFormColumn, AppFormField, AppFormFieldType, AppFormGroup, AppFormLayout, AppFormRow, AppFormTemplate, AppGenericSelectableOption, DragDropAction, ArrayAction, ArrayActionType, FormGroupAction, FormFieldAction, DynamicFormActionHistory, DynamicFormAction } from 'src/classes/AppGenericClasses';
import { Utils } from 'src/utils/Utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  constructor(public messageService: MessageService) { }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'z':
          this.undo();
          break;
        case 'y':
          this.redo();
          break;
        case 'c':
          this.save();
          break;
      }
    }
  }

  title = 'dynamic-forms';
  smScreen = window.innerWidth < 768;
  mdScreen = window.innerWidth < 992;

  formTemplate: AppFormTemplate = new AppFormTemplate([
    {
      key: 'g-0',
      title: 'Datos personales',
      grid: {
        rows: [
          {
            cols: [
              {
                field: new AppFormField(
                  'name',
                  'Nombre',
                  AppFormFieldType.TEXT_FIELD,
                  'TEXT',
                  {
                    required: true
                  }
                )
              },
              {
                field: new AppFormField(
                  'age',
                  'Edad',
                  AppFormFieldType.NUMBER,
                  'NUMBER',
                  {
                    max: 100,
                    min: 1
                  }
                )
              }
            ]
          },
          {
            cols: [
              {
                field: new AppFormField(
                  'email',
                  'Email',
                  AppFormFieldType.EMAIL,
                  'TEXT',
                  {
                    placeholder: 'name@example.com',
                    helpText: 'Por favor incluir una dirección de correo valida.'
                  }
                )
              }
            ]
          },
          {
            cols: [
              {
                field: new AppFormField(
                  'address',
                  'Dirección',
                  AppFormFieldType.TEXT_FIELD,
                  'TEXT',
                  {
                    disabled: true
                  }
                )
              }
            ]
          },
          {
            cols: [
              {
                field: new AppFormField(
                  'description',
                  'Descripción',
                  AppFormFieldType.TEXT_FIELD,
                  'TEXT',
                  {
                    multiline: true
                  }
                )
              }
            ]
          }
        ]
      }
    },
    {
      key: 'g-1',
      title: 'Información de contacto',
      grid: {
        rows: [
          {
            cols: [
              {
                field: new AppFormField(
                  'phone',
                  'Telefono',
                  AppFormFieldType.TEXT_FIELD,
                  'TEXT'
                )
              }
            ]
          }
        ]
      }
    }
  ])
  formLayout: AppFormLayout = new AppFormLayout(this.formTemplate)

  dataTypeOptions: AppGenericSelectableOption[] = [
    {
      label: 'Texto',
      value: 'TEXT'
    },
    {
      label: 'Número',
      value: 'NUMBER'
    }
  ]
  controlTypeOptions: AppGenericSelectableOption[] = [
    {
      label: 'Campo de texto',
      value: AppFormFieldType.TEXT_FIELD,
      type: 'TEXT'
    },
    {
      label: 'Campo númerico',
      value: AppFormFieldType.NUMBER,
      type: 'NUMBER'
    },
    {
      label: 'Campo de email',
      value: AppFormFieldType.EMAIL,
      type: 'TEXT'
    }
  ]
  controlTypeOptionsFiltered: AppGenericSelectableOption[] = []
  htmlClasses: AppGenericSelectableOption[] = [
    {
      label: 'Input pequenio',
      value: 'p-inputtext-sm'
    }
  ]
  htmlClassesFiltered: AppGenericSelectableOption[] = []
  htmlClassesSelected: AppGenericSelectableOption[] = []
  showFieldForm = false
  showGroupForm = false
  preview = false

  actionHistory: DynamicFormActionHistory = new ActionHistory<DragDropAction | ArrayAction | FormGroupAction | FormFieldAction>()

  ngOnInit() {
    this.validateResolution()
  }

  groupSelected!: AppFormGroup
  groupSelectedCopy!: AppFormGroup
  colSelected!: AppFormColumn
  colSelectedCopy!: AppFormColumn

  drop(event: CdkDragDrop<any[]>) {
    this.transferDragDropItem(event.previousContainer, event.container, event.previousIndex, event.currentIndex)
    if (this.itIsNotTheSameContainer(event)) {
      this.actionHistory.undoActions.push(new DragDropAction(
        event.container,
        event.currentIndex,
        event.previousContainer,
        event.previousIndex
      ))
      this.actionHistory.redoActions = []
    }
  }

  itIsNotTheSameContainer(event: CdkDragDrop<any[]>) {
    return event.previousContainer !== event.container || (event.previousIndex != event.currentIndex)
  }

  transferDragDropItem(
    previousContainer: CdkDropList<any[]>,
    currentContainer: CdkDropList<any[]>,
    previousIndex: number,
    currentIndex: number
  ) {
    if (previousContainer === currentContainer) {
      moveItemInArray(currentContainer.data, previousIndex, currentIndex);
    } else {
      transferArrayItem(
        previousContainer.data,
        currentContainer.data,
        previousIndex,
        currentIndex,
      );
    }
  }

  onFormAction(container: any[], newIdx: number, type: ArrayActionType) {
    this.actionHistory.undoActions.push(new ArrayAction(
      container[newIdx],
      container,
      newIdx,
      type
    ))
    this.actionHistory.redoActions = []
  }

  addGroup() {
    const newGroupNum = this.formTemplate.groups.length + 1
    this.formTemplate.groups.push({
      key: `g-${newGroupNum}`,
      title: `Grupo #${newGroupNum}`,
      grid: {
        rows: [
          {
            cols: []
          }
        ]
      }
    })
    this.onFormAction(this.formTemplate.groups, this.formTemplate.groups.length - 1, 'INSERT')
  }

  removeGroup(idx: number) {
    this.onFormAction(this.formTemplate.groups, idx, 'DELETE')
    this.formTemplate.groups.splice(idx, 1)
  }

  onEditGroup(group: AppFormGroup) {
    this.onGroupAction(group)
    this.showGroupForm = true
  }

  onGroupAction(group: AppFormGroup) {
    this.groupSelectedCopy = Utils.deepCopy(group)
    this.groupSelected = group
  }

  onGroupActionEnd() {
    if (JSON.stringify(this.groupSelected) !== JSON.stringify(this.groupSelectedCopy)) {
      this.actionHistory.undoActions.push(new FormGroupAction(this.groupSelectedCopy, this.groupSelected))
      this.actionHistory.redoActions = []
    }
  }

  addRow(rows: AppFormRow[]) {
    const newIdx = rows.push(new AppFormRow())
    this.onFormAction(rows, rows.length - 1, 'INSERT')
    return rows[newIdx - 1]
  }

  removeRow(rows: AppFormRow[], idx: number) {
    this.onFormAction(rows, idx, 'DELETE')
    rows.splice(idx, 1)
  }

  removeColumn(columns: AppFormColumn[], idx: number) {
    this.onFormAction(columns, idx, 'DELETE')
    columns.splice(idx, 1)
  }

  addRowWithField(rows: AppFormRow[]) {
    this.addRow(rows).cols.push({
      field: new AppFormField(
        '',
        'Label',
        AppFormFieldType.TEXT_FIELD,
        'TEXT'
      )
    })
  }

  addFieldToRow(row: AppFormRow) {
    row.cols.push({
      field: new AppFormField(
        '',
        'Label',
        AppFormFieldType.TEXT_FIELD,
        'TEXT'
      )
    })
    this.onFormAction(row.cols, row.cols.length - 1, 'INSERT')
  }

  onEditField(col: AppFormColumn) {
    this.onColumnAction(col)
    this.showFieldForm = true
    this.filterControlTypes()
  }

  onColumnAction(col: AppFormColumn) {
    this.colSelectedCopy = Utils.deepCopy(col)
    this.colSelected = col
  }

  onColumnActionEnd() {
    if (JSON.stringify(this.colSelected) !== JSON.stringify(this.colSelectedCopy)) {
      this.actionHistory.undoActions.push(new FormFieldAction(this.colSelectedCopy.field, this.colSelected.field))
      this.actionHistory.redoActions = []
    }
  }

  onDataTypeChange() {
    this.filterControlTypes()
  }

  filterControlTypes() {
    this.controlTypeOptionsFiltered = this.controlTypeOptions.filter(option => {
      return option.type === this.colSelected.field.dataType
    })
  }

  searchHtmlClass(ev: AutoCompleteCompleteEvent) {
    this.htmlClassesFiltered = this.htmlClasses.filter(option => {
      return option.label.toLowerCase().indexOf(ev.query.toLowerCase()) == 0
    })
  }

  onHTMLClassesChange() {
    this.colSelected.field.htmlClass = this.htmlClassesSelected.map(option => option.value)?.join(' ')
  }

  onSubmit() { }

  get connectedLists() {
    const lists = this.formTemplate.groups.map((group, groupIdx) => {
      const ids: string[] = []
      group.grid.rows.forEach((row, rowIdx) => {
        ids.push(`group-${groupIdx}-row-${rowIdx}`)
      })
      return ids
    }).flat()
    return lists;
  }

  validateResolution() {
    this.smScreen = window.innerWidth < 768;
    this.mdScreen = window.innerWidth < 992;

    this.formLayout.groups = [
      {
        key: 'g-1',
        gridLayout: [
          ['address'],
          ['phone', 'email']
        ]
      },
      {
        key: 'g-0',
        gridLayout: [
          ['name', 'age'],
          ['description']
        ]
      }
    ]

    if (this.mdScreen) {
      this.formLayout.groups = [
        {
          key: 'g-1',
          gridLayout: [
            ['email'],
            ['phone', 'address']
          ]
        },
        {
          key: 'g-0',
          gridLayout: [
            ['name', 'age'],
            ['description']
          ]
        }
      ]
    }
    if (this.smScreen) {
      this.formLayout.groups = [
        {
          key: 'g-1',
          gridLayout: [
            ['address'],
            ['phone'],
            ['email']
          ]
        },
        {
          key: 'g-0',
          gridLayout: [
            ['name'],
            ['age'],
            ['description']
          ]
        }
      ]
    }
    this.formTemplate.groups = this.formLayout.buildTemplate()
  }

  save() {
    this.actionHistory.redoActions = []
    this.messageService.add({ key: 'tc', severity: 'success', summary: '¡Exito!', detail: 'Se han guardado los datos' });
  }

  onHistoryAction(currentActionContainer: DynamicFormAction[], contraryActionContainer: DynamicFormAction[]) {
    const lastAction = currentActionContainer.pop()
    if (lastAction) {
      if (lastAction instanceof DragDropAction) {
        this.handleLastDragDropAction(contraryActionContainer, lastAction)
      }
      if (lastAction instanceof ArrayAction) {
        this.handleLastFormAction(contraryActionContainer, lastAction)
      }
      if (lastAction instanceof FormGroupAction) {
        this.handleLastFormGroupAction(contraryActionContainer, lastAction)
      }
      if (lastAction instanceof FormFieldAction) {
        this.handleLastFormFieldAction(contraryActionContainer, lastAction)
      }
    }
  }

  undo() {
    this.onHistoryAction(this.actionHistory.undoActions, this.actionHistory.redoActions)
  }

  redo() {
    this.onHistoryAction(this.actionHistory.redoActions, this.actionHistory.undoActions)
  }

  handleLastDragDropAction(actions: any[], lastAction: DragDropAction) {
    this.transferDragDropItem(
      lastAction.previousContainer,
      lastAction.currentContainer,
      lastAction.previousIndex,
      lastAction.currentIndex
    )
    actions.push(new DragDropAction(
      lastAction.currentContainer,
      lastAction.currentIndex,
      lastAction.previousContainer,
      lastAction.previousIndex
    ))
  }

  handleLastFormAction(actions: any[], lastAction: ArrayAction) {
    if (lastAction.type === 'DELETE') {
      lastAction.container.splice(lastAction.idx, 0, lastAction.item)
    } else {
      lastAction.container.splice(lastAction.idx, 1)
    }
    actions.push(new ArrayAction(
      lastAction.item,
      lastAction.container,
      lastAction.idx,
      lastAction.type === 'INSERT' ? 'DELETE' : 'INSERT'
    ))
  }

  handleLastFormGroupAction(actions: any[], lastAction: FormGroupAction) {
    actions.push(new FormGroupAction(
      Utils.deepCopy(lastAction.current),
      lastAction.current
    ))
    lastAction.current.title = lastAction.previous.title
  }

  handleLastFormFieldAction(actions: any[], lastAction: FormFieldAction) {
    actions.push(new FormFieldAction(
      Utils.deepCopy(lastAction.current),
      lastAction.current
    ))
    Object.assign(lastAction.current, lastAction.previous)
  }
}
