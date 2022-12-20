import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Menu,
  Link,
  Paper,
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Divider,
  MenuItem,
  Checkbox,
  TableRow,
  TableBody,
  TextField,
  TableCell,
  Container,
  Typography,
  ListItemIcon,
  TableContainer,
  TablePagination,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// components
import moment from 'moment';
import useSync from '../hooks/useSync';
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
// mock
// import timeTrackingList from '../_mock/timetracking';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'project', label: 'Project', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'duration', label: 'Duration', alignRight: false },
  { id: 'billable', label: 'Billable', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  if (!array) return [];
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function TimeTracking() {
  const [apiToken, setApiToken] = useState();
  const [tokenValue, setTokenValue] = useState();

  const { timeTrackingList, fetchTimeTracking } = useSync(apiToken);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = timeTrackingList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSync = (event) => {
    fetchTimeTracking();
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = (event) => {
    if (tokenValue !== apiToken) setTokenValue(apiToken);
    setDialogOpen(true);
  };

  const handleDialogClose = (event) => {
    setDialogOpen(false);
  };

  const handleDialogConfirm = () => {
    setApiToken(tokenValue);
    setDialogOpen(false);
  };

  useEffect(() => {
    console.log(timeTrackingList);
  }, []);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - timeTrackingList.length) : 0;

  const filteredUsers = applySortFilter(timeTrackingList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;
  // console.log(filteredUsers);
  return (
    <Page title="Time Tracking">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Time Tracking
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent="end" spacing={2}>
            <Button variant="outlined" onClick={handleMenuClick} startIcon={<Iconify icon="eva:plus-fill" />}>
              Add Source
            </Button>
            <Button variant="contained" startIcon={<Iconify icon="eva:sync-fill" />} onClick={handleSync}>
              Sync to FreshBooks
            </Button>
          </Stack>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={timeTrackingList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.length !== 0 &&
                    filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, description, duration, status, project, avatarUrl, isBilled } = row;
                      const isItemSelected = selected.indexOf(description) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, description)} />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              {/* <Avatar alt={description} src={avatarUrl} /> */}
                              <Typography variant="subtitle2" noWrap>
                                {project}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{description || '<Not Available>'}</TableCell>
                          <TableCell align="left">{moment.duration(duration, 'seconds').humanize()}</TableCell>
                          <TableCell align="left">{isBilled ? 'Yes' : 'No'}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={(status === 'error' && 'error') || (status === 'new' && 'info') || 'success'}
                            >
                              {status && sentenceCase(status)}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <UserMoreMenu />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {apiToken && isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

                {!apiToken && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper>
                          <Typography gutterBottom align="center" variant="subtitle1">
                            Don't have any source to sync!
                          </Typography>
                          <Button
                            variant="outlined"
                            onClick={handleMenuClick}
                            startIcon={<Iconify icon="eva:plus-fill" />}
                          >
                            Add Source
                          </Button>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={timeTrackingList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={menuOpen}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1.5,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleDialogOpen}>
              <Avatar alt="Toggl icon" src="./static/icons/toggl.png" /> Toggl
            </MenuItem>
            <MenuItem>
              <Avatar alt="Harvest icon" src="./static/icons/harvest.png" /> Harvest
            </MenuItem>
          </Menu>
        </Card>
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>{!apiToken ? 'Sync with Toggl' : 'Update Toggl API Token'}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {!apiToken
                ? 'To sync with Toggl, you need to input your Toggl API token.)'
                : 'Below is your current Toggl API token you can update it.'}
              <Stack direction="row" justifyContent="start" sx={{ mb: 3 }}>
                <Typography variant="subtitle2">How to find it?</Typography>
                <Link
                  sx={{ ml: 1 }}
                  variant="subtitle2"
                  target="_blank"
                  href="https://support.toggl.com/en/articles/3116844-where-is-my-api-key-located"
                >
                  Learn More
                </Link>
              </Stack>
            </DialogContentText>
            <TextField
              spellcheck="false"
              autoFocus
              margin="dense"
              id="apiToken"
              label="Toggl API Token"
              fullWidth
              variant="standard"
              value={tokenValue}
              onChange={(e) => {
                setTokenValue(e.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button variant="contained" onClick={handleDialogConfirm}>
              {!apiToken ? 'Sync Now' : 'Update'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Page>
  );
}
