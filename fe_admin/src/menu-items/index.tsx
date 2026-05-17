// project-imports
import admin from './admin-pages';
import manager from './manager-pages';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [admin, manager]
};

export default menuItems;
