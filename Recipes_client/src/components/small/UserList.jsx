import React from 'react';
import {NavLink} from "react-router-dom";

const UserList = ({users}) => {
  return (
    <div>
      {users.map(user =>
        <div key={user._id}>
          {`${user.nickname} user _id:`}
          <NavLink to={`user/${user._id}`}>{user._id}
          </NavLink>
        </div>)}

    </div>
  );
};

export default UserList;
