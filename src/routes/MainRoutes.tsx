import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import { SimpleLayoutType } from 'config';
import DashboardLayout from 'layout/Dashboard';
import PagesLayout from 'layout/Pages';
import SimpleLayout from 'layout/Simple';
import AdminDashboard from 'pages/dashboard/admin';
import ManagerDashboard from 'pages/dashboard/manager';
import ComboPage from 'pages/combo-page';
import AddCombo from 'sections/combo/add';
import ComboDetail from 'sections/combo/detail';
import EditCombo from 'sections/combo/edit';
import TheaterPage from 'pages/theater-page';
import AddTheater from 'sections/theater/add';
import TheaterDetail from 'sections/theater/detail';
import EditTheater from 'sections/theater/edit';
import UserPage from 'pages/user-page';
import UserDetail from 'sections/user/detail';
import AddUser from 'sections/user/add';
import EditUser from 'sections/user/edit';
import EmployeePage from 'pages/employee-page';
import AddEmployee from 'sections/employee/add';
import MembershipPage from 'pages/membership-page';
import AddMembership from 'sections/membership/add';
import EditMembership from 'sections/membership/edit';
import MembershipDetail from 'sections/membership/detail';
import EditEmployee from 'sections/employee/edit';
import EmployeeDetail from 'sections/employee/detail';
import RoomPage from 'pages/room-page';
import AddRoom from 'sections/room/add';
import EditRoom from 'sections/room/edit';
import RoomDetail from 'sections/room/detail';
import MoviePage from 'pages/movie-page';
import AddMovie from 'sections/movie/add';
import MovieDetail from 'sections/movie/detail';
import EditMovie from 'sections/movie/edit';
import ShowtimePage from 'pages/showtime-page';
import AddShowtime from 'sections/showtime/add';
import EditShowtime from 'sections/showtime/edit';
import ShowtimeDetail from 'sections/showtime/detail';
import BannerPage from 'pages/banner-page';
import AddBanner from 'sections/banner/add';
import EditBanner from 'sections/banner/edit';
import BannerDetail from 'sections/banner/detail';
import AddVoucher from 'sections/voucher/add';
import EditVoucher from 'sections/voucher/edit';
import VoucherPage from 'pages/voucher-page';
import VoucherDetail from 'sections/voucher/detail';
import ProfilePage from 'sections/profile/profile';


// pages routing
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/error/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction/under-construction')));
const MaintenanceUnderConstruction2 = Loadable(lazy(() => import('pages/maintenance/under-construction/under-construction2')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon/coming-soon')));
const MaintenanceComingSoon2 = Loadable(lazy(() => import('pages/maintenance/coming-soon/coming-soon2')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const ContactUS = Loadable(lazy(() => import('pages/contact-us')));

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'admin/dashboard',
          element: < AdminDashboard />
        },
        {
          path: 'manager/dashboard',
          element: <ManagerDashboard />
        },
        {
          path: 'admin/combo',
          element: <ComboPage />
        },
        {
          path: 'admin/combo/add',
          element: <AddCombo />
        },
        {
          path: 'admin/combo/edit/:id',
          element: <EditCombo />
        },
        {
          path: 'admin/combo/detail/:id',
          element: <ComboDetail />
        },
        {
          path: 'admin/theater',
          element: <TheaterPage />
        },
        {
          path: 'admin/theater/add',
          element: <AddTheater />
        },
        {
          path: 'admin/theater/edit/:id',
          element: <EditTheater />
        },
        {
          path: 'admin/theater/detail/:id',
          element: <TheaterDetail />
        },
        {
          path: 'admin/user',
          element: <UserPage />
        },
        {
          path: 'admin/user/add',
          element: <AddUser />
        },
        {
          path: 'admin/user/edit/:id',
          element: <EditUser />
        },
        {
          path: 'admin/user/detail/:id',
          element: <UserDetail />
        },
        {
          path: 'admin/employee',
          element: <EmployeePage />
        },
        {
          path: 'admin/employee/add',
          element: <AddEmployee />
        },
        {
          path: 'admin/employee/edit/:id',
          element: <EditEmployee />
        },
        {
          path: 'admin/employee/detail/:id',
          element: <EmployeeDetail />
        },
        {
          path: 'admin/membership',
          element: <MembershipPage />
        },
        {
          path: 'admin/membership/add',
          element: <AddMembership />
        },
        {
          path: 'admin/membership/edit/:id',
          element: <EditMembership />
        },
        {
          path: 'admin/membership/detail/:id',
          element: <MembershipDetail />
        },
        {
          path: 'admin/room',
          element: <RoomPage />
        },
        {
          path: 'admin/room/add',
          element: <AddRoom />
        },
        {
          path: 'admin/room/edit/:id',
          element: <EditRoom />
        },
        {
          path: 'admin/room/detail/:id',
          element: <RoomDetail />
        },
        {
          path: 'admin/movie',
          element: <MoviePage />
        },
        {
          path: 'admin/movie/add',
          element: <AddMovie />
        },
        {
          path: 'admin/movie/edit/:id',
          element: <EditMovie />
        },
        {
          path: 'admin/movie/detail/:id',
          element: <MovieDetail />
        },
        {
          path: 'admin/showtime',
          element: <ShowtimePage />
        },
        {
          path: 'admin/showtime/add',
          element: <AddShowtime />
        },
        {
          path: 'admin/showtime/edit/:id',
          element: <EditShowtime />
        },
        {
          path: 'admin/showtime/detail/:id',
          element: <ShowtimeDetail />
        },
        {
          path: 'admin/banner',
          element: <BannerPage />
        },
        {
          path: 'admin/banner/add',
          element: <AddBanner />
        },
        {
          path: 'admin/banner/edit/:id',
          element: <EditBanner />
        },
        {
          path: 'admin/banner/detail/:id',
          element: <BannerDetail />
        },
        {
          path: 'admin/voucher',
          element: <VoucherPage />
        },
        {
          path: 'admin/voucher/add',
          element: <AddVoucher />
        },
        {
          path: 'admin/voucher/edit/:id',
          element: <EditVoucher />
        },
        {
          path: 'admin/voucher/detail/:id',
          element: <VoucherDetail />
        },
        {
          path: 'admin/profile',
          element: <ProfilePage />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'sample-page',
          element: <SamplePage />
        }
      ]
    },
    {
      path: '/',
      element: <SimpleLayout layout={SimpleLayoutType.SIMPLE} />,
      children: [
        {
          path: 'contact-us',
          element: <ContactUS />
        }
      ]
    },
    {
      path: '/maintenance',
      element: <PagesLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'under-construction2',
          element: <MaintenanceUnderConstruction2 />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        },
        {
          path: 'coming-soon2',
          element: <MaintenanceComingSoon2 />
        }
      ]
    },
    { path: '*', element: <MaintenanceError /> }
  ]
};

export default MainRoutes;
