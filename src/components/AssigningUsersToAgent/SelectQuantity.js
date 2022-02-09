import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import CheckBoxOutlineBlankIcon from "svgs/unchecked.svg";
import CheckBoxIcon from "svgs/checked.svg";

const icon = <img src={CheckBoxOutlineBlankIcon} alt="dsd" fontSize="small" />;
const checkedIcon = <img src={CheckBoxIcon} alt="dsds" fontSize="small" />;
<CheckBoxIcon fontSize="small" />;

export default function SelectQuantity(props) {
  const all = Array(100)
    .fill()
    .map((_, index) => index + 1);

  return (
    <div className="AssignUsers__main">
      <Autocomplete
        // multiple
        id="checkboxes-tags-demo"
        onChange={(e, value) => props.handleData(e, value, "quantity")}
        options={all}
        // disableCloseOnSelect
        getOptionLabel={(option) => option.toString()}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.measurement || "Select quantity"}
            placeholder="quantity"
          />
        )}
      />
    </div>
  );
}
