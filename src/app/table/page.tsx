"use client";

import { Suspense } from "react";
import DataTableExample from "../components/DataTable/example";

export default function TablePage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <DataTableExample />
      </Suspense>
    </div>
  );
}
