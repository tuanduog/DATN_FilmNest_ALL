import { useState } from 'react';

// material-ui
import { Box, Typography } from '@mui/material';

// project-imports
import { Banner } from 'types/banner';
import BannerForm from './banner-form';
import AddConfirmForm from './add-confirm-form';

function getStepContent(
    step: number,
    handleNext: () => void,
    handleSetBanner: (banner: Banner & { file?: File | null, avatar?: string }) => void,
    banner: Banner & { file?: File | null, avatar?: string }
) {
    switch (step) {
        case 0:
            return (
                <BannerForm
                    handleNext={handleNext}
                    setBanner={handleSetBanner}
                    banner={banner}
                />
            );

        default:
            throw new Error('Unknown step');
    }
}

// ==============================|| ADD BANNER ||============================== //

export default function AddBanner() {
    const [activeStep, setActiveStep] = useState(0);

    // Extend Banner to hold file for upload locally
    const initialValues: Banner = {
        id: 0,
        name: '',
        status: '',
        image: null
    };

    const [banner, setBanner] = useState<Banner>(initialValues);

    const setNext = () => {
        setActiveStep(activeStep + 1);
    };

    const setBack = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <Box>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Typography variant="h3">Thêm banner</Typography>
            </Box>

            {activeStep == 0 ? (
                <Box>
                    {getStepContent(
                        activeStep,
                        setNext,
                        setBanner,
                        banner
                    )}
                </Box>
            ) : (
                <AddConfirmForm handleBack={setBack} banner={banner} />
            )}
        </Box>
    );
}
