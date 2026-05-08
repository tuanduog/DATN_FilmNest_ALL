import { useState } from 'react';

// material-ui
import { Box, Typography } from '@mui/material';

// project-imports
import { Voucher } from 'types/voucher';
import VoucherForm from './voucher-form';
import AddConfirmForm from './add-confirm-form';

function getStepContent(
    step: number,
    handleNext: (values: Voucher) => void,
    setVoucher: (voucher: Voucher) => void,
    voucher: Voucher
) {
    switch (step) {
        case 0:
            return (
                <VoucherForm
                    handleNext={(values) => {
                        setVoucher(values);
                        handleNext(values);
                    }}
                    setVoucher={setVoucher}
                    voucher={voucher}
                />
            );

        default:
            throw new Error('Unknown step');
    }
}

// ==============================|| ADD COMBO ||============================== //

export default function AddVoucher() {
    const [activeStep, setActiveStep] = useState(0);

    // Extend Combo to hold file for upload locally
    const initialValues: Voucher = {
        id: 0,
        code: '',
        type: 'PUBLIC',
        description: '',
        startDate: '',
        endDate: '',
        discount: 0,
        quantity: 0,
        minOrderValue: 0,
        status: 'ACTIVE'
    };

    const [voucher, setVoucher] = useState<Voucher>(initialValues);

    const setNext = () => {
        setActiveStep(activeStep + 1);
    };

    const setBack = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <Box>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Typography variant="h3">Thêm khuyến mãi</Typography>
            </Box>

            {activeStep == 0 ? (
                <Box>
                    {getStepContent(
                        activeStep,
                        setNext,
                        setVoucher,
                        voucher
                    )}
                </Box>
            ) : (
                <AddConfirmForm handleBack={setBack} voucher={voucher} />
            )}
        </Box>
    );
}
