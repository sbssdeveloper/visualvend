import React, { useEffect, useState } from "react";
import TableWithPagination from "../../../../Widgets/web/CommonTable";

export default function PastOrders() {
  return (
    <div className="w--full h--full bg--white p--sm radius--md">
      <TableWithPagination />
    </div>
  );
}
