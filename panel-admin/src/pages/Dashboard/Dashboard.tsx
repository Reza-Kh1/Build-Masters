import { ColDef, themeQuartz } from 'ag-grid-community';
import { AgGridReact } from "ag-grid-react";


export default function Dashboard() {
  const rowData = [
    { make: "تسلا", model: "مدل Y", price: 64950, electric: true, 1: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, mollitia asperiores at totam molestiae autem velit illo cupiditate delectus impedit inventore sunt voluptatem quis laudantium eaque ut dignissimos eligendi esse.", 2: "23", 3: "123" },
    { make: "فورد", model: "F-Series", price: 33850, electric: false, 1: "123", 2: "23", 3: "123" },
    { make: "تسلا", model: "مدل Y", price: 64950, electric: true, 1: "123", 2: "23", 3: "123" },
    { make: "تسلا", model: "مدل Y", price: 64950, electric: true, 1: "123", 2: "23", 3: "123" },
    { make: "تسلا", model: "مدل Y", price: 64950, electric: true, 1: "123", 2: "23", 3: "123" },
    { make: "تسلا", model: "مدل Y", price: 64950, electric: true, 1: "123", 2: "23", 3: "123" },
    { make: "تسلا", model: "مدل Y", price: 64950, electric: true, 1: "123", 2: "23", 3: "123" },
    { make: "تسلا", model: "مدل Y", price: 64950, electric: true, 1: "123", 2: "23", 3: "123" },
    { make: "تسلا", model: "مدل Y", price: 64950, electric: true, 1: "123", 2: "23", 3: "123" },
  ];

  const columnDefs: ColDef[] = [
    { field: "make", headerName: "مارک", },
    { field: "model", headerName: "مدل" },
    { field: "price", headerName: "قیمت" },
    { field: "1", headerName: "الکتریکی" },
    { field: "2", headerName: "الکتریکی" },
    { field: "3", headerName: "الکتریکی" },
  ]
 const myTheme = themeQuartz.withParams({
    backgroundColor: "#F7F9FC",
    foregroundColor: "#1F2937",
    headerTextColor: "#FFFFFF",
    headerBackgroundColor: "#334155",
    oddRowBackgroundColor: "#F1F5F9",
    headerColumnResizeHandleColor: "#CBD5E1",
  });
  return (
      <div className='w-full h-[600px] [--ag-font-size:16px] [--ag-font-family:iranSans]'>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          rowHeight={55}
          rowClass={'pt-2'}
          theme={myTheme}
          defaultColDef={{
            cellStyle: { direction: 'rtl' },
            headerStyle: { direction: 'rtl' },
            filter: true,
            sortable: true,
            resizable: true,
          }}
        />
      </div>
  );
}
