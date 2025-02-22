import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey'; // Icon for password
import { FiGitBranch } from 'react-icons/fi';
import EmailIcon from '@mui/icons-material/Email';
import { PhoneAndroid } from '@mui/icons-material';
import { Call } from '@mui/icons-material';

export const COLUMNS = () => [

  {
    Header: 'Supervisor Name',
    accessor: 'supervisorName',
    icon: <AccountCircleIcon />, // AccountCircle icon for supervisor's name
  },
  {
    Header: 'Supervisor Email',
    accessor: 'supervisorEmail',
    icon: <EmailIcon />,
  },
  {
    Header: 'Supervisor Phone',
    accessor: 'supervisorPhone',
    icon: <PhoneAndroid />, // PhoneAndroid icon represents the phone
  },
  {
    Header: 'Username',
    accessor: 'username',
    icon: <AccountCircleIcon />, // AccountCircle icon for username
  },
  {
    Header: 'Password',
    accessor: 'password',
    icon: <VpnKeyIcon />, // VpnKey icon for password
  },
  {
    Header: 'Company Name',
    accessor: 'companyName', // from companyId.companyName
    icon: <BusinessIcon />, // Business icon represents the company
  },
  {
    Header: 'Branch Name',
    accessor: 'branchName', // from branchId.branchName
    icon: <FiGitBranch />, // Branch icon represents a branch
  },
  // {
  //   Header: 'Branch Location',
  //   accessor: 'branchLocation', // from branchId.branchLocation
  //   icon: <LocationOnIcon />, // Location icon for branch location
  // },
  {
    Header: 'Created At',
    accessor: 'createdAt',
   
  },
];
