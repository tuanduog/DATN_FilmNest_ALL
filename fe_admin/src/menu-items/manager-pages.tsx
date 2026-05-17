import {
    Category,
    VideoSquare,
    Clock,
    Ticket,
    Building,
    MessageProgramming,
    I24Support
} from 'iconsax-reactjs';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
    dashboard: Category,
    room: VideoSquare,
    showtime: Clock,
    booking: Ticket,
    theaterProfile: Building,
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
            icon: icons.dashboard
        },
        {
            id: 'room',
            title: 'room',
            type: 'item',
            url: '/manager/room',
            icon: icons.room
        },
        {
            id: 'showtime',
            title: 'showtime',
            type: 'item',
            url: '/manager/showtime',
            icon: icons.showtime
        },
        {
            id: 'booking',
            title: 'booking',
            type: 'item',
            url: '/manager/booking',
            icon: icons.booking
        },
        {
            id: 'theater-profile',
            title: 'theater-profile',
            type: 'item',
            url: '/manager/theater-profile',
            icon: icons.theaterProfile
        }
    ]
};

export default manager;
