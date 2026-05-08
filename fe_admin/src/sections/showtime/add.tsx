import { useState } from 'react';

// material-ui
import { Box, Typography } from '@mui/material';

// project-imports
import { Showtime } from 'types/showtime';
import ShowtimeForm from './showtime-form';
import AddConfirmForm from './add-confirm-form';

function getStepContent(
    step: number,
    handleNext: () => void,
    handleSetShowtime: (showtime: Showtime) => void,
    showtime: Showtime
) {
    switch (step) {
        case 0:
            return (
                <ShowtimeForm
                    handleNext={handleNext}
                    setShowtime={handleSetShowtime}
                    showtime={showtime}
                />
            );

        default:
            throw new Error('Unknown step');
    }
}

export default function AddShowtime() {
    const [activeStep, setActiveStep] = useState(0);

    const initialValues: Showtime = {
        id: 0,
        movieId: 0,
        roomId: 0,
        showDate: '',
        startTime: '',
        surcharge: 0,
        status: 'ACTIVE'
    };

    const [showtime, setShowtime] = useState<Showtime>(initialValues);

    const setNext = () => {
        setActiveStep(activeStep + 1);
    };

    const setBack = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <Box>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Typography variant="h3">Thêm suất chiếu</Typography>
            </Box>

            {activeStep == 0 ? (
                <Box>
                    {getStepContent(
                        activeStep,
                        setNext,
                        setShowtime,
                        showtime
                    )}
                </Box>
            ) : (
                <AddConfirmForm handleBack={setBack} showtime={showtime} />
            )}
        </Box>
    );
}
