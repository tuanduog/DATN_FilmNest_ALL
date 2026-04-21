// assets
import { I24Support, MessageProgramming } from 'iconsax-reactjs';

// type
import { NavItemType } from 'types/menu';

// icons
// icons
const icons = {
  maintenance: MessageProgramming,
  contactus: I24Support
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const admin: NavItemType = {
  id: 'group-pages',
  title: 'admin',
  type: 'group',
  children: [
    // {
    //   id: 'maintenance',
    //   title: 'maintenance',
    //   type: 'collapse',
    //   icon: icons.maintenance,
    //   children: [
    //     {
    //       id: 'error-404',
    //       title: 'error-404',
    //       type: 'item',
    //       url: '/maintenance/404',
    //       target: true
    //     },
    //   ]
    // },
    {
      id: 'dashboard',
      title: 'dashboard',
      type: 'item',
      url: '/admin/dashboard',
      icon: icons.contactus
    },
    {
      id: 'combo',
      title: 'combo',
      type: 'item',
      url: '/admin/combo',
      icon: icons.contactus
    },
    {
      id: 'theater',
      title: 'theater',
      type: 'item',
      url: '/admin/theater',
      icon: icons.contactus
    },
    {
      id: 'user',
      title: 'user',
      type: 'item',
      url: '/admin/user',
      icon: icons.contactus
    },
    {
      id: 'employee',
      title: 'employee',
      type: 'item',
      url: '/admin/employee',
      icon: icons.contactus
    },
    {
      id: 'membership',
      title: 'membership',
      type: 'item',
      url: '/admin/membership',
      icon: icons.contactus
    }
  ]
};

export default admin;
