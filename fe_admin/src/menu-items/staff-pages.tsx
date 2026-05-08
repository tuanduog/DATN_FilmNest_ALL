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

const staff: NavItemType = {
    id: 'group-pages',
    title: 'staff',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'dashboard',
            type: 'item',
            url: '/staff/dashboard',
            icon: icons.contactus
        }
    ]
};

export default staff;
