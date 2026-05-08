// project-imports
import admin from './admin-pages';
import manager from './manager-pages';
import staff from './staff-pages';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [admin, manager, staff]
};

export default menuItems;
