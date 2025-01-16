import React, { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Checkbox,
} from '@mui/material';
import { Search as SearchIcon, AccountCircle, Close as CloseIcon } from '@mui/icons-material';
import { api } from '../../../utils/api';
import { API_BASE_URL } from '../../../utils/config';

const UserSearchBar = ({ onSelectUser }) => {
  const [searchUser, setSearchUser] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setHasSearched(true);
    if (!searchUser) return;

    setLoading(true);
    try {
      const res = await api(`/users?fullName=${searchUser}`);
      setUserResults(res.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setHasSearched(false);
    setUserResults([]);
    setSearchUser('');
    setSelectedUser(null);
    onSelectUser(null);
  };

  const handleUserSelect = (user) => {
    if (selectedUser && selectedUser._id === user._id) {
      setSelectedUser(null);
      onSelectUser(null, false);
    } else {
      setSelectedUser(user);
      onSelectUser(user, true);
    }
  };

  return (
    <div>
      {/* User Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <TextField
          fullWidth
          id="input-with-icon-textfield"
          label="Search User"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          sx={{ mb: 2, mt: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
          variant="standard"
        />
        {userResults.length ? (
          <IconButton type="button" sx={{ p: '10px' }} aria-label="clear" onClick={resetSearch}>
            <CloseIcon />
          </IconButton>
        ) : (
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        )}
      </div>

      {/* Loading Indicator */}
      {loading && <CircularProgress />}

      {/* User Results */}
      <List
        sx={{
          maxHeight: 180,
          overflowY: 'auto',
          border: userResults.length > 0 ? '1px solid #ccc' : 'none',
          borderRadius: 2,
          p: 0,
          mt: 1,
        }}
      >
        {hasSearched && userResults.length === 0 ? (
          <Typography variant="body2" color="textSecondary" textAlign="center">
            No users found
          </Typography>
        ) : (
          userResults.map((user) => (
            <ListItem
              key={user._id}
              button
              onClick={() => handleUserSelect(user)}
              sx={{
                backgroundColor: selectedUser && selectedUser._id === user._id ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.05)',
                },
              }}
            >
              <ListItemAvatar>
                <Avatar src={`${API_BASE_URL}${user.avatar}`} alt={user.fullName} />
              </ListItemAvatar>
              <ListItemText primary={user.fullName} />
              <ListItemText primary={user.email} />
              <Checkbox
                checked={selectedUser && selectedUser._id === user._id}
                onChange={() => handleUserSelect(user)}
                sx={{ color: selectedUser && selectedUser._id === user._id ? 'primary.main' : undefined }}
              />
            </ListItem>
          ))
        )}
      </List>
    </div>
  );
};

export default UserSearchBar;
