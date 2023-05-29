import "ag-grid-community/styles/ag-grid.css" // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css" // Optional theme CSS
import { AgGridReact } from "ag-grid-react"
import { useCallback, useRef, useState } from "react"
import { utils, writeFileXLSX } from "xlsx"
import "./App.css"
import FileUploadSingle from "./FileUploadSingle.tsx"
import { getData } from "./data"

function App() {
  const gridRef = useRef()
  console.log("🚀 ~ file: App.tsx:13 ~ App ~ gridRef:", gridRef)

  const columnDefs = [
    {
      field: "id",
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    {
      headerName: "Part Details",
      children: [
        {
          field: "part_name",
          headerName: "Part Name",
          filter: "agTextColumnFilter",
          editable: true,
        },
        { field: "part_number", columnGroupShow: "open" },
        {
          field: "discount",
          filter: "agTextColumnFilter",
          columnGroupShow: "open",
          valueFormatter: (params) => {
            return `${params.value}%`
          },
        },
        {
          field: "price",
          filter: "agTextColumnFilter",
          columnGroupShow: "close",
        },
      ],
    },
    {
      field: "brand",
      editable: true,
    },
  ]
  const [data, setData] = useState(getData())

  const onBtnExport = useCallback(() => {
    gridRef?.current.api.exportDataAsCsv({
      // columnSeparator: "|",
      skipColumnGroupHeaders: true,
      allColumns: true,
    })
  }, [])

  const getCurrentData = () => {
    if (gridRef.current) {
      const rowData = []
      gridRef.current.api.forEachNode((node) => {
        rowData.push(node.data)
      })
      const data = utils.json_to_sheet(rowData)

      const wb = utils.book_new()
      utils.book_append_sheet(wb, data, "Sheet1")
      writeFileXLSX(wb, "test.xlsx")
    }
  }

  return (
    <div
      style={{
        width: "1200px",
        height: "600px",
      }}
      className="ag-theme-alpine"
    >
      <AgGridReact
        ref={gridRef}
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          resizable: true,
          filter: true,
          floatingFilter: true,
        }}
        rowSelection={"multiple"}
      />
      <button onClick={getCurrentData}>Export</button>
      {/* <button onClick={onBtnExport}>Export CSV</button> */}
      <FileUploadSingle gridref={gridRef} />
    </div>
  )
}

export default App
