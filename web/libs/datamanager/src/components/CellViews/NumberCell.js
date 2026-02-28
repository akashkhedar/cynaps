import { Tooltip } from "@cynaps/ui";
import { isDefined } from "../../utils/utils";

const formatNumber = (num) => {
  const number = Number(num);

  if (num % 1 === 0) {
    return number;
  }
  return number.toFixed(3);
};

export const NumberCell = (props) => {
  // `props` here will contain { column, original, value }
  // from standard react-table / DataManager cell rendering
  const { column, original, value } = props;
  
  const formattedValue = isDefined(value) ? formatNumber(value) : "";

  if (column?.alias === "cancelled_annotations" && original?.needs_rework && original?.rejection_reason) {
    return (
      <Tooltip title={`Rejection Reason: ${original.rejection_reason}`}>
        <span style={{ cursor: "help", borderBottom: "1px dotted #DD0000" }}>{formattedValue}</span>
      </Tooltip>
    );
  }

  return formattedValue;
};

// NumberCell.userSelectable = false;

