"use client";

import React from "react";
import DataTable from "./index";
import { useGetUsers } from "@/app/query/userService";
import { getAgeColor } from "@/app/utils/styleUtils";

export default function DataTableExample() {
  const { data: users } = useGetUsers();

  return (
    <div>
      <h1>DataTable 정렬 기능 예시</h1>

      <DataTable data={users}>
        <DataTable.Header>
          <DataTable.Row index={-1}>
            <DataTable.Cell>ID</DataTable.Cell>
            <DataTable.Cell>이름</DataTable.Cell>
            <DataTable.Cell>나이</DataTable.Cell>
            <DataTable.Cell>직업</DataTable.Cell>
          </DataTable.Row>
        </DataTable.Header>

        <DataTable.Body>
          {(item, index) => (
            <DataTable.Row key={item.id} index={index}>
              <DataTable.Cell>{item.id}</DataTable.Cell>
              <DataTable.Cell>{item.name}</DataTable.Cell>
              <DataTable.Cell>
                <span style={{ color: getAgeColor(item.age) }}>
                  {item.age}세
                </span>
              </DataTable.Cell>
              <DataTable.Cell>{item.job}</DataTable.Cell>
            </DataTable.Row>
          )}
        </DataTable.Body>
      </DataTable>
    </div>
  );
}
