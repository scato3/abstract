"use client";

import React, { createContext, useContext, ReactNode } from "react";
import styles from "./DataTable.module.scss";

// 기본 데이터 타입 정의
export interface TableItem {
  id: number | string; // number와 string 모두 허용
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // 모든 프로퍼티 허용
}

// 정렬 방향 정의 (외부에서도 사용할 수 있게 export)
export type SortDirection = "asc" | "desc" | null;

// 정렬 함수 타입 정의 (외부에서도 사용할 수 있게 export)
export type SortFunction<T> = (a: T, b: T, direction: SortDirection) => number;

// Context 타입 정의
type DataTableContextType<T extends TableItem = TableItem> = {
  data: T[];
};

// Context 생성
const DataTableContext = createContext<DataTableContextType | undefined>(
  undefined
);

// DataTable 메인 컴포넌트
interface DataTableProps<T extends TableItem = TableItem> {
  data: T[];
  children: ReactNode;
}

function DataTable<T extends TableItem = TableItem>({
  data,
  children,
}: DataTableProps<T>) {
  return (
    <DataTableContext.Provider value={{ data }}>
      <div className={styles["data-table-container"]}>{children}</div>
    </DataTableContext.Provider>
  );
}

// Context 사용을 위한 훅
const useDataTable = <T extends TableItem = TableItem>() => {
  const context = useContext(DataTableContext) as DataTableContextType<T>;
  if (context === undefined) {
    throw new Error("useDataTable must be used within a DataTable");
  }
  return context;
};

// Header 컴포넌트
interface HeaderProps {
  children: ReactNode;
}

const Header = ({ children }: HeaderProps) => {
  return <div className={styles["data-table-header"]}>{children}</div>;
};

// Row 컴포넌트
interface RowProps {
  children: ReactNode;
  index: number;
}

const Row = ({ children, index }: RowProps) => {
  return (
    <div
      className={`${styles["data-table-row"]} ${
        index % 2 === 0 ? styles.even : styles.odd
      }`}
    >
      {children}
    </div>
  );
};

interface CellProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const Cell = ({ children, onClick, className = "" }: CellProps) => {
  return (
    <div
      className={`${styles["data-table-cell"]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Body 컴포넌트
interface BodyProps<T extends TableItem> {
  children: (item: T, index: number) => ReactNode;
}

function Body<T extends TableItem>(props: BodyProps<T>) {
  const { children } = props;
  const { data } = useDataTable<T>();

  return (
    <div className={styles["data-table-body"]}>
      {data.map((item, index) => (
        <React.Fragment key={item.id}>{children(item, index)}</React.Fragment>
      ))}
    </div>
  );
}

// 타입 정의 및 타입 캐스팅을 위한 타입
type BodyComponent = <T extends TableItem>(
  props: BodyProps<T>
) => React.ReactElement;

// Compound Pattern 구성
DataTable.Header = Header;
DataTable.Body = Body as BodyComponent;
DataTable.Row = Row;
DataTable.Cell = Cell;

export { DataTable, useDataTable };
export default DataTable;
