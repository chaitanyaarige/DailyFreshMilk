import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { listUsers } from "store/user";
import { useQuery } from "react-query";
import CheckBoxOutlineBlankIcon from "svgs/unchecked.svg";
import CheckBoxIcon from "svgs/checked.svg";

const icon = <img src={CheckBoxOutlineBlankIcon} alt="dsd" fontSize="small" />;
const checkedIcon = <img src={CheckBoxIcon} alt="dsds" fontSize="small" />;
<CheckBoxIcon fontSize="small" />;

export default function SelectUser(props) {
  const { access_token, refreshAccessToken } = props;
  const [users, setUsers] = useState([]);

  const { isLoading } = useQuery([3, access_token], listUsers, {
    onSuccess: (data) => {
      data?.data && setUsers(data.data.data);
      console.log(isLoading);
    },
    onError: (error) => {
      if (error && error.response && error.response.status === 401) {
        refreshAccessToken();
      }
    },
  });

  return (
    <div className="AssignUsers__main">
      <Autocomplete
        multiple
        id="checkboxes-tags-demo"
        onChange={(e, value) => props.handleData(e, value, "user")}
        options={users}
        // disableCloseOnSelect
        getOptionLabel={(option) => option.phone_no}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
            {option.phone_no}
          </li>
        )}
        renderInput={(params) => <TextField {...params} label="Select Users" placeholder="Users" />}
      />
    </div>
  );
}
