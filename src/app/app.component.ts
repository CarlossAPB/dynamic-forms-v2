import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { AppFormColumn, AppFormField, AppFormFieldType, AppFormRow, AppFormTemplate, AppGenericSelectableOption } from 'src/classes/AppGenericClasses';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'dynamic-forms';

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
                    min: 50
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
                    placeholder: 'name@example.com'
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
      value: AppFormFieldType.TEXT_FIELD
    },
    {
      label: 'Campo númerico',
      value: AppFormFieldType.NUMBER
    },
    {
      label: 'Campo de email',
      value: AppFormFieldType.EMAIL
    }
  ]

  ngOnInit() {
    this.formTemplate.layout = [

      {
        key: 'g-0',
        gridLayout: [
          ['name', 'age'],
          []
        ]
      }, {
        key: 'g-1',
        gridLayout: [
          ['address'],
          ['phone', 'email']
        ]
      }
    ]
  }

  colSelected!: AppFormColumn

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  addRow(rows: AppFormRow[]) {
    const newIdx = rows.push(new AppFormRow())
    return rows[newIdx - 1]
  }

  removeRow(rows: AppFormRow[], idx: number) {
    rows.splice(idx, 1)
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
  }

  onAddFieldToCol(col: AppFormColumn) {
    this.colSelected = col
  }
}
