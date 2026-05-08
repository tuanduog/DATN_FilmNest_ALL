import { useState } from 'react';

// material-ui
import { Box, Typography } from '@mui/material';

// project-imports
import { Theater } from 'types/theater';
import TheaterForm from './theater-form';
import AddConfirmForm from './add-confirm-form';

function getStepContent(
    step: number,
    handleNext: () => void,
    handleSetTheater: (theater: Theater) => void,
    theater: Theater
) {
    switch (step) {
        case 0:
            return (
                <TheaterForm
                    handleNext={handleNext}
                    setTheater={handleSetTheater}
                    theater={theater}
                />
            );

        default:
            throw new Error('Unknown step');
    }
}

// ==============================|| ADD THEATER ||============================== //

export default function AddTheater() {
    const [activeStep, setActiveStep] = useState(0);

    const initialValues: Theater = {
        name: '',
        address: '',
        provinceCode: '',
        provinceName: '',
        communeCode: '',
        communeName: '',
        description: '',
        hotline: '',
        openTime: '08:00',
        closeTime: '23:00',
        status: 'ACTIVE'
    };

    const [theater, setTheater] = useState<Theater>(initialValues);

    const setNext = () => {
        setActiveStep(activeStep + 1);
    };

    const setBack = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <Box>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Typography variant="h3">Thêm rạp chiếu</Typography>
            </Box>

            {activeStep === 0 ? (
                <Box>
                    {getStepContent(
                        activeStep,
                        setNext,
                        setTheater,
                        theater
                    )}
                </Box>
            ) : (
                <AddConfirmForm handleBack={setBack} theater={theater} />
            )}
        </Box>
    );
}
