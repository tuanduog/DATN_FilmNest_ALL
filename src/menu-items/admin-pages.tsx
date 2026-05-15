import {
  Category,
  Box as BoxIcon,
  Buildings,
  User,
  People,
  Medal,
  VideoSquare,
  Video,
  Clock,
  Ticket,
  Gallery,
  TicketDiscount,
  MessageProgramming,
  I24Support
} from 'iconsax-reactjs';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  dashboard: Category,
  combo: BoxIcon,
  theater: Buildings,
  user: User,
  employee: People,
  membership: Medal,
  room: VideoSquare,
  movie: Video,
  showtime: Clock,
  booking: Ticket,
  banner: Gallery,
  voucher: TicketDiscount,
  maintenance: MessageProgramming,
  contactus: I24Support
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const admin: NavItemType = {
  id: 'admin-pages',
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
      icon: icons.dashboard
    },
    {
      id: 'combo',
      title: 'combo',
      type: 'item',
      url: '/admin/combo',
      icon: icons.combo
    },
    {
      id: 'theater',
      title: 'theater',
      type: 'item',
      url: '/admin/theater',
      icon: icons.theater
    },
    {
      id: 'user',
      title: 'user',
      type: 'item',
      url: '/admin/user',
      icon: icons.user
    },
    {
      id: 'employee',
      title: 'employee',
      type: 'item',
      url: '/admin/employee',
      icon: icons.employee
    },
    {
      id: 'membership',
      title: 'membership',
      type: 'item',
      url: '/admin/membership',
      icon: icons.membership
    },
    {
      id: 'room',
      title: 'room',
      type: 'item',
      url: '/admin/room',
      icon: icons.room
    },
    {
      id: 'movie',
      title: 'movie',
      type: 'item',
      url: '/admin/movie',
      icon: icons.movie
    },
    {
      id: 'showtime',
      title: 'showtime',
      type: 'item',
      url: '/admin/showtime',
      icon: icons.showtime
    },
    {
      id: 'booking',
      title: 'booking',
      type: 'item',
      url: '/admin/booking',
      icon: icons.booking
    },
    {
      id: 'banner',
      title: 'banner',
      type: 'item',
      url: '/admin/banner',
      icon: icons.banner
    },
    {
      id: 'voucher',
      title: 'voucher',
      type: 'item',
      url: '/admin/voucher',
      icon: icons.voucher
    }
  ]
};

export default admin;
