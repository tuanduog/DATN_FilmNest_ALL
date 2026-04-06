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

const manager: NavItemType = {
    id: 'group-pages',
    title: 'manager',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'dashboard',
            type: 'item',
            url: '/manager/dashboard',
            icon: icons.contactus,
            target: true
        }
    ]
};

export default manager;
