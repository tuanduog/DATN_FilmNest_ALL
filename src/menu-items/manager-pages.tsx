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
    id: 'manager-pages',
    title: 'manager',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'dashboard',
            type: 'item',
            url: '/manager/dashboard',
            icon: icons.contactus
        },
        {
            id: 'room',
            title: 'room',
            type: 'item',
            url: '/manager/room',
            icon: icons.contactus
        },
        {
            id: 'showtime',
            title: 'showtime',
            type: 'item',
            url: '/manager/showtime',
            icon: icons.contactus
        },
        {
            id: 'booking',
            title: 'booking',
            type: 'item',
            url: '/manager/booking',
            icon: icons.contactus
        },
        {
            id: 'theater-profile',
            title: 'theater-profile',
            type: 'item',
            url: '/manager/theater-profile',
            icon: icons.contactus
        }
    ]
};

export default manager;
