// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { FormattedMessage } from 'react-intl';

// assets
import { Card, Edit2, Logout, Profile, Profile2User } from 'iconsax-reactjs';

import { useNavigate } from 'react-router-dom';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

interface Props {
  handleLogout: () => void;
}

export default function ProfileTab({ handleLogout }: Props) {
  const navigate = useNavigate();

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      {/* <ListItemButton>
        <ListItemIcon>
          <Edit2 variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary="Edit Profile" />
      </ListItemButton> */}
      <ListItemButton onClick={() => navigate('/admin/profile')}>
        <ListItemIcon>
          <Profile variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary={<FormattedMessage id="view-profile" />} />
      </ListItemButton>
      {/* 
      <ListItemButton>
        <ListItemIcon>
          <Profile2User variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary="Social Profile" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <Card variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary="Billing" />
      </ListItemButton> */}
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <Logout variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary={<FormattedMessage id="logout" />} />
      </ListItemButton>
    </List>
  );
}
