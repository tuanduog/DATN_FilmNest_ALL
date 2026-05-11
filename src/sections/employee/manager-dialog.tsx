import { CSSProperties, Fragment, useEffect, useMemo, useState } from 'react';

// material-ui
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

// third-party
import {
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    closestCenter,
    type DragEndEvent,
    type UniqueIdentifier,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import { restrictToHorizontalAxis, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { rankItem } from '@tanstack/match-sorter-utils';
import {
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedMinMaxValues,
    getFacetedUniqueValues,
    getPaginationRowModel,
    getSortedRowModel,
    getGroupedRowModel,
    getExpandedRowModel,
    flexRender,
    useReactTable,
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    GroupingState,
    Row,
    FilterFn,
    Header
} from '@tanstack/react-table';

import IconButton from 'components/@extended/IconButton';
import EmptyTable from 'components/third-party/react-table/EmptyTable';
import HeaderSort from 'components/third-party/react-table/HeaderSort';
import RowEditable from 'components/third-party/react-table/RowEditable';
import { ArrowDown2, ArrowRight2, CloseCircle, Command, TableDocument } from 'iconsax-reactjs';
import { DEFAULT_PAGE_SIZE, PageRequest } from 'types/paging';
import { Alert, Button, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, Snackbar, TableHead } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { HttpStatusCode } from 'axios';
import useAuth from 'hooks/useAuth';
import Radio from '@mui/material/Radio';
import { Employee } from 'types/employee';
import { getList } from 'api/employee';
import MainCard from 'components/MainCard';
import formatDate from 'utils/formatDateTime';

interface ManagerDialogProps {
    open: boolean;
    id?: number;
    onClose: () => void;
    onConfirm: (manager: any) => void;
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // rank the item
    const itemRank = rankItem(row.getValue(columnId), value);

    // store the ranking info
    addMeta(itemRank);

    // return if the item should be filtered in/out
    return itemRank.passed;
};

// ==============================|| REACT TABLE - EDIT ACTION ||============================== //

const nonOrderableColumnId: UniqueIdentifier[] = ['drag-handle', 'expander', 'select'];

// ==============================|| REACT TABLE - DRAGGABLE HEADER ||============================== //

function DraggableTableHeader({ header }: { header: Header<any, unknown> }) {
    const { attributes, isDragging, listeners, setNodeRef, transform } = useSortable({
        id: header.column.id
    });

    const style: CSSProperties = {
        opacity: isDragging ? 0.8 : 1,
        position: 'relative',
        transform: CSS.Translate.toString(transform),
        transition: 'width transform 0.2s ease-in-out',
        whiteSpace: 'nowrap',
        width: header.column.getSize(),
        zIndex: isDragging ? 1 : 0
    };

    return (
        <TableCell colSpan={header.colSpan} ref={setNodeRef} style={style}>
            {header.isPlaceholder ? null : (
                <Stack direction="row" sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                    {header.column.getCanGroup() && (
                        <IconButton
                            color={header.column.getIsGrouped() ? 'error' : 'primary'}
                            onClick={header.column.getToggleGroupingHandler()}
                            size="small"
                            sx={{ p: 0, width: 24, height: 24, fontSize: '1rem', mr: 0.75 }}
                        >
                            {header.column.getIsGrouped() ? (
                                <Command size="32" color="#FF8A65" variant="Bold" />
                            ) : (
                                <TableDocument size="32" variant="Outline" />
                            )}
                        </IconButton>
                    )}
                    <Box {...(!nonOrderableColumnId.includes(header.id) && { ...attributes, ...listeners, sx: { cursor: 'move' } })}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                    </Box>
                    {header.column.getCanSort() && <HeaderSort column={header.column} sort />}
                </Stack>
            )}
        </TableCell>
    );
}

// ==============================|| REACT TABLE - DRAGGABLE ROW ||============================== //

function DraggableRow({ row }: { row: Row<any> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({ id: row.original.id });

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1 : 0,
        position: 'relative'
    };

    return (
        <TableRow ref={setNodeRef} style={style}>
            {row.getVisibleCells().map((cell) => {
                let bgcolor = 'background.paper';
                if (cell.getIsGrouped()) bgcolor = 'primary.lighter';
                if (cell.getIsAggregated()) bgcolor = 'warning.lighter';
                if (cell.getIsPlaceholder()) bgcolor = 'error.lighter';

                if (cell.column.columnDef.meta !== undefined && cell.column.getCanSort()) {
                    Object.assign(cell.column.columnDef.meta, { style: { background: bgcolor } });
                }

                return (
                    <TableCell
                        key={cell.id}
                        {...cell.column.columnDef.meta}
                        {...(cell.getIsGrouped() && cell.column.columnDef.meta === undefined && { style: { background: bgcolor } })}
                        sx={{
                            width:
                                cell.column.columnDef.meta && 'width' in cell.column.columnDef.meta
                                    ? (cell.column.columnDef.meta as { width?: string | number }).width
                                    : undefined,
                            justifyContent: cell.column.id === 'edit' ? 'center' : 'left',
                            verticalAlign: 'middle'
                        }}
                    >
                        {cell.getIsGrouped() ? (
                            <Stack direction="row" sx={{ gap: 0.5, alignItems: 'center' }}>
                                <IconButton color="secondary" onClick={row.getToggleExpandedHandler()} size="small" sx={{ p: 0, width: 24, height: 24 }}>
                                    {row.getIsExpanded() ? <ArrowDown2 size="32" variant="Outline" /> : <ArrowRight2 size="32" variant="Outline" />}
                                </IconButton>
                                <Box>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Box> <Box>({row.subRows.length})</Box>
                            </Stack>
                        ) : cell.getIsAggregated() ? (
                            flexRender(cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell, cell.getContext())
                        ) : cell.getIsPlaceholder() ? null : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                    </TableCell>
                );
            })}
        </TableRow>
    );
}

const ManagerDialog: React.FC<ManagerDialogProps> = ({ open, id, onClose, onConfirm }) => {
    const { logout } = useAuth();
    const intl = useIntl();
    const [manager, setManager] = useState<Employee>();
    const columns = useMemo<ColumnDef<Employee>[]>(
        () => [
            {
                id: 'select',
                header: '',
                enableGrouping: false,
                enableSorting: false,
                enableColumnFilter: false,
                cell: ({ row, table }) => {
                    const { meta } = table.options;
                    const selectedRow = meta?.selectedRow;
                    const setSelectedRow = meta?.setSelectedRow;
                    const activeId = selectedRow.id ? selectedRow.id : id;

                    return (
                        <FormControlLabel
                            control={
                                <Radio
                                    disableRipple
                                    checked={row.original.id == activeId}
                                    onChange={() => {
                                        setSelectedRow && setSelectedRow(row.original);
                                        setManager(row.original);
                                    }}
                                    color="primary"
                                    value={row.original.id}
                                />
                            }
                            label=""
                        />
                    );
                },
                meta: { width: '5%', style: { textAlign: 'center' } }
            },
            {
                id: 'id',
                title: 'Id',
                header: '#',
                accessorKey: 'id',
                dataType: 'text',
                enableColumnFilter: false,
                enableGrouping: false,
                meta: { className: 'cell-center' }
            },
            {
                id: 'code',
                header: intl.formatMessage({ id: 'code' }),
                accessorKey: 'code',
                dataType: 'text',
                enableGrouping: false,
                meta: { width: '35%' }
            },
            {
                id: 'fullname',
                header: intl.formatMessage({ id: 'fullname' }),
                accessorKey: 'fullname',
                dataType: 'text',
                enableGrouping: false,
                meta: { width: '35%' }
            },
            {
                id: 'email',
                header: intl.formatMessage({ id: 'email' }),
                accessorKey: 'email',
                dataType: 'text',
                enableGrouping: false,
                meta: { width: '35%' }
            },
            {
                id: 'phone',
                header: intl.formatMessage({ id: 'phone' }),
                accessorKey: 'phone',
                dataType: 'text',
                enableGrouping: false,
                meta: { width: '35%' }
            },
            {
                id: 'role',
                header: intl.formatMessage({ id: 'role' }),
                accessorKey: 'role',
                dataType: 'text',
                enableGrouping: false,
                meta: { width: '35%' },
                cell: ({ row }) => {
                    const role = row.original.role;
                    return role === 'manager' ? intl.formatMessage({ id: 'manager' }) : role === 'staff' ? intl.formatMessage({ id: 'staff' }) : role;
                }
            },
            {
                id: 'theaterName',
                header: intl.formatMessage({ id: 'theater-responsiblility' }),
                accessorKey: 'theaterName',
                dataType: 'text',
                enableGrouping: false,
                meta: { width: '35%' }
            },
            {
                id: 'status',
                header: intl.formatMessage({ id: 'status' }),
                accessorKey: 'status',
                cell: (cell) => {
                    const { status } = cell.row.original;

                    return (
                        <Chip
                            label={
                                status === 'ACTIVE' ? intl.formatMessage({ id: 'active' }) : status === 'INACTIVE' ? intl.formatMessage({ id: 'inactive' }) : 'UNKNOWN'
                            }
                            color={status === 'ACTIVE' ? 'success' : 'error'}
                        />
                    );
                },
                dataType: 'select',
                enableGrouping: false,
                meta: { width: '20%' }
            },
        ],
        [id, intl]
    );

    let options: number[] = [10, 25, 50, 100];
    const [data, setData] = useState<Employee[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageRequest, setPageRequest] = useState<PageRequest>({
        page: 0,
        size: DEFAULT_PAGE_SIZE,
        sort: '',
        keyword: '',
        status: '',
        role: 'MANAGER'
    });
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });
    const [columnOrder, setColumnOrder] = useState<string[]>(() => columns.map((c) => c.id!));

    const dataIds = useMemo<UniqueIdentifier[]>(() => data?.map(({ id }: any) => id), [data]);

    const [rowSelection, setRowSelection] = useState({});
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [grouping, setGrouping] = useState<GroupingState>([]);

    const [columnVisibility, setColumnVisibility] = useState({});

    const [originalData, setOriginalData] = useState(() => [...data]);
    const [selectedRow, setSelectedRow] = useState({});

    const handleChangePageSize = (event: SelectChangeEvent<number>) => {
        setPageRequest((prev) => ({ ...prev, size: event.target.value, page: 0 }));
    };

    useEffect(() => {
        const fetchManagers = async () => {
            const response = await getList(pageRequest);

            if (response.status === HttpStatusCode.Ok) {
                setData(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements);
                setPageNumber(response.data.pageable.pageNumber);
            } else if (response.status === HttpStatusCode.Unauthorized) {
                logout();
            } else {
                setAlert({ open: true, message: intl.formatMessage({ id: 'unknown-error' }), severity: 'error' });
            }
        };

        fetchManagers();
    }, [pageRequest, intl, logout]);

    const table = useReactTable({
        data: data,
        columns,
        manualPagination: true,
        defaultColumn: { cell: RowEditable },
        getRowId: (row: Employee) => (row.id ?? '').toString(),
        state: { rowSelection, columnFilters, sorting, grouping, columnOrder, columnVisibility },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onGroupingChange: setGrouping,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onColumnOrderChange: setColumnOrder,
        onColumnVisibilityChange: setColumnVisibility,
        getRowCanExpand: () => true,
        getExpandedRowModel: getExpandedRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        globalFilterFn: fuzzyFilter,
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
        meta: {
            selectedRow,
            setSelectedRow,
            revertData: (rowIndex: number, revert: unknown) => {
                if (revert) {
                    setData((old: Employee[]) => old.map((row, index) => (index === rowIndex ? originalData[rowIndex] : row)));
                } else {
                    setOriginalData((old) => old.map((row, index) => (index === rowIndex ? data[rowIndex] : row)));
                }
            },
            updateData: (rowIndex, columnId, value) => {
                setData((old: Employee[]) =>
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            return { ...old[rowIndex]!, [columnId]: value };
                        }
                        return row;
                    })
                );
            }
        }
    });

    // Handle Column Drag End
    function handleColumnDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            if (nonOrderableColumnId.includes(over.id)) return;
            setColumnOrder((columnOrder) => {
                const oldIndex = columnOrder.indexOf(active.id as string);
                const newIndex = columnOrder.indexOf(over.id as string);
                return arrayMove(columnOrder, oldIndex, newIndex);
            });
        }
    }

    // Handle Row Drag End
    function handleRowDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            setData((data: any) => {
                const oldIndex = dataIds.indexOf(active.id);
                const newIndex = dataIds.indexOf(over.id);
                return arrayMove(data, oldIndex, newIndex);
            });
        }
    }

    const handleConfirm = () => {
        if (manager) {
            onConfirm(manager);
        } else {
            setAlert({
                open: true,
                message: intl.formatMessage({ id: 'please-select-one-manager' }),
                severity: 'warning'
            });
        }
    };

    const columnSensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));
    const rowSensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));

    useEffect(() => setColumnVisibility({ id: false, contact: false, country: false, progress: false }), []);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={false}
            slotProps={{
                paper: {
                    sx: {
                        width: '75%',
                        maxWidth: 'none',
                        height: '95%'
                    }
                }
            }}
            fullWidth
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>
                {intl.formatMessage({ id: 'theater-list' })}
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseCircle />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ pb: 0 }}>
                <Stack
                    sx={() => ({
                        p: 0
                    })}
                >
                    <MainCard content={false}>
                        <Snackbar
                            open={alert?.open}
                            autoHideDuration={3000}
                            onClose={() => setAlert({ ...alert, open: false })}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            <Alert
                                severity={alert?.severity || 'info'}
                                variant="filled"
                                sx={{
                                    width: '100%',
                                    borderRadius: 2,
                                    fontSize: 15,
                                    textAlign: 'center',
                                    py: 1.5,
                                    px: 2
                                }}
                            >
                                {alert?.message || intl.formatMessage({ id: 'no-notification' })}
                            </Alert>
                        </Snackbar>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            sx={(theme) => ({
                                gap: 2,
                                justifyContent: 'left',
                                p: 2,
                                [theme.breakpoints.down('sm')]: { '& .MuiOutlinedInput-root, & .MuiFormControl-root': { width: 1 } }
                            })}
                        >
                            <Stack direction="row" spacing={2} sx={{ flexGrow: 1, flexWrap: 'wrap' }}>
                                <OutlinedInput
                                    value={globalFilter ?? ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                        if (e.key === 'Enter') {
                                            setPageRequest({ ...pageRequest, page: 0, keyword: globalFilter });
                                        }
                                    }}
                                    placeholder={intl.formatMessage({ id: 'search' })}
                                    sx={{ minWidth: 100 }}
                                />
                            </Stack>

                            <Typography variant="caption" color="secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <FormattedMessage id="total" />: {totalElements} <FormattedMessage id="records" />
                            </Typography>
                        </Stack>

                        {/* Column DnD Context */}
                        <DndContext
                            collisionDetection={closestCenter}
                            modifiers={[restrictToHorizontalAxis]}
                            onDragEnd={handleColumnDragEnd}
                            sensors={columnSensors}
                        >
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                                                    {headerGroup.headers.map((header) => (
                                                        <DraggableTableHeader key={header.id} header={header} />
                                                    ))}
                                                </SortableContext>
                                            </TableRow>
                                        ))}
                                    </TableHead>

                                    <TableBody>
                                        {/* Row DnD Context */}
                                        <DndContext
                                            collisionDetection={closestCenter}
                                            modifiers={[restrictToVerticalAxis]}
                                            onDragEnd={handleRowDragEnd}
                                            sensors={rowSensors}
                                        >
                                            {table.getRowModel().rows.length > 0 ? (
                                                <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                                                    {table.getRowModel().rows.map((row) => (
                                                        <Fragment key={row.id}>
                                                            <DraggableRow row={row} />
                                                        </Fragment>
                                                    ))}
                                                </SortableContext>
                                            ) : (
                                                <TableRow sx={{ '&.MuiTableRow-root:hover': { bgcolor: 'transparent' } }}>
                                                    <TableCell colSpan={table.getAllColumns().length}>
                                                        <EmptyTable msg={intl.formatMessage({ id: 'no-data' })} />
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </DndContext>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </DndContext>

                        <Divider />

                        <Grid spacing={1} container sx={{ alignItems: 'center', justifyContent: 'space-between', width: 'auto', mt: 2 }}>
                            <Grid>
                                <Stack direction="row" sx={{ gap: 1, alignItems: 'center', marginLeft: 2 }}>
                                    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                                        <Typography variant="caption" color="secondary">
                                            <FormattedMessage id="row-per-page" />
                                        </Typography>

                                        <FormControl sx={{ m: 1 }}>
                                            <Select
                                                id="demo-controlled-open-select"
                                                value={pageRequest.size}
                                                onChange={handleChangePageSize}
                                                size="small"
                                                sx={{ '& .MuiSelect-select': { py: 0.75, px: 1.25 } }}
                                            >
                                                {options.map((option: number) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                </Stack>
                            </Grid>

                            <Grid sx={{ mt: { xs: 2, sm: 0 } }}>
                                <Pagination
                                    count={totalPages}
                                    variant="contained"
                                    page={pageNumber + 1}
                                    onChange={(event, value) => setPageRequest({ ...pageRequest, page: value - 1 })}
                                    color="primary"
                                    showFirstButton
                                    showLastButton
                                />
                            </Grid>
                        </Grid>
                    </MainCard>
                </Stack>
            </DialogContent>

            <Box textAlign="right" px={3} py={2}>
                <Button
                    variant="contained"
                    sx={{
                        bgcolor: 'orangered',
                        px: 4,
                        '&:hover': { bgcolor: '#ffb324ff' }
                    }}
                    size="large"
                    onClick={handleConfirm}
                >
                    {intl.formatMessage({ id: 'confirm' })}
                </Button>
            </Box>
        </Dialog>
    );
};

export default ManagerDialog;
