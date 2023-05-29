import { ChangeEvent, useState } from "react"
import { read, utils, writeFileXLSX } from "xlsx"

function FileUploadSingle({ gridref }) {
  const [file, setFile] = useState<File>()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUploadClick = async () => {
    if (!file) {
      return
    }

    const f = await file.arrayBuffer()
    const wb = await read(f)
    const data = await utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
    gridref.current.api.setRowData(data)
  }

  return (
    <div
      style={{
        display: "flex",
        paddingBottom: "30px",
      }}
    >
      <input type="file" onChange={handleFileChange} accept=".xlsx" />

      {file && <button onClick={handleUploadClick}>Import</button>}
    </div>
  )
}

export default FileUploadSingle
