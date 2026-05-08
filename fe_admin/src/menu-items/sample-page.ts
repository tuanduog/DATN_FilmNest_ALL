/*** This is example of menu item without group for horizontal layout. There will be no children. ***/

// assets
import { DocumentCode2 } from 'iconsax-reactjs';

// types
import { NavItemType } from 'types/menu';

// icons
const icons = {
  samplePage: DocumentCode2
};

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const managePage: NavItemType = {
  id: 'manage-page',
  title: 'manage-page',
  type: 'group',
  url: '/manage-page',
  icon: icons.samplePage
};

export default managePage;
