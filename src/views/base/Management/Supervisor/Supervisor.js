import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  Button,
  InputBase,
  Modal,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material'
import { RiEdit2Fill } from 'react-icons/ri'
import { AiFillDelete } from 'react-icons/ai'
import {
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import TablePagination from '@mui/material/TablePagination'
import { useNavigate } from 'react-router-dom'
import Loader from '../../../../components/Loader/Loader'
import CloseIcon from '@mui/icons-material/Close'
import { MdConnectWithoutContact } from 'react-icons/md'
import { AiOutlineUpload } from 'react-icons/ai'
import ReactPaginate from 'react-paginate'
import Cookies from 'js-cookie'
import { IoMdAdd } from 'react-icons/io'
import toast, { Toaster } from 'react-hot-toast'
import * as XLSX from 'xlsx' // For Excel export
import jsPDF from 'jspdf' // For PDF export
import 'jspdf-autotable' // For table formatting in PDF
import CIcon from '@coreui/icons-react'
import GroupIcon from '@mui/icons-material/Group'
import { cilSettings } from '@coreui/icons'
import '../../../../../src/app.css'
import { COLUMNS } from './columns'
import { StyledTablePagination } from '../../../PaginationCssFile/TablePaginationStyles'
// import { FaBriefcase   } from 'react-icons/fa';
import { FiGitBranch } from 'react-icons/fi';
import BusinessIcon from '@mui/icons-material/Business';
import '../../ReusablecodeforTable/styles.css';
import ExcelJS from 'exceljs';
import PDFExporter from '../../ReusablecodeforTable/PDFExporter'
import ExcelExporter from '../../ReusablecodeforTable/ExcelExporter'
import jwt_decode from 'jwt-decode';
const token=Cookies.get("token");
let role=null
if(token){
  const decodetoken=jwt_decode(token);
   role=decodetoken.role;
}
console.log("n",role)
const Supervisor = () => {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const [pageCount, setPageCount] = useState()
  // const handleEditModalClose = () => setEditModalOpen(false)
  // const handleAddModalClose = () => setAddModalOpen(false)
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const columns = COLUMNS()
  const [sortedData, setSortedData] = useState([])
  const [companyData, setCompanyData] = useState([]);
  const handleEditModalClose = () => {
    setFormData({})
    setEditModalOpen(false)
  }

  const handleAddModalClose = () => {
    setFormData({})
    setAddModalOpen(false)
  }

  const style = {
    position: 'absolute',
    top: '50%',
    borderRadius: '10px',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '35%',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto', // Enable vertical scrolling
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    marginTop: '8px',
  }

  // ##################### getting data  ###################
  const fetchData = async (page = 1) => {
    const accessToken = Cookies.get('token');
    const url = `https://rocketsales-server.onrender.com/api/Company/branch/supervisors`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
  

const allData = response.data.flatMap((branchh) => 
  branchh.Supervisor.map((item)=>({
    ...item,
    companyName: branchh.companyName,
    companyId:branchh._id,
  }))
 
);
console.log("mm",allData)
      if (response.data) {
        // Filter the data based on the search query if it is not empty
        const filteredData = allData
          .map((item) => {
            // Apply the formatDate method to 'created_at' field if it exists
            if (item.created_at) {
              item.created_at = formatDate(item.created_at);
            }
            
            return item;
          })
          .filter((item) =>
            Object.values(item).some((value) =>
              value.toString().toLowerCase().includes(searchQuery.toLowerCase())
            )
          );
  
        setData(filteredData); // Set the filtered data to `data`
        setSortedData(filteredData); // Set the filtered data to `sortedData`
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error for further handling if needed
    }
  };
  
  const fetchCompany = async () => {
    const accessToken = Cookies.get('token');
    const url = `https://rocketsales-server.onrender.com/api/get-companies`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
  console.log("my data response",response.data)
      if (response.data) {
      
        // const companydata1 = response.data
        setCompanyData( response.data);
       
      }
      console.log("companies are",companyData);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error for further handling if needed
    }
  };
  useEffect(() => {
    fetchCompany();
  }, []);
  // Format the date into DD-MM-YYYY format
  function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0'); // Add leading zero if single digit
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Add leading zero to month
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
  
  // Example: parsing the formatted date string back to a Date object if needed
  function parseDate(dateString) {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  
  useEffect(() => {
    setLoading(true)
    // fetchcompany()
    fetchData() // Refetch data when searchQuery changes
  }, [searchQuery]) // Dependency array ensures the effect runs whenever searchQuery changes

  // ##################### Filter data by search query #######################
  const filterGroups = () => {
    if (!searchQuery) {
      setFilteredData(data) // No query, show all drivers
    } else {
      const filtered = data.filter((group) =>
        group.branchName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredData(filtered)
      setCurrentPage(1)
    }
  }

  useEffect(() => {
    filterGroups(searchQuery)
  }, [data, searchQuery])

  const handlePageClick = (e) => {
    console.log(e.selected + 1)
    let page = e.selected + 1
    setCurrentPage(page)
    setLoading(true)
    fetchData(page)
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    console.log(formData)
    try {
      const accessToken = Cookies.get('token')
      const response = await axios.post(`https://rocketsales-server.onrender.com/api/Company/branch`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 201) {
        toast.success('Branch is created successfully')
        fetchData()
        setFormData({ name: '' })
        setAddModalOpen(false)
      }
      fetchData();
    } catch (error) {
      toast.error('An error occured')
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }

  // ###################################################################
  // ######################### Edit Group #########################
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(newRowsPerPage === -1 ? sortedData.length : newRowsPerPage) // Set to all rows if -1
    setPage(0) // Reset to the first page
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    console.log(formData)
    try {
      const accessToken = Cookies.get('authToken')
      const response = await axios.put(
        `https://rocketsales-server.onrender.com/api/Company/${formData.companyId}/branch/${formData._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (response.status === 200) {
        toast.success('group is edited successfully')
        fetchData()
        setFormData({ name: '' })
        setEditModalOpen(false)
      }
    } catch (error) {
      toast.error('An error occured')
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }

  const handleEditGroup = async (item) => {
    console.log(item)
    setEditModalOpen(true)
    setFormData({ ...item })
    console.log('this is before edit', formData)
  }

 
  const haqndleDeletesubmit = async (item) => {
    if (!item._id) {
      toast.error('Invalid item selected for deletion.')
      return
    }

    const confirmed = confirm('Do you want to delete this user?')
    if (!confirmed) return

    try {
      const accessToken = Cookies.get('token')
      if (!accessToken) {
        toast.error('Authentication token is missing.')
        return
      }

      const response = await axios({
        method: 'DELETE', // Explicitly specifying DELETE method
        // url: `https://rocketsales-server.onrender.com/api/delete-branch/${item._id}`,
        url: `https://rocketsales-server.onrender.com/api/Company/${item.companyId}/branch/${item._id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 200) {
        toast.success('Group deleted successfully')
        fetchData()
      }
    } catch (error) {
      console.error('Error Details:', error.response || error.message)
      toast.error('An error occurred while deleting the group.')
    }
  }


  
  const exportToExcel = ExcelExporter({
  
    columns: COLUMNS(),
    data: filteredData,
    fileName: 'Supervisor_data.xlsx',
    mytitle:'Supervisor Data Report',
  });

const exportToPDF = PDFExporter({
  title: 'Supervisor Data Report',
  columns: COLUMNS(),
  data: filteredData,
  fileName: 'Supervisor_data_report.pdf',
});

  return (
    <div className="d-flex flex-column mx-md-3 mt-3 h-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="d-flex justify-content-between mb-2">
        <div>
          <h2
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#4c637c',
              fontWeight: '600',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            <FiGitBranch  style={{ fontSize: '24px', color: '#4c637c' }} />
            Supervisor
          </h2>
        </div>


<div className="d-flex align-items-center">
 
  <div className="me-3 d-none d-md-block">
    <input
      type="search"
      className="form-control"
      placeholder="🔍 Search here..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      style={{
        height: "40px", // Ensure consistent height
        padding: "8px 12px",
        fontSize: "16px",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
    />
  </div>

  {/* Settings Dropdown */}


  {/* Add Button */}
  <div className="add-container d-flex align-items-center" onClick={() => setAddModalOpen(true)}>
    <div className="add-icon">+</div>
    <span className="add-text ms-2">ADD</span>
  </div>
  <CDropdown className="position-relative me-3">
    <CDropdownToggle
      color="secondary"
      style={{
        borderRadius: '50%',
        padding: '10px',
        height: '48px',
        width: '48px',
        marginLeft:'12px'
      }}
    >
      <CIcon icon={cilSettings} />
    </CDropdownToggle>
    <CDropdownMenu>
      <CDropdownItem onClick={exportToPDF}>PDF</CDropdownItem>
      <CDropdownItem onClick={exportToExcel}>Excel</CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</div>

      </div>
      <div className="d-md-none mb-2">
        <input
          type="search"
          className="form-control"
          placeholder="search here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <TableContainer
        component={Paper}
        sx={{
          height: 'auto',
          overflowX: 'auto',

        }}
      >
        <CTable
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: '14px',
            borderCollapse: 'collapse',
            width: '100%',
            border: '1px solid #e0e0e0', // Light border
          }}
          bordered
          align="middle"
          className="mb-2"
          hover
          responsive
        >
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell
                className="text-center"
                style={{
                  backgroundColor: '#1d3d5f',
                  padding: '5px 12px', // Reduced padding for top and bottom
                  borderBottom: '1px solid #e0e0e0', // Light border under headers
                  textAlign: 'center', // Center header text
                  verticalAlign: 'middle',
                  color: 'white',
                }}
              >
                SN
              </CTableHeaderCell>
              {columns.map((col) => (
                <CTableHeaderCell
                  key={col.accessor}
                  className="text-center"
                  style={{
                    padding: '5px 12px', // Reduced padding for top and bottom
                    borderBottom: '1px solid #e0e0e0', // Light border under headers
                    textAlign: 'center', // Center header text
                    verticalAlign: 'middle',
                    backgroundColor: '#1d3d5f',
                    color: 'white',
                  }}
                >
                  {col.Header}
                </CTableHeaderCell>
              ))}
              <CTableHeaderCell
                className="text-center"
                style={{
                  padding: '5px 12px', // Reduced padding for top and bottom
                  borderBottom: '1px solid #e0e0e0', // Light border under headers
                  textAlign: 'center', // Center header text
                  verticalAlign: 'middle',
                  backgroundColor: '#1d3d5f',
                  color: 'white',
                }}
              >
                Actions
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {loading ? (
              <CTableRow>
                <CTableDataCell
                  colSpan={columns.length + 2}
                  className="text-center"
                  style={{
                    padding: '20px 0',
                    fontSize: '16px',
                    color: '#999',
                  }}
                >
                  Loading...
                </CTableDataCell>
              </CTableRow>
            ) : sortedData.length > 0 ? (
              sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <CTableRow
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? 'transparent':  '#f1f8fd', // Grey for even rows, transparent for odd rows
                      transition: 'background-color 0.3s ease',
                      borderBottom: '1px solid #e0e0e0',
                    }}
                    hover
                  >
                    <CTableDataCell
                      className="text-center"
                      style={{
                        padding: '0px 12px',
                        color: '#242424',
                        fontSize: '13px',
                        backgroundColor: index % 2 === 0 ? 'transparent':'#f1f8fd'  ,
                      }}
                    >
                      {index + 1}
                    </CTableDataCell>

                    {columns.map((col) => (
                      <CTableDataCell
                        key={col.accessor}
                        className="text-center"
                        style={{
                          padding: '0px 12px',
                          color: '#242424',
                          fontSize: '13px',
                          backgroundColor: index % 2 === 0 ?'transparent' : '#f1f8fd',
                        }}
                      >
                        {item[col.accessor] || '--'}
                      </CTableDataCell>
                    ))}

                   
  <CTableDataCell
      className={`text-center table-cell ${index % 2 === 0 ? 'table-cell-even' : 'table-cell-odd'}`}
    >
      <IconButton
        aria-label="edit"
        onClick={() => handleEditGroup(item)}
        className="icon-button icon-button-edit"
      >
        <RiEdit2Fill className="icon-button-icon" />
      </IconButton>

      <IconButton
        aria-label="delete"
        onClick={() => haqndleDeletesubmit(item)}
        className="icon-button icon-button-delete"
      >
        <AiFillDelete className="icon-button-icon" />
      </IconButton>
    </CTableDataCell>

                  </CTableRow>
                ))
            ) : (
              <CTableRow>
                <CTableDataCell
                  colSpan={columns.length + 2}
                  className="text-center"
                  style={{
                    padding: '20px 0',
                    fontSize: '16px',
                    color: '#999',
                  }}
                >
                  No data available
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </TableContainer>

     

      <StyledTablePagination>
        <TablePagination
          rowsPerPageOptions={[{ label: 'All', value: -1 }, 1, 10, 25, 100, 1000]}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage === sortedData.length ? -1 : rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => {
            console.log('Page changed:', newPage)
            handleChangePage(event, newPage)
          }}
          onRowsPerPageChange={(event) => {
            console.log('Rows per page changed:', event.target.value)
            handleChangeRowsPerPage(event)
          }}
        />
      </StyledTablePagination>
     
      <Modal
  open={addModalOpen}
  onClose={handleAddModalClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
    <div className="d-flex justify-content-between">
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Add New Supervisor
      </Typography>
      <IconButton onClick={handleAddModalClose}>
        <CloseIcon />
      </IconButton>
    </div>
    <DialogContent>
      <form onSubmit={handleAddSubmit}>

        <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {role==1?
          (
            <>
            <FormControl style={{ display: 'flex', flexDirection: 'column' }}>
                <InputLabel id="company-label">Company</InputLabel>
                <Select
                  labelId="company-label"
                  id="companyId"
                  value={formData.companyId || ''}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                  label="Company"
                  startAdornment={
                    <InputAdornment position="start">
                      <BusinessIcon />
                    </InputAdornment>
                  }
                >
                  {companyData.map((company) => (
                    <MenuItem key={company._id} value={company._id}>
                      {company.companyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              </>
          )
          :null}
         
          {COLUMNS().slice(1).map((column) => (
            <TextField
              key={column.accessor}
              label={column.Header}
              name={column.accessor}
              value={formData[column.accessor] || ''}
              onChange={(e) =>
                setFormData({ ...formData, [column.accessor]: e.target.value })
              }
              // Remove required attribute
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {column.icon}
                  </InputAdornment>
                ),
              }}
            />
          ))}
         
        </FormControl>
        
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginTop: '20px' }}
        >
          Submit
        </Button>
      </form>
    </DialogContent>
  </Box>
</Modal>



    
<Modal
  open={editModalOpen}
  onClose={handleEditModalClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
    <div className="d-flex justify-content-between">
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Edit Supervisor
      </Typography>
      <IconButton onClick={handleEditModalClose}>
        <CloseIcon />
      </IconButton>
    </div>
    <DialogContent>
      <form onSubmit={handleEditSubmit}>
        <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
        {role==1?
          (
            <>
            <FormControl style={{ display: 'flex', flexDirection: 'column' }}>
                <InputLabel id="company-label">Company</InputLabel>
                <Select
                  labelId="company-label"
                  id="companyId"
                  value={formData.companyId || ''}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                  label="Company"
                  startAdornment={
                    <InputAdornment position="start">
                      <BusinessIcon />
                    </InputAdornment>
                  }
                >
                  {companyData.map((company) => (
                    <MenuItem key={company._id} value={company._id}>
                      {company.companyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              </>
          )
          :null}
          {COLUMNS().slice(1).map((column) => (
            <TextField
              key={column.accessor}
              label={column.Header}
              name={column.accessor}
              value={formData[column.accessor] || ''} // Pre-fill with existing data
              onChange={(e) =>
                setFormData({ ...formData, [column.accessor]: e.target.value })
              }
              // Remove the required attribute
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {column.icon}
                  </InputAdornment>
                ),
              }}
            />
          ))}
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginTop: '20px' }}
        >
          Submit
        </Button>
      </form>
    </DialogContent>
  </Box>
</Modal>


    </div>
  )
}

export default Supervisor
