import { AllCommunityModule, ColDef, ModuleRegistry, themeAlpine, themeBalham, themeMaterial, themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemo, useState } from 'react';
import { Theme } from 'react-toastify';
import { AllEnterpriseModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([AllEnterpriseModule]);

export default function Dashboard() {
  const [rowData] = useState([
    { make: "تسلا", model: "مدل Y", price: 64950, electric: true, 1: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, mollitia asperiores at totam molestiae autem velit illo cupiditate delectus impedit inventore sunt voluptatem quis laudantium eaque ut dignissimos eligendi esse.", 2: "23", 3: "123" },
    { make: "فورد", model: "F-Series", price: 33850, electric: false, 1: "123", 2: "23", 3: "123" },
    { make: "تسلا", model: "مدل Y", price: 64950, electric: true, 1: "123", 2: "23", 3: "123" },
    { make: "تسلا", model: "مدل Y", price: 64950, electric: true, 1: "123", 2: "23", 3: "123" },
    { make: "تسلا", model: "مدل Y", price: 64950, electric: true, 1: "123", 2: "23", 3: "123" },
    { make: "تسلا", model: "مدل Y", price: 64950, electric: true, 1: "123", 2: "23", 3: "123" },
    { make: "تسلا", model: "مدل Y", price: 64950, electric: true, 1: "123", 2: "23", 3: "123" },
    { make: "تسلا", model: "مدل Y", price: 64950, electric: true, 1: "123", 2: "23", 3: "123" },
    { make: "تسلا", model: "مدل Y", price: 64950, electric: true, 1: "123", 2: "23", 3: "123" },

  ]);

  // تنظیمات ستون‌ها
  const [columnDefs] = useState<ColDef[]>([
    { field: "make", headerName: "مارک", },
    { field: "model", headerName: "مدل" },
    { field: "price", headerName: "قیمت" },
    { field: "1", headerName: "الکتریکی" },
    { field: "2", headerName: "الکتریکی" },
    {
      field: "3", headerName: "الکتریکی",
    },
  ]);
  const myTheme = themeQuartz.withParams({
    backgroundColor: "#F7F9FC",
    foregroundColor: "#1F2937",
    headerTextColor: "#FFFFFF",
    headerBackgroundColor: "#334155", // ← ملایم‌ترش کردیم
    oddRowBackgroundColor: "#F1F5F9",
    headerColumnResizeHandleColor: "#CBD5E1",  // رنگ دستگیره ریسایز – ظریف و مدرن
  });
  return (
    <div>

      <div
        style={{
          width: '100%',
          height: '600px',
        }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          theme={myTheme}
          defaultColDef={{
            filter: true,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
          }}
        />
      </div>
      <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, mollitia asperiores at totam molestiae autem velit illo cupiditate delectus impedit inventore sunt voluptatem quis laudantium eaque ut dignissimos eligendi esse.</span>
    </div>
  );
}
