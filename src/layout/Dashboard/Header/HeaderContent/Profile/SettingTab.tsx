import { useCallback, useEffect, useState } from 'react';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { FormattedMessage } from 'react-intl';

// project-imports
import useConfig from 'hooks/useConfig';

// assets
import { LanguageSquare, Maximize1, ArrowDown2 } from 'iconsax-reactjs';

// types
import { I18n } from 'types/config';

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

export default function SettingTab() {
  const { i18n, onChangeLocalization } = useConfig();

  const [fullScreen, setFullScreen] = useState(false);
  const [openLanguage, setOpenLanguage] = useState(false);

  const handleLanguageChange = (lang: I18n) => {
    onChangeLocalization(lang);
    setOpenLanguage(false);
  };

  const handleToggleFullScreen = useCallback(() => {
    if (document && !document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton onClick={() => setOpenLanguage(!openLanguage)}>
        <ListItemIcon>
          <LanguageSquare variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary={<FormattedMessage id="language" />} />
        <ArrowDown2 size={16} style={{ transform: openLanguage ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
      </ListItemButton>
      
      <Collapse in={openLanguage} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 5 }} selected={i18n === 'en'} onClick={() => handleLanguageChange('en')}>
            <ListItemText primary="English (UK)" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 5 }} selected={i18n === 'vi'} onClick={() => handleLanguageChange('vi')}>
            <ListItemText primary="Tiếng Việt (Vietnamese)" />
          </ListItemButton>
        </List>
      </Collapse>

      <ListItemButton onClick={handleToggleFullScreen}>
        <ListItemIcon>
          <Maximize1 variant="Bulk" size={18} {...(fullScreen && { style: { transform: 'rotate(180deg)' } })} />
        </ListItemIcon>
        <ListItemText primary={fullScreen ? <FormattedMessage id="exit-fullscreen" /> : <FormattedMessage id="fullscreen" />} />
      </ListItemButton>
    </List>
  );
}
